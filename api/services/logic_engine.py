import math
import json
from datetime import datetime, timezone
from config import (
    QUIZ_FAIL_THRESHOLD, TALK_TIME_THRESHOLD,
    LATENCY_MULTIPLIER, DECAY_THRESHOLD, DECAY_HALF_LIFE_DAYS,
    openai_client, LLM_MODEL,
)
from services.rag import generate_quiz_for_trigger

DEDUP_WINDOW = "48 hours"


# ── Main entry point ─────────────────────────────────────
def check_all_triggers(student_id: str, db) -> list[dict]:
    """Run Triggers 1, 4, 5 — called after every lesson and quiz completion."""
    events = []
    events += _trigger_quiz_failure(student_id, db)
    events += _trigger_latency(student_id, db)
    events += _trigger_spaced_rep(student_id, db)
    return events


async def fire_trigger(event: dict, db, oai_client):
    """Dedup-check, log, and generate quiz for a single trigger event."""
    student_id   = event["student_id"]
    topic        = event["topic"]
    trigger_type = event["trigger_type"]

    # Dedup: skip if same trigger+topic fired within DEDUP_WINDOW
    existing = db.table("trigger_events") \
        .select("id") \
        .eq("student_id", student_id) \
        .eq("topic", topic) \
        .eq("trigger_type", trigger_type) \
        .gte("fired_at", f"now() - interval '{DEDUP_WINDOW}'") \
        .execute()

    if existing.data:
        return None

    # Log trigger event
    db.table("trigger_events").insert({
        "student_id":   student_id,
        "topic":        topic,
        "trigger_type": trigger_type,
        "trigger_data": event.get("trigger_data", {}),
    }).execute()

    # Generate quiz via RAG
    quiz_json = await generate_quiz_for_trigger(
        student_id=student_id,
        topic=topic,
        trigger_type=trigger_type,
        trigger_data=event.get("trigger_data", {}),
        db=db,
        openai_client=oai_client,
    )

    if not quiz_json:
        return None

    # Save quiz — status 'pending' until student portal picks it up
    result = db.table("generated_quizzes").insert({
        "student_id":   student_id,
        "topic":        topic,
        "trigger_type": trigger_type,
        "quiz_title":   quiz_json.get("quiz_title", f"{topic} Quiz"),
        "questions":    quiz_json.get("questions", []),
        "status":       "pending",
    }).execute()

    return result.data[0] if result.data else None


# ── TRIGGER 1: Quiz Failure ───────────────────────────────
def _trigger_quiz_failure(student_id: str, db) -> list[dict]:
    recent = db.table("generated_quizzes") \
        .select("topic, score") \
        .eq("student_id", student_id) \
        .eq("status", "completed") \
        .gte("completed_at", "now() - interval '7 days'") \
        .execute()

    return [
        {
            "student_id":   student_id,
            "topic":        q["topic"],
            "trigger_type": "quiz_failure",
            "trigger_data": {"score": q["score"]},
        }
        for q in (recent.data or [])
        if q["score"] is not None and q["score"] < QUIZ_FAIL_THRESHOLD
    ]


# ── TRIGGER 2: Tutor Report (called on recap submission) ──
async def trigger_tutor_report(
    recap_id: str, student_id: str, raw_text: str, db, oai_client
) -> list[str]:
    """Parse recap with LLM, fire triggers for each struggled topic."""
    prompt = f"""A tutor wrote this post-lesson recap:
---
{raw_text}
---
Extract every academic topic the student struggled with.
Return ONLY valid JSON: {{"topics": [{{"topic": "string", "struggle_level": "mild|moderate|severe"}}]}}
If no struggles are mentioned return {{"topics": []}}"""

    response = await oai_client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.1,
    )
    parsed = json.loads(response.choices[0].message.content)
    topics = parsed.get("topics", [])

    # Save parsed topics to recap row
    db.table("tutor_recaps").update({
        "parsed_topics": topics,
        "processed": True,
    }).eq("id", recap_id).execute()

    fired = []
    for t in topics:
        await fire_trigger({
            "student_id":   student_id,
            "topic":        t["topic"],
            "trigger_type": "tutor_report",
            "trigger_data": {"struggle_level": t["struggle_level"]},
        }, db, oai_client)
        fired.append(t["topic"])

    return fired


# ── TRIGGER 3: Talk-Time (fired directly from transcription.py) ──
# Handled inline in process_completed_transcript — no separate function needed


# ── TRIGGER 4: Latency ───────────────────────────────────
def _trigger_latency(student_id: str, db) -> list[dict]:
    """
    Compares each correct quiz response time against the student's
    per-topic baseline. Uses a Supabase RPC for the JOIN.
    """
    result = db.rpc("get_slow_responses", {
        "p_student_id":  student_id,
        "p_multiplier":  LATENCY_MULTIPLIER,
    }).execute()

    return [
        {
            "student_id":   student_id,
            "topic":        r["topic"],
            "trigger_type": "latency",
            "trigger_data": {
                "response_ms": r["response_time_ms"],
                "baseline_ms": r["baseline_answer_ms"],
            },
        }
        for r in (result.data or [])
    ]


# ── TRIGGER 5: Spaced Repetition / Decay ─────────────────
def _trigger_spaced_rep(student_id: str, db) -> list[dict]:
    rows = db.table("topic_mastery") \
        .select("*") \
        .eq("student_id", student_id) \
        .execute()

    now = datetime.now(timezone.utc)
    events = []

    for row in (rows.data or []):
        if not row.get("last_demonstrated_at"):
            continue

        last = datetime.fromisoformat(row["last_demonstrated_at"])
        days = (now - last).days
        decay = row["mastery_score"] * math.pow(0.5, days / DECAY_HALF_LIFE_DAYS)

        # Update decay score
        db.table("topic_mastery") \
            .update({"decay_score": round(decay, 4)}) \
            .eq("id", row["id"]) \
            .execute()

        if decay < DECAY_THRESHOLD:
            events.append({
                "student_id":   student_id,
                "topic":        row["topic"],
                "trigger_type": "spaced_rep",
                "trigger_data": {
                    "decay_score":  round(decay, 4),
                    "days_since":   days,
                },
            })

    return events


# ── Mastery score updater (called after every quiz submission) ──
def update_mastery(student_id: str, topic: str, subject: str, score: float, db):
    """Upsert mastery score after a quiz is completed."""
    now = datetime.now(timezone.utc).isoformat()
    existing = db.table("topic_mastery") \
        .select("*") \
        .eq("student_id", student_id) \
        .eq("topic", topic) \
        .execute()

    if existing.data:
        row = existing.data[0]
        # Exponential moving average so recent performance weighs more
        new_score = round(0.3 * score + 0.7 * row["mastery_score"], 4)
        db.table("topic_mastery").update({
            "mastery_score":         new_score,
            "last_demonstrated_at":  now,
            "total_attempts":        row["total_attempts"] + 1,
        }).eq("id", row["id"]).execute()
    else:
        db.table("topic_mastery").insert({
            "student_id":            student_id,
            "topic":                 topic,
            "subject":               subject,
            "mastery_score":         score,
            "decay_score":           score,
            "last_demonstrated_at":  now,
            "total_attempts":        1,
        }).execute()
