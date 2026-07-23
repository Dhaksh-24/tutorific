import { useState } from "react";
import { MobDashHeader, RescheduleModal } from "../components/UI.jsx";
import { TutorRecapForm, AudioUploader } from "../AIComponents.jsx";
import { initials, nowTime, fmtGBP } from "../data.js";

const SB_LINKS = [
  {icon:"⌂",label:"Dashboard",       p:"tdash"},
  {icon:"◷",label:"My Sessions",     p:"tsessions"},
  {icon:"✓",label:"Mark Attendance", p:"tattend"},
  {icon:"£",label:"Earnings",        p:"tearnings"},
];

export default function TutorDash({ page, nav, user, onLogout, sessions, setSessions, tutorPayments }) {
  const mySessions  = sessions.filter(s => s.tutorId === user.tutorId);
  const myPayments  = tutorPayments[user.tutorId] || [];
  const rate        = user.ratePerHour;
  const upcoming    = mySessions.filter(s => !s.attendState);
  const completed   = mySessions.filter(s => s.attendState !== null);
  const totalEarned = completed.filter(s=>s.attendState==="P"||s.attendState==="L").reduce((a,s)=>a+(s.durationHours||1)*rate,0);
  const totalPaid   = myPayments.filter(p=>p.status==="Paid").reduce((a,p)=>a+p.invoiced,0);
  const outstanding = totalEarned - totalPaid;

  const [selId,       setSelId]       = useState(null);
  const [marks,       setMarks]       = useState({});
  const [feedback,    setFeedback]    = useState(null);
  const [reschedSess, setReschedSess] = useState(null);
  const [expandedId,  setExpandedId]  = useState(null); // which completed session shows recap/upload

  const selSess = mySessions.find(s=>s.id===selId)||null;
  const unmarked = mySessions.filter(s=>s.attendState===null);

  const selectSess = id => {
    setSelId(Number(id)); setFeedback(null);
    const s = mySessions.find(s=>s.id===Number(id));
    setMarks(p=>({...p,[Number(id)]:s?.attendState||null}));
  };

  const saveMark = () => {
    const m = marks[selId];
    if(!m){ setFeedback("error"); return; }
    setSessions(p=>p.map(s=>s.id===selId?{...s,attendState:m,markedAt:nowTime()}:s));
    setFeedback("saved");
  };

  const joinSession = s => {
    setSessions(p=>p.map(x=>x.id===s.id?{...x,attendState:"P",joinedAt:nowTime()}:x));
    window.open(s.meet,"_blank");
  };

  const reschedule = (id,date,time,reason) => {
    const [,mo,d]=date.split("-");
    const mn=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    setSessions(p=>p.map(s=>s.id===id?{...s,date:d,month:mn[parseInt(mo)-1],time,rescheduled:true,rescheduleReason:reason}:s));
  };

  const dc=(s)=>s==="P"?"dot-p":s==="A"?"dot-a":s==="L"?"dot-l":"dot-n";
  const dl=(s)=>s==="P"?"Present":s==="A"?"Absent":s==="L"?"Late":"—";
  const pageTitle={tdash:"Dashboard",tsessions:"My Sessions",tattend:"Mark Attendance",tearnings:"Earnings"}[page]||"Tutor Portal";

  return (
    <div className="dash-shell">
      <MobDashHeader user={user} onLogout={onLogout} links={SB_LINKS} page={page} nav={nav}/>
      <div className="sidebar">
        <div className="sb-logo">Tutorific <span>✦</span></div>
        <div className="sb-nav">
          <div className="sb-section">Tutor Portal</div>
          {SB_LINKS.map(s=>(
            <div key={s.p} className={`sb-link${page===s.p?" act":""}`} onClick={()=>nav(s.p)}>
              <span style={{fontSize:".9rem",width:18,textAlign:"center"}}>{s.icon}</span>{s.label}
            </div>
          ))}
        </div>
        <div className="sb-bottom">
          <div className="sb-user">
            <div className="sb-av" style={{background:"var(--teal)"}}>{initials(user.name)}</div>
            <div><div className="sb-name">{user.name}</div><div className="sb-role">{user.subject}</div></div>
          </div>
          <div className="sb-link" onClick={onLogout}><span>⤺</span> Sign Out</div>
        </div>
      </div>

      <div className="dash-main">
        <div className="dash-header">
          <div>
            <h2>{pageTitle}</h2>
            <div className="sub">Friday, 19 March 2026 · £{rate}/hr</div>
          </div>
          {page==="tsessions" && <span className="badge b-green" style={{fontSize:".75rem",padding:".3rem .8rem"}}>{upcoming.length} upcoming</span>}
        </div>

        <div className="dash-content">

          {/* ── DASHBOARD ── */}
          {page==="tdash" && <>
            <div className="stat-grid stat-grid-3" style={{marginBottom:"1.5rem"}}>
              <div className="earn-card g">
                <div style={{fontSize:".66rem",color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".4rem"}}>Total Earned</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.85rem",color:"var(--teal)",lineHeight:1}}>{fmtGBP(totalEarned)}</div>
                <div style={{fontSize:".72rem",color:"var(--muted)",marginTop:".28rem"}}>Attended sessions · £{rate}/hr</div>
              </div>
              <div className="earn-card go">
                <div style={{fontSize:".66rem",color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".4rem"}}>Paid Out</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.85rem",color:"var(--gold)",lineHeight:1}}>{fmtGBP(totalPaid)}</div>
                <div style={{fontSize:".72rem",color:"var(--muted)",marginTop:".28rem"}}>{myPayments.filter(p=>p.status==="Paid").length} payments received</div>
              </div>
              <div className="earn-card n">
                <div style={{fontSize:".66rem",color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".4rem"}}>Outstanding</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.85rem",color:outstanding>0?"var(--navy)":"var(--teal)",lineHeight:1}}>{fmtGBP(outstanding)}</div>
                <div style={{fontSize:".72rem",color:outstanding>0?"var(--gold)":"var(--teal)",marginTop:".28rem"}}>{outstanding>0?"Awaiting payment":"All up to date ✓"}</div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <h3>Upcoming Sessions</h3>
                <span className="card-link" onClick={()=>nav("tsessions")}>All sessions →</span>
              </div>
              <div className="card-body">
                {upcoming.length===0 && <div style={{textAlign:"center",padding:"1.25rem",color:"var(--muted)",fontSize:".85rem"}}>No upcoming sessions.</div>}
                {upcoming.map(s=>(
                  <div key={s.id} className="lesson-row">
                    <div className="lesson-date"><div className="d">{s.date}</div><div className="m">{s.month}</div></div>
                    <div className="lesson-info" style={{flex:1}}>
                      <div className="t">{s.studentName} — {s.topic}</div>
                      <div className="s">{s.time} · {s.subj} · {s.durationHours}h{s.rescheduled?" · 🔄 Rescheduled":""}</div>
                    </div>
                    <div style={{display:"flex",gap:".4rem",flexShrink:0}}>
                      <button className="btn-start" onClick={()=>joinSession(s)}>▶ Start</button>
                      <button className="btn-reschedule" onClick={()=>setReschedSess(s)}>Reschedule</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><h3>Recent Sessions</h3></div>
              <div className="tbl-wrap"><table>
                <thead><tr><th>Date</th><th>Student</th><th>Subject</th><th>Dur.</th><th>Att.</th><th>Earnings</th></tr></thead>
                <tbody>
                  {completed.length===0 && <tr><td colSpan={6} style={{textAlign:"center",color:"var(--muted)",padding:"2rem"}}>No completed sessions.</td></tr>}
                  {completed.map(s=>{
                    const amt=(s.attendState==="P"||s.attendState==="L")?(s.durationHours||1)*rate:0;
                    return <tr key={s.id}>
                      <td>{s.date} {s.month}</td>
                      <td className="tbl-name">{s.studentName}</td>
                      <td>{s.subj}</td>
                      <td>{s.durationHours||1}h</td>
                      <td><span className={`adot ${dc(s.attendState)}`} title={dl(s.attendState)}>{s.attendState}</span></td>
                      <td style={{fontWeight:600,color:amt>0?"var(--teal)":"var(--muted)"}}>{amt>0?fmtGBP(amt):"—"}</td>
                    </tr>;
                  })}
                </tbody>
              </table></div>
            </div>
          </>}

          {/* ── MY SESSIONS ── */}
          {page==="tsessions" && <>
            <div className="banner teal">
              <span>📅</span>
              <p><strong>▶ Start Session</strong> opens Google Meet and auto-marks you present. After each session, expand the recap panel to submit notes and upload a recording for AI quiz generation.</p>
            </div>

            {upcoming.length>0 && <>
              <div className="section-divider">Upcoming</div>
              {upcoming.map(s=>(
                <div key={s.id} className="sess-card">
                  <div className="sc-top">
                    <div>
                      <div className="sc-title">{s.studentName} · {s.subj}</div>
                      <div className="sc-meta">{s.date} {s.month} · {s.time} · {s.durationHours}h · {s.topic}{s.rescheduled?" · 🔄 Rescheduled":""}</div>
                      {s.rescheduled&&s.rescheduleReason&&<div style={{fontSize:".72rem",color:"var(--muted)",marginTop:".12rem"}}>Reason: {s.rescheduleReason}</div>}
                    </div>
                    <div className="sc-actions">
                      <button className="btn-start" onClick={()=>joinSession(s)}>▶ Start Session</button>
                      <button className="btn-reschedule" onClick={()=>setReschedSess(s)}>🔄 Reschedule</button>
                    </div>
                  </div>
                  <div className="sess-meet">Meet: <a href={s.meet} target="_blank" rel="noreferrer">{s.meet}</a></div>
                </div>
              ))}
            </>}

            {completed.length>0 && <>
              <div className="section-divider" style={{marginTop:"1.25rem"}}>Completed</div>
              {completed.map(s=>(
                <div key={s.id} className="sess-card" style={{opacity:.88}}>
                  <div className="sc-top">
                    <div>
                      <div className="sc-title">{s.studentName} · {s.subj}</div>
                      <div className="sc-meta">{s.date} {s.month} · {s.time} · {s.topic}{s.joinedAt?` · Joined ${s.joinedAt}`:""}</div>
                    </div>
                    <div style={{display:"flex",gap:".6rem",alignItems:"center"}}>
                      <span className={`adot ${dc(s.attendState)}`} title={dl(s.attendState)}>{s.attendState}</span>
                      {(s.attendState==="P"||s.attendState==="L")&&<span style={{fontSize:".78rem",color:"var(--teal)",fontWeight:700}}>{fmtGBP((s.durationHours||1)*rate)}</span>}
                      <button onClick={()=>setExpandedId(expandedId===s.id?null:s.id)}
                        style={{padding:".3rem .7rem",borderRadius:7,border:"1px solid var(--border)",background:expandedId===s.id?"var(--bg2)":"transparent",fontSize:".73rem",fontWeight:600,cursor:"pointer",color:"var(--text2)"}}>
                        {expandedId===s.id?"▲ Hide":"Post-lesson ▾"}
                      </button>
                    </div>
                  </div>
                  {expandedId===s.id && (
                    <div className="recap-inner" style={{marginTop:".85rem",paddingTop:".85rem",borderTop:"1px solid var(--border)"}}>
                      <div>
                        <div style={{fontSize:".7rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".65rem"}}>📝 Post-Lesson Recap</div>
                        <TutorRecapForm session={s} user={user} onComplete={r=>console.log(r)}/>
                      </div>
                      <div>
                        <div style={{fontSize:".7rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".65rem"}}>🎙️ Upload Recording</div>
                        <AudioUploader session={s} onDone={d=>console.log(d)}/>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>}

            {mySessions.length===0 && (
              <div style={{textAlign:"center",padding:"3rem",color:"var(--muted)"}}>
                <div style={{fontSize:"2.25rem",marginBottom:"1rem"}}>📅</div>
                <p>No sessions assigned yet.</p>
              </div>
            )}
          </>}

          {/* ── MARK ATTENDANCE ── */}
          {page==="tattend" && <>
            <div className="banner teal">
              <span>✅</span>
              <p>Select a session then mark attendance. Updates sync with the admin dashboard in real-time.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",alignItems:"start"}}>
              <div>
                <div className="card" style={{marginBottom:"1.1rem"}}>
                  <div className="card-head"><h3>Select Session</h3></div>
                  <div className="card-body" style={{display:"flex",flexDirection:"column",gap:".45rem"}}>
                    {mySessions.length===0 && <p style={{color:"var(--muted)",fontSize:".85rem"}}>No sessions assigned.</p>}
                    {mySessions.map(s=>(
                      <div key={s.id} onClick={()=>selectSess(s.id)}
                        style={{padding:".72rem .9rem",borderRadius:8,cursor:"pointer",border:"1.5px solid",borderColor:selId===s.id?"var(--teal)":"var(--border)",background:selId===s.id?"var(--teal-bg)":"var(--white)",transition:"all .15s"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:".5rem"}}>
                          <div>
                            <div style={{fontWeight:600,fontSize:".84rem"}}>{s.date} {s.month} · {s.time}</div>
                            <div style={{fontSize:".72rem",color:"var(--muted)",marginTop:".1rem"}}>{s.studentName} · {s.topic}</div>
                          </div>
                          {s.attendState
                            ? <span className={`adot ${dc(s.attendState)}`}>{s.attendState}</span>
                            : <span className="badge b-amber" style={{fontSize:".65rem"}}>Unmarked</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selSess && (
                  <div className="card anim-fade" style={{marginBottom:0}}>
                    <div className="card-head">
                      <h3>Mark Attendance</h3>
                      <span style={{fontSize:".76rem",color:"var(--muted)"}}>{selSess.studentName}</span>
                    </div>
                    <div className="card-body">
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".75rem .9rem",background:"var(--bg)",borderRadius:8,marginBottom:"1rem",flexWrap:"wrap",gap:".65rem"}}>
                        <div>
                          <div style={{fontWeight:600,fontSize:".88rem"}}>{selSess.studentName}</div>
                          <div style={{fontSize:".74rem",color:"var(--muted)"}}>{selSess.subj} · {selSess.durationHours||1}h</div>
                        </div>
                        <div style={{display:"flex",gap:".35rem"}}>
                          {[["P","Present","var(--teal)","var(--teal-bg)"],["L","Late","var(--gold)","var(--gold-bg)"],["A","Absent","var(--red)","var(--red-bg)"]].map(([code,lbl,col,bg])=>(
                            <button key={code}
                              onClick={()=>{setMarks(p=>({...p,[selId]:code}));setFeedback(null);}}
                              style={{padding:".36rem .85rem",borderRadius:7,border:"1.5px solid",borderColor:marks[selId]===code?col:"var(--border)",background:marks[selId]===code?bg:"transparent",color:marks[selId]===code?col:"var(--muted)",fontSize:".76rem",fontWeight:700,cursor:"pointer",transition:"all .15s"}}
                            >{lbl}</button>
                          ))}
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        {feedback==="saved" && <span style={{fontSize:".8rem",color:"var(--teal)",fontWeight:600}}>✓ Saved!</span>}
                        {feedback==="error" && <span style={{fontSize:".8rem",color:"var(--red)",fontWeight:600}}>Choose an option first.</span>}
                        {!feedback && <span/>}
                        <button className="btn-join" style={{fontSize:".82rem"}} onClick={saveMark}>Save Attendance</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card" style={{marginBottom:0}}>
                <div className="card-head"><h3>Summary · March 2026</h3></div>
                <div className="card-body">
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".65rem",marginBottom:"1.1rem"}}>
                    {[{l:"Present",v:completed.filter(s=>s.attendState==="P").length,c:"b-green"},{l:"Late",v:completed.filter(s=>s.attendState==="L").length,c:"b-amber"},{l:"Absent",v:completed.filter(s=>s.attendState==="A").length,c:"b-red"}].map(x=>(
                      <div key={x.l} style={{textAlign:"center",padding:".85rem .4rem",background:"var(--bg)",borderRadius:8}}>
                        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.7rem",color:"var(--navy)",lineHeight:1}}>{x.v}</div>
                        <span className={`badge ${x.c}`} style={{marginTop:".25rem"}}>{x.l}</span>
                      </div>
                    ))}
                  </div>
                  {mySessions.map(s=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:".65rem",padding:".6rem 0",borderBottom:"1px solid var(--border)"}}>
                      <span className={`adot ${s.attendState?dc(s.attendState):"dot-n"}`}>{s.attendState||"?"}</span>
                      <div style={{flex:1}}><div style={{fontSize:".82rem",fontWeight:600}}>{s.studentName}</div><div style={{fontSize:".72rem",color:"var(--muted)"}}>{s.date} {s.month} · {s.topic}</div></div>
                      {s.attendState && <span style={{fontSize:".7rem",color:"var(--muted)"}}>{s.markedAt||""}</span>}
                    </div>
                  ))}
                  {unmarked.length>0 && (
                    <div className="banner gold" style={{marginTop:".85rem",marginBottom:0}}>
                      <span>⚠</span><p>{unmarked.length} session{unmarked.length!==1?"s":""} still need marking</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>}

          {/* ── EARNINGS ── */}
          {page==="tearnings" && <>
            <div className="stat-grid stat-grid-3" style={{marginBottom:"1.5rem"}}>
              <div className="earn-card g">
                <div style={{fontSize:".66rem",color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".4rem"}}>Total Earned</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.85rem",color:"var(--teal)",lineHeight:1}}>{fmtGBP(totalEarned)}</div>
                <div style={{fontSize:".72rem",color:"var(--muted)",marginTop:".28rem"}}>Attended sessions · £{rate}/hr</div>
              </div>
              <div className="earn-card go">
                <div style={{fontSize:".66rem",color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".4rem"}}>Paid Out</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.85rem",color:"var(--gold)",lineHeight:1}}>{fmtGBP(totalPaid)}</div>
                <div style={{fontSize:".72rem",color:"var(--muted)",marginTop:".28rem"}}>{myPayments.filter(p=>p.status==="Paid").length} payments</div>
              </div>
              <div className="earn-card n">
                <div style={{fontSize:".66rem",color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".4rem"}}>Outstanding</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.85rem",color:outstanding>0?"var(--navy)":"var(--teal)",lineHeight:1}}>{fmtGBP(outstanding)}</div>
                <div style={{fontSize:".72rem",color:outstanding>0?"var(--gold)":"var(--teal)",marginTop:".28rem"}}>{outstanding>0?"Awaiting payment":"All up to date ✓"}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:"1.25rem"}}>
              <div className="card" style={{marginBottom:0}}>
                <div className="card-head"><h3>Session History</h3></div>
                <div className="tbl-wrap"><table>
                  <thead><tr><th>Date</th><th>Student</th><th>Subject</th><th>Dur.</th><th>Att.</th><th>Earned</th></tr></thead>
                  <tbody>
                    {mySessions.length===0&&<tr><td colSpan={6} style={{textAlign:"center",color:"var(--muted)",padding:"1.5rem"}}>No sessions yet.</td></tr>}
                    {mySessions.map(s=>{const a=(s.attendState==="P"||s.attendState==="L")?(s.durationHours||1)*rate:0;return<tr key={s.id}><td>{s.date} {s.month}</td><td className="tbl-name">{s.studentName}</td><td>{s.subj}</td><td>{s.durationHours||1}h</td><td>{s.attendState?<span className={`adot ${dc(s.attendState)}`}>{s.attendState}</span>:<span style={{color:"var(--muted)",fontSize:".72rem"}}>—</span>}</td><td style={{fontWeight:600,color:a>0?"var(--teal)":"var(--muted)"}}>{a>0?fmtGBP(a):"—"}</td></tr>;})}
                  </tbody>
                </table></div>
              </div>
              <div className="card" style={{marginBottom:0}}>
                <div className="card-head"><h3>Payment History</h3></div>
                <div style={{padding:"0 1.1rem"}}>
                  {myPayments.length===0&&<p style={{color:"var(--muted)",padding:"1.5rem 0",textAlign:"center",fontSize:".85rem"}}>No records yet.</p>}
                  {myPayments.map((p,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".78rem 0",borderBottom:"1px solid var(--border)"}}>
                      <div><div style={{fontWeight:600,fontSize:".84rem"}}>{p.month}</div><div style={{fontSize:".72rem",color:"var(--muted)"}}>{p.sessions} sessions</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontFamily:"'DM Serif Display',serif",fontWeight:600,fontSize:".98rem"}}>£{p.invoiced}</div><span className={`badge b-${p.status==="Paid"?"green":"amber"}`}>{p.status}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>}

        </div>
      </div>
      {reschedSess && <RescheduleModal session={reschedSess} onClose={()=>setReschedSess(null)} onConfirm={(id,d,t,r)=>{reschedule(id,d,t,r);setReschedSess(null);}}/>}
    </div>
  );
}
