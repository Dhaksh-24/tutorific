// src/AIComponents.jsx
// Drop-in AI components wired to the FastAPI backend.
// Import into App.jsx and add to the relevant dashboard pages.

import { useState, useEffect, useRef } from "react";
import { api } from "./api";

// ─── shared mini helpers ───────────────────────────────────
const nowMs = () => Date.now();
const pct = (n) => `${Math.round(n * 100)}%`;
const difficultyColor = { easy: "b-green", medium: "b-amber", hard: "b-red" };
const triggerLabel = {
  quiz_failure: "📉 Quiz Retry",
  tutor_report: "📝 Tutor Flagged",
  talk_time:    "🎙️ Active Recall",
  latency:      "⚡ Fluency Drill",
  spaced_rep:   "🔁 Spaced Review",
};

// ════════════════════════════════════════════════════════════
// 1. QUIZ RUNNER  (student portal)
//    Shows all pending quizzes, lets student work through them
// ════════════════════════════════════════════════════════════
export function QuizRunner({ studentId, onComplete }) {
  const [quizzes, setQuizzes]     = useState([]);
  const [active, setActive]       = useState(null);   // quiz being taken
  const [qIndex, setQIndex]       = useState(0);
  const [selected, setSelected]   = useState(null);   // current answer
  const [shortAns, setShortAns]   = useState("");
  const [responses, setResponses] = useState([]);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const startRef = useRef(nowMs());

  useEffect(() => { fetchQuizzes(); }, [studentId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await api.getPendingQuizzes(studentId);
      setQuizzes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    setActive(quiz);
    setQIndex(0);
    setResponses([]);
    setResult(null);
    setSelected(null);
    setShortAns("");
    startRef.current = nowMs();
  };

  const currentQ = active?.questions?.[qIndex];

  const handleAnswer = () => {
    const answer = currentQ.type === "short_answer" ? shortAns : selected;
    if (!answer) return;

    const elapsed = nowMs() - startRef.current;
    const isCorrect =
      answer.trim().toLowerCase() ===
      currentQ.correct_answer.trim().toLowerCase();

    const resp = {
      question_index:   qIndex,
      answer_given:     answer,
      is_correct:       isCorrect,
      response_time_ms: elapsed,
    };

    const newResponses = [...responses, resp];
    setResponses(newResponses);
    setSelected(null);
    setShortAns("");
    startRef.current = nowMs();

    if (qIndex + 1 < active.questions.length) {
      setQIndex(qIndex + 1);
    } else {
      finishQuiz(newResponses);
    }
  };

  const finishQuiz = async (finalResponses) => {
    setSubmitting(true);
    try {
      const res = await api.submitQuiz(active.id, studentId, finalResponses);
      setResult(res);
      setQuizzes((prev) => prev.filter((q) => q.id !== active.id));
      onComplete?.(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Result screen ────────────────────────────────────
  if (result) return (
    <div className="card fu" style={{ marginBottom: 0 }}>
      <div className="card-b" style={{ textAlign: "center", padding: "2.5rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>
          {result.score >= 0.8 ? "🎉" : result.score >= 0.6 ? "👍" : "💪"}
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.75rem", color: "var(--navy)", marginBottom: ".4rem" }}>
          {pct(result.score)} — {result.correct}/{result.total} correct
        </h3>
        <p style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: "1.75rem" }}>
          {result.score >= 0.8
            ? "Excellent work! Your mastery score has been updated."
            : result.score >= 0.6
            ? "Good effort — keep practising this topic."
            : "This topic has been flagged for extra practice."}
        </p>
        {result.new_triggers_fired?.length > 0 && (
          <div className="info-banner gold" style={{ textAlign: "left", marginBottom: "1.25rem" }}>
            <span>🔔</span>
            <p>New practice quiz generated for: <strong>{result.new_triggers_fired.join(", ")}</strong></p>
          </div>
        )}
        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center" }}>
          <button className="btn-p" onClick={() => { setResult(null); setActive(null); fetchQuizzes(); }}>
            {quizzes.length > 0 ? "Next Quiz" : "Done"}
          </button>
          {active && (
            <button onClick={() => startQuiz(active)} style={{ padding: ".7rem 1.4rem", borderRadius: 8, border: "1.5px solid var(--border)", background: "transparent", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── Active quiz ───────────────────────────────────────
  if (active && currentQ) return (
    <div className="card" style={{ marginBottom: 0 }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: "var(--bg2)" }}>
        <div style={{ height: "100%", width: pct(qIndex / active.questions.length), background: "var(--teal)", transition: "width .35s" }} />
      </div>
      <div className="card-h">
        <div>
          <h3 style={{ fontSize: "1rem" }}>{active.quiz_title}</h3>
          <div style={{ fontSize: ".76rem", color: "var(--muted)", marginTop: ".15rem" }}>
            <span className={`badge ${triggerLabel[active.trigger_type] ? "b-blue" : "b-gray"}`} style={{ marginRight: ".5rem" }}>
              {triggerLabel[active.trigger_type] || active.trigger_type}
            </span>
            Question {qIndex + 1} of {active.questions.length}
          </div>
        </div>
        <span className={`badge ${difficultyColor[currentQ.difficulty]}`}>{currentQ.difficulty}</span>
      </div>
      <div className="card-b">
        <p style={{ fontWeight: 600, fontSize: "1rem", color: "var(--navy)", marginBottom: "1.5rem", lineHeight: 1.55 }}>
          {currentQ.question}
        </p>

        {/* MCQ */}
        {currentQ.type === "mcq" && (
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {currentQ.options?.map((opt, i) => (
              <button key={i} onClick={() => setSelected(opt)}
                style={{
                  padding: ".85rem 1rem", borderRadius: 8, border: "1.5px solid",
                  borderColor: selected === opt ? "var(--teal)" : "var(--border)",
                  background: selected === opt ? "rgba(13,122,95,.07)" : "#fff",
                  textAlign: "left", cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                  fontSize: ".88rem", fontWeight: selected === opt ? 600 : 400,
                  color: selected === opt ? "var(--teal)" : "var(--text)", transition: "all .15s",
                }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Short answer */}
        {currentQ.type === "short_answer" && (
          <textarea value={shortAns} onChange={(e) => setShortAns(e.target.value)}
            placeholder="Type your answer..." rows={3}
            style={{ width: "100%", padding: ".8rem 1rem", border: "1.5px solid var(--border)", borderRadius: 8, fontFamily: "'Outfit',sans-serif", fontSize: ".88rem", resize: "vertical" }}
            onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        )}

        {/* True / False */}
        {currentQ.type === "true_false" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            {["True", "False"].map((opt) => (
              <button key={opt} onClick={() => setSelected(opt)}
                style={{
                  flex: 1, padding: "1rem", borderRadius: 8, border: "1.5px solid",
                  borderColor: selected === opt ? "var(--teal)" : "var(--border)",
                  background: selected === opt ? "rgba(13,122,95,.07)" : "#fff",
                  cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700, fontSize: ".95rem",
                  color: selected === opt ? "var(--teal)" : "var(--text)",
                }}>
                {opt === "True" ? "✓ True" : "✗ False"}
              </button>
            ))}
          </div>
        )}

        <button className="btn-p" style={{ width: "100%", marginTop: "1.5rem", padding: ".85rem" }}
          onClick={handleAnswer}
          disabled={submitting || (!selected && !shortAns)}
        >
          {submitting ? "Saving…" : qIndex + 1 < active.questions.length ? "Next Question →" : "Finish Quiz"}
        </button>

        {/* Explanation panel (shown after last question only — or could show inline) */}
      </div>
    </div>
  );

  // ── Quiz list ─────────────────────────────────────────
  if (loading) return <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)", fontSize: ".88rem" }}>Loading your quizzes…</div>;

  if (quizzes.length === 0) return (
    <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)" }}>
      <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>✅</div>
      <p style={{ fontSize: ".9rem" }}>No quizzes waiting — check back after your next lesson.</p>
    </div>
  );

  return (
    <div>
      {quizzes.map((q) => (
        <div key={q.id} className="tsess-card" style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: ".95rem", color: "var(--text)", marginBottom: ".3rem" }}>{q.quiz_title}</div>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span className="badge b-blue">{triggerLabel[q.trigger_type] || q.trigger_type}</span>
                <span style={{ fontSize: ".76rem", color: "var(--muted)" }}>{q.topic}</span>
                <span style={{ fontSize: ".76rem", color: "var(--muted)" }}>· ~{q.estimated_minutes} min</span>
                <span style={{ fontSize: ".76rem", color: "var(--muted)" }}>· {q.questions?.length} questions</span>
              </div>
            </div>
            <button className="btn-start" onClick={() => startQuiz(q)}>Start Quiz →</button>
          </div>
        </div>
      ))}
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// 2. MASTERY PANEL  (student portal)
//    Visual breakdown of topic mastery + decay scores
// ════════════════════════════════════════════════════════════
export function MasteryPanel({ studentId }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMastery(studentId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: ".88rem" }}>Loading mastery data…</div>;
  if (!data || data.topics.length === 0) return (
    <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
      <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>📊</div>
      <p style={{ fontSize: ".88rem" }}>No mastery data yet — complete your first quiz to start tracking.</p>
    </div>
  );

  const sorted = [...data.topics].sort((a, b) => b.mastery_score - a.mastery_score);

  return (
    <div>
      {/* Summary chips */}
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {data.strongest?.length > 0 && (
          <div style={{ background: "rgba(13,122,95,.07)", border: "1px solid rgba(13,122,95,.18)", borderRadius: "var(--r)", padding: ".75rem 1rem", flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: ".7rem", color: "var(--teal)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".5rem" }}>Strongest</div>
            {data.strongest.map((t) => <div key={t} style={{ fontSize: ".83rem", fontWeight: 600, color: "var(--text)", marginBottom: ".2rem" }}>✓ {t}</div>)}
          </div>
        )}
        {data.weakest?.length > 0 && (
          <div style={{ background: "rgba(201,149,11,.06)", border: "1px solid rgba(201,149,11,.18)", borderRadius: "var(--r)", padding: ".75rem 1rem", flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: ".7rem", color: "var(--gold)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".5rem" }}>Needs Work</div>
            {data.weakest.map((t) => <div key={t} style={{ fontSize: ".83rem", fontWeight: 600, color: "var(--text)", marginBottom: ".2rem" }}>⚠ {t}</div>)}
          </div>
        )}
      </div>

      {/* Per-topic bars */}
      {sorted.map((t) => (
        <div key={t.topic} style={{ marginBottom: "1.1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: ".35rem" }}>
            <span style={{ fontWeight: 600, fontSize: ".88rem" }}>{t.topic}</span>
            <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>{pct(t.mastery_score)} mastery</span>
          </div>
          {/* Mastery bar */}
          <div style={{ height: 8, background: "var(--bg2)", borderRadius: 100, marginBottom: ".25rem", overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct(t.mastery_score), background: t.mastery_score >= 0.7 ? "var(--teal)" : t.mastery_score >= 0.4 ? "var(--gold)" : "#d04040", borderRadius: 100, transition: "width .6s ease" }} />
          </div>
          {/* Decay bar */}
          <div style={{ height: 4, background: "var(--bg2)", borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct(t.decay_score), background: t.decay_score >= 0.5 ? "rgba(13,122,95,.4)" : "rgba(201,149,11,.5)", borderRadius: 100, transition: "width .6s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".2rem" }}>
            <span style={{ fontSize: ".68rem", color: "var(--muted)" }}>Retention: {pct(t.decay_score)}</span>
            <span style={{ fontSize: ".68rem", color: "var(--muted)" }}>{t.total_attempts} attempt{t.total_attempts !== 1 ? "s" : ""}</span>
          </div>
        </div>
      ))}
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// 3. STUDY GUIDE VIEWER  (student portal)
//    On-demand study guide generated from lesson transcripts
// ════════════════════════════════════════════════════════════
export function StudyGuideViewer({ studentId, topic, onClose }) {
  const [guide, setGuide]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    api.getStudyGuide(studentId, topic)
      .then(setGuide)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [studentId, topic]);

  return (
    <div className="modal-bg fade" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 620 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ marginBottom: ".25rem" }}>{topic} — Study Guide</h3>
            <p style={{ fontSize: ".8rem", color: "var(--muted)" }}>Generated from your lesson transcript</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--muted)", lineHeight: 1 }}>×</button>
        </div>

        {loading && <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>Generating your personalised study guide…</div>}
        {error && <div style={{ textAlign: "center", padding: "2rem", color: "#a02020" }}>No transcript available for this topic yet.</div>}

        {guide && <>
          <div className="info-banner teal" style={{ marginBottom: "1.25rem" }}>
            <span>📖</span><p>{guide.summary}</p>
          </div>

          {guide.key_concepts?.length > 0 && <>
            <div style={{ fontWeight: 700, fontSize: ".78rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".75rem" }}>Key Concepts</div>
            {guide.key_concepts.map((c, i) => (
              <div key={i} style={{ marginBottom: ".85rem", padding: ".9rem 1rem", background: "var(--bg)", borderRadius: 8, borderLeft: "3px solid var(--teal)" }}>
                <div style={{ fontWeight: 700, fontSize: ".88rem", marginBottom: ".3rem", color: "var(--navy)" }}>{c.concept}</div>
                <div style={{ fontSize: ".84rem", color: "var(--text)", lineHeight: 1.65 }}>{c.explanation}</div>
              </div>
            ))}
          </>}

          {guide.common_mistakes?.length > 0 && <>
            <div style={{ fontWeight: 700, fontSize: ".78rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", margin: "1.25rem 0 .75rem" }}>Common Mistakes</div>
            {guide.common_mistakes.map((m, i) => (
              <div key={i} style={{ padding: ".6rem .9rem", background: "rgba(200,40,40,.05)", border: "1px solid rgba(200,40,40,.12)", borderRadius: 7, marginBottom: ".5rem", fontSize: ".85rem", color: "var(--text)" }}>
                ⚠ {m}
              </div>
            ))}
          </>}

          {guide.remember?.length > 0 && <>
            <div style={{ fontWeight: 700, fontSize: ".78rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", margin: "1.25rem 0 .75rem" }}>Remember</div>
            {guide.remember.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: ".6rem", alignItems: "flex-start", marginBottom: ".5rem", fontSize: ".85rem", color: "var(--text)" }}>
                <span style={{ color: "var(--gold)", fontWeight: 700, flexShrink: 0 }}>★</span>{r}
              </div>
            ))}
          </>}
        </>}
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// 4. TUTOR RECAP FORM  (tutor portal → after lesson)
//    Text area + submit → triggers LLM parsing
// ════════════════════════════════════════════════════════════
export function TutorRecapForm({ session, user, onComplete }) {
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const handleSubmit = async () => {
    if (!text.trim() || text.length < 20) return;
    setLoading(true);
    try {
      const res = await api.submitRecap(
        session.id,
        user.tutorId,
        String(session.studentId),
        text,
      );
      setResult(res);
      onComplete?.(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (result) return (
    <div style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
      <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>✅</div>
      <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.25rem", color: "var(--navy)", marginBottom: ".4rem" }}>Recap saved</h4>
      <p style={{ fontSize: ".84rem", color: "var(--muted)", marginBottom: "1rem" }}>
        {result.quizzes_queued > 0
          ? `${result.quizzes_queued} AI quiz${result.quizzes_queued !== 1 ? "zes" : ""} queued for ${session.studentName}.`
          : "No specific struggle topics detected."}
      </p>
      {result.parsed_topics?.length > 0 && (
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".6rem" }}>Topics flagged</div>
          {result.parsed_topics.map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: ".55rem .85rem", background: "var(--bg)", borderRadius: 7, marginBottom: ".4rem" }}>
              <span style={{ fontWeight: 600, fontSize: ".85rem" }}>{typeof t === "string" ? t : t.topic}</span>
              {t.struggle_level && <span className={`badge b-${t.struggle_level === "severe" ? "red" : t.struggle_level === "moderate" ? "amber" : "gray"}`}>{t.struggle_level}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="info-banner gold" style={{ marginBottom: "1rem" }}>
        <span>🤖</span>
        <p>Our AI reads your recap and automatically queues targeted practice quizzes for {session.studentName}. Be specific about topics they found difficult.</p>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder={`e.g. Emma struggled with factorising quadratics — she kept forgetting to look for common factors first. We also briefly covered the quadratic formula but ran out of time. She was confident on expanding double brackets.`}
        style={{ width: "100%", padding: ".9rem 1rem", border: "1.5px solid var(--border)", borderRadius: 8, fontFamily: "'Outfit',sans-serif", fontSize: ".87rem", resize: "vertical", lineHeight: 1.7, marginBottom: "1rem" }}
        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".75rem" }}>
        <span style={{ fontSize: ".76rem", color: text.length < 20 ? "var(--muted)" : "var(--teal)" }}>
          {text.length < 20 ? `${20 - text.length} more characters needed` : "✓ Ready to submit"}
        </span>
        <button
          className="btn-start"
          style={{ padding: ".6rem 1.4rem", opacity: text.length < 20 || loading ? 0.5 : 1 }}
          onClick={handleSubmit}
          disabled={text.length < 20 || loading}
        >
          {loading ? "Analysing…" : "Submit Recap →"}
        </button>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// 5. AUDIO UPLOAD + STATUS POLLER  (tutor portal)
//    Upload audio after lesson → polls transcription status
// ════════════════════════════════════════════════════════════
export function AudioUploader({ session, onDone }) {
  const [status, setStatus] = useState("idle");   // idle|uploading|processing|done|failed
  const [ratio, setRatio]   = useState(null);
  const [triggers, setTriggers] = useState([]);
  const pollRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");

    try {
      // In production: upload to Supabase Storage, get presigned URL
      // For now we pass a placeholder URL — wire up Supabase Storage SDK here
      const audioUrl = `https://your-supabase-project.supabase.co/storage/v1/object/public/recordings/${session.id}.mp3`;

      await api.uploadAudio(session.id, audioUrl);
      setStatus("processing");
      startPolling();
    } catch (e) {
      console.error(e);
      setStatus("failed");
    }
  };

  const startPolling = () => {
    pollRef.current = setInterval(async () => {
      try {
        const s = await api.getLessonStatus(session.id);
        if (s.transcript_status === "done") {
          clearInterval(pollRef.current);
          setStatus("done");
          setRatio(s.tutor_talk_ratio);
          setTriggers(s.triggers_fired || []);
          onDone?.(s);
        } else if (s.transcript_status === "failed") {
          clearInterval(pollRef.current);
          setStatus("failed");
        }
      } catch (e) {
        console.error(e);
      }
    }, 10000); // poll every 10 seconds
  };

  // Cleanup on unmount
  useEffect(() => () => clearInterval(pollRef.current), []);

  return (
    <div>
      {status === "idle" && (
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed var(--border)", borderRadius: "var(--r)", padding: "2rem", cursor: "pointer", transition: "border-color .2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>
          <input type="file" accept="audio/*,video/*" style={{ display: "none" }} onChange={handleFile} />
          <div style={{ fontSize: "2rem", marginBottom: ".6rem" }}>🎙️</div>
          <div style={{ fontWeight: 600, color: "var(--navy)", marginBottom: ".3rem" }}>Upload lesson recording</div>
          <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>MP3, M4A, WAV, MP4 — max 500MB</div>
        </label>
      )}

      {status === "uploading" && (
        <div className="info-banner teal">
          <span>⬆️</span><p>Uploading audio…</p>
        </div>
      )}

      {status === "processing" && (
        <div className="info-banner teal">
          <div className="live-dot" style={{ flexShrink: 0, marginTop: 4 }} />
          <p style={{ marginLeft: ".5rem" }}>
            <strong>Transcribing with AssemblyAI</strong> — this usually takes 3–8 minutes.
            The page will update automatically.
          </p>
        </div>
      )}

      {status === "done" && (
        <div>
          <div className="info-banner teal" style={{ marginBottom: "1rem" }}>
            <span>✅</span>
            <p><strong>Transcript ready.</strong> AI analysis complete.</p>
          </div>
          {ratio !== null && (
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div className="sb2" style={{ flex: 1 }}>
                <div className="lbl">Tutor Talk Time</div>
                <div className="val">{pct(ratio)}</div>
                <div className={ratio > 0.8 ? "hinta" : "hint"}>
                  {ratio > 0.8 ? "⚠ Active recall quiz queued" : "Good balance"}
                </div>
              </div>
              <div className="sb2" style={{ flex: 1 }}>
                <div className="lbl">Triggers Fired</div>
                <div className="val">{triggers.length}</div>
                <div className="hint">AI quizzes generated</div>
              </div>
            </div>
          )}
          {triggers.length > 0 && (
            <div style={{ fontSize: ".84rem", color: "var(--muted)" }}>
              Triggers: {triggers.map((t) => <span key={t} className="badge b-blue" style={{ marginRight: ".35rem" }}>{triggerLabel[t] || t}</span>)}
            </div>
          )}
        </div>
      )}

      {status === "failed" && (
        <div className="info-banner" style={{ background: "rgba(200,40,40,.06)", border: "1px solid rgba(200,40,40,.2)" }}>
          <span>❌</span>
          <p style={{ color: "#a02020" }}>Transcription failed. Check the audio file and try again.</p>
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// 6. ADMIN: STUDENT AI PANEL  (admin portal)
//    Per-student mastery overview + manual trigger button
// ════════════════════════════════════════════════════════════
export function AdminStudentAIPanel({ student }) {
  const [mastery, setMastery]     = useState(null);
  const [running, setRunning]     = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [open, setOpen]           = useState(false);

  const load = () => {
    api.getMastery(String(student.id))
      .then(setMastery)
      .catch(console.error);
  };

  useEffect(() => { if (open) load(); }, [open]);

  const handleRunTriggers = async () => {
    setRunning(true);
    try {
      const res = await api.runTriggers(String(student.id));
      setRunResult(res);
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)}
        style={{ background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: ".35rem .85rem", fontSize: ".75rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif", color: "var(--navy)" }}>
        {open ? "▲ Hide AI" : "🤖 AI Data"}
      </button>

      {open && (
        <div style={{ marginTop: ".75rem", padding: "1rem", background: "var(--bg)", borderRadius: "var(--r)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: ".5rem" }}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>AI Mastery — {student.name}</div>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <button onClick={load} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: ".3rem .75rem", fontSize: ".73rem", cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Refresh</button>
              <button onClick={handleRunTriggers} disabled={running}
                style={{ background: "var(--navy)", color: "#fff", border: "none", borderRadius: 6, padding: ".3rem .85rem", fontSize: ".73rem", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 600, opacity: running ? 0.6 : 1 }}>
                {running ? "Running…" : "Run Triggers"}
              </button>
            </div>
          </div>

          {runResult && (
            <div style={{ marginBottom: ".85rem", padding: ".6rem .9rem", background: "rgba(13,122,95,.07)", border: "1px solid rgba(13,122,95,.2)", borderRadius: 7, fontSize: ".8rem", color: "var(--teal)" }}>
              ✓ {runResult.quizzes_generated} quiz{runResult.quizzes_generated !== 1 ? "zes" : ""} generated for: {runResult.topics.join(", ") || "no new triggers"}
            </div>
          )}

          {!mastery && <div style={{ fontSize: ".84rem", color: "var(--muted)" }}>No mastery data yet.</div>}
          {mastery?.topics?.map((t) => (
            <div key={t.topic} style={{ marginBottom: ".85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".83rem", fontWeight: 600, marginBottom: ".3rem" }}>
                <span>{t.topic}</span>
                <span style={{ color: "var(--muted)", fontWeight: 400 }}>{pct(t.mastery_score)} · decay {pct(t.decay_score)}</span>
              </div>
              <div style={{ height: 6, background: "#e0dcd4", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct(t.mastery_score), background: t.mastery_score >= 0.7 ? "var(--teal)" : t.mastery_score >= 0.4 ? "var(--gold)" : "#d04040", borderRadius: 100 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
