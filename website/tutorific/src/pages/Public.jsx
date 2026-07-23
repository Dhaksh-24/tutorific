import { useState } from "react";
import { Footer } from "../components/UI.jsx";
import { TUTORS_AUTH } from "../data.js";

const TESTIMONIALS = [
  {stars:"★★★★★",body:"Emma went from a predicted grade 4 to achieving a grade 8 in her mocks. The personalised approach and consistent feedback made all the difference.",name:"Sarah J.",role:"Parent — GCSE Maths"},
  {stars:"★★★★★",body:"We were sceptical about online tutoring but Tutorific completely won us over. Ben's confidence in English has soared and his tutor genuinely cares.",name:"Claire T.",role:"Parent — 11+ Prep"},
  {stars:"★★★★★",body:"The AI quizzes after each lesson are brilliant. Isla told me she actually looks forward to doing them because they're based on exactly what she covered.",name:"Greg H.",role:"Parent — A-Level Chemistry"},
  {stars:"★★★★★",body:"As a student myself I find the portal really easy to use. Joining lessons is one click, and the study guides afterwards save me so much time.",name:"Liam W.",role:"Year 13 Student"},
];

// ─── Home ─────────────────────────────────────────────────────
export function HomePage({ nav, setShowLogin }) {
  return (<>
    {/* Hero */}
    <div className="hero">
      <div className="hero-inner">
        <div className="anim-up">
          <div className="hero-eyebrow">🎓 Years 3–13 · UK Online Tutoring</div>
          <h1>Where Every<br/><em>Student</em> Thrives</h1>
          <p className="hero-sub">Personalised 1-to-1 tutoring from 11+ through A-Level. Expert tutors, AI-powered practice, and real results.</p>
          <div className="hero-btns">
            <button className="btn-primary gold" onClick={()=>nav("courses")}>Explore Courses</button>
            <button className="btn-secondary" style={{borderColor:"rgba(255,255,255,.25)",color:"rgba(255,255,255,.8)"}} onClick={()=>setShowLogin("student")}>Student Portal →</button>
          </div>
        </div>
        <div className="hero-card anim-up" style={{animationDelay:".15s"}}>
          <div className="hero-card-title">Tutorific by the numbers</div>
          {[["200+","students taught across the UK"],["95%","pass rate in mock exams"],["4.9 ★","average parent rating"],["8","specialist subject tutors"]].map(([n,l])=>(
            <div key={l} className="hero-stat-row">
              <div className="hero-stat-n">{n}</div>
              <div className="hero-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Courses strip */}
    <div style={{background:"var(--white)",padding:"4.5rem 2rem"}}>
      <div style={{maxWidth:1260,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
          <div>
            <div className="eyebrow">Our programmes</div>
            <h2 className="section-title" style={{marginBottom:0}}>Something for every year group</h2>
          </div>
          <button className="btn-secondary btn-sm" onClick={()=>nav("courses")}>View all →</button>
        </div>
        <div className="courses-grid">
          {[
            {tag:"tag-gold",label:"Primary",title:"11+ Preparation",desc:"Grammar and independent school entrance prep across all four tested areas.",pills:["Maths","English","VR","NVR"]},
            {tag:"tag-teal",label:"KS3",title:"Key Stage 3",desc:"Strong foundations in Years 7–9 to set students up for GCSE confidence.",pills:["Maths","English","Science"]},
            {tag:"tag-navy",label:"GCSE",title:"GCSE",desc:"Intensive, focused tuition built around each student's actual weak points.",pills:["Maths","English","Sciences","History"]},
            {tag:"tag-purple",label:"A-Level",title:"A-Level",desc:"Specialist tutors guiding sixth-formers towards university-ready grades.",pills:["Maths","Biology","Chemistry","English"]},
          ].map(c=>(
            <div key={c.title} className="course-card" onClick={()=>nav("courses")}>
              <div className={`course-tag ${c.tag}`}>{c.label}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="pills">{c.pills.map(p=><span key={p} className="pill">{p}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="feat-bg">
      <div className="inner">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"center",marginBottom:"3rem"}}>
          <div>
            <div className="eyebrow" style={{color:"var(--gold2)"}}>What's included</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(1.8rem,3.5vw,2.6rem)",color:"#fff",marginBottom:".85rem",letterSpacing:"-.02em"}}>Everything your child needs to succeed</h2>
            <p style={{color:"rgba(255,255,255,.48)",fontSize:".93rem",lineHeight:1.8}}>From live sessions to AI-generated practice quizzes based on real lesson transcripts — we've built a complete learning system.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".75rem"}}>
            {[["🎯","98%","Lesson satisfaction"],["📝","15k+","Past paper questions"],["🤖","AI","Personalised quizzes"],["⏱️","24h","Support response"]].map(([ic,n,l])=>(
              <div key={l} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"var(--r)",padding:"1.25rem"}}>
                <div style={{fontSize:"1.35rem",marginBottom:".5rem"}}>{ic}</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.65rem",color:"#fff",lineHeight:1}}>{n}</div>
                <div style={{fontSize:".75rem",color:"rgba(255,255,255,.4)",marginTop:".2rem"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="feat-grid">
          {[
            {icon:"🎯",title:"Personalised Sessions",desc:"Every lesson adapts to the student's pace, knowledge gaps and exam board."},
            {icon:"🤖",title:"AI Practice Quizzes",desc:"Generated from real lesson transcripts so questions match exactly how the tutor explained it."},
            {icon:"📈",title:"Progress Tracking",desc:"Mastery and retention scores update after every quiz so you always know where you stand."},
            {icon:"📝",title:"Exam Technique",desc:"Past papers, model answers and timed practice built into every programme."},
            {icon:"💬",title:"Tutor Chat Support",desc:"Message your tutor between sessions — most respond within a few hours."},
            {icon:"📚",title:"Resource Library",desc:"Notes, recordings and past papers organised by topic in your student portal."},
          ].map(f=>(
            <div key={f.title} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Testimonials */}
    <div style={{background:"var(--bg)",padding:"5rem 2rem"}}>
      <div style={{maxWidth:1260,margin:"0 auto"}}>
        <div style={{marginBottom:"2.25rem"}}>
          <div className="eyebrow">What parents & students say</div>
          <h2 className="section-title">Trusted by families across the UK</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} className="testi-card">
              <div className="testi-stars">{t.stars}</div>
              <p className="testi-body">"{t.body}"</p>
              <div className="testi-author">
                <div className="testi-av">{t.name[0]}</div>
                <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTA */}
    <div style={{background:"var(--navy)",padding:"4.5rem 2rem",textAlign:"center"}}>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <div className="eyebrow" style={{color:"var(--gold2)"}}>Ready to start?</div>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(1.8rem,3.5vw,2.6rem)",color:"#fff",marginBottom:".85rem",letterSpacing:"-.02em"}}>Join 200+ students already achieving more</h2>
        <p style={{color:"rgba(255,255,255,.48)",fontSize:".93rem",lineHeight:1.8,marginBottom:"2rem"}}>Book a free trial session — no commitment required.</p>
        <div style={{display:"flex",gap:".75rem",justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn-primary gold" style={{fontSize:".92rem"}} onClick={()=>nav("contact")}>Book a Free Trial</button>
          <button className="btn-primary" style={{fontSize:".92rem",background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)"}} onClick={()=>nav("pricing")}>View Pricing</button>
        </div>
      </div>
    </div>

    <Footer nav={nav}/>
  </>);
}

// ─── Courses ──────────────────────────────────────────────────
export function CoursesPage({ nav }) {
  return (<>
    <div style={{background:"var(--navy)",padding:"3.5rem 2rem"}}>
      <div style={{maxWidth:1260,margin:"0 auto"}}>
        <div className="eyebrow" style={{color:"var(--gold2)"}}>Programmes</div>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(2rem,4vw,3rem)",color:"#fff",letterSpacing:"-.02em"}}>Our Courses</h1>
      </div>
    </div>
    <div style={{maxWidth:1260,margin:"0 auto",padding:"3.5rem 2rem"}}>
      <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
        {[
          {tag:"tag-gold",label:"Years 5–6",title:"11+ Preparation",price:95,desc:"Our 11+ programme gives young learners the best possible chance at grammar and independent school entrance exams. We cover all four tested areas with structured practice and mock exam sessions.",subjects:["Maths","English","Verbal Reasoning","Non-Verbal Reasoning"],features:["Weekly 60-min live sessions","Timed past paper practice","Full mock exam sessions","Digital revision library","Progress reports to parents"]},
          {tag:"tag-teal",label:"Years 7–9",title:"Key Stage 3",price:95,desc:"Building rock-solid foundations across core subjects to set students up for GCSE success. We identify gaps early and fix them before they become exam problems.",subjects:["Mathematics","English","Science"],features:["Weekly live tutoring","Topic-by-topic structured notes","Homework support","Progress tracking dashboard"]},
          {tag:"tag-navy",label:"Years 10–11",title:"GCSE",price:120,desc:"Our most popular programme. Intensive, exam-focused tuition designed around each student's real weak points, based on actual mock data and topic analysis.",subjects:["Maths","English Language","English Literature","Biology","Chemistry","Physics"],features:["Weekly live sessions","Exam technique coaching","Past paper deep-dives","Model answer walkthroughs","Mock result analysis"]},
          {tag:"tag-purple",label:"Years 12–13",title:"A-Level",price:150,desc:"Specialist tutors guiding sixth-formers through demanding A-Level content with university-focused preparation and independent thinking skills.",subjects:["Mathematics","Biology","Chemistry","Physics","English Literature"],features:["Weekly 75-min live sessions","UCAS personal statement guidance","Extended writing support","Deep-dive conceptual sessions"]},
        ].map(c=>(
          <div key={c.title} style={{background:"var(--white)",borderRadius:"var(--r2)",border:"1px solid var(--border)",padding:"2rem",display:"grid",gridTemplateColumns:"1fr 200px",gap:"2rem",alignItems:"start"}}>
            <div>
              <div className={`course-tag ${c.tag}`} style={{marginBottom:"1rem"}}>{c.label}</div>
              <h3 style={{fontSize:"1.65rem",marginBottom:".6rem"}}>{c.title}</h3>
              <p style={{color:"var(--muted)",fontSize:".88rem",lineHeight:1.78,marginBottom:"1.25rem",maxWidth:540}}>{c.desc}</p>
              <div className="pills" style={{marginBottom:"1.25rem"}}>{c.subjects.map(s=><span key={s} className="pill">{s}</span>)}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:".65rem"}}>
                {c.features.map(f=><span key={f} style={{fontSize:".78rem",color:"var(--teal)",display:"flex",alignItems:"center",gap:".3rem"}}><span style={{fontWeight:800}}>✓</span>{f}</span>)}
              </div>
            </div>
            <div style={{textAlign:"center",background:"var(--bg)",borderRadius:"var(--r)",padding:"1.5rem"}}>
              <div style={{fontSize:".68rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".4rem"}}>From</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"2.4rem",color:"var(--navy)",lineHeight:1}}>£{c.price}</div>
              <div style={{fontSize:".76rem",color:"var(--muted)",margin:".3rem 0 1.1rem"}}>/month</div>
              <button className="btn-primary gold" style={{width:"100%",justifyContent:"center",fontSize:".82rem"}} onClick={()=>nav("contact")}>Enquire Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer nav={nav}/>
  </>);
}

// ─── About ────────────────────────────────────────────────────
export function AboutPage({ nav }) {
  return (<>
    <div style={{background:"var(--navy)",padding:"3.5rem 2rem"}}>
      <div style={{maxWidth:1260,margin:"0 auto"}}>
        <div className="eyebrow" style={{color:"var(--gold2)"}}>Our story</div>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(2rem,4vw,3rem)",color:"#fff",letterSpacing:"-.02em"}}>About Tutorific</h1>
      </div>
    </div>

    <div style={{background:"var(--white)",padding:"4.5rem 2rem"}}>
      <div style={{maxWidth:1260,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center"}}>
        <div>
          <div className="eyebrow">Who we are</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(1.8rem,3vw,2.4rem)",color:"var(--navy)",marginBottom:"1rem",letterSpacing:"-.02em"}}>Passionate about every student's potential</h2>
          <p style={{color:"var(--muted)",fontSize:".9rem",lineHeight:1.85,marginBottom:"1rem"}}>Tutorific was founded on a simple belief: every student deserves access to genuinely expert, personalised support — not a one-size-fits-all approach.</p>
          <p style={{color:"var(--muted)",fontSize:".9rem",lineHeight:1.85,marginBottom:"2rem"}}>We're a team of specialist tutors working entirely online with students across the UK. Our AI technology doesn't replace the tutor — it amplifies their impact between sessions.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".85rem"}}>
            {[["200+","Students taught"],["8","Expert tutors"],["95%","Mock pass rate"],["4.9★","Parent rating"]].map(([n,l])=>(
              <div key={l} style={{padding:"1.1rem",background:"var(--bg)",borderRadius:"var(--r)",border:"1px solid var(--border)"}}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.85rem",color:"var(--navy)",lineHeight:1}}>{n}</div>
                <div style={{fontSize:".76rem",color:"var(--muted)",marginTop:".25rem"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          {[
            {icon:"🎯",title:"Truly personalised",body:"We start every student with a diagnostic assessment. Sessions are built around their gaps, not a generic syllabus."},
            {icon:"🤖",title:"AI that actually helps",body:"Our AI generates practice quizzes from real lesson transcripts — so questions are based on exactly how your tutor explained it."},
            {icon:"📊",title:"Transparent progress",body:"Parents and students can see mastery scores, attendance, and upcoming sessions in the portal at any time."},
          ].map(f=>(
            <div key={f.title} style={{padding:"1.25rem",background:"var(--bg)",borderRadius:"var(--r)",border:"1px solid var(--border)",display:"flex",gap:"1rem",alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:9,background:"var(--teal-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{f.icon}</div>
              <div><div style={{fontWeight:700,fontSize:".9rem",color:"var(--navy)",marginBottom:".3rem"}}>{f.title}</div><div style={{fontSize:".84rem",color:"var(--muted)",lineHeight:1.7}}>{f.body}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div style={{background:"var(--bg)",padding:"4.5rem 2rem"}}>
      <div style={{maxWidth:1260,margin:"0 auto"}}>
        <div className="eyebrow">Our tutors</div>
        <h2 className="section-title">Meet the team</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.25rem",marginTop:"1.5rem"}}>
          {[
            {name:"Mr. Ahmed",sub:"GCSE & A-Level Maths",bio:"Former comprehensive school HOD with 12 years' experience. Specialist in making abstract concepts concrete.",badge:"Maths"},
            {name:"Ms. Clarke",sub:"English Language, Literature & 11+",bio:"Trained secondary English teacher. Published author of 11+ prep materials used in schools across London.",badge:"English / 11+"},
            {name:"Dr. Patel",sub:"GCSE & A-Level Sciences",bio:"PhD in Biochemistry from Imperial. Tutored A-Level students for 8 years alongside academic research.",badge:"Science"},
          ].map(t=>(
            <div key={t.name} style={{background:"var(--white)",borderRadius:"var(--r2)",border:"1px solid var(--border)",padding:"1.75rem"}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:"var(--navy2)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Serif Display',serif",fontSize:"1.25rem",marginBottom:"1rem"}}>{t.name.split(" ").pop()[0]}</div>
              <div style={{fontWeight:700,fontSize:".95rem",color:"var(--navy)",marginBottom:".2rem"}}>{t.name}</div>
              <div style={{fontSize:".78rem",color:"var(--muted)",marginBottom:".85rem"}}>{t.sub}</div>
              <div className={`course-tag tag-teal`} style={{marginBottom:".85rem"}}>{t.badge}</div>
              <p style={{fontSize:".84rem",color:"var(--text2)",lineHeight:1.7}}>{t.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Footer nav={nav}/>
  </>);
}

// ─── Pricing ──────────────────────────────────────────────────
export function PricingPage({ nav }) {
  return (<>
    <div style={{background:"var(--navy)",padding:"3.5rem 2rem"}}>
      <div style={{maxWidth:1260,margin:"0 auto"}}>
        <div className="eyebrow" style={{color:"var(--gold2)"}}>Pricing</div>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(2rem,4vw,3rem)",color:"#fff",letterSpacing:"-.02em"}}>Simple, transparent fees</h1>
        <p style={{color:"rgba(255,255,255,.5)",fontSize:".95rem",marginTop:".75rem"}}>No registration fees, no hidden charges. Cancel any time.</p>
      </div>
    </div>
    <div style={{maxWidth:1260,margin:"0 auto",padding:"3.5rem 2rem"}}>
      <div className="pricing-grid">
        {[
          {title:"Primary / 11+",desc:"Years 3–6",price:95,featured:true,badge:"Most Popular",features:["Weekly 60-min live session","Past paper practice library","Full digital revision notes","Parent progress reports","Student portal access"]},
          {title:"Key Stage 3",desc:"Years 7–9",price:95,featured:false,features:["Weekly 60-min live session","Subject-specific notes","Homework support","Progress dashboard","Student portal access"]},
          {title:"GCSE",desc:"Years 10–11",price:120,featured:false,features:["Weekly 60-min live session","Exam technique coaching","Past paper walkthroughs","Mock result analysis","Student portal access"]},
          {title:"A-Level",desc:"Years 12–13",price:150,featured:false,features:["Weekly 75-min live session","UCAS personal statement help","Deep-dive topic sessions","Extended writing feedback","Student portal access"]},
        ].map(p=>(
          <div key={p.title} className={`price-card${p.featured?" featured":""}`}>
            {p.featured && <div className="price-badge">{p.badge}</div>}
            <div className="price-label">{p.desc}</div>
            <h3>{p.title}</h3>
            <div className="price-amount"><sup>£</sup>{p.price}<span>/month</span></div>
            <ul className="price-features">{p.features.map(f=><li key={f}>{f}</li>)}</ul>
            <button className={`btn-primary${p.featured?" gold":""}`} style={{width:"100%",justifyContent:"center",marginTop:".5rem"}} onClick={()=>nav("contact")}>Get Started</button>
          </div>
        ))}
      </div>
      <div style={{marginTop:"2.5rem",padding:"1.75rem 2rem",background:"var(--white)",borderRadius:"var(--r2)",border:"1px solid var(--border)",display:"flex",alignItems:"center",gap:"1.5rem",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:220}}>
          <div style={{fontWeight:700,fontSize:".95rem",color:"var(--navy)",marginBottom:".35rem"}}>🎁 Free trial session</div>
          <p style={{fontSize:".85rem",color:"var(--muted)",lineHeight:1.7}}>Not sure yet? Book a free 30-minute trial with any tutor. No payment required.</p>
        </div>
        <button className="btn-primary teal" style={{fontSize:".88rem",flexShrink:0}} onClick={()=>nav("contact")}>Book Free Trial</button>
      </div>
    </div>
    <Footer nav={nav}/>
  </>);
}

// ─── Contact ──────────────────────────────────────────────────
export function ContactPage({ nav }) {
  const [form, setForm]   = useState({name:"",email:"",subject:"General Enquiry",year:"",message:""});
  const [sent, setSent]   = useState(false);
  const [errors, setErrors] = useState({});
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const validate = () => {
    const e = {};
    if(!form.name.trim())    e.name="Required";
    if(!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email="Valid email required";
    if(!form.message.trim()) e.message="Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if(validate()) setSent(true); };

  return (<>
    <div style={{background:"var(--navy)",padding:"3.5rem 2rem"}}>
      <div style={{maxWidth:1260,margin:"0 auto"}}>
        <div className="eyebrow" style={{color:"var(--gold2)"}}>Contact</div>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(2rem,4vw,3rem)",color:"#fff",letterSpacing:"-.02em"}}>Get in touch</h1>
      </div>
    </div>
    <div style={{maxWidth:1260,margin:"0 auto",padding:"3.5rem 2rem"}}>
      <div className="contact-grid">
        <div>
          <h3 style={{marginBottom:"1.5rem"}}>We'd love to hear from you</h3>
          {[{icon:"📞",label:"Phone",value:"+44 7826 842306"},{icon:"✉️",label:"Email",value:"tutorifictuition@gmail.com"},{icon:"📍",label:"Location",value:"Online · UK-wide"},{icon:"🕒",label:"Hours",value:"Mon–Fri 9am–6pm, Sat 10am–2pm"}].map(c=>(
            <div key={c.label} className="contact-info-item">
              <div className="contact-icon">{c.icon}</div>
              <div><div className="contact-label">{c.label}</div><div className="contact-value">{c.value}</div></div>
            </div>
          ))}
          <div style={{marginTop:"2rem",padding:"1.25rem",background:"var(--bg)",borderRadius:"var(--r)",border:"1px solid var(--border)"}}>
            <div style={{fontWeight:600,fontSize:".88rem",color:"var(--navy)",marginBottom:".5rem"}}>🎁 Free trial available</div>
            <p style={{fontSize:".83rem",color:"var(--muted)",lineHeight:1.7}}>Mention in your message that you'd like a free 30-minute trial session and we'll arrange one — no payment required.</p>
          </div>
        </div>
        <div>
          {sent ? (
            <div style={{background:"var(--teal-bg)",border:"1.5px solid var(--teal-bd)",borderRadius:"var(--r2)",padding:"3rem",textAlign:"center"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>✅</div>
              <h3 style={{marginBottom:".5rem"}}>Message sent!</h3>
              <p style={{color:"var(--muted)",fontSize:".9rem",marginBottom:"1.5rem"}}>We'll get back to you within 24 hours.</p>
              <button className="btn-primary teal" onClick={()=>{setSent(false);setForm({name:"",email:"",subject:"General Enquiry",year:"",message:""})}}>Send another</button>
            </div>
          ) : (
            <div style={{background:"var(--white)",borderRadius:"var(--r2)",border:"1px solid var(--border)",padding:"2rem"}}>
              <h3 style={{marginBottom:"1.5rem"}}>Send a message</h3>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Name *</label>
                  <input className={`form-input${errors.name?" error":""}`} placeholder="Jane Smith" value={form.name} onChange={e=>f("name",e.target.value)}/>
                  {errors.name && <div style={{fontSize:".72rem",color:"var(--red)",marginTop:".25rem"}}>{errors.name}</div>}
                </div>
                <div className="form-field">
                  <label className="form-label">Email *</label>
                  <input className={`form-input${errors.email?" error":""}`} type="email" placeholder="jane@email.com" value={form.email} onChange={e=>f("email",e.target.value)}/>
                  {errors.email && <div style={{fontSize:".72rem",color:"var(--red)",marginTop:".25rem"}}>{errors.email}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Subject</label>
                  <select className="form-input" value={form.subject} onChange={e=>f("subject",e.target.value)}>
                    {["General Enquiry","Course Information","Pricing","Book a Trial","Technical Support"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Year Group</label>
                  <select className="form-input" value={form.year} onChange={e=>f("year",e.target.value)}>
                    <option value="">Please select…</option>
                    {["Year 3–6 (11+)","Year 7–9 (KS3)","Year 10–11 (GCSE)","Year 12–13 (A-Level)"].map(y=><option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Message *</label>
                <textarea className={`form-input${errors.message?" error":""}`} rows={4} placeholder="Tell us about your child and what you're looking for…" value={form.message} onChange={e=>f("message",e.target.value)} style={{resize:"vertical"}}/>
                {errors.message && <div style={{fontSize:".72rem",color:"var(--red)",marginTop:".25rem"}}>{errors.message}</div>}
              </div>
              <button className="btn-primary gold" style={{width:"100%",justifyContent:"center",marginTop:".25rem",fontSize:".9rem"}} onClick={handleSubmit}>Send Message</button>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer nav={nav}/>
  </>);
}

// ─── Login ────────────────────────────────────────────────────
export function LoginPage({ type, onLogin, nav }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");

  const studentCred = {email:"emma.johnson@student.tutorific.co.uk",pass:"Tutor-4829-X",name:"Emma Johnson"};
  const adminCred   = {email:"admin@tutorific.co.uk",pass:"admin123",name:"Admin"};

  const handle = () => {
    setErr("");
    if(type==="student"){
      if(email===studentCred.email && pass===studentCred.pass) onLogin({type:"student",name:studentCred.name,studentId:1});
      else setErr("Incorrect email or password.");
    } else if(type==="admin"){
      if(email===adminCred.email && pass===adminCred.pass) onLogin({type:"admin",name:"Admin"});
      else setErr("Incorrect email or password.");
    } else {
      const match = TUTORS_AUTH.find(t=>t.email===email && t.pass===pass);
      if(match) onLogin({type:"tutor",name:match.name,tutorId:match.id,subject:match.subject,ratePerHour:match.ratePerHour});
      else setErr("Incorrect tutor credentials.");
    }
  };

  const portalInfo = {
    student:{title:"Student Portal",sub:"Access your lessons, materials and AI practice",hint:{email:studentCred.email,pass:studentCred.pass},extra:null},
    tutor:  {title:"Tutor Portal",  sub:"Manage sessions, attendance and earnings",        hint:{email:"ahmed@tutorific.co.uk",pass:"Ahmed-2024-T"},extra:"Also: clarke@tutorific.co.uk / Clarke-2024-T"},
    admin:  {title:"Admin Portal",  sub:"Manage students, leads and payments",             hint:{email:adminCred.email,pass:adminCred.pass},extra:null},
  }[type];

  return (
    <div className="auth-page">
      <div className="auth-wrap anim-up">
        <div className="auth-logo">Tutorific <span>✦</span></div>
        {type==="tutor" && (
          <div style={{display:"flex",justifyContent:"center",margin:".5rem 0 0"}}>
            <span style={{background:"var(--teal-bg)",color:"var(--teal)",border:"1px solid var(--teal-bd)",borderRadius:"100px",padding:".22rem .85rem",fontSize:".68rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase"}}>Tutor Portal</span>
          </div>
        )}
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.65rem",textAlign:"center",marginTop:"1.25rem",marginBottom:".25rem",color:"var(--navy)"}}>{portalInfo.title}</h2>
        <p className="auth-subtitle">{portalInfo.sub}</p>

        <div className="form-field">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder={portalInfo.hint.email} value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
        <div className="form-field">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Your password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
        {err && <div style={{fontSize:".8rem",color:"var(--red)",marginBottom:".75rem",padding:".6rem .85rem",background:"var(--red-bg)",borderRadius:7}}>{err}</div>}
        <button className="btn-primary" style={{width:"100%",justifyContent:"center",marginTop:".25rem",background:"var(--navy)"}} onClick={handle}>Sign In</button>

        <div className="auth-hint">
          <strong>Demo credentials</strong><br/>
          Email: <strong>{portalInfo.hint.email}</strong><br/>
          Password: <strong>{portalInfo.hint.pass}</strong>
          {portalInfo.extra && <><br/><span style={{fontSize:".72rem",marginTop:".25rem",display:"block",color:"var(--muted)"}}>{portalInfo.extra}</span></>}
        </div>
        <p style={{textAlign:"center",marginTop:"1.1rem",fontSize:".8rem",color:"var(--muted)",cursor:"pointer"}} onClick={()=>nav("home")}>← Back to website</p>
      </div>
    </div>
  );
}
