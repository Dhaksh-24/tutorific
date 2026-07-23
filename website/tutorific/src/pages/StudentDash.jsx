import { useState } from "react";
import { MobDashHeader } from "../components/UI.jsx";
import { QuizRunner, MasteryPanel } from "../AIComponents.jsx";
import { MATERIALS, nowTime, initials } from "../data.js";

const SB_LINKS = [
  {icon:"⌂",label:"Dashboard",  p:"sdash"},
  {icon:"◷",label:"My Lessons", p:"slessons"},
  {icon:"⚡",label:"AI Practice",p:"squizzes"},
  {icon:"↗",label:"My Progress",p:"smastery"},
  {icon:"◫",label:"Materials",  p:"smaterials"},
];

export default function StudentDash({ page, nav, user, onLogout, sessions, onJoin }) {
  const [matTab, setMatTab] = useState("Maths");
  const mySessions = sessions.filter(s => s.studentId === (user.studentId || 1));

  const handleJoin = s => { onJoin(s.id); window.open(s.meet,"_blank"); };

  const pageTitle = {
    sdash:"Dashboard", slessons:"My Lessons",
    squizzes:"AI Practice", smastery:"My Progress", smaterials:"Materials"
  }[page] || "Dashboard";

  return (
    <div className="dash-shell">
      <MobDashHeader user={user} onLogout={onLogout} links={SB_LINKS} page={page} nav={nav}/>
      <div className="sidebar">
        <div className="sb-logo">Tutorific <span>✦</span></div>
        <div className="sb-nav">
          <div className="sb-section">Student Portal</div>
          {SB_LINKS.map(s=>(
            <div key={s.p} className={`sb-link${page===s.p?" act":""}`} onClick={()=>nav(s.p)}>
              <span style={{fontSize:".95rem",width:18,textAlign:"center"}}>{s.icon}</span>{s.label}
            </div>
          ))}
        </div>
        <div className="sb-bottom">
          <div className="sb-user">
            <div className="sb-av">{initials(user.name)}</div>
            <div><div className="sb-name">{user.name}</div><div className="sb-role">Year 11 Student</div></div>
          </div>
          <div className="sb-link" onClick={onLogout}><span style={{fontSize:".9rem"}}>⤺</span> Sign Out</div>
        </div>
      </div>

      <div className="dash-main">
        <div className="dash-header">
          <div>
            <h2>{page==="sdash"?`Welcome back, ${user.name.split(" ")[0]}`:pageTitle}</h2>
            <div className="sub">Friday, 19 March 2026</div>
          </div>
          {page==="squizzes" && <span className="badge b-blue" style={{fontSize:".75rem",padding:".3rem .8rem"}}>Powered by AI 🤖</span>}
        </div>

        <div className="dash-content">

          {/* ── DASHBOARD ── */}
          {page==="sdash" && <>
            <div className="stat-grid stat-grid-4">
              {[
                {label:"Upcoming Lessons",value:mySessions.filter(s=>!s.attendState).length,hint:"This month"},
                {label:"Sessions Attended",value:mySessions.filter(s=>s.attendState==="P").length,hint:"Auto-tracked"},
                {label:"Materials",value:"13",hint:"3 new this week"},
                {label:"Next Lesson",value:"Sat 22",warn:"3:00 PM — Maths"},
              ].map(s=>(
                <div key={s.label} className="stat-card">
                  <div className="sc-label">{s.label}</div>
                  <div className="sc-value">{s.value}</div>
                  {s.hint && <div className="sc-hint">{s.hint}</div>}
                  {s.warn && <div className="sc-warn">{s.warn}</div>}
                </div>
              ))}
            </div>

            <div className="banner teal">
              <span>💡</span>
              <p><strong>Attendance is automatic.</strong> Clicking "Join Session" logs you as present — no sign-in needed.</p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
              <div className="card" style={{marginBottom:0}}>
                <div className="card-head">
                  <h3>Upcoming Lessons</h3>
                  <span className="card-link" onClick={()=>nav("slessons")}>All lessons →</span>
                </div>
                <div className="card-body">
                  {mySessions.filter(s=>!s.attendState).slice(0,3).map(l=>(
                    <div key={l.id} className="lesson-row">
                      <div className="lesson-date"><div className="d">{l.date}</div><div className="m">{l.month}</div></div>
                      <div className="lesson-info">
                        <div className="t">{l.subj}</div>
                        <div className="s">{l.topic} · {l.time}</div>
                      </div>
                      <button className="btn-join" onClick={()=>handleJoin(l)}>Join →</button>
                    </div>
                  ))}
                  {mySessions.filter(s=>!s.attendState).length===0 && (
                    <div style={{textAlign:"center",padding:"1.5rem",color:"var(--muted)",fontSize:".85rem"}}>No upcoming sessions</div>
                  )}
                </div>
              </div>

              <div className="card" style={{marginBottom:0}}>
                <div className="card-head">
                  <h3>Recent Materials</h3>
                  <span className="card-link" onClick={()=>nav("smaterials")}>Library →</span>
                </div>
                <div className="card-body">
                  {MATERIALS.Maths.slice(0,3).map(m=>(
                    <div key={m.name} className="mat-row">
                      <div className={`mat-icon ${m.type.toLowerCase()}`}>{m.type}</div>
                      <div className="mat-info"><div className="n">{m.name}</div><div className="m">{m.size}</div></div>
                      <button className="btn-dl">↓</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>}

          {/* ── MY LESSONS ── */}
          {page==="slessons" && (
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><h3>All Sessions</h3></div>
              <div className="card-body">
                <div className="banner teal" style={{marginBottom:"1.1rem"}}>
                  <span className="live-dot" style={{marginTop:4}}/><p style={{marginLeft:".5rem"}}><strong>Auto-tracked</strong> — clicking Join marks you present instantly.</p>
                </div>
                {mySessions.map(l=>(
                  <div key={l.id} className="lesson-row" style={{padding:"1rem 0"}}>
                    <div className="lesson-date"><div className="d">{l.date}</div><div className="m">{l.month}</div></div>
                    <div className="lesson-info" style={{flex:1}}>
                      <div className="t">{l.subj} — {l.topic}</div>
                      <div className="s">{l.time} · {l.tutor}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      {l.attendState==="P"
                        ? <span style={{fontSize:".76rem",color:"var(--teal)",fontWeight:700}}>✓ Attended {l.joinedAt && `· ${l.joinedAt}`}</span>
                        : <button className="btn-join" onClick={()=>handleJoin(l)}>Join Session →</button>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AI PRACTICE ── */}
          {page==="squizzes" && <>
            <div className="banner teal">
              <span>🤖</span>
              <p>Quizzes are generated from <strong>your actual lesson transcripts</strong> and triggered automatically when the AI spots a topic to practise.</p>
            </div>
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><h3>Your Practice Quizzes</h3></div>
              <div className="card-body">
                <QuizRunner studentId={String(user.studentId||1)} onComplete={r=>console.log("done",r)}/>
              </div>
            </div>
          </>}

          {/* ── MY PROGRESS ── */}
          {page==="smastery" && <>
            <div className="banner gold">
              <span>📊</span>
              <p>Mastery and retention scores update every time you complete a quiz. The thin bar below each topic shows how much you're retaining over time.</p>
            </div>
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><h3>Topic Mastery</h3></div>
              <div className="card-body">
                <MasteryPanel studentId={String(user.studentId||1)}/>
              </div>
            </div>
          </>}

          {/* ── MATERIALS ── */}
          {page==="smaterials" && <>
            <div style={{display:"flex",gap:".4rem",marginBottom:"1.1rem",flexWrap:"wrap"}}>
              {Object.keys(MATERIALS).map(t=>(
                <button key={t}
                  onClick={()=>setMatTab(t)}
                  style={{padding:".38rem .9rem",borderRadius:"100px",fontSize:".76rem",fontWeight:600,border:"1.5px solid",borderColor:matTab===t?"var(--navy)":"var(--border)",background:matTab===t?"var(--navy)":"transparent",color:matTab===t?"#fff":"var(--muted)",cursor:"pointer",transition:"all .16s"}}
                >{t}</button>
              ))}
            </div>
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><h3>{matTab} — Library</h3></div>
              <div className="card-body">
                {MATERIALS[matTab].map(m=>(
                  <div key={m.name} className="mat-row">
                    <div className={`mat-icon ${m.type.toLowerCase()}`}>{m.type}</div>
                    <div className="mat-info"><div className="n">{m.name}</div><div className="m">{m.size} · Added {m.added}</div></div>
                    <button className="btn-dl" onClick={()=>alert("Connect Supabase Storage in production.")}>↓</button>
                  </div>
                ))}
              </div>
            </div>
          </>}

        </div>
      </div>
    </div>
  );
}
