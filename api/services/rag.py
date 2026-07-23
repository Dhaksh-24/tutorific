import json
from config import openai_client, LLM_MODEL, TOP_K_CHUNKS
from services.embeddings import retrieve_context

TRIGGER_INSTRUCTIONS = {
    "quiz_failure": (
        "The student scored poorly on this topic. "
        "Generate foundational questions that rebuild understanding from the ground up. "
        "Start easy and build confidence."
    ),
    "tutor_report": (
        "The tutor flagged this topic as a struggle point. "
        "Focus tightly on the exact concepts and explanations from the transcript. "
        "Use the tutor's own wording where possible."
    ),
    "talk_time": (
        "The tutor did most of the talking during this topic. "
        "Generate active-recall questions that force the student to produce the knowledge themselves. "
        "No hints — the student must retrieve it from memory."
    ),
    "latency": (
        "The student answered correctly but too slowly, indicating weak fluency. "
        "Generate rapid-fire short-answer questions to build speed and automaticity."
    ),
    "spaced_rep": (
        "The student has not reviewed this topic in a while and their retention is decaying. "
        "Generate spaced-repetition refresher questions that start simple and build to complex."
    ),
}

QUESTION_MIX = {
    "quiz_failure": {"mcq": 4, "true_false": 1},
    "tutor_report": {"mcq": 3, "short_answer": 2},
    "talk_time":    {"short_answer": 4, "true_false": 1},
    "latency":      {"short_answer": 5},
    "spaced_rep":   {"mcq": 2, "short_answer": 2, "true_false": 1},
}


async def generate_quiz_for_trigger(
    student_id: str,
    topic: str,
    trigger_type: str,
    trigger_data: dict,
    db,
    openai_client,
) -> dict | None:
    """
    Full RAG pipeline:
    1. Retrieve relevant transcript chunks for this student + topic
    2. Build trigger-specific prompt
    3. Call GPT-4o-mini with JSON mode
    4. Return structured quiz dict
    """

    # ── 1. Retrieve context ───────────────────────────────
    query = f"tutor explaining {topic} to student, student questions about {topic}"
    chunks = await retrieve_context(
        student_id=student_id,
        topic=topic,
        query=query,
        k=TOP_K_CHUNKS,
    )

    if not chunks:
        # No transcript data yet — cannot generate a grounded quiz
        return None

    context = "\n\n".join(c["content"] for c in chunks)
    question_mix = QUESTION_MIX.get(trigger_type, {"mcq": 3, "short_answer": 2})
    mix_description = ", ".join(f"{v} {k}" for k, v in question_mix.items())

    # ── 2. Build prompt ───────────────────────────────────
    prompt = f"""You are an AI tutoring assistant. Your job is to generate a personalised quiz
using ONLY the teaching content from the transcript excerpt below.
Do not introduce any external knowledge or textbook definitions.
Every question and explanation must be grounded in what the tutor actually said.

TOPIC: {topic}
TRIGGER REASON: {TRIGGER_INSTRUCTIONS[trigger_type]}
QUESTION MIX: {mix_description} (5 questions total)

TRANSCRIPT CONTEXT:
\"\"\"
{context}
\"\"\"

Return ONLY valid JSON in this exact structure — no prose, no markdown:
{{
  "quiz_title": "string",
  "topic": "{topic}",
  "trigger_type": "{trigger_type}",
  "estimated_minutes": integer,
  "questions": [
    {{
      "index": 0,
      "type": "mcq" | "short_answer" | "true_false",
      "question": "string",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."] or null,
      "correct_answer": "string",
      "explanation": "string — reference how the tutor explained this in the transcript",
      "difficulty": "easy" | "medium" | "hard"
    }}
  ]
}}

Rules:
- Exactly 5 questions, matching the question mix above
- options must be a list of 4 strings for mcq, null for short_answer and true_false
- true_false correct_answer must be exactly "True" or "False"
- difficulty: easy for quiz_failure triggers, hard for latency triggers, mixed otherwise
- explanation must quote or closely paraphrase the tutor's wording from the transcript
- If the transcript context is insufficient for a question, skip it and replace with another type
"""

    # ── 3. Call LLM ───────────────────────────────────────
    response = await openai_client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=1500,
    )

    raw = response.choices[0].message.content

    # ── 4. Parse and validate ─────────────────────────────
    try:
        quiz = json.loads(raw)
        # Basic sanity check
        assert "questions" in quiz
        assert isinstance(quiz["questions"], list)
        assert len(quiz["questions"]) > 0
        return quiz
    except (json.JSONDecodeError, AssertionError, KeyError):
        return None


async def generate_study_guide(
    student_id: str,
    topic: str,
    db,
    openai_client,
) -> dict | None:
    """
    Generates a structured study guide from transcript chunks.
    Called on-demand from the student portal.
    """
    query = f"key concepts explanations {topic} revision summary"
    chunks = await retrieve_context(student_id=student_id, topic=topic, query=query)

    if not chunks:
        return None

    context = "\n\n".join(c["content"] for c in chunks)

    prompt = f"""You are an AI tutoring assistant. Create a concise study guide
using ONLY content from the transcript below. Do not add external information.

TOPIC: {topic}

TRANSCRIPT:
\"\"\"
{context}
\"\"\"

Return ONLY valid JSON:
{{
  "title": "string",
  "topic": "{topic}",
  "summary": "2-3 sentence overview of what was covered",
  "key_concepts": [
    {{"concept": "string", "explanation": "string — in the tutor's own words"}}
  ],
  "common_mistakes": ["string"],
  "remember": ["string — key things to memorise"]
}}
"""

    response = await openai_client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.2,
        max_tokens=1200,
    )

    try:
        return json.loads(response.choices[0].message.content)
    except (json.JSONDecodeError, KeyError):
        return None
