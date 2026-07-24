import { useState } from "react";
import { MobDashHeader, AddStudentModal, ConfirmModal } from "../components/UI.jsx";
import { AdminStudentAIPanel } from "../AIComponents.jsx";
import {
  initials, nowTime, daysSince, avatarColor, genPw, genEmail,
  TUTORS_AUTH, PAST_ATTEND,
  STAGE_ORDER, STAGE_COLORS, STAGE_DOTS,
} from "../data.js";

const SB_LINKS = [
  {icon:"⌂",label:"Overview",   p:"adash"},
  {icon:"◫",label:"Students",   p:"aStudents"},
  {icon:"◎",label:"CRM",        p:"acrm"},
  {icon:"✓",label:"Attendance", p:"aattend"},
  {icon:"£",label:"Payments",   p:"apayments"},
  {icon:"✦",label:"Tutors",     p:"atutors"},
];

// ─── CRM Panel ─────────────────────────────────────────────
function CRMPanel({ leads, setLeads, onConvert }) {
  const [sel,      setSel]      = useState(null);
  const [search,   setSearch]   = useState("");
  const [stageF,   setStageF]   = useState("All");
  const [logTab,   setLogTab]   = useState("note");
  const [logText,  setLogText]  = useState("");
  const [remDate,  setRemDate]  = useState("");
  const [emailSub, setEmailSub] = useState("");
  const [confirm,  setConfirm]  = useState(null); // lead to convert

  const lead    = sel ? leads.find(l=>l.id===sel) : null;
  const filtered = leads.filter(l=>{
    const ms = stageF==="All" || l.stage===stageF;
    const q  = search.toLowerCase();
    return ms && (!q || l.name.toLowerCase().includes(q) || l.subject.toLowerCase().includes(q));
  });
  const byStage = st => filtered.filter(l=>l.stage===st);

  const upd  = (id,p) => setLeads(prev=>prev.map(l=>l.id===id?{...l,...p}:l));
  const addTL= (id,e) => setLeads(prev=>prev.map(l=>l.id===id?{...l,timeline:[...l.timeline,e]}:l));
  const ts   = () => new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"})+", "+nowTime();

  const changeStage = (id,stage) => {
    upd(id,{stage});
    addTL(id,{type:"stage",text:`Stage → ${stage}`,detail:`Moved to ${stage}.`,ts:ts()});
  };

  const logNote = () => {
    if(!logText.trim()||!lead) return;
    const t = ts();
    if(logTab==="note")   addTL(lead.id,{type:"note", text:"Note logged",            detail:logText,ts:t});
    if(logTab==="email")  addTL(lead.id,{type:"email",text:`Email: ${emailSub||"(no subject)"}`,detail:logText,ts:t});
    if(logTab==="remind"){upd(lead.id,{reminder:remDate});addTL(lead.id,{type:"remind",text:"Reminder set",detail:`${logText} — Due: ${remDate||"TBD"}`,ts:t});}
    setLogText(""); setEmailSub(""); setRemDate("");
  };

  const doConvert = () => {
    const l = confirm;
    const pw=genPw(), email=genEmail(l.name);
    const student={id:Date.now(),name:l.name,year:l.year||"Yr 10",subject:l.subject,tutor:"Mr. Ahmed",parent:l.parent,parentEmail:l.email,fee:120,email};
    onConvert(student);
    changeStage(l.id,"Active");
    addTL(l.id,{type:"email",text:"Account created & credentials sent",detail:`Login: ${email} / ${pw}`,ts:ts()});
    setConfirm(null);
  };

  const tIC = t=>t==="note"?"tl-note":t==="email"?"tl-email":t==="stage"?"tl-stage":t==="remind"?"tl-remind":"tl-enq";
  const tIE = t=>t==="note"?"📝":t==="email"?"📧":t==="stage"?"🔀":t==="remind"?"🔔":"📩";

  return (<>
    <div className="stat-grid stat-grid-4" style={{marginBottom:"1.25rem"}}>
      {[{l:"Total",v:leads.length,h:"All stages"},{l:"Leads",v:leads.filter(l=>l.stage==="Lead").length,w:true},{l:"In Trial",v:leads.filter(l=>l.stage==="Trial").length,w:true},{l:"Active",v:leads.filter(l=>l.stage==="Active").length}].map(s=>(
        <div key={s.l} className="stat-card"><div className="sc-label">{s.l}</div><div className="sc-value">{s.v}</div><div className={s.w?"sc-warn":"sc-hint"}>{s.w?"Needs follow-up":"This term"}</div></div>
      ))}
    </div>
    <div className="search-row">
      <input placeholder="Search name, parent, subject…" value={search} onChange={e=>setSearch(e.target.value)}/>
      {["All",...STAGE_ORDER].map(s=><button key={s} className={`filter-pill${stageF===s?" act":""}`} onClick={()=>setStageF(s)}>{s}</button>)}
    </div>
    <div className="crm-layout">
      <div>
        <div className="pipeline">
          {STAGE_ORDER.map(stage=>(
            <div key={stage} className="pipe-col">
              <div className="pipe-head">
                <div className="pipe-label" style={{color:STAGE_DOTS[stage]}}>{stage}</div>
                <div className="pipe-count">{byStage(stage).length}</div>
              </div>
              {byStage(stage).length===0 && <div style={{textAlign:"center",padding:"1rem .5rem",color:"var(--muted)",fontSize:".76rem"}}>No contacts</div>}
              {byStage(stage).map(l=>(
                <div key={l.id} className={`lead-card${sel===l.id?" sel":""}`} onClick={()=>setSel(l.id)}>
                  {l.reminder && <div className="remind-dot"/>}
                  <div className="lead-name">{l.name}</div>
                  <div className="lead-sub">{l.parent} · {l.subject}</div>
                  <div className="lead-meta">
                    <span className={`badge ${STAGE_COLORS[l.stage]}`}>{l.source}</span>
                    <span className="lead-days">{daysSince(l.date)}d ago</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="crm-panel">
        {!lead ? (
          <div className="crm-empty"><div style={{fontSize:"2.25rem",marginBottom:".75rem"}}>👤</div><p style={{fontSize:".85rem",lineHeight:1.65}}>Select a contact to view details</p></div>
        ) : (
          <div className="anim-fade" key={lead.id}>
            <div style={{padding:"1.25rem",borderBottom:"1px solid var(--border)"}}>
              <div style={{width:46,height:46,borderRadius:"50%",background:avatarColor(lead.name),color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"1rem",marginBottom:".85rem"}}>{initials(lead.name)}</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.3rem",color:"var(--navy)",marginBottom:".18rem"}}>{lead.name}</div>
              <div style={{fontSize:".78rem",color:"var(--muted)",marginBottom:".75rem"}}>{lead.parent} · {lead.subject} · {lead.year}</div>
              <div style={{display:"flex",gap:".35rem",flexWrap:"wrap"}}>
                <span className={`badge ${STAGE_COLORS[lead.stage]}`}>{lead.stage}</span>
                <span className="badge b-blue">{lead.source}</span>
                {lead.reminder && <span className="badge b-red">🔔 {lead.reminder}</span>}
              </div>
            </div>

            <div className="stage-btns">
              {STAGE_ORDER.map(s=><button key={s} className={`stage-btn${lead.stage===s?" act":""}`} onClick={()=>changeStage(lead.id,s)}>{s}</button>)}
            </div>

            <div style={{padding:"1rem 1.1rem",borderBottom:"1px solid var(--border)"}}>
              {[["📧","Email",lead.email],["📞","Phone",lead.phone],["📅","Enquired",lead.date]].map(([ic,l,v])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:".55rem",fontSize:".8rem"}}>
                  <span>{ic}</span><span style={{color:"var(--muted)",minWidth:60,fontSize:".72rem",fontWeight:600}}>{l}</span><span style={{color:"var(--text)"}}>{v}</span>
                </div>
              ))}
            </div>

            <div className="crm-actions">
              <button className="crm-act-btn" onClick={()=>{setLogTab("email");setEmailSub("Following up on your enquiry");}}>📧 Email</button>
              <button className="crm-act-btn" onClick={()=>setLogTab("note")}>📝 Note</button>
              <button className="crm-act-btn" onClick={()=>setLogTab("remind")}>🔔 Remind</button>
              {(lead.stage==="Lead"||lead.stage==="Trial") && (
                <button className="crm-act-btn convert" onClick={()=>setConfirm(lead)}>⚡ Convert</button>
              )}
            </div>

            <div style={{padding:"1rem 1.1rem",maxHeight:240,overflowY:"auto",borderBottom:"1px solid var(--border)"}}>
              {[...lead.timeline].reverse().map((t,i)=>(
                <div key={i} className="tl-item">
                  <div className={`tl-icon ${tIC(t.type)}`}>{tIE(t.type)}</div>
                  <div><div className="tl-text">{t.text}</div><div className="tl-detail">{t.detail}</div><div className="tl-ts">{t.ts}</div></div>
                </div>
              ))}
            </div>

            <div style={{padding:"1rem 1.1rem",background:"var(--bg)"}}>
              <div className="log-tabs">
                {[["note","📝 Note"],["email","📧 Email"],["remind","🔔 Reminder"]].map(([k,l])=>(
                  <button key={k} className={`log-tab${logTab===k?" act":""}`} onClick={()=>setLogTab(k)}>{l}</button>
                ))}
              </div>
              {logTab==="email" && <input className="log-ta" style={{display:"block",marginBottom:".45rem",resize:"none"}} placeholder="Subject…" value={emailSub} onChange={e=>setEmailSub(e.target.value)}/>}
              <textarea className="log-ta" rows={3} placeholder={logTab==="note"?"Log a call or note…":logTab==="email"?"Email body…":"What to follow up on?"} value={logText} onChange={e=>setLogText(e.target.value)}/>
              {logTab==="remind" && (
                <div style={{background:"var(--red-bg)",border:"1px solid var(--red-bd)",borderRadius:7,padding:".65rem .85rem",marginTop:".45rem"}}>
                  <div style={{fontSize:".7rem",fontWeight:700,color:"var(--red)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:".4rem"}}>Reminder Date</div>
                  <input type="date" className="log-ta" value={remDate} onChange={e=>setRemDate(e.target.value)} style={{marginBottom:0}}/>
                </div>
              )}
              <button className="btn-primary" style={{width:"100%",justifyContent:"center",marginTop:".6rem",fontSize:".8rem"}} onClick={logNote}>
                {logTab==="note"?"Save Note":logTab==="email"?"Send Email":"Set Reminder"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {confirm && (
      <ConfirmModal
        title={`Convert ${confirm.name}?`}
        message="This will create a student account, generate login credentials and email them to the parent."
        confirmLabel="Convert to Student"
        onConfirm={doConvert}
        onCancel={()=>setConfirm(null)}
      />
    )}
  </>);
}

// ─── Admin Dash ────────────────────────────────────────────
export default function AdminDash({ page, nav, onLogout, students, setStudents, payments, setPayments, sessions, setSessions, leads, setLeads, showAdd, setShowAdd, tutorPayments, setTutorPayments }) {
  const totalRev = payments.filter(p=>p.status==="Paid").reduce((a,p)=>a+p.amount,0);
  const totalOut = payments.filter(p=>p.status!=="Paid").reduce((a,p)=>a+p.amount,0);
  const dc = s=>s==="P"?"dot-p":s==="A"?"dot-a":s==="L"?"dot-l":"dot-n";

  const addStudent = s => {
    setStudents(p=>[...p,s]);
    setPayments(p=>[...p,{id:Date.now(),studentId:s.id,student:s.name,parent:s.parent,amount:s.fee,due:"01 Apr",paid:"—",status:"Pending"}]);
  };
  const markPaid   = id => setPayments(p=>p.map(x=>x.id===id?{...x,status:"Paid",paid:"Today"}:x));
  const handleConv = ns => { setStudents(p=>[...p,ns]); setPayments(p=>[...p,{id:Date.now(),studentId:ns.id,student:ns.name,parent:ns.parent,amount:ns.fee,due:"01 Apr",paid:"—",status:"Pending"}]); };

  const tutorRows = TUTORS_AUTH.map(t=>{
    const pl=tutorPayments[t.id]||[];
    return{...t,invoiced:pl.reduce((a,p)=>a+p.invoiced,0),paid:pl.filter(p=>p.status==="Paid").reduce((a,p)=>a+p.invoiced,0),sessions:pl.reduce((a,p)=>a+p.sessions,0),owed:pl.filter(p=>p.status==="Pending").reduce((a,p)=>a+p.invoiced,0)};
  });
  const markTutorPaid = tid => setTutorPayments(p=>({...p,[tid]:p[tid].map(x=>x.status==="Pending"?{...x,status:"Paid"}:x)}));

  const pageTitle={adash:"Overview",aStudents:"Students",acrm:"CRM",aattend:"Attendance",apayments:"Payments",atutors:"Tutors"}[page]||"Admin";
  const openLeads = leads.filter(l=>l.stage==="Lead").length;

  return (
    <div className="dash-shell">
      <MobDashHeader user={{name:"Admin"}} onLogout={onLogout} links={SB_LINKS} page={page} nav={nav}/>
      <div className="sidebar">
        <div className="sb-logo">Tutorific <span>✦</span></div>
        <div className="sb-nav">
          <div className="sb-section">Admin Panel</div>
          {SB_LINKS.map(s=>(
            <div key={s.p} className={`sb-link${page===s.p?" act":""}`} onClick={()=>nav(s.p)}>
              <span style={{fontSize:".9rem",width:18,textAlign:"center"}}>{s.icon}</span>
              {s.label}
              {s.p==="acrm" && openLeads>0 && <span className="notif">{openLeads}</span>}
            </div>
          ))}
        </div>
        <div className="sb-bottom">
          <div className="sb-user">
            <div className="sb-av" style={{background:"var(--gold)"}}>AD</div>
            <div><div className="sb-name">Admin</div><div className="sb-role">Tutorific HQ</div></div>
          </div>
          <div className="sb-link" onClick={onLogout}><span>⤺</span> Sign Out</div>
        </div>
      </div>

      <div className="dash-main">
        <div className="dash-header">
          <div><h2>{pageTitle}</h2><div className="sub">Friday, 19 March 2026</div></div>
          {page==="aStudents" && <button className="btn-primary gold btn-sm" onClick={()=>setShowAdd(true)}>+ Add Student</button>}
          {page==="acrm" && <button className="btn-primary teal btn-sm" onClick={()=>{const n=prompt("Contact name?");if(n)setLeads(p=>[...p,{id:Date.now(),name:n,parent:"",email:"",phone:"",stage:"Lead",subject:"",year:"",source:"Manual",date:"2026-03-19",reminder:null,timeline:[{type:"enq",text:"Lead added manually",detail:"",ts:nowTime()}]}]);}}>+ Add Lead</button>}
        </div>

        <div className="dash-content">

          {/* ── OVERVIEW ── */}
          {page==="adash" && <>
            <div className="stat-grid stat-grid-4">
              {[{l:"Active Students",v:students.length,h:"This term"},{l:"Revenue",v:`£${totalRev}`,h:"March 2026"},{l:"Outstanding",v:`£${totalOut}`,w:`${payments.filter(p=>p.status!=="Paid").length} families`},{l:"Open Leads",v:leads.filter(l=>l.stage==="Lead"||l.stage==="Trial").length,w:"In pipeline"}].map(s=>(
                <div key={s.l} className="stat-card"><div className="sc-label">{s.l}</div><div className="sc-value">{s.v}</div><div className={s.w?"sc-warn":"sc-hint"}>{s.w||s.h}</div></div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
              <div className="card" style={{marginBottom:0}}>
                <div className="card-head"><h3>Payment Status</h3><span className="card-link" onClick={()=>nav("apayments")}>All →</span></div>
                <div className="tbl-wrap"><table>
                  <thead><tr><th>Student</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>{payments.slice(0,5).map(p=><tr key={p.id}><td className="tbl-name">{p.student}</td><td>£{p.amount}</td><td><span className={`badge b-${p.status==="Paid"?"green":p.status==="Overdue"?"red":"amber"}`}>{p.status}</span></td></tr>)}</tbody>
                </table></div>
              </div>
              <div className="card" style={{marginBottom:0}}>
                <div className="card-head"><h3>CRM Pipeline</h3><span className="card-link" onClick={()=>nav("acrm")}>All →</span></div>
                <div className="card-body">
                  {STAGE_ORDER.map(s=>(
                    <div key={s} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".62rem 0",borderBottom:"1px solid var(--border)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:".55rem"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_DOTS[s]}}/>
                        <span style={{fontSize:".85rem",fontWeight:500}}>{s}</span>
                      </div>
                      <span style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.35rem",color:"var(--navy)"}}>{leads.filter(l=>l.stage===s).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>}

          {/* ── STUDENTS ── */}
          {page==="aStudents" && <>
            <div className="banner gold"><span>🔑</span><p>Adding a student auto-generates login credentials and emails them to the parent.</p></div>
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><h3>All Students ({students.length})</h3></div>
              <div className="tbl-wrap"><table>
                <thead><tr><th>Student</th><th>Year</th><th>Subject</th><th>Tutor</th><th>Parent</th><th>Email</th><th>Fee</th><th>AI</th></tr></thead>
                <tbody>
                  {students.map(s=><tr key={s.id}>
                    <td className="tbl-name">{s.name}</td>
                    <td>{s.year}</td><td>{s.subject}</td><td>{s.tutor}</td><td>{s.parent}</td>
                    <td style={{fontSize:".76rem",color:"var(--muted)",fontFamily:"'DM Mono',monospace"}}>{s.email}</td>
                    <td style={{fontWeight:600}}>£{s.fee}/mo</td>
                    <td><AdminStudentAIPanel student={s}/></td>
                  </tr>)}
                </tbody>
              </table></div>
            </div>
          </>}

          {/* ── CRM ── */}
          {page==="acrm" && <CRMPanel leads={leads} setLeads={setLeads} onConvert={handleConv}/>}

          {/* ── ATTENDANCE ── */}
          {page==="aattend" && <>
            <div className="banner teal">
              <span className="live-dot" style={{marginTop:3,flexShrink:0}}/>
              <p style={{marginLeft:".5rem"}}><strong>Live.</strong> When a student clicks Join or a tutor marks attendance, rows update here.</p>
            </div>
            {sessions.filter(s=>s.attendState==="P").length>0 && (
              <div className="card">
                <div className="card-head"><h3>Live Joins</h3></div>
                <div className="card-body">
                  {sessions.filter(s=>s.attendState==="P").map(s=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:".85rem",padding:".6rem 0",borderBottom:"1px solid var(--border)"}}>
                      <span className="adot dot-p">P</span>
                      <div style={{flex:1}}><div style={{fontWeight:600,fontSize:".85rem"}}>{s.studentName}</div><div style={{fontSize:".72rem",color:"var(--muted)"}}>{s.subj} · {s.tutor}{s.joinedAt?` · joined ${s.joinedAt}`:""}</div></div>
                      <span className="badge b-green">Logged</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="card">
              <div className="card-head">
                <h3>All Sessions — March 2026</h3>
                <div className="attend-legend">
                  {[["P","dot-p","Present"],["A","dot-a","Absent"],["L","dot-l","Late"]].map(([s,c,l])=><span key={s}><span className={`adot ${c}`}>{s}</span>{l}</span>)}
                </div>
              </div>
              <div className="tbl-wrap"><table>
                <thead><tr><th>Student</th><th>Date</th><th>Subject</th><th>Tutor</th><th>Status</th><th>Marked</th></tr></thead>
                <tbody>
                  {sessions.map(s=><tr key={s.id}>
                    <td className="tbl-name">{s.studentName}</td>
                    <td>{s.date} {s.month}</td><td>{s.subj}</td><td>{s.tutor}</td>
                    <td>{s.attendState?<span className={`adot ${dc(s.attendState)}`}>{s.attendState}</span>:<span style={{fontSize:".72rem",color:"var(--muted)"}}>Pending</span>}</td>
                    <td style={{fontSize:".72rem",color:"var(--muted)"}}>{s.markedAt||"—"}</td>
                  </tr>)}
                </tbody>
              </table></div>
            </div>
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head">
                <h3>Historical Attendance</h3>
                <div className="attend-legend">
                  {[["P","dot-p","Present"],["A","dot-a","Absent"],["L","dot-l","Late"]].map(([s,c,l])=><span key={s}><span className={`adot ${c}`}>{s}</span>{l}</span>)}
                </div>
              </div>
              <div className="tbl-wrap"><table>
                <thead><tr><th>Student</th><th>Year</th><th>Subject</th><th>Tutor</th>{PAST_ATTEND[1].map(w=><th key={w.d}>{w.d}</th>)}<th>Rate</th></tr></thead>
                <tbody>
                  {students.filter(s=>PAST_ATTEND[s.id]).map(s=>{
                    const hist=PAST_ATTEND[s.id]||[];
                    const rate=hist.length?Math.round((hist.filter(a=>a.s==="P").length/hist.length)*100):0;
                    return <tr key={s.id}>
                      <td className="tbl-name">{s.name}</td>
                      <td>{s.year}</td><td>{s.subject}</td><td>{s.tutor}</td>
                      {hist.map((a,i)=><td key={i}><span className={`adot ${dc(a.s)}`}>{a.s}</span></td>)}
                      <td><span className={`badge b-${rate>=90?"green":rate>=75?"amber":"red"}`}>{rate}%</span></td>
                    </tr>;
                  })}
                </tbody>
              </table></div>
            </div>
          </>}

          {/* ── PAYMENTS ── */}
          {page==="apayments" && <>
            <div className="stat-grid stat-grid-3">
              {[{l:"Collected",v:`£${totalRev}`,h:`${payments.filter(p=>p.status==="Paid").length} payments`},{l:"Outstanding",v:`£${totalOut}`,w:`${payments.filter(p=>p.status!=="Paid").length} families`},{l:"Total Expected",v:`£${payments.reduce((a,p)=>a+p.amount,0)}`,h:"March 2026"}].map(s=>(
                <div key={s.l} className="stat-card"><div className="sc-label">{s.l}</div><div className="sc-value">{s.v}</div><div className={s.w?"sc-warn":"sc-hint"}>{s.w||s.h}</div></div>
              ))}
            </div>
            <div className="card" style={{marginBottom:0}}>
              <div className="card-head"><h3>Parent Payments — March 2026</h3></div>
              <div className="tbl-wrap"><table>
                <thead><tr><th>Student</th><th>Parent</th><th>Amount</th><th>Due</th><th>Paid</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {payments.map(p=>(
                    <tr key={p.id}>
                      <td className="tbl-name">{p.student}</td>
                      <td>{p.parent}</td>
                      <td style={{fontWeight:600}}>£{p.amount}</td>
                      <td>{p.due}</td><td>{p.paid}</td>
                      <td><span className={`badge b-${p.status==="Paid"?"green":p.status==="Overdue"?"red":"amber"}`}>{p.status}</span></td>
                      <td>
                        {p.status!=="Paid" && (
                          <div style={{display:"flex",gap:".35rem",flexWrap:"wrap"}}>
                            <button onClick={()=>markPaid(p.id)} className="btn-primary teal btn-xs" style={{fontSize:".72rem"}}>Mark Paid</button>
                            <button onClick={()=>alert(`Reminder sent to ${p.parent}.`)} className="btn-secondary btn-xs" style={{fontSize:".72rem"}}>Remind</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
          </>}

          {/* ── TUTORS ── */}
          {page==="atutors" && <>
            <div className="stat-grid stat-grid-3">
              {[{l:"Total Tutors",v:tutorRows.length,h:"Active"},{l:"Sessions",v:tutorRows.reduce((a,t)=>a+t.sessions,0),h:"This month"},{l:"Outstanding",v:`£${tutorRows.reduce((a,t)=>a+t.owed,0)}`,w:`To ${tutorRows.filter(t=>t.owed>0).length} tutor(s)`}].map(s=>(
                <div key={s.l} className="stat-card"><div className="sc-label">{s.l}</div><div className="sc-value">{s.v}</div><div className={s.w?"sc-warn":"sc-hint"}>{s.w||s.h}</div></div>
              ))}
            </div>
            <div className="card">
              <div className="card-head"><h3>Tutor Payment Schedule</h3></div>
              <div className="tbl-wrap"><table>
                <thead><tr><th>Tutor</th><th>Subject</th><th>Sessions</th><th>Rate</th><th>Invoiced</th><th>Paid</th><th>Owed</th><th>Action</th></tr></thead>
                <tbody>
                  {tutorRows.map(t=>(
                    <tr key={t.id}>
                      <td className="tbl-name">{t.name}</td>
                      <td>{t.subject}</td>
                      <td style={{textAlign:"center"}}>{t.sessions}</td>
                      <td>£{t.ratePerHour}</td>
                      <td>£{t.invoiced}</td>
                      <td style={{color:"var(--teal)",fontWeight:600}}>£{t.paid}</td>
                      <td style={{color:t.owed>0?"var(--gold)":"var(--teal)",fontWeight:700}}>£{t.owed}</td>
                      <td>{t.owed>0?<button onClick={()=>markTutorPaid(t.id)} className="btn-primary teal btn-xs">Mark Paid</button>:<span className="badge b-green">Up to date</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.1rem"}}>
              {tutorRows.map(t=>(
                <div key={t.id} className="card" style={{marginBottom:0}}>
                  <div className="card-head"><h3 style={{fontSize:".9rem"}}>{t.name}</h3><span style={{fontSize:".72rem",color:"var(--muted)"}}>£{t.ratePerHour}/hr</span></div>
                  <div style={{padding:"0 1.1rem"}}>
                    {(tutorPayments[t.id]||[]).map((p,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".72rem 0",borderBottom:"1px solid var(--border)"}}>
                        <div><div style={{fontSize:".82rem",fontWeight:600}}>{p.month}</div><div style={{fontSize:".7rem",color:"var(--muted)"}}>{p.sessions} sessions</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:".95rem"}}>£{p.invoiced}</div><span className={`badge b-${p.status==="Paid"?"green":"amber"}`}>{p.status}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>}

        </div>
      </div>
      {showAdd && <AddStudentModal onClose={()=>setShowAdd(false)} onAdd={addStudent}/>}
    </div>
  );
}
