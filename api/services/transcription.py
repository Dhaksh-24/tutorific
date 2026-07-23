import assemblyai as aai
from config import get_supabase, openai_client, TALK_TIME_THRESHOLD
from services.embeddings import embed_and_store_chunks
from services.logic_engine import check_all_triggers, fire_trigger


async def submit_transcription(lesson_id: str, audio_url: str) -> str:
    """Submit audio to AssemblyAI. Returns transcript_id."""
    db = get_supabase()

    config = aai.TranscriptionConfig(
        speaker_labels=True,
        speakers_expected=2,
        # webhook so we don't poll — AssemblyAI will POST to /webhooks/assemblyai
        webhook_url="https://your-api-domain.com/webhooks/assemblyai",
        webhook_auth_header_name="X-Webhook-Secret",
        webhook_auth_header_value="your-webhook-secret",
    )

    transcriber = aai.Transcriber()
    transcript = transcriber.submit(audio_url, config)

    # Store the AssemblyAI transcript_id so webhook can look up lesson
    db.table("lessons").update({
        "transcript_id": transcript.id,
        "transcript_status": "processing",
    }).eq("id", lesson_id).execute()

    return transcript.id


async def process_completed_transcript(transcript_id: str):
    """
    Called by webhook once AssemblyAI finishes.
    Runs the full ingestion pipeline.
    """
    db = get_supabase()

    # Fetch lesson using transcript_id
    lesson_row = db.table("lessons") \
        .select("*") \
        .eq("transcript_id", transcript_id) \
        .single() \
        .execute()
    lesson = lesson_row.data
    lesson_id  = lesson["id"]
    student_id = lesson["student_id"]
    topic      = lesson["topic"]

    # Fetch full transcript from AssemblyAI
    transcript = aai.Transcript.get_by_id(transcript_id)
    if transcript.status != aai.TranscriptStatus.completed:
        db.table("lessons").update({"transcript_status": "failed"}) \
            .eq("id", lesson_id).execute()
        return

    # ── Compute talk-time ratio ───────────────────────────
    utterances = transcript.utterances or []
    tutor_ms = sum(u.end - u.start for u in utterances if u.speaker == "A")
    total_ms  = utterances[-1].end if utterances else 1
    ratio = round(tutor_ms / total_ms, 3)

    db.table("lessons").update({
        "transcript_status": "done",
        "tutor_talk_ratio": ratio,
    }).eq("id", lesson_id).execute()

    # ── Build speaker-aware chunks ────────────────────────
    chunks = _build_chunks(utterances, student_id, lesson_id, topic)

    # ── Embed and store in pgvector ───────────────────────
    await embed_and_store_chunks(chunks)

    # ── Run all triggers ──────────────────────────────────
    trigger_events = check_all_triggers(student_id, db)

    # Also check talk-time trigger explicitly for this lesson
    if ratio > TALK_TIME_THRESHOLD:
        trigger_events.append({
            "student_id": student_id,
            "topic": topic,
            "trigger_type": "talk_time",
            "trigger_data": {"ratio": ratio},
        })

    for event in trigger_events:
        await fire_trigger(event, db, openai_client)


def _build_chunks(
    utterances: list,
    student_id: str,
    lesson_id: str,
    topic: str,
    max_tokens: int = 400,
) -> list[dict]:
    """
    Group consecutive utterances into chunks of ~max_tokens.
    Preserves speaker info for context.
    """
    chunks = []
    current_text = ""
    current_speaker = ""
    current_start = 0
    current_end = 0

    for u in utterances:
        speaker = "TUTOR" if u.speaker == "A" else "STUDENT"
        line = f"[{speaker}]: {u.text}"
        # Rough token estimate: 1 token ≈ 4 chars
        if len(current_text) + len(line) > max_tokens * 4 and current_text:
            chunks.append({
                "student_id": student_id,
                "lesson_id":  lesson_id,
                "topic":      topic,
                "content":    current_text.strip(),
                "speaker":    current_speaker,
                "start_ms":   current_start,
                "end_ms":     current_end,
            })
            current_text = ""
            current_start = u.start

        current_text    += line + "\n"
        current_speaker  = speaker
        current_end      = u.end
        if not current_start:
            current_start = u.start

    if current_text:
        chunks.append({
            "student_id": student_id,
            "lesson_id":  lesson_id,
            "topic":      topic,
            "content":    current_text.strip(),
            "speaker":    current_speaker,
            "start_ms":   current_start,
            "end_ms":     current_end,
        })

    return chunks
