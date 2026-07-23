// src/api.js
// Central API client — swap BASE_URL for production

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function req(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

// ── Lessons ──────────────────────────────────────────────
export const api = {
  // Tutor: submit audio after lesson ends
  uploadAudio: (lessonId, audioUrl) =>
    req("/lessons/upload-audio", {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonId, audio_url: audioUrl }),
    }),

  // Poll transcription status (call every 10s)
  getLessonStatus: (lessonId) => req(`/lessons/${lessonId}/status`),

  // Tutor: post-lesson recap text
  submitRecap: (lessonId, tutorId, studentId, rawText) =>
    req("/recaps/", {
      method: "POST",
      body: JSON.stringify({
        lesson_id: lessonId,
        tutor_id: tutorId,
        student_id: studentId,
        raw_text: rawText,
      }),
    }),

  // ── Quizzes ────────────────────────────────────────────
  // Student: get all pending quizzes (marks them delivered)
  getPendingQuizzes: (studentId) => req(`/quizzes/pending/${studentId}`),

  // Student: submit completed quiz
  submitQuiz: (quizId, studentId, responses) =>
    req("/quizzes/submit", {
      method: "POST",
      body: JSON.stringify({ quiz_id: quizId, student_id: studentId, responses }),
    }),

  // Student: on-demand study guide for a topic
  getStudyGuide: (studentId, topic) =>
    req(`/quizzes/study-guide/${studentId}/${encodeURIComponent(topic)}`),

  // Student: mastery report
  getMastery: (studentId) => req(`/quizzes/mastery/${studentId}`),

  // ── Admin ──────────────────────────────────────────────
  runTriggers: (studentId) =>
    req(`/triggers/run/${studentId}`, { method: "POST" }),
};
