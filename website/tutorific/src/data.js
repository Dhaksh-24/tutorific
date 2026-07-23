// ─── helpers ─────────────────────────────────────────────────
export const genPw = () => {
  const w = ["Tutor","Learn","Study","Excel","Smart","Bright","Ace","Star"];
  const l = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return `${w[Math.floor(Math.random()*w.length)]}-${Math.floor(1000+Math.random()*9000)}-${l[Math.floor(Math.random()*l.length)]}`;
};
export const genEmail = n => n.toLowerCase().replace(/\s+/g,".") + "@student.tutorific.co.uk";
export const nowTime  = () => { const d=new Date(); return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0"); };
export const initials = n => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
export const avatarColor = n => {
  const c=["#0b5a3f","#1a3354","#7a4000","#5030a0","#a02020","#0d4a7a"];
  let h=0; for(let i=0;i<n.length;i++) h=n.charCodeAt(i)+((h<<5)-h);
  return c[Math.abs(h)%c.length];
};
export const daysSince = d => {
  const now=new Date("2026-03-19"), then=new Date(d);
  return Math.floor((now-then)/(1000*60*60*24));
};
export const fmtGBP = n => `£${n.toFixed(2).replace(/\.00$/,"")}`;
export const pct    = n => `${Math.round(n*100)}%`;

// ─── CRM constants ────────────────────────────────────────────
export const STAGE_ORDER  = ["Lead","Trial","Active","Churned"];
export const STAGE_COLORS = {Lead:"b-purple",Trial:"b-amber",Active:"b-green",Churned:"b-gray"};
export const STAGE_DOTS   = {Lead:"#7030c0",Trial:"var(--gold)",Active:"var(--teal)",Churned:"var(--muted)"};

// ─── Tutor auth ───────────────────────────────────────────────
export const TUTORS_AUTH = [
  {id:"tutor-ahmed",  name:"Mr. Ahmed",  email:"ahmed@tutorific.co.uk",  pass:"Ahmed-2024-T",  subject:"Maths",         ratePerHour:28},
  {id:"tutor-clarke", name:"Ms. Clarke", email:"clarke@tutorific.co.uk", pass:"Clarke-2024-T", subject:"English, 11+",  ratePerHour:28},
  {id:"tutor-patel",  name:"Dr. Patel",  email:"patel@tutorific.co.uk",  pass:"Patel-2024-T",  subject:"Science",       ratePerHour:32},
];

// ─── Students ─────────────────────────────────────────────────
export const INIT_STUDENTS = [
  {id:1,name:"Emma Johnson",  year:"Yr 11",subject:"GCSE Maths",      tutor:"Mr. Ahmed",  tutorId:"tutor-ahmed",  parent:"Sarah Johnson", parentEmail:"sarah.johnson@email.com",  fee:120,email:"emma.johnson@student.tutorific.co.uk"},
  {id:2,name:"James Okafor",  year:"Yr 11",subject:"GCSE English",    tutor:"Ms. Clarke", tutorId:"tutor-clarke", parent:"David Okafor",  parentEmail:"david.okafor@email.com",   fee:120,email:"james.okafor@student.tutorific.co.uk"},
  {id:3,name:"Priya Sharma",  year:"Yr 9", subject:"KS3 Science",     tutor:"Dr. Patel",  tutorId:"tutor-patel",  parent:"Raj Sharma",    parentEmail:"raj.sharma@email.com",     fee:95, email:"priya.sharma@student.tutorific.co.uk"},
  {id:4,name:"Liam Williams", year:"Yr 13",subject:"A-Level Maths",   tutor:"Mr. Ahmed",  tutorId:"tutor-ahmed",  parent:"Karen Williams",parentEmail:"karen.williams@email.com", fee:150,email:"liam.williams@student.tutorific.co.uk"},
  {id:5,name:"Amelia Davis",  year:"Yr 6", subject:"11+ Prep",        tutor:"Ms. Clarke", tutorId:"tutor-clarke", parent:"Tom Davis",     parentEmail:"tom.davis@email.com",      fee:95, email:"amelia.davis@student.tutorific.co.uk"},
  {id:6,name:"Noah Patel",    year:"Yr 10",subject:"GCSE Science",    tutor:"Dr. Patel",  tutorId:"tutor-patel",  parent:"Anita Patel",   parentEmail:"anita.patel@email.com",    fee:120,email:"noah.patel@student.tutorific.co.uk"},
  {id:7,name:"Zara Ahmed",    year:"Yr 7", subject:"KS3 Maths",       tutor:"Mr. Ahmed",  tutorId:"tutor-ahmed",  parent:"Fatima Ahmed",  parentEmail:"fatima.ahmed@email.com",   fee:95, email:"zara.ahmed@student.tutorific.co.uk"},
];

// ─── Sessions ─────────────────────────────────────────────────
export const INIT_SESSIONS = [
  {id:101,studentId:1,studentName:"Emma Johnson", date:"22",month:"Mar",time:"15:00",subj:"Mathematics",      topic:"Quadratic Equations",  tutor:"Mr. Ahmed",  tutorId:"tutor-ahmed",  meet:"https://meet.google.com/abc-defg-hij",attendState:null,durationHours:1},
  {id:102,studentId:1,studentName:"Emma Johnson", date:"24",month:"Mar",time:"16:00",subj:"English Literature",topic:"Romeo & Juliet",       tutor:"Ms. Clarke", tutorId:"tutor-clarke", meet:"https://meet.google.com/bcd-efgh-ijk",attendState:null,durationHours:1},
  {id:103,studentId:1,studentName:"Emma Johnson", date:"26",month:"Mar",time:"15:30",subj:"Mathematics",      topic:"Trigonometry",          tutor:"Mr. Ahmed",  tutorId:"tutor-ahmed",  meet:"https://meet.google.com/cde-fghi-jkl",attendState:null,durationHours:1},
  {id:104,studentId:2,studentName:"James Okafor", date:"22",month:"Mar",time:"14:00",subj:"English",          topic:"Language Analysis",     tutor:"Ms. Clarke", tutorId:"tutor-clarke", meet:"https://meet.google.com/def-ghij-klm",attendState:null,durationHours:1},
  {id:105,studentId:3,studentName:"Priya Sharma", date:"23",month:"Mar",time:"16:30",subj:"Science",          topic:"Atomic Structure",      tutor:"Dr. Patel",  tutorId:"tutor-patel",  meet:"https://meet.google.com/efg-hijk-lmn",attendState:null,durationHours:1},
  {id:106,studentId:4,studentName:"Liam Williams",date:"18",month:"Mar",time:"17:00",subj:"A-Level Maths",   topic:"Integration by Parts",  tutor:"Mr. Ahmed",  tutorId:"tutor-ahmed",  meet:"https://meet.google.com/fgh-ijkl-mno",attendState:"P",durationHours:1.5,joinedAt:"17:02",markedAt:"17:45"},
  {id:107,studentId:7,studentName:"Zara Ahmed",   date:"17",month:"Mar",time:"10:00",subj:"KS3 Maths",       topic:"Algebra Basics",        tutor:"Mr. Ahmed",  tutorId:"tutor-ahmed",  meet:"https://meet.google.com/ghi-jklm-nop",attendState:"A",durationHours:1,markedAt:"10:58"},
  {id:108,studentId:5,studentName:"Amelia Davis", date:"16",month:"Mar",time:"11:00",subj:"11+ Prep",         topic:"Verbal Reasoning",      tutor:"Ms. Clarke", tutorId:"tutor-clarke", meet:"https://meet.google.com/hij-klmn-opq",attendState:"P",durationHours:1,joinedAt:"11:03",markedAt:"12:05"},
  {id:109,studentId:6,studentName:"Noah Patel",   date:"20",month:"Mar",time:"14:00",subj:"GCSE Science",    topic:"Forces & Motion",       tutor:"Dr. Patel",  tutorId:"tutor-patel",  meet:"https://meet.google.com/ijk-lmno-pqr",attendState:null,durationHours:1},
];

// ─── Payments ─────────────────────────────────────────────────
export const PAYMENTS_INIT = [
  {id:1,studentId:1,student:"Emma Johnson", parent:"Sarah Johnson", amount:120,due:"01 Mar",paid:"02 Mar",status:"Paid"},
  {id:2,studentId:2,student:"James Okafor", parent:"David Okafor",  amount:120,due:"01 Mar",paid:"—",     status:"Overdue"},
  {id:3,studentId:3,student:"Priya Sharma", parent:"Raj Sharma",    amount:95, due:"01 Mar",paid:"28 Feb",status:"Paid"},
  {id:4,studentId:4,student:"Liam Williams",parent:"Karen Williams",amount:150,due:"01 Mar",paid:"01 Mar",status:"Paid"},
  {id:5,studentId:5,student:"Amelia Davis", parent:"Tom Davis",     amount:95, due:"01 Mar",paid:"—",     status:"Pending"},
  {id:6,studentId:6,student:"Noah Patel",   parent:"Anita Patel",   amount:120,due:"01 Mar",paid:"04 Mar",status:"Paid"},
  {id:7,studentId:7,student:"Zara Ahmed",   parent:"Fatima Ahmed",  amount:95, due:"01 Mar",paid:"—",     status:"Pending"},
];

// ─── Tutor payments ───────────────────────────────────────────
export const TUTOR_PAYMENTS_INIT = {
  "tutor-ahmed": [{month:"Jan 2026",sessions:6,invoiced:168,status:"Paid"},{month:"Feb 2026",sessions:8,invoiced:224,status:"Paid"},{month:"Mar 2026",sessions:5,invoiced:140,status:"Pending"}],
  "tutor-clarke":[{month:"Jan 2026",sessions:5,invoiced:140,status:"Paid"},{month:"Feb 2026",sessions:6,invoiced:168,status:"Paid"},{month:"Mar 2026",sessions:4,invoiced:112,status:"Paid"}],
  "tutor-patel": [{month:"Jan 2026",sessions:4,invoiced:128,status:"Paid"},{month:"Feb 2026",sessions:5,invoiced:160,status:"Pending"},{month:"Mar 2026",sessions:3,invoiced:96, status:"Pending"}],
};

// ─── Materials ────────────────────────────────────────────────
export const MATERIALS = {
  Maths:[
    {name:"Quadratic Equations — Full Notes",type:"PDF",size:"1.2 MB",added:"12 Mar"},
    {name:"Algebra Revision Worksheet",      type:"PDF",size:"840 KB",added:"8 Mar"},
    {name:"Past Paper — GCSE Maths 2024 P1", type:"PDF",size:"2.1 MB",added:"5 Mar"},
    {name:"Lesson Recording — Surds & Indices",type:"VID",size:"145 MB",added:"1 Mar"},
  ],
  English:[
    {name:"Romeo & Juliet — Essay Frameworks",type:"DOC",size:"320 KB",added:"11 Mar"},
    {name:"Key Quotes Revision Sheet",         type:"PDF",size:"480 KB",added:"7 Mar"},
    {name:"Language Analysis Techniques",      type:"PDF",size:"1.1 MB",added:"3 Mar"},
  ],
  Science:[
    {name:"Atomic Structure Notes",            type:"PDF",size:"1.5 MB",added:"10 Mar"},
    {name:"Chemistry Equations Cheat Sheet",   type:"PDF",size:"290 KB",added:"6 Mar"},
    {name:"Past Paper — AQA Combined 2024",    type:"PDF",size:"3.2 MB",added:"2 Mar"},
  ],
};

// ─── Historical attendance ────────────────────────────────────
export const PAST_ATTEND = {
  1:[{d:"3 Mar",s:"P"},{d:"5 Mar",s:"P"},{d:"8 Mar",s:"A"},{d:"10 Mar",s:"P"},{d:"12 Mar",s:"P"}],
  2:[{d:"3 Mar",s:"P"},{d:"5 Mar",s:"L"},{d:"8 Mar",s:"P"},{d:"10 Mar",s:"P"},{d:"12 Mar",s:"A"}],
  3:[{d:"4 Mar",s:"P"},{d:"6 Mar",s:"P"},{d:"9 Mar",s:"P"},{d:"11 Mar",s:"P"},{d:"13 Mar",s:"P"}],
  4:[{d:"3 Mar",s:"A"},{d:"5 Mar",s:"P"},{d:"8 Mar",s:"P"},{d:"10 Mar",s:"L"},{d:"12 Mar",s:"P"}],
  5:[{d:"4 Mar",s:"P"},{d:"6 Mar",s:"P"},{d:"9 Mar",s:"P"},{d:"11 Mar",s:"A"},{d:"13 Mar",s:"P"}],
  6:[{d:"3 Mar",s:"P"},{d:"5 Mar",s:"P"},{d:"8 Mar",s:"L"},{d:"10 Mar",s:"P"},{d:"12 Mar",s:"P"}],
  7:[{d:"4 Mar",s:"P"},{d:"6 Mar",s:"P"},{d:"9 Mar",s:"P"},{d:"11 Mar",s:"P"},{d:"13 Mar",s:"L"}],
};

// ─── CRM leads ────────────────────────────────────────────────
export const INIT_LEADS = [
  {id:201,name:"Sophie Williams",parent:"Mark Williams",  email:"mark.williams@email.com",   phone:"07700 900123",stage:"Lead",  subject:"GCSE Maths",      year:"Yr 10",source:"Contact Form",date:"2026-03-17",reminder:null,
   timeline:[{type:"enq",text:"Enquiry received via contact form",detail:"Interested in GCSE Maths. Struggling with algebra before mocks.",ts:"17 Mar, 10:42am"}]},
  {id:202,name:"Ben Thornton",   parent:"Claire Thornton",email:"claire.thornton@email.com",phone:"07700 900456",stage:"Lead",  subject:"11+ Prep",        year:"Yr 5", source:"Contact Form",date:"2026-03-16",reminder:"2026-03-21",
   timeline:[{type:"enq",text:"Enquiry received via contact form",detail:"Looking for 11+ prep, sitting in September.",ts:"16 Mar, 2:15pm"},{type:"remind",text:"Reminder set",detail:"Call Claire on 21 March.",ts:"16 Mar, 3:00pm"}]},
  {id:203,name:"Isla Henderson", parent:"Greg Henderson", email:"greg.henderson@email.com",  phone:"07700 900789",stage:"Trial",subject:"A-Level Chemistry",year:"Yr 12",source:"Instagram",   date:"2026-03-10",reminder:null,
   timeline:[{type:"enq",text:"DM via Instagram",detail:"Struggling with organic chemistry.",ts:"10 Mar, 11:00am"},{type:"note",text:"Call logged",detail:"Trial booked 20 March with Dr. Patel.",ts:"11 Mar, 4:30pm"}]},
  {id:204,name:"Marcus Cole",    parent:"Diane Cole",     email:"diane.cole@email.com",      phone:"07700 900321",stage:"Trial",subject:"GCSE English",    year:"Yr 11",source:"Referral",    date:"2026-03-08",reminder:"2026-03-22",
   timeline:[{type:"enq",text:"Referred by Emma Johnson's family",detail:"Needs English Literature help.",ts:"8 Mar, 9:20am"},{type:"note",text:"Trial complete",detail:"Ms. Clarke: Marcus engaged well.",ts:"15 Mar, 5:10pm"}]},
  {id:205,name:"Freya Booth",    parent:"Neil Booth",     email:"neil.booth@email.com",      phone:"07700 900654",stage:"Active",subject:"KS3 Science",    year:"Yr 8", source:"Facebook",    date:"2026-02-20",reminder:null,
   timeline:[{type:"enq",text:"Enquiry via Facebook",detail:"Saw our post.",ts:"20 Feb, 1:05pm"},{type:"stage",text:"Stage → Active",detail:"Enrolled. £95/month.",ts:"4 Mar, 9:00am"}]},
  {id:206,name:"Oliver Reed",    parent:"Julia Reed",     email:"julia.reed@email.com",      phone:"07700 900987",stage:"Churned",subject:"GCSE Maths",   year:"Yr 11",source:"Contact Form",date:"2026-01-15",reminder:null,
   timeline:[{type:"enq",text:"Enquiry via contact form",detail:"Looking for GCSE Maths.",ts:"15 Jan, 3:00pm"},{type:"stage",text:"Stage → Churned",detail:"Found local in-person tutor.",ts:"28 Feb, 9:00am"}]},
];
