from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


# ── Lessons ───────────────────────────────────────────────
class LessonCreate(BaseModel):
    student_id: str
    tutor_id: str
    subject: str
    topic: str
    scheduled_at: datetime
    duration_minutes: Optional[int] = None

class LessonAudioUpload(BaseModel):
    lesson_id: str
    audio_url: str          # presigned Supabase storage URL

class LessonStatus(BaseModel):
    lesson_id: str
    transcript_status: str  # pending | processing | done | failed
    tutor_talk_ratio: Optional[float] = None
    triggers_fired: list[str] = []


# ── Tutor Recap ───────────────────────────────────────────
class RecapSubmit(BaseModel):
    lesson_id: str
    tutor_id: str
    student_id: str
    raw_text: str

class ParsedTopic(BaseModel):
    topic: str
    struggle_level: Literal["mild", "moderate", "severe"]

class RecapResponse(BaseModel):
    recap_id: str
    parsed_topics: list[ParsedTopic]
    quizzes_queued: int


# ── Quiz ──────────────────────────────────────────────────
class QuizQuestion(BaseModel):
    index: int
    type: Literal["mcq", "short_answer", "true_false"]
    question: str
    options: Optional[list[str]] = None
    correct_answer: str
    explanation: str
    difficulty: Literal["easy", "medium", "hard"]

class QuizOut(BaseModel):
    id: str
    topic: str
    trigger_type: str
    quiz_title: str
    estimated_minutes: int
    questions: list[QuizQuestion]
    status: str
    created_at: datetime

class QuizResponse(BaseModel):
    quiz_id: str
    question_index: int
    answer_given: str
    is_correct: bool
    response_time_ms: int

class QuizSubmit(BaseModel):
    student_id: str
    responses: list[QuizResponse]

class QuizResult(BaseModel):
    quiz_id: str
    score: float
    correct: int
    total: int
    new_triggers_fired: list[str]


# ── Trigger ───────────────────────────────────────────────
class TriggerEvent(BaseModel):
    student_id: str
    topic: str
    trigger_type: str
    trigger_data: dict

class TriggerResult(BaseModel):
    triggers_fired: int
    quizzes_generated: int
    topics: list[str]


# ── Mastery ───────────────────────────────────────────────
class TopicMastery(BaseModel):
    topic: str
    subject: str
    mastery_score: float
    decay_score: float
    last_demonstrated_at: Optional[datetime]
    total_attempts: int

class StudentMasteryReport(BaseModel):
    student_id: str
    topics: list[TopicMastery]
    weakest: list[str]      # bottom 3 by decay_score
    strongest: list[str]    # top 3 by mastery_score


# ── AssemblyAI Webhook ────────────────────────────────────
class AssemblyWebhook(BaseModel):
    transcript_id: str
    status: str
