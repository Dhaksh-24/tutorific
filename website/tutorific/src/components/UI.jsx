import { useState } from "react";
import { initials, genPw, genEmail, nowTime, STAGE_ORDER, STAGE_DOTS, STAGE_COLORS, avatarColor, daysSince } from "../data.js";

// ─── Navbar ──────────────────────────────────────────────────
export function Navbar({ page, nav, user, onLogout, setShowLogin, menuOpen, setMenuOpen }) {
  const pubLinks  = [["home","Home"],["courses","Courses"],["about","About"],["pricing","Pricing"],["contact","Contact"]];
  const stdLinks  = [["sdash","Dashboard"],["slessons","My Lessons"],["squizzes","AI Practice"],["smastery","My Progress"],["smaterials","Materials"]];
  const tutLinks  = [["tdash","Dashboard"],["tsessions","My Sessions"],["tattend","Attendance"],["tearnings","Earnings"]];
  const admLinks  = [["adash","Overview"],["aStudents","Students"],["acrm","CRM"],["aattend","Attendance"],["apayments","Payments"],["atutors","Tutors"]];
  const links = user?.type==="student"?stdLinks:user?.type==="tutor"?tutLinks:user?.type==="admin"?admLinks:pubLinks;
  const homeP = user?.type==="student"?"sdash":user?.type==="tutor"?"tdash":user?.type==="admin"?"adash":"home";

  return (<>
    <nav className="nav">
      <div className="nav-logo" onClick={()=>nav(homeP)}>Tutorific <span>✦</span></div>
      <div className="nav-links">
        {links.map(([p,l])=><span key={p} className={`nav-link${page===p?" act":""}`} onClick={()=>nav(p)}>{l}</span>)}
      </div>
      <div className="nav-actions">
        {!user ? <>
          <button className="btn-ghost" onClick={()=>setShowLogin("student")}>Student</button>
          <button className="btn-ghost teal" onClick={()=>setShowLogin("tutor")}>Tutor</button>
          <button className="btn-accent" onClick={()=>setShowLogin("admin")}>Admin</button>
        </> : <>
          <span style={{color:"rgba(255,255,255,.45)",fontSize:".76rem"}}>
            {user.type==="tutor"?"👩‍🏫":user.type==="admin"?"🔐":"👋"} {user.name}
          </span>
          <button className="btn-ghost" onClick={onLogout}>Sign out</button>
        </>}
      </div>
      <button className={`ham${menuOpen?" open":""}`} onClick={()=>setMenuOpen(o=>!o)}>
        <span/><span/><span/>
      </button>
    </nav>
    <div className={`mob-menu${menuOpen?" open":""}`}>
      {links.map(([p,l])=>(
        <div key={p} className={`mob-link${page===p?" act":""}`} onClick={()=>{nav(p);setMenuOpen(false);}}>{l}</div>
      ))}
      <div className="mob-divider"/>
      <div className="mob-actions">
        {!user ? <>
          <button className="btn-ghost" style={{width:"100%",padding:".65rem",textAlign:"center"}} onClick={()=>{setShowLogin("student");setMenuOpen(false);}}>Student Login</button>
          <button className="btn-ghost teal" style={{width:"100%",padding:".65rem",textAlign:"center"}} onClick={()=>{setShowLogin("tutor");setMenuOpen(false);}}>Tutor Login</button>
          <button className="btn-accent" style={{width:"100%",padding:".65rem",textAlign:"center"}} onClick={()=>{setShowLogin("admin");setMenuOpen(false);}}>Admin</button>
        </> : <>
          <div style={{fontSize:".8rem",color:"rgba(255,255,255,.4)",paddingBottom:".5rem"}}>{user.name}</div>
          <button className="btn-ghost" style={{width:"100%",padding:".65rem",textAlign:"center"}} onClick={()=>{onLogout();setMenuOpen(false);}}>Sign Out</button>
        </>}
      </div>
    </div>
  </>);
}

// ─── Mobile dashboard header ──────────────────────────────────
export function MobDashHeader({ user, onLogout, links, page, nav }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mob-dash-header">
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.25rem",color:"#fff"}}>Tutorific <span style={{color:"var(--gold2)"}}>✦</span></div>
      <button onClick={()=>setOpen(o=>!o)} className={`ham${open?" open":""}`}><span/><span/><span/></button>
      {open && (
        <div style={{position:"fixed",top:50,left:0,right:0,bottom:0,background:"var(--navy)",zIndex:190,padding:"1.25rem 1.5rem",display:"flex",flexDirection:"column",gap:".1rem",overflowY:"auto"}}>
          {links.map(l=>(
            <div key={l.p} className={`mob-link${page===l.p?" act":""}`} onClick={()=>{nav(l.p);setOpen(false);}}>{l.icon} {l.label}</div>
          ))}
          <div className="mob-divider"/>
          <div style={{fontSize:".8rem",color:"rgba(255,255,255,.38)",padding:".5rem 0"}}>{user.name}</div>
          <button className="btn-ghost" style={{width:"100%",padding:".65rem",textAlign:"center"}} onClick={()=>{onLogout();setOpen(false);}}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────
export function Footer({ nav }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">Tutorific <span>✦</span></div>
          <p className="footer-desc">Expert online tutoring for Years 3–13. Personalised, engaging and results-driven.</p>
        </div>
        <div className="footer-col"><h5>Programmes</h5><ul>{["11+ Preparation","Key Stage 3","GCSE","A-Level"].map(l=><li key={l}><span onClick={()=>nav("courses")}>{l}</span></li>)}</ul></div>
        <div className="footer-col"><h5>Company</h5><ul>{[["About","about"],["Pricing","pricing"],["Contact","contact"]].map(([l,p])=><li key={l}><span onClick={()=>nav(p)}>{l}</span></li>)}</ul></div>
        <div className="footer-col"><h5>Contact</h5><ul>
          <li><span>+44 7826 842306</span></li>
          <li><span>tutorifictuition@gmail.com</span></li>
          <li><span>Instagram · Facebook · YouTube</span></li>
        </ul></div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Tutorific. All rights reserved.</p>
        <div style={{display:"flex",gap:"1.5rem"}}>
          <span style={{color:"rgba(255,255,255,.25)",fontSize:".75rem",cursor:"pointer"}}>Terms</span>
          <span style={{color:"rgba(255,255,255,.25)",fontSize:".75rem",cursor:"pointer"}}>Privacy</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Confirm modal (replaces window.confirm) ──────────────────
export function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel="Confirm", danger=false }) {
  return (
    <div className="modal-bg anim-fade" onClick={e=>e.target===e.currentTarget&&onCancel()}>
      <div className="modal" style={{maxWidth:400}}>
        <h3 style={{marginBottom:".5rem"}}>{title}</h3>
        <p style={{color:"var(--muted)",fontSize:".87rem",lineHeight:1.65,marginBottom:"1.75rem"}}>{message}</p>
        <div style={{display:"flex",gap:".65rem"}}>
          <button onClick={onCancel} className="btn-secondary" style={{flex:1}}>Cancel</button>
          <button onClick={onConfirm} className={`btn-primary${danger?" red":""}`} style={{flex:2,justifyContent:"center",background:danger?"var(--red)":"var(--teal)"}}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Student Modal ────────────────────────────────────────
export function AddStudentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({name:"",year:"Yr 11",subject:"GCSE Maths",tutor:"Mr. Ahmed",parent:"",parentEmail:"",fee:120});
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState("");
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const subjects = ["11+ Prep","KS3 Maths","KS3 English","KS3 Science","GCSE Maths","GCSE English","GCSE Science","A-Level Maths","A-Level Biology","A-Level Chemistry"];
  const years = ["Yr 5","Yr 6","Yr 7","Yr 8","Yr 9","Yr 10","Yr 11","Yr 12","Yr 13"];

  const handleCreate = () => {
    if(!form.name||!form.parent||!form.parentEmail){ alert("Please fill all required fields."); return; }
    const password = genPw(), email = genEmail(form.name);
    const student = {id:Date.now(),name:form.name,year:form.year,subject:form.subject,tutor:form.tutor,parent:form.parent,parentEmail:form.parentEmail,fee:Number(form.fee),email};
    setResult({password,email,student});
    onAdd(student);
  };

  const copy = (val, key) => {
    navigator.clipboard?.writeText(val).catch(()=>{});
    setCopied(key);
    setTimeout(()=>setCopied(""),1500);
  };

  return (
    <div className="modal-bg anim-fade" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        {!result ? <>
          <h3>Add Student</h3>
          <p className="modal-sub">Login credentials will be auto-generated and emailed to the parent.</p>
          <div className="modal-row">
            <div><label className="modal-label">Student Name</label><input className="modal-input" placeholder="Sophie Williams" value={form.name} onChange={e=>f("name",e.target.value)}/></div>
            <div><label className="modal-label">Year Group</label><select className="modal-input" value={form.year} onChange={e=>f("year",e.target.value)}>{years.map(y=><option key={y}>{y}</option>)}</select></div>
          </div>
          <div className="modal-row">
            <div><label className="modal-label">Subject</label><select className="modal-input" value={form.subject} onChange={e=>f("subject",e.target.value)}>{subjects.map(s=><option key={s}>{s}</option>)}</select></div>
            <div><label className="modal-label">Tutor</label><select className="modal-input" value={form.tutor} onChange={e=>f("tutor",e.target.value)}>{["Mr. Ahmed","Ms. Clarke","Dr. Patel"].map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
          <div className="modal-row">
            <div><label className="modal-label">Parent Name</label><input className="modal-input" placeholder="Mark Williams" value={form.parent} onChange={e=>f("parent",e.target.value)}/></div>
            <div><label className="modal-label">Monthly Fee</label><select className="modal-input" value={form.fee} onChange={e=>f("fee",e.target.value)}>{[95,120,150].map(x=><option key={x} value={x}>£{x}/month</option>)}</select></div>
          </div>
          <label className="modal-label">Parent Email</label>
          <input className="modal-input" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={e=>f("parentEmail",e.target.value)}/>
          <div style={{display:"flex",gap:".65rem",marginTop:".25rem"}}>
            <button onClick={onClose} className="btn-secondary" style={{flex:1}}>Cancel</button>
            <button onClick={handleCreate} className="btn-primary gold" style={{flex:2,justifyContent:"center"}}>Create & Send Login</button>
          </div>
        </> : <>
          <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
            <div style={{fontSize:"2rem",marginBottom:".5rem"}}>✅</div>
            <h3>Account Created</h3>
            <p style={{color:"var(--muted)",fontSize:".85rem",marginTop:".3rem"}}>Credentials for <strong>{result.student.name}</strong></p>
          </div>
          <div className="cred-box">
            <div style={{fontSize:".7rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:".65rem"}}>Login Credentials</div>
            {[["Email",result.email,"email"],["Password",result.password,"pass"]].map(([l,v,k])=>(
              <div key={k} className="cred-row">
                <div><div className="cred-label">{l}</div><div className="cred-val">{v}</div></div>
                <button className="btn-copy" onClick={()=>copy(v,k)}>{copied===k?"Copied!":"Copy"}</button>
              </div>
            ))}
          </div>
          <div className="banner teal" style={{marginTop:".85rem",marginBottom:0}}>
            <span>📧</span><p>Welcome email sent to <strong>{result.student.parentEmail}</strong></p>
          </div>
          <button className="btn-primary" style={{width:"100%",justifyContent:"center",marginTop:"1.1rem"}} onClick={onClose}>Done</button>
        </>}
      </div>
    </div>
  );
}

// ─── Reschedule Modal ─────────────────────────────────────────
export function RescheduleModal({ session, onClose, onConfirm }) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reason, setReason]   = useState("");
  const [done, setDone]       = useState(false);
  const slots = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

  const handleConfirm = () => {
    if(!newDate||!newTime){ alert("Please pick a date and time."); return; }
    onConfirm(session.id, newDate, newTime, reason);
    setDone(true);
  };

  return (
    <div className="modal-bg anim-fade" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        {done ? (
          <div style={{textAlign:"center",padding:"1rem 0"}}>
            <div style={{fontSize:"2rem",marginBottom:"1rem"}}>✅</div>
            <h3 style={{marginBottom:".5rem"}}>Rescheduled</h3>
            <p style={{color:"var(--muted)",fontSize:".85rem",marginBottom:"1.5rem"}}>
              {session.studentName}'s session moved to {newDate} at {newTime}. Student and parent have been notified.
            </p>
            <button className="btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={onClose}>Done</button>
          </div>
        ) : (<>
          <h3>Reschedule Session</h3>
          <p className="modal-sub">
            {session.studentName} · {session.subj} — {session.topic}<br/>
            Currently: {session.date} {session.month} at {session.time}
          </p>
          <label className="modal-label">New Date</label>
          <input type="date" className="modal-input" value={newDate} onChange={e=>setNewDate(e.target.value)} min="2026-03-20"/>
          <label className="modal-label" style={{marginBottom:".5rem"}}>New Time</label>
          <div className="time-slots">
            {slots.map(t=><button key={t} className={`time-slot${newTime===t?" active":""}`} onClick={()=>setNewTime(t)}>{t}</button>)}
          </div>
          <label className="modal-label">Reason <span style={{fontWeight:400,textTransform:"none"}}>(optional)</span></label>
          <textarea className="modal-input" rows={2} placeholder="e.g. Tutor unavailable, student request…" value={reason} onChange={e=>setReason(e.target.value)} style={{resize:"none"}}/>
          <div style={{display:"flex",gap:".65rem",marginTop:".25rem"}}>
            <button onClick={onClose} className="btn-secondary" style={{flex:1}}>Cancel</button>
            <button onClick={handleConfirm} className="btn-primary teal" style={{flex:2,justifyContent:"center"}}>Confirm Reschedule</button>
          </div>
        </>)}
      </div>
    </div>
  );
}
