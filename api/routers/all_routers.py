"""
routers/lessons.py  — audio upload + lesson management
routers/recaps.py   — tutor post-lesson recap
routers/quizzes.py  — quiz delivery, submission, mastery
routers/webhooks.py — AssemblyAI callback
routers/triggers.py — manual trigger + mastery report
"""

# ════════════════════════════════════════════════
# routers/lessons.py
# ════════════════════════════════════════════════
from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.schemas import LessonCreate, LessonAudioUpload, LessonStatus
from config import get_supabase
from services.transcription import submit_transcription

router_lessons = APIRouter()

@router_lessons.post("/", response_model=dict)
async def create_lesson(body: LessonCreate):
    """Create a lesson record before the session starts."""
    db = get_supabase()
    result = db.table("lessons").insert({
        "student_id":        body.student_id,
        "tutor_id":          body.tutor_id,
        "subject":           body.subject,
        "topic":             body.topic,
        "scheduled_at":      body.scheduled_at.isoformat(),
        "duration_minutes":  body.duration_minutes,
        "transcript_status": "pending",
    }).execute()
    return {"lesson_id": result.data[0]["id"]}


@router_lessons.post("/upload-audio")
async def upload_audio(body: LessonAudioUpload, bg: BackgroundTasks):
    """
    Triggered after lesson ends. Receives a Supabase Storage URL for the audio.
    Submits to AssemblyAI in the background — returns immediately.
    """
    db = get_supabase()
    lesson = db.table("lessons").select("id").eq("id", body.lesson_id).execute()
    if not lesson.data:
        raise HTTPException(404, "Lesson not found")

    bg.add_task(submit_transcription, body.lesson_id, body.audio_url)
    return {"status": "processing", "message": "Audio submitted for transcription"}


@router_lessons.get("/{lesson_id}/status", response_model=LessonStatus)
async def get_lesson_status(lesson_id: str):
    """Poll transcription status. Frontend polls this every 10s after upload."""
    db = get_supabase()
    lesson = db.table("lessons").select(
        "id, transcript_status, tutor_talk_ratio"
    ).eq("id", lesson_id).single().execute()

    if not lesson.data:
        raise HTTPException(404, "Lesson not found")

    triggers = db.table("trigger_events") \
        .select("trigger_type") \
        .eq("lesson_id", lesson_id) \
        .execute()

    return LessonStatus(
        lesson_id=lesson_id,
        transcript_status=lesson.data["transcript_status"],
        tutor_talk_ratio=lesson.data.get("tutor_talk_ratio"),
        triggers_fired=[t["trigger_type"] for t in (triggers.data or [])],
    )


# ════════════════════════════════════════════════
# routers/recaps.py
# ════════════════════════════════════════════════
from fastapi import APIRouter
from models.schemas import RecapSubmit, RecapResponse
from config import get_supabase, openai_client
from services.logic_engine import trigger_tutor_report, fire_trigger

router_recaps = APIRouter()

@router_recaps.post("/", response_model=RecapResponse)
async def submit_recap(body: RecapSubmit):
    """
    Tutor submits a free-text post-lesson recap.
    LLM parses it for struggled topics → fires Trigger 2 for each.
    """
    db = get_supabase()

    # Save raw recap first
    result = db.table("tutor_recaps").insert({
        "lesson_id":  body.lesson_id,
        "tutor_id":   body.tutor_id,
        "student_id": body.student_id,
        "raw_text":   body.raw_text,
        "processed":  False,
    }).execute()
    recap_id = result.data[0]["id"]

    # LLM parses + fires triggers
    fired_topics = await trigger_tutor_report(
        recap_id=recap_id,
        student_id=body.student_id,
        raw_text=body.raw_text,
        db=db,
        oai_client=openai_client,
    )

    return RecapResponse(
        recap_id=recap_id,
        parsed_topics=fired_topics,
        quizzes_queued=len(fired_topics),
    )


# ════════════════════════════════════════════════
# routers/quizzes.py
# ════════════════════════════════════════════════
from fastapi import APIRouter, HTTPException
from models.schemas import QuizOut, QuizSubmit, QuizResult
from config import get_supabase, openai_client
from services.logic_engine import update_mastery, check_all_triggers, fire_trigger
from services.rag import generate_study_guide

router_quizzes = APIRouter()

@router_quizzes.get("/pending/{student_id}", response_model=list[QuizOut])
async def get_pending_quizzes(student_id: str):
    """
    Student portal polls this on login and after each lesson.
    Returns all quizzes in 'pending' status for this student.
    """
    db = get_supabase()
    result = db.table("generated_quizzes") \
        .select("*") \
        .eq("student_id", student_id) \
        .eq("status", "pending") \
        .order("created_at", desc=True) \
        .execute()

    quizzes = []
    for q in (result.data or []):
        # Mark as delivered so we don't re-send
        db.table("generated_quizzes").update({
            "status": "delivered",
            "delivered_at": "now()",
        }).eq("id", q["id"]).execute()
        quizzes.append(q)

    return quizzes


@router_quizzes.post("/submit", response_model=QuizResult)
async def submit_quiz(body: QuizSubmit):
    """
    Student submits completed quiz answers.
    1. Score the quiz
    2. Store each response (for latency trigger)
    3. Update mastery
    4. Run all triggers — may generate new quizzes
    """
    db = get_supabase()

    quiz = db.table("generated_quizzes") \
        .select("*") \
        .eq("id", body.quiz_id) \
        .single() \
        .execute()

    if not quiz.data:
        raise HTTPException(404, "Quiz not found")

    q_data = quiz.data
    total  = len(body.responses)
    correct = sum(1 for r in body.responses if r.is_correct)
    score  = round(correct / total, 3) if total else 0.0

    # Store individual responses
    for r in body.responses:
        db.table("quiz_responses").insert({
            "quiz_id":         body.quiz_id,
            "student_id":      body.student_id,
            "question_index":  r.question_index,
            "answer_given":    r.answer_given,
            "is_correct":      r.is_correct,
            "response_time_ms": r.response_time_ms,
        }).execute()

    # Update baseline response time per topic (rolling average)
    avg_ms = int(sum(r.response_time_ms for r in body.responses) / total) if total else 0
    _update_baseline(body.student_id, q_data["topic"], avg_ms, db)

    # Mark quiz complete
    db.table("generated_quizzes").update({
        "status":       "completed",
        "score":        score,
        "completed_at": "now()",
    }).eq("id", body.quiz_id).execute()

    # Update mastery score
    update_mastery(
        student_id=body.student_id,
        topic=q_data["topic"],
        subject=q_data.get("subject", ""),
        score=score,
        db=db,
    )

    # Run all triggers again — quiz failure might fire
    new_events = check_all_triggers(body.student_id, db)
    new_topics = []
    for event in new_events:
        quiz_row = await fire_trigger(event, db, openai_client)
        if quiz_row:
            new_topics.append(event["topic"])

    return QuizResult(
        quiz_id=body.quiz_id,
        score=score,
        correct=correct,
        total=total,
        new_triggers_fired=new_topics,
    )


@router_quizzes.get("/study-guide/{student_id}/{topic}")
async def get_study_guide(student_id: str, topic: str):
    """On-demand study guide generation from lesson transcripts."""
    db = get_supabase()
    guide = await generate_study_guide(student_id, topic, db, openai_client)
    if not guide:
        raise HTTPException(404, "No transcript data found for this topic")
    return guide


@router_quizzes.get("/mastery/{student_id}")
async def get_mastery(student_id: str):
    """Student mastery report — used in the student portal AI tab."""
    db = get_supabase()
    rows = db.table("topic_mastery") \
        .select("*") \
        .eq("student_id", student_id) \
        .order("decay_score") \
        .execute()

    topics = rows.data or []
    sorted_by_mastery = sorted(topics, key=lambda x: x["mastery_score"])

    return {
        "student_id": student_id,
        "topics": topics,
        "weakest":   [t["topic"] for t in sorted_by_mastery[:3]],
        "strongest": [t["topic"] for t in sorted_by_mastery[-3:]],
    }


def _update_baseline(student_id: str, topic: str, new_avg_ms: int, db):
    """Rolling average for response time baseline (Trigger 4)."""
    row = db.table("topic_mastery") \
        .select("baseline_answer_ms, total_attempts") \
        .eq("student_id", student_id) \
        .eq("topic", topic) \
        .execute()

    if row.data and row.data[0].get("baseline_answer_ms"):
        old = row.data[0]["baseline_answer_ms"]
        attempts = row.data[0]["total_attempts"] or 1
        # Weighted rolling average — older sessions matter less
        updated = int((old * min(attempts, 5) + new_avg_ms) / (min(attempts, 5) + 1))
        db.table("topic_mastery").update({"baseline_answer_ms": updated}) \
            .eq("student_id", student_id).eq("topic", topic).execute()


# ════════════════════════════════════════════════
# routers/webhooks.py
# ════════════════════════════════════════════════
from fastapi import APIRouter, Request, HTTPException
from config import get_supabase
from services.transcription import process_completed_transcript

router_webhooks = APIRouter()

@router_webhooks.post("/assemblyai")
async def assemblyai_webhook(request: Request, bg: BackgroundTasks):
    """
    AssemblyAI posts here when transcription is complete.
    We process the transcript in the background and return 200 immediately.
    """
    # Verify webhook secret
    secret = request.headers.get("X-Webhook-Secret")
    if secret != "your-webhook-secret":
        raise HTTPException(403, "Invalid webhook secret")

    payload = await request.json()
    transcript_id = payload.get("transcript_id")
    status = payload.get("status")

    if status == "completed":
        bg.add_task(process_completed_transcript, transcript_id)
    elif status == "error":
        db = get_supabase()
        db.table("lessons").update({"transcript_status": "failed"}) \
            .eq("transcript_id", transcript_id).execute()

    return {"received": True}


# ════════════════════════════════════════════════
# routers/triggers.py
# ════════════════════════════════════════════════
from fastapi import APIRouter
from models.schemas import TriggerResult
from config import get_supabase, openai_client
from services.logic_engine import check_all_triggers, fire_trigger

router_triggers = APIRouter()

@router_triggers.post("/run/{student_id}", response_model=TriggerResult)
async def run_triggers(student_id: str):
    """
    Manually run all triggers for a student.
    Useful for admin panel — 'Regenerate AI content' button.
    """
    db = get_supabase()
    events = check_all_triggers(student_id, db)
    fired_topics = []

    for event in events:
        result = await fire_trigger(event, db, openai_client)
        if result:
            fired_topics.append(event["topic"])

    return TriggerResult(
        triggers_fired=len(fired_topics),
        quizzes_generated=len(fired_topics),
        topics=fired_topics,
    )
