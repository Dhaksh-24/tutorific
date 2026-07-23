import { useState } from "react";
import "./styles.css";
import { Navbar } from "./components/UI.jsx";
import { HomePage, CoursesPage, AboutPage, PricingPage, ContactPage, LoginPage } from "./pages/Public.jsx";
import StudentDash from "./pages/StudentDash.jsx";
import TutorDash   from "./pages/TutorDash.jsx";
import AdminDash   from "./pages/AdminDash.jsx";
import { INIT_STUDENTS, INIT_SESSIONS, PAYMENTS_INIT, INIT_LEADS, TUTOR_PAYMENTS_INIT, nowTime } from "./data.js";

export default function App() {
  const [page,          setPage]          = useState("home");
  const [user,          setUser]          = useState(null);
  const [showLogin,     setShowLogin]     = useState(null);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [students,      setStudents]      = useState(INIT_STUDENTS);
  const [payments,      setPayments]      = useState(PAYMENTS_INIT);
  const [sessions,      setSessions]      = useState(INIT_SESSIONS);
  const [leads,         setLeads]         = useState(INIT_LEADS);
  const [tutorPayments, setTutorPayments] = useState(TUTOR_PAYMENTS_INIT);
  const [showAdd,       setShowAdd]       = useState(false);

  const nav = p => { setPage(p); setShowLogin(null); setMenuOpen(false); window.scrollTo(0,0); };
  const onLogin = u => { setUser(u); setShowLogin(null); nav(u.type==="student"?"sdash":u.type==="tutor"?"tdash":"adash"); };
  const onLogout = () => { setUser(null); nav("home"); };
  const handleJoin = id => setSessions(p=>p.map(s=>s.id===id?{...s,attendState:"P",joinedAt:nowTime()}:s));

  if (showLogin) return (
    <>
      <Navbar page={page} nav={nav} user={user} onLogout={onLogout} setShowLogin={setShowLogin} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      <LoginPage type={showLogin} onLogin={onLogin} nav={nav}/>
    </>
  );

  if (user?.type === "student") return (
    <StudentDash page={page} nav={nav} user={user} onLogout={onLogout} sessions={sessions} onJoin={handleJoin}/>
  );

  if (user?.type === "tutor") return (
    <TutorDash page={page} nav={nav} user={user} onLogout={onLogout} sessions={sessions} setSessions={setSessions} tutorPayments={tutorPayments}/>
  );

  if (user?.type === "admin") return (
    <AdminDash page={page} nav={nav} onLogout={onLogout} students={students} setStudents={setStudents} payments={payments} setPayments={setPayments} sessions={sessions} setSessions={setSessions} leads={leads} setLeads={setLeads} showAdd={showAdd} setShowAdd={setShowAdd} tutorPayments={tutorPayments} setTutorPayments={setTutorPayments}/>
  );

  return (<>
    <Navbar page={page} nav={nav} user={user} onLogout={onLogout} setShowLogin={setShowLogin} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
    {page==="home"    && <HomePage    nav={nav} setShowLogin={setShowLogin}/>}
    {page==="courses" && <CoursesPage nav={nav}/>}
    {page==="about"   && <AboutPage   nav={nav}/>}
    {page==="pricing" && <PricingPage nav={nav}/>}
    {page==="contact" && <ContactPage nav={nav}/>}
  </>);
}
