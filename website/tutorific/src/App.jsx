import { useState } from "react";

// ─── CSS ───────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f5f0e8;--bg2:#ede8dc;--navy:#0b1d33;--navy2:#1a3456;
  --gold:#c9950b;--gold2:#e8b420;--teal:#0d7a5f;--teal2:#e8f5f1;
  --text:#2d3b4a;--muted:#637080;--border:rgba(11,29,51,.12);
  --r:12px;--r2:20px;
}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh}
h1,h2,h3,h4,h5{font-family:'Cormorant Garamond',serif;line-height:1.2}
a{color:inherit;text-decoration:none}
button{font-family:'Outfit',sans-serif;cursor:pointer;border:none;outline:none}

/* NAV */
.nav{position:sticky;top:0;z-index:100;background:var(--navy);display:flex;align-items:center;justify-content:space-between;padding:0 3rem;height:68px}
.nav-logo{color:#fff;font-family:'Cormorant Garamond',serif;font-size:1.65rem;font-weight:600;cursor:pointer}
.nav-logo span{color:var(--gold2)}
.nav-links{display:flex;gap:1.75rem}
.nav-link{color:rgba(255,255,255,.65);font-size:.82rem;font-weight:500;letter-spacing:.09em;text-transform:uppercase;padding:.4rem 0;border-bottom:2px solid transparent;transition:all .2s;cursor:pointer}
.nav-link:hover,.nav-link.act{color:#fff;border-color:var(--gold2)}
.nav-actions{display:flex;gap:.75rem;align-items:center}
.btn-out{background:transparent;border:1.5px solid rgba(255,255,255,.35);color:#fff;padding:.42rem 1rem;border-radius:6px;font-size:.8rem;font-weight:500;transition:all .2s;cursor:pointer}
.btn-out:hover{border-color:var(--gold2);color:var(--gold2)}
.btn-gold{background:var(--gold);color:#fff;padding:.42rem 1rem;border-radius:6px;font-size:.8rem;font-weight:600;transition:all .2s;cursor:pointer;border:none}
.btn-gold:hover{background:var(--gold2)}

/* HERO / PUBLIC */
.hero{background:var(--navy);min-height:86vh;display:flex;align-items:center;position:relative;overflow:hidden;padding:4rem 3rem}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 72% 45%,rgba(201,149,11,.14),transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(13,122,95,.1),transparent 50%)}
.hero-c{position:relative;z-index:1;max-width:600px}
.hero-badge{display:inline-block;background:rgba(201,149,11,.18);color:var(--gold2);border:1px solid rgba(201,149,11,.35);padding:.3rem .95rem;border-radius:100px;font-size:.76rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1.5rem}
.hero h1{font-size:clamp(2.8rem,5.5vw,4.8rem);color:#fff;font-weight:600;margin-bottom:1.25rem}
.hero h1 em{color:var(--gold2);font-style:italic}
.hero-sub{color:rgba(255,255,255,.65);font-size:1.05rem;max-width:460px;margin-bottom:2.5rem;line-height:1.75}
.hero-btns{display:flex;gap:1rem;flex-wrap:wrap}
.btn-p{background:var(--gold);color:#fff;padding:.8rem 1.9rem;border-radius:8px;font-size:.9rem;font-weight:600;transition:all .25s;cursor:pointer;border:none}
.btn-p:hover{background:var(--gold2);transform:translateY(-2px)}
.btn-s{background:transparent;border:1.5px solid rgba(255,255,255,.32);color:#fff;padding:.8rem 1.9rem;border-radius:8px;font-size:.9rem;font-weight:500;transition:all .25s;cursor:pointer}
.btn-s:hover{border-color:#fff;background:rgba(255,255,255,.07)}
.hero-stats{position:absolute;right:3rem;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:1.25rem;z-index:1}
.hstat{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:var(--r);padding:1.5rem 2rem;text-align:center}
.hstat-n{font-family:'Cormorant Garamond',serif;font-size:2.4rem;font-weight:700;color:#fff;line-height:1}
.hstat-l{color:rgba(255,255,255,.5);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-top:.3rem}

.slabel{font-size:.75rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:.7rem}
.stitle{font-size:clamp(1.9rem,3.5vw,2.8rem);color:var(--navy);font-weight:600;margin-bottom:.9rem}
.courses-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:1.5rem}
.cc{background:#fff;border-radius:var(--r2);border:1px solid var(--border);padding:2rem;transition:all .25s;cursor:pointer}
.cc:hover{transform:translateY(-4px);box-shadow:0 14px 40px rgba(11,29,51,.11);border-color:var(--gold)}
.ctag{display:inline-block;padding:.28rem .8rem;border-radius:100px;font-size:.72rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:1rem}
.t-gold{background:rgba(201,149,11,.1);color:var(--gold)}
.t-teal{background:rgba(13,122,95,.1);color:var(--teal)}
.t-navy{background:rgba(11,29,51,.07);color:var(--navy2)}
.t-purple{background:rgba(100,60,200,.08);color:#6040b0}
.cc h3{font-size:1.45rem;color:var(--navy);margin-bottom:.55rem}
.cc p{color:var(--muted);font-size:.88rem;line-height:1.7;margin-bottom:1.2rem}
.pills{display:flex;flex-wrap:wrap;gap:.45rem}
.pill{background:var(--bg);border:1px solid var(--border);border-radius:100px;padding:.22rem .7rem;font-size:.72rem;color:var(--text);font-weight:500}
.feat-sec{background:var(--navy);padding:5rem 3rem}
.feat-inner{max-width:1280px;margin:0 auto}
.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2rem;margin-top:3rem}
.fi{padding:1.5rem;border-radius:var(--r);border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);transition:all .25s}
.fi:hover{background:rgba(255,255,255,.07);border-color:rgba(201,149,11,.3)}
.fi-icon{width:44px;height:44px;border-radius:10px;background:rgba(201,149,11,.18);display:flex;align-items:center;justify-content:center;margin-bottom:1rem;font-size:1.2rem}
.fi h4{font-family:'Cormorant Garamond',serif;font-size:1.25rem;color:#fff;margin-bottom:.45rem}
.fi p{color:rgba(255,255,255,.55);font-size:.85rem;line-height:1.7}
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:1.5rem}
.pc{background:#fff;border-radius:var(--r2);border:1px solid var(--border);padding:2.5rem;position:relative}
.pc.feat{border:2px solid var(--gold);box-shadow:0 8px 40px rgba(201,149,11,.12)}
.pc-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--gold);color:#fff;padding:.28rem 1rem;border-radius:100px;font-size:.72rem;font-weight:700;white-space:nowrap}
.pc h3{font-size:1.35rem;color:var(--navy);margin-bottom:.4rem}
.pc .desc{color:var(--muted);font-size:.85rem;margin-bottom:1.25rem}
.price{font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:700;color:var(--navy);margin:.5rem 0}
.price sup{font-size:1.2rem;vertical-align:top;margin-top:.7rem;display:inline-block}
.price span{font-size:.9rem;font-family:'Outfit',sans-serif;color:var(--muted);font-weight:400}
.pfl{list-style:none;margin:1.5rem 0}
.pfl li{padding:.55rem 0;border-bottom:1px solid var(--border);font-size:.87rem;color:var(--text);display:flex;align-items:center;gap:.6rem}
.pfl li::before{content:'✓';color:var(--teal);font-weight:800;font-size:.85rem}
.contact-wrap{display:grid;grid-template-columns:1fr 1.6fr;gap:4rem;align-items:start}
.ci{display:flex;align-items:flex-start;gap:1rem;margin-bottom:1.5rem}
.ci-icon{width:42px;height:42px;border-radius:10px;background:var(--teal2);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.ci-text .t{font-weight:600;font-size:.9rem;color:var(--text);margin-bottom:.2rem}
.ci-text .s{font-size:.85rem;color:var(--muted)}
.cf input,.cf textarea,.cf select{width:100%;padding:.8rem 1rem;border:1.5px solid var(--border);border-radius:8px;font-family:'Outfit',sans-serif;font-size:.88rem;background:#fff;color:var(--text);margin-bottom:1rem;transition:border-color .2s}
.cf input:focus,.cf textarea:focus,.cf select:focus{outline:none;border-color:var(--gold)}
.cf textarea{height:115px;resize:vertical}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:1rem}

/* AUTH */
.auth-page{min-height:82vh;display:flex;align-items:center;justify-content:center;padding:3rem}
.auth-card{background:#fff;border-radius:var(--r2);border:1px solid var(--border);padding:3rem;width:100%;max-width:440px;box-shadow:0 20px 60px rgba(11,29,51,.1)}
.fl{display:block;font-size:.8rem;font-weight:600;color:var(--text);margin-bottom:.4rem;letter-spacing:.04em}
.fi2{width:100%;padding:.8rem 1rem;border:1.5px solid var(--border);border-radius:8px;font-family:'Outfit',sans-serif;font-size:.88rem;background:var(--bg);color:var(--text);transition:border-color .2s;margin-bottom:1.1rem}
.fi2:focus{outline:none;border-color:var(--gold);background:#fff}
.btn-full{width:100%;padding:.9rem;border-radius:8px;font-size:.92rem;font-weight:600;cursor:pointer}
.btn-navy{background:var(--navy);color:#fff;transition:all .2s;border:none}
.btn-navy:hover{background:var(--navy2)}
.auth-hint{margin-top:1.25rem;padding:1rem;background:var(--bg);border-radius:8px;font-size:.8rem;color:var(--muted);line-height:1.6}
.auth-hint strong{color:var(--text)}

/* DASH SHELL */
.dash-wrap{display:grid;grid-template-columns:230px 1fr;min-height:100vh}
.sidebar{background:var(--navy);padding:1.75rem 1.25rem;display:flex;flex-direction:column}
.sb-logo{font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:#fff;font-weight:600;margin-bottom:2.5rem;padding-left:.5rem}
.sb-logo span{color:var(--gold2)}
.sb-nav{display:flex;flex-direction:column;gap:.2rem;flex:1}
.sb-sec{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.3);padding:1.25rem .5rem .4rem}
.sb-link{color:rgba(255,255,255,.58);padding:.7rem .85rem;border-radius:8px;font-size:.85rem;font-weight:500;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.7rem}
.sb-link:hover{background:rgba(255,255,255,.08);color:#fff}
.sb-link.act{background:rgba(201,149,11,.18);color:var(--gold2)}
.sb-bottom{padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.08)}
.sb-user{display:flex;align-items:center;gap:.75rem;padding:.6rem .5rem}
.sb-avatar{width:34px;height:34px;border-radius:50%;background:var(--gold);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;flex-shrink:0}
.sb-name{font-size:.82rem;font-weight:500;color:rgba(255,255,255,.8);line-height:1.2}
.sb-role{font-size:.72rem;color:rgba(255,255,255,.4)}
.dm{display:flex;flex-direction:column;background:var(--bg);overflow-y:auto;min-height:100vh}
.dh{background:#fff;border-bottom:1px solid var(--border);padding:1.1rem 2.25rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.dh h2{font-size:1.3rem;color:var(--navy)}
.dh .date{font-size:.8rem;color:var(--muted)}
.dc{padding:2.25rem;flex:1}

/* CARDS / STAT */
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem;margin-bottom:2rem}
.stat-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;margin-bottom:1.75rem}
.sb2{background:#fff;border-radius:var(--r);border:1px solid var(--border);padding:1.4rem}
.sb2 .lbl{font-size:.72rem;color:var(--muted);font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.45rem}
.sb2 .val{font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--navy);font-weight:600;line-height:1}
.sb2 .hint{font-size:.75rem;color:var(--teal);margin-top:.3rem}
.sb2 .hinta{font-size:.75rem;color:var(--gold);margin-top:.3rem}
.card{background:#fff;border-radius:var(--r);border:1px solid var(--border);margin-bottom:1.75rem;overflow:hidden}
.card-h{padding:1.1rem 1.6rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.card-h h3{font-size:1.05rem;color:var(--navy)}
.card-b{padding:1.6rem}

/* TABLE */
table{width:100%;border-collapse:collapse;font-size:.86rem}
thead th{text-align:left;padding:.8rem 1rem;font-size:.72rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--border);background:var(--bg)}
tbody td{padding:.85rem 1rem;border-bottom:1px solid var(--border);color:var(--text);vertical-align:middle}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover{background:rgba(11,29,51,.02)}
.badge{display:inline-block;padding:.2rem .65rem;border-radius:100px;font-size:.7rem;font-weight:700}
.b-green{background:rgba(13,122,95,.1);color:var(--teal)}
.b-amber{background:rgba(201,149,11,.12);color:var(--gold)}
.b-red{background:rgba(200,40,40,.1);color:#a02020}
.b-blue{background:rgba(20,80,200,.08);color:#1040b0}
.b-purple{background:rgba(100,60,200,.1);color:#5030a0}
.b-gray{background:rgba(11,29,51,.07);color:var(--muted)}
.adot{width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.66rem;font-weight:800}
.ap{background:rgba(13,122,95,.14);color:var(--teal)}
.aa{background:rgba(200,40,40,.12);color:#a02020}
.al{background:rgba(201,149,11,.14);color:var(--gold)}
.an{background:rgba(11,29,51,.07);color:var(--muted)}

/* STUDENT PORTAL */
.lr{display:flex;align-items:center;gap:1.25rem;padding:.95rem 0;border-bottom:1px solid var(--border)}
.lr:last-child{border-bottom:none}
.ldate{text-align:center;min-width:52px;background:var(--navy);color:#fff;border-radius:8px;padding:.55rem .5rem}
.ldate .d{font-size:1.35rem;font-family:'Cormorant Garamond',serif;font-weight:700;line-height:1}
.ldate .m{font-size:.6rem;text-transform:uppercase;letter-spacing:.07em;opacity:.65}
.li2{flex:1}
.li2 .t{font-weight:600;color:var(--text);font-size:.9rem}
.li2 .m2{color:var(--muted);font-size:.78rem;margin-top:.15rem}
.btn-meet{background:var(--teal);color:#fff;padding:.46rem 1rem;border-radius:6px;font-size:.78rem;font-weight:700;transition:all .2s;border:none;cursor:pointer}
.btn-meet:hover{background:#0a5f48;transform:translateY(-1px)}
.tabs{display:flex;gap:.5rem;margin-bottom:1.5rem;flex-wrap:wrap}
.tab{padding:.46rem 1rem;border-radius:100px;font-size:.8rem;font-weight:600;transition:all .2s;border:1.5px solid var(--border);background:transparent;color:var(--muted);cursor:pointer}
.tab.act{background:var(--navy);color:#fff;border-color:var(--navy)}
.mr{display:flex;align-items:center;gap:.95rem;padding:.85rem 0;border-bottom:1px solid var(--border)}
.mr:last-child{border-bottom:none}
.fic{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;flex-shrink:0}
.ic-pdf{background:rgba(200,40,40,.09);color:#b02020}
.ic-vid{background:rgba(13,122,95,.1);color:var(--teal)}
.ic-doc{background:rgba(11,29,51,.08);color:var(--navy)}
.ic-xls{background:rgba(13,122,95,.08);color:#1a6020}
.mi{flex:1}
.mi .n{font-size:.88rem;font-weight:500;color:var(--text)}
.mi .m{font-size:.75rem;color:var(--muted)}
.btn-dl{background:var(--bg);border:1px solid var(--border);color:var(--text);padding:.36rem .85rem;border-radius:6px;font-size:.76rem;font-weight:500;cursor:pointer;transition:all .2s}

/* MODALS */
.modal-bg{position:fixed;inset:0;background:rgba(11,29,51,.5);display:flex;align-items:center;justify-content:center;z-index:999;padding:2rem}
.modal{background:#fff;border-radius:var(--r2);padding:2.5rem;width:100%;max-width:560px;max-height:90vh;overflow-y:auto}
.modal h3{font-size:1.6rem;color:var(--navy);margin-bottom:.4rem}
.modal .sub{color:var(--muted);font-size:.85rem;margin-bottom:1.75rem}
.mfi{width:100%;padding:.75rem 1rem;border:1.5px solid var(--border);border-radius:8px;font-family:'Outfit',sans-serif;font-size:.88rem;background:var(--bg);color:var(--text);transition:border-color .2s;margin-bottom:1rem}
.mfi:focus{outline:none;border-color:var(--gold);background:#fff}
.mfrow{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
.mfl{display:block;font-size:.78rem;font-weight:600;color:var(--muted);margin-bottom:.35rem;letter-spacing:.04em;text-transform:uppercase}
.success-box{background:rgba(13,122,95,.06);border:1.5px solid rgba(13,122,95,.2);border-radius:var(--r);padding:1.5rem;margin-top:1rem}
.success-box h4{font-family:'Cormorant Garamond',serif;font-size:1.25rem;color:var(--navy);margin-bottom:.75rem}
.cred-row{display:flex;align-items:center;justify-content:space-between;padding:.6rem .85rem;background:#fff;border:1px solid var(--border);border-radius:8px;margin-bottom:.6rem}
.cred-label{font-size:.75rem;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.cred-val{font-family:monospace;font-size:.9rem;font-weight:700;color:var(--navy);letter-spacing:.04em}
.copy-btn{background:var(--bg2);border:none;border-radius:5px;padding:.3rem .7rem;font-size:.72rem;font-weight:600;cursor:pointer;color:var(--text);transition:all .18s}
.copy-btn:hover{background:var(--gold);color:#fff}
.email-banner{background:rgba(13,122,95,.08);border:1px solid rgba(13,122,95,.2);border-radius:8px;padding:.85rem 1rem;display:flex;align-items:center;gap:.75rem;margin-top:.85rem}
.email-banner p{font-size:.82rem;color:var(--teal);font-weight:500;line-height:1.5}

/* CRM */
.crm-wrap{display:grid;grid-template-columns:1fr 380px;gap:1.75rem;min-height:calc(100vh - 140px)}
.pipeline{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;align-items:start}
.pipeline-col{background:var(--bg2);border-radius:var(--r);padding:1rem}
.pc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:.85rem}
.pc-label{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.pc-count{background:rgba(11,29,51,.1);color:var(--muted);font-size:.7rem;font-weight:700;padding:.15rem .55rem;border-radius:100px}
.lead-card{background:#fff;border-radius:var(--r);border:1px solid var(--border);padding:1rem;margin-bottom:.75rem;cursor:pointer;transition:all .2s;position:relative}
.lead-card:hover{border-color:var(--gold);box-shadow:0 4px 16px rgba(11,29,51,.08);transform:translateY(-1px)}
.lead-card.selected{border-color:var(--gold);border-width:2px}
.lead-card .lc-name{font-weight:600;font-size:.88rem;color:var(--text);margin-bottom:.2rem}
.lead-card .lc-sub{font-size:.76rem;color:var(--muted);margin-bottom:.6rem}
.lead-card .lc-meta{display:flex;align-items:center;justify-content:space-between}
.lead-card .lc-days{font-size:.7rem;color:var(--muted)}
.remind-dot{width:8px;height:8px;border-radius:50%;background:#e84040;position:absolute;top:10px;right:10px}
.crm-detail{background:#fff;border-radius:var(--r);border:1px solid var(--border);display:flex;flex-direction:column;height:fit-content;position:sticky;top:80px}
.cd-top{padding:1.5rem;border-bottom:1px solid var(--border)}
.cd-avatar{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;color:#fff;margin-bottom:1rem}
.cd-name{font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:var(--navy);margin-bottom:.2rem}
.cd-sub{font-size:.82rem;color:var(--muted);margin-bottom:.85rem}
.cd-tags{display:flex;gap:.4rem;flex-wrap:wrap}
.stage-btns{display:flex;gap:.4rem;flex-wrap:wrap;padding:1rem 1.5rem;border-bottom:1px solid var(--border)}
.stage-btn{padding:.3rem .8rem;border-radius:100px;font-size:.72rem;font-weight:700;border:1.5px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;transition:all .18s}
.stage-btn:hover{border-color:var(--navy);color:var(--navy)}
.stage-btn.act{border-color:var(--navy);background:var(--navy);color:#fff}
.cd-info{padding:1rem 1.5rem;border-bottom:1px solid var(--border)}
.cd-row{display:flex;align-items:center;gap:.65rem;margin-bottom:.6rem;font-size:.83rem}
.cd-row .lbl{color:var(--muted);min-width:72px;font-size:.75rem;font-weight:600;letter-spacing:.04em}
.cd-row .val{color:var(--text)}
.cd-actions{display:flex;gap:.6rem;padding:1rem 1.5rem;border-bottom:1px solid var(--border);flex-wrap:wrap}
.act-btn{flex:1;min-width:80px;padding:.55rem .5rem;border-radius:8px;font-size:.75rem;font-weight:600;border:1.5px solid var(--border);background:transparent;color:var(--text);cursor:pointer;transition:all .18s;text-align:center}
.act-btn:hover{background:var(--bg);border-color:var(--navy2)}
.act-btn.primary{background:var(--navy);color:#fff;border-color:var(--navy)}
.act-btn.primary:hover{background:var(--navy2)}
.act-btn.convert{background:var(--teal);color:#fff;border-color:var(--teal)}
.act-btn.convert:hover{background:#0a5f48}
.cd-timeline{padding:1.25rem 1.5rem;max-height:320px;overflow-y:auto}
.tl-item{display:flex;gap:.75rem;margin-bottom:1.1rem}
.tl-icon{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;flex-shrink:0;margin-top:.1rem}
.tl-note{background:rgba(13,122,95,.1);color:var(--teal)}
.tl-email{background:rgba(20,80,200,.1);color:#1040b0}
.tl-stage{background:rgba(201,149,11,.12);color:var(--gold)}
.tl-remind{background:rgba(200,40,40,.1);color:#a02020}
.tl-enq{background:rgba(100,60,200,.1);color:#5030a0}
.tl-body .t{font-size:.83rem;font-weight:600;color:var(--text);margin-bottom:.15rem}
.tl-body .s{font-size:.77rem;color:var(--muted);line-height:1.5}
.tl-body .ts{font-size:.7rem;color:var(--muted);margin-top:.2rem}
.log-form{padding:1.25rem 1.5rem;border-top:1px solid var(--border);background:var(--bg)}
.log-tabs{display:flex;gap:.4rem;margin-bottom:.85rem}
.log-tab{padding:.3rem .75rem;border-radius:100px;font-size:.72rem;font-weight:700;border:1.5px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;transition:all .18s}
.log-tab.act{background:var(--navy);color:#fff;border-color:var(--navy)}
.log-input{width:100%;padding:.6rem .85rem;border:1.5px solid var(--border);border-radius:8px;font-family:'Outfit',sans-serif;font-size:.82rem;background:#fff;color:var(--text);margin-bottom:.65rem;resize:none}
.log-input:focus{outline:none;border-color:var(--gold)}
.remind-panel{background:rgba(232,64,64,.05);border:1px solid rgba(232,64,64,.15);border-radius:8px;padding:.85rem;margin-top:.6rem}
.remind-panel .rl{font-size:.75rem;font-weight:700;color:#a02020;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.5rem}
.crm-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:3rem;text-align:center;color:var(--muted)}
.crm-empty .big{font-size:2.5rem;margin-bottom:.75rem}
.crm-empty p{font-size:.88rem;line-height:1.65;max-width:220px}
.search-bar{display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem}
.search-bar input{flex:1;padding:.65rem 1rem;border:1.5px solid var(--border);border-radius:8px;font-family:'Outfit',sans-serif;font-size:.85rem;background:#fff;color:var(--text);transition:border-color .2s}
.search-bar input:focus{outline:none;border-color:var(--gold)}
.filter-pill{padding:.38rem .9rem;border-radius:100px;font-size:.75rem;font-weight:600;border:1.5px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;transition:all .18s;white-space:nowrap}
.filter-pill.act{background:var(--navy);color:#fff;border-color:var(--navy)}

/* TUTOR PORTAL */
.attend-toggle-row{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1rem;border-radius:8px;background:var(--bg);margin-bottom:.6rem;transition:background .15s}
.attend-toggle-row:hover{background:var(--bg2)}
.attend-toggle-row .sname{font-weight:600;font-size:.9rem;color:var(--text)}
.attend-toggle-row .sdetail{font-size:.77rem;color:var(--muted);margin-top:.1rem}
.toggle-group{display:flex;gap:.4rem}
.tog{padding:.38rem .9rem;border-radius:6px;font-size:.78rem;font-weight:700;border:1.5px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;transition:all .15s}
.tog.present{background:rgba(13,122,95,.12);color:var(--teal);border-color:rgba(13,122,95,.25)}
.tog.absent{background:rgba(200,40,40,.1);color:#a02020;border-color:rgba(200,40,40,.2)}
.tog.late{background:rgba(201,149,11,.1);color:var(--gold);border-color:rgba(201,149,11,.2)}
.earn-card{background:#fff;border-radius:var(--r);border:1px solid var(--border);padding:1.4rem;position:relative;overflow:hidden}
.earn-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
.earn-card.green::before{background:var(--teal)}
.earn-card.gold::before{background:var(--gold)}
.earn-card.navy::before{background:var(--navy)}

/* MISC */
.live-dot{width:8px;height:8px;border-radius:50%;background:var(--teal);display:inline-block;animation:pulse 1.5s infinite}
.attend-legend{display:flex;gap:1.25rem;align-items:center;font-size:.78rem;color:var(--muted)}
.attend-legend span{display:flex;align-items:center;gap:.4rem}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .5s ease both}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.fade{animation:fadeIn .2s ease}

/* FOOTER */
.footer{background:var(--navy);padding:4rem 3rem 2rem}
.fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:3rem;max-width:1280px;margin-left:auto;margin-right:auto}
.flogo{font-family:'Cormorant Garamond',serif;font-size:1.75rem;color:#fff;font-weight:600;margin-bottom:.9rem}
.flogo span{color:var(--gold2)}
.fdesc{color:rgba(255,255,255,.45);font-size:.85rem;line-height:1.75;max-width:270px}
.fc h5{color:#fff;font-family:'Outfit',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1.1rem}
.fc ul{list-style:none}
.fc ul li{margin-bottom:.55rem}
.fc ul li span{color:rgba(255,255,255,.45);font-size:.85rem;cursor:pointer;transition:color .2s}
.fc ul li span:hover{color:var(--gold2)}
.fb{border-top:1px solid rgba(255,255,255,.09);padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center;max-width:1280px;margin:0 auto}
.fb p{color:rgba(255,255,255,.3);font-size:.78rem}
`;

// ─── helpers ───────────────────────────────────────────────
const genPw = () => {
  const w=["Tutor","Learn","Study","Excel","Smart","Bright","Ace","Star"];
  const l="ABCDEFGHJKLMNPQRSTUVWXYZ";
  return `${w[Math.floor(Math.random()*w.length)]}-${String(Math.floor(1000+Math.random()*9000))}-${l[Math.floor(Math.random()*l.length)]}`;
};
const genEmail = n => n.toLowerCase().replace(/\s+/g,".")+"@student.tutorific.co.uk";
const nowTime = () => { const d=new Date(); return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0"); };
const initials = n => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const avatarColor = n => { const c=["#0b5a3f","#1a3456","#7a4000","#5030a0","#a02020","#0d4a7a"]; let h=0; for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h); return c[Math.abs(h)%c.length]; };
const daysSince = d => { const now=new Date("2026-03-19"); const then=new Date(d); return Math.floor((now-then)/(1000*60*60*24)); };
const fmtGBP = n => `£${n.toFixed(2).replace(/\.00$/,"")}`;

// ─── seed data ─────────────────────────────────────────────
const INIT_STUDENTS = [
  {id:1,name:"Emma Johnson",year:"Yr 11",subject:"GCSE Maths",tutor:"Mr. Ahmed",parent:"Sarah Johnson",parentEmail:"sarah.johnson@email.com",fee:120,email:"emma.johnson@student.tutorific.co.uk"},
  {id:2,name:"James Okafor",year:"Yr 11",subject:"GCSE English",tutor:"Ms. Clarke",parent:"David Okafor",parentEmail:"david.okafor@email.com",fee:120,email:"james.okafor@student.tutorific.co.uk"},
  {id:3,name:"Priya Sharma",year:"Yr 9",subject:"KS3 Science",tutor:"Dr. Patel",parent:"Raj Sharma",parentEmail:"raj.sharma@email.com",fee:95,email:"priya.sharma@student.tutorific.co.uk"},
  {id:4,name:"Liam Williams",year:"Yr 13",subject:"A-Level Maths",tutor:"Mr. Ahmed",parent:"Karen Williams",parentEmail:"karen.williams@email.com",fee:150,email:"liam.williams@student.tutorific.co.uk"},
  {id:5,name:"Amelia Davis",year:"Yr 6",subject:"11+ Prep",tutor:"Ms. Clarke",parent:"Tom Davis",parentEmail:"tom.davis@email.com",fee:95,email:"amelia.davis@student.tutorific.co.uk"},
  {id:6,name:"Noah Patel",year:"Yr 10",subject:"GCSE Science",tutor:"Dr. Patel",parent:"Anita Patel",parentEmail:"anita.patel@email.com",fee:120,email:"noah.patel@student.tutorific.co.uk"},
  {id:7,name:"Zara Ahmed",year:"Yr 7",subject:"KS3 Maths",tutor:"Mr. Ahmed",parent:"Fatima Ahmed",parentEmail:"fatima.ahmed@email.com",fee:95,email:"zara.ahmed@student.tutorific.co.uk"},
];

const INIT_SESSIONS = [
  {id:101,studentId:1,studentName:"Emma Johnson",date:"15",month:"Mar",time:"15:00",subj:"Mathematics",topic:"Quadratic Equations",tutor:"Mr. Ahmed",tutorId:"tutor-ahmed",meet:"https://meet.google.com/abc-defg-hij",attendState:null,durationHours:1},
  {id:102,studentId:1,studentName:"Emma Johnson",date:"17",month:"Mar",time:"16:00",subj:"English Literature",topic:"Romeo & Juliet",tutor:"Ms. Clarke",tutorId:"tutor-clarke",meet:"https://meet.google.com/bcd-efgh-ijk",attendState:null,durationHours:1},
  {id:103,studentId:1,studentName:"Emma Johnson",date:"19",month:"Mar",time:"15:30",subj:"Mathematics",topic:"Trigonometry",tutor:"Mr. Ahmed",tutorId:"tutor-ahmed",meet:"https://meet.google.com/cde-fghi-jkl",attendState:null,durationHours:1},
  {id:104,studentId:2,studentName:"James Okafor",date:"15",month:"Mar",time:"14:00",subj:"English",topic:"Language Analysis",tutor:"Ms. Clarke",tutorId:"tutor-clarke",meet:"https://meet.google.com/def-ghij-klm",attendState:null,durationHours:1},
  {id:105,studentId:3,studentName:"Priya Sharma",date:"16",month:"Mar",time:"16:30",subj:"Science",topic:"Atomic Structure",tutor:"Dr. Patel",tutorId:"tutor-patel",meet:"https://meet.google.com/efg-hijk-lmn",attendState:null,durationHours:1},
  {id:106,studentId:4,studentName:"Liam Williams",date:"18",month:"Mar",time:"17:00",subj:"A-Level Maths",topic:"Integration by Parts",tutor:"Mr. Ahmed",tutorId:"tutor-ahmed",meet:"https://meet.google.com/fgh-ijkl-mno",attendState:"P",durationHours:1.5,joinedAt:"17:02"},
  {id:107,studentId:7,studentName:"Zara Ahmed",date:"17",month:"Mar",time:"10:00",subj:"KS3 Maths",topic:"Algebra Basics",tutor:"Mr. Ahmed",tutorId:"tutor-ahmed",meet:"https://meet.google.com/ghi-jklm-nop",attendState:"A",durationHours:1},
  {id:108,studentId:5,studentName:"Amelia Davis",date:"16",month:"Mar",time:"11:00",subj:"11+ Prep",topic:"Verbal Reasoning",tutor:"Ms. Clarke",tutorId:"tutor-clarke",meet:"https://meet.google.com/hij-klmn-opq",attendState:"P",durationHours:1,joinedAt:"11:03"},
  {id:109,studentId:6,studentName:"Noah Patel",date:"15",month:"Mar",time:"13:00",subj:"GCSE Science",topic:"Forces & Motion",tutor:"Dr. Patel",tutorId:"tutor-patel",meet:"https://meet.google.com/ijk-lmno-pqr",attendState:"L",durationHours:1,joinedAt:"13:12"},
];

const PAST_ATTEND = {
  1:[{d:"3 Mar",s:"P"},{d:"5 Mar",s:"P"},{d:"8 Mar",s:"A"},{d:"10 Mar",s:"P"},{d:"12 Mar",s:"P"}],
  2:[{d:"3 Mar",s:"P"},{d:"5 Mar",s:"L"},{d:"8 Mar",s:"P"},{d:"10 Mar",s:"P"},{d:"12 Mar",s:"A"}],
  3:[{d:"4 Mar",s:"P"},{d:"6 Mar",s:"P"},{d:"9 Mar",s:"P"},{d:"11 Mar",s:"P"},{d:"13 Mar",s:"P"}],
  4:[{d:"3 Mar",s:"A"},{d:"5 Mar",s:"P"},{d:"8 Mar",s:"P"},{d:"10 Mar",s:"L"},{d:"12 Mar",s:"P"}],
  5:[{d:"4 Mar",s:"P"},{d:"6 Mar",s:"P"},{d:"9 Mar",s:"P"},{d:"11 Mar",s:"A"},{d:"13 Mar",s:"P"}],
  6:[{d:"3 Mar",s:"P"},{d:"5 Mar",s:"P"},{d:"8 Mar",s:"L"},{d:"10 Mar",s:"P"},{d:"12 Mar",s:"P"}],
  7:[{d:"4 Mar",s:"P"},{d:"6 Mar",s:"P"},{d:"9 Mar",s:"P"},{d:"11 Mar",s:"P"},{d:"13 Mar",s:"L"}],
};

const PAYMENTS_INIT = [
  {id:1,studentId:1,student:"Emma Johnson",parent:"Sarah Johnson",amount:120,due:"01 Mar",paid:"02 Mar",status:"Paid"},
  {id:2,studentId:2,student:"James Okafor",parent:"David Okafor",amount:120,due:"01 Mar",paid:"—",status:"Overdue"},
  {id:3,studentId:3,student:"Priya Sharma",parent:"Raj Sharma",amount:95,due:"01 Mar",paid:"28 Feb",status:"Paid"},
  {id:4,studentId:4,student:"Liam Williams",parent:"Karen Williams",amount:150,due:"01 Mar",paid:"01 Mar",status:"Paid"},
  {id:5,studentId:5,student:"Amelia Davis",parent:"Tom Davis",amount:95,due:"01 Mar",paid:"—",status:"Pending"},
  {id:6,studentId:6,student:"Noah Patel",parent:"Anita Patel",amount:120,due:"01 Mar",paid:"04 Mar",status:"Paid"},
  {id:7,studentId:7,student:"Zara Ahmed",parent:"Fatima Ahmed",amount:95,due:"01 Mar",paid:"—",status:"Pending"},
];

// Tutor accounts — tutorId matches session.tutorId
const TUTORS_AUTH = [
  {id:"tutor-ahmed", name:"Mr. Ahmed", email:"ahmed@tutorific.co.uk", pass:"Ahmed-2024-T", subject:"Maths", ratePerHour:28},
  {id:"tutor-clarke", name:"Ms. Clarke", email:"clarke@tutorific.co.uk", pass:"Clarke-2024-T", subject:"English, 11+", ratePerHour:28},
  {id:"tutor-patel", name:"Dr. Patel", email:"patel@tutorific.co.uk", pass:"Patel-2024-T", subject:"Science", ratePerHour:32},
];

// Historical tutor payment records (invoiced vs paid)
const TUTOR_PAYMENTS_INIT = {
  "tutor-ahmed": [{month:"Jan 2026",sessions:6,invoiced:168,status:"Paid"},{month:"Feb 2026",sessions:8,invoiced:224,status:"Paid"},{month:"Mar 2026",sessions:5,invoiced:140,status:"Pending"}],
  "tutor-clarke": [{month:"Jan 2026",sessions:5,invoiced:140,status:"Paid"},{month:"Feb 2026",sessions:6,invoiced:168,status:"Paid"},{month:"Mar 2026",sessions:4,invoiced:112,status:"Paid"}],
  "tutor-patel":  [{month:"Jan 2026",sessions:4,invoiced:128,status:"Paid"},{month:"Feb 2026",sessions:5,invoiced:160,status:"Pending"},{month:"Mar 2026",sessions:3,invoiced:96,status:"Pending"}],
};

const MATERIALS = {
  Maths:[{name:"Quadratic Equations — Full Notes",type:"PDF",size:"1.2 MB",added:"12 Mar"},{name:"Algebra Revision Worksheet",type:"PDF",size:"840 KB",added:"8 Mar"},{name:"Past Paper — GCSE Maths 2024 P1",type:"PDF",size:"2.1 MB",added:"5 Mar"},{name:"Lesson Recording — Surds & Indices",type:"VID",size:"145 MB",added:"1 Mar"}],
  English:[{name:"Romeo & Juliet — Essay Frameworks",type:"DOC",size:"320 KB",added:"11 Mar"},{name:"Key Quotes Revision Sheet",type:"PDF",size:"480 KB",added:"7 Mar"},{name:"Language Analysis Techniques",type:"PDF",size:"1.1 MB",added:"3 Mar"}],
  Science:[{name:"Atomic Structure Notes",type:"PDF",size:"1.5 MB",added:"10 Mar"},{name:"Chemistry Equations Cheat Sheet",type:"PDF",size:"290 KB",added:"6 Mar"},{name:"Past Paper — AQA Combined 2024",type:"PDF",size:"3.2 MB",added:"2 Mar"}],
};

// ─── CRM seed data ─────────────────────────────────────────
const STAGE_ORDER = ["Lead","Trial","Active","Churned"];
const STAGE_COLORS = {Lead:"b-purple",Trial:"b-amber",Active:"b-green",Churned:"b-gray"};
const STAGE_DOTS = {Lead:"#7030c0",Trial:"var(--gold)",Active:"var(--teal)",Churned:"var(--muted)"};

const INIT_LEADS = [
  {id:201,name:"Sophie Williams",parent:"Mark Williams",email:"mark.williams@email.com",phone:"07700 900123",stage:"Lead",subject:"GCSE Maths",year:"Yr 10",source:"Contact Form",date:"2026-03-17",reminder:null,
   timeline:[{type:"enq",text:"Enquiry received via contact form",detail:"Interested in GCSE Maths support. Struggling with algebra and needs help before mocks.",ts:"17 Mar, 10:42am"}]},
  {id:202,name:"Ben Thornton",parent:"Claire Thornton",email:"claire.thornton@email.com",phone:"07700 900456",stage:"Lead",subject:"11+ Prep",year:"Yr 5",source:"Contact Form",date:"2026-03-16",reminder:"2026-03-21",
   timeline:[{type:"enq",text:"Enquiry received via contact form",detail:"Looking for 11+ preparation, sitting exams in September.",ts:"16 Mar, 2:15pm"},{type:"remind",text:"Follow-up reminder set",detail:"Call Claire on 21 March to discuss trial session.",ts:"16 Mar, 3:00pm"}]},
  {id:203,name:"Isla Henderson",parent:"Greg Henderson",email:"greg.henderson@email.com",phone:"07700 900789",stage:"Trial",subject:"A-Level Chemistry",year:"Yr 12",source:"Instagram",date:"2026-03-10",reminder:null,
   timeline:[{type:"enq",text:"Enquiry via Instagram DM",detail:"Struggling with organic chemistry. Would like to try a session.",ts:"10 Mar, 11:00am"},{type:"note",text:"Call logged",detail:"Spoke with Greg for 12 mins. Trial booked for 20 March with Dr. Patel.",ts:"11 Mar, 4:30pm"},{type:"email",text:"Email sent",detail:"Welcome email sent with trial session details and Google Meet link.",ts:"11 Mar, 4:35pm"}]},
  {id:204,name:"Marcus Cole",parent:"Diane Cole",email:"diane.cole@email.com",phone:"07700 900321",stage:"Trial",subject:"GCSE English",year:"Yr 11",source:"Referral",date:"2026-03-08",reminder:"2026-03-22",
   timeline:[{type:"enq",text:"Referred by Emma Johnson's family",detail:"Needs help with English Literature.",ts:"8 Mar, 9:20am"},{type:"email",text:"Email sent",detail:"Introduction email with pricing and course overview.",ts:"8 Mar, 10:00am"},{type:"note",text:"Trial session completed",detail:"Ms. Clarke reported Marcus engaged well.",ts:"15 Mar, 5:10pm"},{type:"remind",text:"Follow-up reminder set",detail:"Chase Diane re: enrolment decision by 22 March.",ts:"15 Mar, 5:12pm"}]},
  {id:205,name:"Freya Booth",parent:"Neil Booth",email:"neil.booth@email.com",phone:"07700 900654",stage:"Active",subject:"KS3 Science",year:"Yr 8",source:"Facebook",date:"2026-02-20",reminder:null,
   timeline:[{type:"enq",text:"Enquiry via Facebook",detail:"Neil saw our Facebook post.",ts:"20 Feb, 1:05pm"},{type:"stage",text:"Stage updated: Active",detail:"Enrolled. Fee £95/month.",ts:"4 Mar, 9:00am"}]},
  {id:206,name:"Oliver Reed",parent:"Julia Reed",email:"julia.reed@email.com",phone:"07700 900987",stage:"Churned",subject:"GCSE Maths",year:"Yr 11",source:"Contact Form",date:"2026-01-15",reminder:null,
   timeline:[{type:"enq",text:"Enquiry via contact form",detail:"Looking for GCSE Maths help.",ts:"15 Jan, 3:00pm"},{type:"stage",text:"Stage updated: Churned",detail:"Student cancelled — found local in-person tutor.",ts:"28 Feb, 9:00am"}]},
];

// ─── CRM panel ─────────────────────────────────────────────
function CRMPanel({leads,setLeads,onConvertToStudent}) {
  const [selected,setSelected]=useState(null);
  const [search,setSearch]=useState("");
  const [filterStage,setFilterStage]=useState("All");
  const [logTab,setLogTab]=useState("note");
  const [logText,setLogText]=useState("");
  const [reminderDate,setReminderDate]=useState("");
  const [emailSubj,setEmailSubj]=useState("");

  const lead = selected ? leads.find(l=>l.id===selected) : null;
  const filtered = leads.filter(l=>{
    const matchStage = filterStage==="All" || l.stage===filterStage;
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.parent.toLowerCase().includes(q) || l.subject.toLowerCase().includes(q);
    return matchStage && matchSearch;
  });
  const byStage = stage => filtered.filter(l=>l.stage===stage);
  const updateLead = (id,patch) => setLeads(prev=>prev.map(l=>l.id===id?{...l,...patch}:l));
  const addTimeline = (id,entry) => setLeads(prev=>prev.map(l=>l.id===id?{...l,timeline:[...l.timeline,entry]}:l));
  const changeStage = (id,stage) => { const ts=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"})+", "+nowTime(); updateLead(id,{stage}); addTimeline(id,{type:"stage",text:`Stage updated: ${stage}`,detail:`Manually moved to ${stage}.`,ts}); };
  const logNote = () => {
    if(!logText.trim()||!lead) return;
    const ts=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"})+", "+nowTime();
    if(logTab==="note") addTimeline(lead.id,{type:"note",text:"Note logged",detail:logText,ts});
    else if(logTab==="email") addTimeline(lead.id,{type:"email",text:`Email sent: ${emailSubj||"(no subject)"}`,detail:logText,ts});
    else if(logTab==="remind") { updateLead(lead.id,{reminder:reminderDate}); addTimeline(lead.id,{type:"remind",text:"Follow-up reminder set",detail:`${logText} — Due: ${reminderDate||"(no date)"}`,ts}); }
    setLogText(""); setEmailSubj(""); setReminderDate("");
  };
  const handleConvert = (lead) => {
    const confirmed = window.confirm(`Convert ${lead.name} to an active student?`);
    if(!confirmed) return;
    const pw=genPw(), email=genEmail(lead.name);
    const newStudent={id:Date.now(),name:lead.name,year:lead.year||"Yr 10",subject:lead.subject,tutor:"Mr. Ahmed",parent:lead.parent,parentEmail:lead.email,fee:120,email};
    onConvertToStudent(newStudent);
    changeStage(lead.id,"Active");
    const ts=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"})+", "+nowTime();
    addTimeline(lead.id,{type:"email",text:"Account created & credentials emailed",detail:`Login: ${email} / ${pw}`,ts});
    alert(`✅ ${lead.name} converted!\n\nEmail: ${email}\nPassword: ${pw}`);
  };
  const tIconClass=t=>t==="note"?"tl-note":t==="email"?"tl-email":t==="stage"?"tl-stage":t==="remind"?"tl-remind":"tl-enq";
  const tIconEmoji=t=>t==="note"?"📝":t==="email"?"📧":t==="stage"?"🔀":t==="remind"?"🔔":"📩";

  return (
    <div>
      <div className="stat-grid" style={{marginBottom:"1.5rem"}}>
        {[{l:"Total Contacts",v:leads.length,h:"All stages",c:"hint"},{l:"Active Leads",v:leads.filter(l=>l.stage==="Lead").length,h:"Awaiting contact",c:"hinta"},{l:"In Trial",v:leads.filter(l=>l.stage==="Trial").length,h:"Deciding",c:"hinta"},{l:"New Today",v:0,h:"From contact form",c:"hint"}].map(s=><div className="sb2" key={s.l}><div className="lbl">{s.l}</div><div className="val">{s.v}</div><div className={s.c}>{s.h}</div></div>)}
      </div>
      <div className="search-bar">
        <input placeholder="Search by name, parent, or subject..." value={search} onChange={e=>setSearch(e.target.value)}/>
        {["All",...STAGE_ORDER].map(s=><button key={s} className={`filter-pill${filterStage===s?" act":""}`} onClick={()=>setFilterStage(s)}>{s}</button>)}
      </div>
      <div className="crm-wrap">
        <div>
          <div className="pipeline">
            {STAGE_ORDER.map(stage=>(
              <div className="pipeline-col" key={stage}>
                <div className="pc-head"><div className="pc-label" style={{color:STAGE_DOTS[stage]}}>{stage}</div><div className="pc-count">{byStage(stage).length}</div></div>
                {byStage(stage).length===0&&<div style={{textAlign:"center",padding:"1.5rem .5rem",color:"var(--muted)",fontSize:".78rem"}}>No contacts</div>}
                {byStage(stage).map(l=>(
                  <div key={l.id} className={`lead-card${selected===l.id?" selected":""}`} onClick={()=>setSelected(l.id)}>
                    {l.reminder&&<div className="remind-dot" title="Reminder set"/>}
                    <div className="lc-name">{l.name}</div>
                    <div className="lc-sub">{l.parent} · {l.subject}</div>
                    <div className="lc-meta"><span className={`badge ${STAGE_COLORS[l.stage]}`}>{l.source}</span><span className="lc-days">{daysSince(l.date)}d ago</span></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="crm-detail">
          {!lead?(<div className="crm-empty"><div className="big">👤</div><p>Select a contact from the pipeline to view their details.</p></div>):(
            <div className="fade" key={lead.id}>
              <div className="cd-top">
                <div className="cd-avatar" style={{background:avatarColor(lead.name)}}>{initials(lead.name)}</div>
                <div className="cd-name">{lead.name}</div>
                <div className="cd-sub">{lead.parent} · {lead.subject} · {lead.year}</div>
                <div className="cd-tags"><span className={`badge ${STAGE_COLORS[lead.stage]}`}>{lead.stage}</span><span className="badge b-blue">{lead.source}</span>{lead.reminder&&<span className="badge b-red">🔔 {lead.reminder}</span>}</div>
              </div>
              <div className="stage-btns">{STAGE_ORDER.map(s=><button key={s} className={`stage-btn${lead.stage===s?" act":""}`} onClick={()=>changeStage(lead.id,s)}>{s}</button>)}</div>
              <div className="cd-info">{[["📧","Email",lead.email],["📞","Phone",lead.phone],["📅","Enquired",lead.date]].map(([ic,l,v])=><div className="cd-row" key={l}><span style={{fontSize:"1rem"}}>{ic}</span><span className="lbl">{l}</span><span className="val">{v}</span></div>)}</div>
              <div className="cd-actions">
                <button className="act-btn" onClick={()=>{setLogTab("email");setEmailSubj("Following up on your enquiry");}}>📧 Email</button>
                <button className="act-btn" onClick={()=>setLogTab("note")}>📝 Note</button>
                <button className="act-btn" onClick={()=>setLogTab("remind")}>🔔 Remind</button>
                {(lead.stage==="Trial"||lead.stage==="Lead")&&<button className="act-btn convert" onClick={()=>handleConvert(lead)}>⚡ Convert</button>}
              </div>
              <div className="cd-timeline">{[...lead.timeline].reverse().map((t,i)=><div className="tl-item" key={i}><div className={`tl-icon ${tIconClass(t.type)}`}>{tIconEmoji(t.type)}</div><div className="tl-body"><div className="t">{t.text}</div><div className="s">{t.detail}</div><div className="ts">{t.ts}</div></div></div>)}</div>
              <div className="log-form">
                <div className="log-tabs">{[["note","📝 Note"],["email","📧 Email"],["remind","🔔 Reminder"]].map(([k,l])=><button key={k} className={`log-tab${logTab===k?" act":""}`} onClick={()=>setLogTab(k)}>{l}</button>)}</div>
                {logTab==="email"&&<input className="log-input" placeholder="Subject line..." value={emailSubj} onChange={e=>setEmailSubj(e.target.value)} style={{display:"block",marginBottom:".5rem"}}/>}
                <textarea className="log-input" rows={3} placeholder={logTab==="note"?"Log a call, meeting, or observation...":logTab==="email"?"Write your email body...":"What do you need to follow up on?"} value={logText} onChange={e=>setLogText(e.target.value)}/>
                {logTab==="remind"&&<div className="remind-panel"><div className="rl">Reminder Date</div><input type="date" className="log-input" value={reminderDate} onChange={e=>setReminderDate(e.target.value)} style={{marginBottom:0}}/></div>}
                <button className="act-btn primary" style={{width:"100%",marginTop:".65rem",padding:".65rem"}} onClick={logNote}>{logTab==="note"?"Save Note":logTab==="email"?"Send Email":"Set Reminder"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── add student modal ─────────────────────────────────────
function AddStudentModal({onClose,onAdd}) {
  const [form,setForm]=useState({name:"",year:"Yr 11",subject:"GCSE Maths",tutor:"Mr. Ahmed",parent:"",parentEmail:"",fee:120});
  const [result,setResult]=useState(null);
  const [copied,setCopied]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const subjectOpts=["11+ Prep","KS3 Maths","KS3 English","KS3 Science","GCSE Maths","GCSE English","GCSE Science","A-Level Maths","A-Level Biology","A-Level Chemistry"];
  const handleCreate=()=>{ if(!form.name||!form.parent||!form.parentEmail){alert("Please fill all required fields.");return;} const password=genPw(),email=genEmail(form.name); const s={id:Date.now(),name:form.name,year:form.year,subject:form.subject,tutor:form.tutor,parent:form.parent,parentEmail:form.parentEmail,fee:Number(form.fee),email}; setResult({password,email,student:s}); onAdd(s); };
  const copy=(t)=>{navigator.clipboard?.writeText(t).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),1500);};
  return (
    <div className="modal-bg fade" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        {!result?<>
          <h3>Add New Student</h3>
          <p className="sub">Login credentials will be generated and emailed to the parent automatically.</p>
          <div className="mfrow"><div><label className="mfl">Student Name</label><input className="mfi" placeholder="Sophie Williams" value={form.name} onChange={e=>f("name",e.target.value)}/></div><div><label className="mfl">Year Group</label><select className="mfi" value={form.year} onChange={e=>f("year",e.target.value)}>{["Yr 5","Yr 6","Yr 7","Yr 8","Yr 9","Yr 10","Yr 11","Yr 12","Yr 13"].map(y=><option key={y}>{y}</option>)}</select></div></div>
          <div className="mfrow"><div><label className="mfl">Subject</label><select className="mfi" value={form.subject} onChange={e=>f("subject",e.target.value)}>{subjectOpts.map(s=><option key={s}>{s}</option>)}</select></div><div><label className="mfl">Tutor</label><select className="mfi" value={form.tutor} onChange={e=>f("tutor",e.target.value)}>{["Mr. Ahmed","Ms. Clarke","Dr. Patel"].map(t=><option key={t}>{t}</option>)}</select></div></div>
          <div className="mfrow"><div><label className="mfl">Parent Name</label><input className="mfi" placeholder="Mark Williams" value={form.parent} onChange={e=>f("parent",e.target.value)}/></div><div><label className="mfl">Monthly Fee</label><select className="mfi" value={form.fee} onChange={e=>f("fee",e.target.value)}>{[95,120,150].map(x=><option key={x} value={x}>£{x}/month</option>)}</select></div></div>
          <label className="mfl">Parent Email</label>
          <input className="mfi" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={e=>f("parentEmail",e.target.value)}/>
          <div style={{display:"flex",gap:".75rem",marginTop:".5rem"}}>
            <button onClick={onClose} style={{flex:1,padding:".8rem",borderRadius:8,border:"1.5px solid var(--border)",background:"transparent",color:"var(--text)",fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Cancel</button>
            <button onClick={handleCreate} className="btn-p" style={{flex:2,padding:".8rem"}}>Create & Send Login</button>
          </div>
        </>:<>
          <div style={{textAlign:"center",marginBottom:"1.5rem"}}><div style={{fontSize:"2rem",marginBottom:".5rem"}}>✅</div><h3>Account Created</h3><p style={{color:"var(--muted)",fontSize:".85rem",marginTop:".35rem"}}>Credentials generated for <strong>{result.student.name}</strong></p></div>
          <div className="success-box"><h4>Login Credentials</h4>
            <div className="cred-row"><div><div className="cred-label">Email</div><div className="cred-val">{result.email}</div></div><button className="copy-btn" onClick={()=>copy(result.email)}>Copy</button></div>
            <div className="cred-row"><div><div className="cred-label">Password</div><div className="cred-val">{result.password}</div></div><button className="copy-btn" onClick={()=>copy(result.password)}>{copied?"Copied!":"Copy"}</button></div>
          </div>
          <div className="email-banner" style={{marginTop:".85rem"}}><span style={{fontSize:"1.25rem"}}>📧</span><p>Welcome email sent to <strong>{result.student.parentEmail}</strong> with portal link and credentials.</p></div>
          <button className="btn-p" style={{width:"100%",padding:".8rem",marginTop:"1.25rem"}} onClick={onClose}>Done</button>
        </>}
      </div>
    </div>
  );
}

// ─── navbar ────────────────────────────────────────────────
function Navbar({page,nav,user,onLogout,setShowLogin}) {
  if(user?.type==="student") return (
    <nav className="nav">
      <div className="nav-logo" onClick={()=>nav("sdash")}>Tutor<span>ific</span></div>
      <div className="nav-links">{[["sdash","Dashboard"],["slessons","My Lessons"],["smaterials","Materials"]].map(([p,l])=><span key={p} className={`nav-link${page===p?" act":""}`} onClick={()=>nav(p)}>{l}</span>)}</div>
      <div className="nav-actions"><span style={{color:"rgba(255,255,255,.5)",fontSize:".8rem"}}>👋 {user.name}</span><button className="btn-out" onClick={onLogout}>Sign Out</button></div>
    </nav>
  );
  if(user?.type==="admin") return (
    <nav className="nav">
      <div className="nav-logo" onClick={()=>nav("adash")}>Tutor<span>ific</span></div>
      <div className="nav-links">{[["adash","Overview"],["aStudents","Students"],["acrm","CRM"],["aattend","Attendance"],["apayments","Payments"],["atutors","Tutors"]].map(([p,l])=><span key={p} className={`nav-link${page===p?" act":""}`} onClick={()=>nav(p)}>{l}</span>)}</div>
      <div className="nav-actions"><span style={{color:"rgba(255,255,255,.5)",fontSize:".8rem"}}>🔐 Admin</span><button className="btn-out" onClick={onLogout}>Sign Out</button></div>
    </nav>
  );
  if(user?.type==="tutor") return (
    <nav className="nav">
      <div className="nav-logo" onClick={()=>nav("tdash")}>Tutor<span>ific</span></div>
      <div className="nav-links">{[["tdash","My Dashboard"],["tattend","Mark Attendance"]].map(([p,l])=><span key={p} className={`nav-link${page===p?" act":""}`} onClick={()=>nav(p)}>{l}</span>)}</div>
      <div className="nav-actions"><span style={{color:"rgba(255,255,255,.5)",fontSize:".8rem"}}>👩‍🏫 {user.name}</span><button className="btn-out" onClick={onLogout}>Sign Out</button></div>
    </nav>
  );
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={()=>nav("home")}>Tutor<span>ific</span></div>
      <div className="nav-links">{[["home","Home"],["courses","Courses"],["about","About"],["pricing","Pricing"],["contact","Contact"]].map(([p,l])=><span key={p} className={`nav-link${page===p?" act":""}`} onClick={()=>nav(p)}>{l}</span>)}</div>
      <div className="nav-actions">
        <button className="btn-out" onClick={()=>setShowLogin("student")}>Student Login</button>
        <button className="btn-out" style={{borderColor:"rgba(13,122,95,.5)",color:"rgba(13,122,95,.9)"}} onClick={()=>setShowLogin("tutor")}>Tutor Login</button>
        <button className="btn-gold" onClick={()=>setShowLogin("admin")}>Admin</button>
      </div>
    </nav>
  );
}

// ─── footer ────────────────────────────────────────────────
function Footer({nav}) {
  return (
    <footer className="footer">
      <div className="fg">
        <div><div className="flogo">Tutor<span>ific</span></div><p className="fdesc">Expert online tutoring for Years 3–13. Personalised, engaging and results-driven.</p></div>
        <div className="fc"><h5>Programmes</h5><ul>{["11+ Preparation","Key Stage 3","GCSE","A-Level"].map(l=><li key={l}><span onClick={()=>nav("courses")}>{l}</span></li>)}</ul></div>
        <div className="fc"><h5>Company</h5><ul>{[["About","about"],["Pricing","pricing"],["Contact","contact"]].map(([l,p])=><li key={l}><span onClick={()=>nav(p)}>{l}</span></li>)}</ul></div>
        <div className="fc"><h5>Contact</h5><ul><li><span>+44 7826 842306</span></li><li><span>tutorifictuition@gmail.com</span></li><li><span>Facebook · Instagram · YouTube</span></li></ul></div>
      </div>
      <div className="fb"><p>© 2026 Tutorific. All rights reserved.</p><div style={{display:"flex",gap:"1.5rem"}}><span style={{color:"rgba(255,255,255,.3)",fontSize:".78rem",cursor:"pointer"}}>Terms & Conditions</span><span style={{color:"rgba(255,255,255,.3)",fontSize:".78rem",cursor:"pointer"}}>Privacy Policy</span></div></div>
    </footer>
  );
}

// ─── public pages (unchanged) ──────────────────────────────
function HomePage({nav,setShowLogin}) {
  return <>
    <div className="hero">
      <div className="hero-c fu">
        <div className="hero-badge">🎓 Years 3–13 · Online Tutoring</div>
        <h1>Unlock Your<br/><em>Potential</em></h1>
        <p className="hero-sub">Expert online tutoring from 11+ through to A-Level. Personalised sessions, revision materials, and a passionate team dedicated to your success.</p>
        <div className="hero-btns"><button className="btn-p" onClick={()=>nav("courses")}>Explore Courses</button><button className="btn-s" onClick={()=>setShowLogin("student")}>Student Portal</button></div>
      </div>
      <div className="hero-stats">{[["200+","Students Taught"],["95%","Pass Rate"],["4.9★","Rating"],["8","Expert Tutors"]].map(([n,l])=><div className="hstat" key={l}><div className="hstat-n">{n}</div><div className="hstat-l">{l}</div></div>)}</div>
    </div>
    <div style={{background:"#fff",padding:"5rem 3rem"}}><div style={{maxWidth:1280,margin:"0 auto"}}>
      <div style={{marginBottom:"3.5rem"}}><div className="slabel">Our Classes</div><h2 className="stitle">There's Something for Everyone</h2></div>
      <div className="courses-grid">{[{tag:"t-gold",label:"Primary",title:"11+ Preparation",desc:"Excel in 11+ exams with expert guidance across all four tested areas.",pills:["Maths","English","Verbal Reasoning","NVR"]},{tag:"t-teal",label:"KS3",title:"Key Stage 3",desc:"Tailored support for Years 7–9 building mastery across core subjects.",pills:["Maths","English","Science"]},{tag:"t-navy",label:"GCSE",title:"GCSE",desc:"Intensive, focused tuition for Year 10 & 11 across all major subjects.",pills:["Maths","English","Science","History","Geography"]},{tag:"t-purple",label:"A-Level",title:"A-Level",desc:"University-focused tuition developing critical thinking for sixth-formers.",pills:["Maths","Biology","Chemistry","English Lit","Physics"]}].map(c=><div className="cc" key={c.title} onClick={()=>nav("courses")}><div className={`ctag ${c.tag}`}>{c.label}</div><h3>{c.title}</h3><p>{c.desc}</p><div className="pills">{c.pills.map(p=><span className="pill" key={p}>{p}</span>)}</div></div>)}</div>
    </div></div>
    <div className="feat-sec"><div className="feat-inner">
      <div className="slabel" style={{color:"var(--gold2)"}}>What's Included</div>
      <h2 className="stitle" style={{color:"#fff"}}>Master All Subjects with Confidence</h2>
      <div className="feat-grid">{[{icon:"🎯",title:"Personalised Tutoring",desc:"Sessions tailored to every learner's unique needs."},{icon:"📝",title:"Exam Practice",desc:"Past papers, timed questions and model answers."},{icon:"🖥️",title:"Interactive Tools",desc:"Virtual whiteboards and multimedia tools."},{icon:"💬",title:"Chat Support",desc:"Reach your tutor beyond lessons whenever needed."},{icon:"📚",title:"Revision Materials",desc:"24/7 library of notes, past papers and model answers."},{icon:"😊",title:"Stress-Free Environment",desc:"Rigorous learning combined with fun and engagement."}].map(f=><div className="fi" key={f.title}><div className="fi-icon">{f.icon}</div><h4>{f.title}</h4><p>{f.desc}</p></div>)}</div>
    </div></div>
    <div style={{background:"var(--bg)",padding:"5rem 3rem",textAlign:"center"}}><div style={{maxWidth:680,margin:"0 auto"}}>
      <div className="slabel">Ready to Start?</div>
      <h2 className="stitle">Join Hundreds of Students Already Achieving More</h2>
      <p style={{color:"var(--muted)",margin:"1rem 0 2rem",fontSize:".95rem",lineHeight:1.75}}>From 11+ prep to A-Level mastery — expert tutors, real results.</p>
      <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}><button className="btn-p" onClick={()=>nav("pricing")}>View Pricing</button><button onClick={()=>nav("contact")} style={{background:"transparent",border:"1.5px solid var(--border)",color:"var(--text)",padding:".8rem 1.9rem",borderRadius:"8px",fontSize:".9rem",fontWeight:500,cursor:"pointer"}}>Get in Touch</button></div>
    </div></div>
    <Footer nav={nav}/>
  </>;
}

function CoursesPage({nav}){return <>
  <div style={{background:"var(--navy)",padding:"4rem 3rem",textAlign:"center"}}><div className="slabel" style={{color:"var(--gold2)"}}>All Programmes</div><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3.2rem)",color:"#fff",fontWeight:600}}>Our Courses</h1></div>
  <div style={{maxWidth:1280,margin:"0 auto",padding:"4rem 3rem"}}><div style={{display:"flex",flexDirection:"column",gap:"2rem"}}>
    {[{tag:"t-gold",label:"Years 5–6",title:"11+ Preparation",price:95,desc:"Our 11+ programme gives young learners the best chance at grammar and independent school entrance exams.",subjects:["Maths","English","Verbal Reasoning","Non-Verbal Reasoning"],features:["Weekly 60-min live sessions","Past paper practice","Mock exam sessions","Full revision library"]},{tag:"t-teal",label:"Years 7–9",title:"Key Stage 3",price:95,desc:"Building rock-solid foundations across core subjects to set students up for GCSE success.",subjects:["Mathematics","English","Science"],features:["Weekly live tutoring","Topic-by-topic notes","Homework support","Progress tracking"]},{tag:"t-navy",label:"Years 10–11",title:"GCSE",price:120,desc:"Our most popular programme — intensive, focused tuition designed around each student's weak points.",subjects:["Maths","English Language","English Literature","Biology","Chemistry","Physics"],features:["Weekly live sessions","Exam technique coaching","Past paper analysis","Model answer library"]},{tag:"t-purple",label:"Years 12–13",title:"A-Level",price:150,desc:"Specialist tutors guiding you through A-Level content with university-focused preparation.",subjects:["Mathematics","Biology","Chemistry","Physics","English Literature"],features:["1-to-1 or small group","UCAS personal statement help","Deep-dive topic sessions"]}].map(c=>(
      <div key={c.title} style={{background:"#fff",borderRadius:"var(--r2)",border:"1px solid var(--border)",padding:"2.5rem",display:"grid",gridTemplateColumns:"1fr auto",gap:"2.5rem",alignItems:"start"}}>
        <div><div className={`ctag ${c.tag}`} style={{marginBottom:"1rem"}}>{c.label}</div><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.75rem",color:"var(--navy)",marginBottom:".75rem"}}>{c.title}</h3><p style={{color:"var(--muted)",fontSize:".9rem",lineHeight:1.75,marginBottom:"1.5rem",maxWidth:560}}>{c.desc}</p><div className="pills" style={{marginBottom:"1.5rem"}}>{c.subjects.map(s=><span className="pill" key={s}>{s}</span>)}</div><div style={{display:"flex",flexWrap:"wrap",gap:".5rem"}}>{c.features.map(f=><span key={f} style={{fontSize:".8rem",color:"var(--teal)",display:"flex",alignItems:"center",gap:".35rem"}}><span style={{fontWeight:800}}>✓</span>{f}</span>)}</div></div>
        <div style={{textAlign:"center",minWidth:180,background:"var(--bg)",borderRadius:"var(--r)",padding:"1.75rem"}}><div style={{fontSize:".75rem",color:"var(--muted)",marginBottom:".5rem",textTransform:"uppercase",letterSpacing:".08em",fontWeight:600}}>From</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.5rem",fontWeight:700,color:"var(--navy)",lineHeight:1}}>£{c.price}</div><div style={{fontSize:".78rem",color:"var(--muted)",margin:".3rem 0 1.25rem"}}>/month</div><button className="btn-p" style={{width:"100%",padding:".7rem"}} onClick={()=>nav("contact")}>Enquire Now</button></div>
      </div>
    ))}
  </div></div>
  <Footer nav={nav}/>
</>;}

function AboutPage({nav}){return <>
  <div style={{background:"var(--navy)",padding:"4rem 3rem",textAlign:"center"}}><div className="slabel" style={{color:"var(--gold2)"}}>Our Story</div><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3.2rem)",color:"#fff",fontWeight:600}}>About Tutorific</h1></div>
  <div style={{maxWidth:1280,margin:"0 auto",padding:"5rem 3rem"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"center"}}>
    <div style={{background:"linear-gradient(135deg,var(--navy),var(--navy2))",borderRadius:"var(--r2)",height:420,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"5rem",color:"rgba(255,255,255,.15)"}}>📚</div>
    <div><div className="slabel">Who We Are</div><h2 className="stitle">Passionate About Every Student's Success</h2><p style={{color:"var(--muted)",fontSize:".93rem",lineHeight:1.8,marginBottom:"1.25rem"}}>Tutorific was founded with a simple belief: every student deserves access to expert, personalised tutoring.</p><p style={{color:"var(--muted)",fontSize:".93rem",lineHeight:1.8,marginBottom:"2rem"}}>We're a growing team of specialist tutors working with students across the UK entirely online.</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>{[["200+","Students Taught"],["8","Expert Tutors"],["95%","Pass Rate"],["4.9★","Parent Rating"]].map(([n,l])=><div key={l} style={{textAlign:"center",padding:"1.5rem",background:"var(--bg2)",borderRadius:"var(--r)"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.2rem",fontWeight:700,color:"var(--navy)"}}>{n}</div><div style={{fontSize:".78rem",color:"var(--muted)",marginTop:".2rem"}}>{l}</div></div>)}</div>
    </div>
  </div></div>
  <Footer nav={nav}/>
</>;}

function PricingPage({nav}){return <>
  <div style={{background:"var(--navy)",padding:"4rem 3rem",textAlign:"center"}}><div className="slabel" style={{color:"var(--gold2)"}}>Simple Pricing</div><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3.2rem)",color:"#fff",fontWeight:600}}>Transparent, No-Surprise Fees</h1></div>
  <div style={{maxWidth:1280,margin:"0 auto",padding:"5rem 3rem"}}><div className="pricing-grid">
    {[{title:"Primary / 11+",desc:"Years 3–6",price:95,feat:true,badge:"Most Popular",features:["Weekly 60-min live session","Past paper library","Full revision notes","Chat support","Student portal"]},{title:"KS3",desc:"Years 7–9",price:95,feat:false,features:["Weekly 60-min live session","Subject-specific notes","Homework support","Chat support","Student portal"]},{title:"GCSE",desc:"Years 10–11",price:120,feat:false,features:["Weekly 60-min live session","Exam technique coaching","Past paper library","Model answers","Mock exam feedback"]},{title:"A-Level",desc:"Years 12–13",price:150,feat:false,features:["Weekly 75-min live session","UCAS support","Deep-dive sessions","Chat support","Dedicated tutor"]}].map(p=>(
      <div key={p.title} className={`pc${p.feat?" feat":""}`}>{p.feat&&<div className="pc-badge">{p.badge}</div>}<h3>{p.title}</h3><div className="desc">{p.desc}</div><div className="price"><sup>£</sup>{p.price}<span>/month</span></div><ul className="pfl">{p.features.map(f=><li key={f}>{f}</li>)}</ul><button className="btn-p" style={{width:"100%",padding:".75rem",marginTop:".5rem"}} onClick={()=>nav("contact")}>Get Started</button></div>
    ))}
  </div></div>
  <Footer nav={nav}/>
</>;}

function ContactPage({nav}){
  const [sent,setSent]=useState(false);
  return <>
    <div style={{background:"var(--navy)",padding:"4rem 3rem",textAlign:"center"}}><div className="slabel" style={{color:"var(--gold2)"}}>Get in Touch</div><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3.2rem)",color:"#fff",fontWeight:600}}>We'd Love to Hear from You</h1></div>
    <div style={{maxWidth:1280,margin:"0 auto",padding:"5rem 3rem"}}><div className="contact-wrap">
      <div>{[{icon:"📞",t:"Phone",s:"+44 7826 842306"},{icon:"✉️",t:"Email",s:"tutorifictuition@gmail.com"},{icon:"📍",t:"Location",s:"Online — teaching students across the UK"},{icon:"🕒",t:"Hours",s:"Mon–Fri 9am–6pm, Sat 10am–2pm"}].map(c=><div className="ci" key={c.t}><div className="ci-icon">{c.icon}</div><div className="ci-text"><div className="t">{c.t}</div><div className="s">{c.s}</div></div></div>)}</div>
      <div>{sent?(<div style={{background:"var(--teal2)",border:"1.5px solid rgba(13,122,95,.2)",borderRadius:"var(--r2)",padding:"3rem",textAlign:"center"}}><div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>✅</div><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:"var(--navy)",marginBottom:".5rem"}}>Message Sent!</h3><p style={{color:"var(--muted)",fontSize:".9rem"}}>We'll get back to you within 24 hours.</p><button className="btn-p" style={{marginTop:"1.5rem"}} onClick={()=>setSent(false)}>Send Another</button></div>):(
        <div style={{background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"2.5rem"}}><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:"var(--navy)",marginBottom:"1.5rem"}}>Send a Message</h3><div className="cf"><div className="frow"><div><label className="fl">Name</label><input placeholder="Jane Smith"/></div><div><label className="fl">Email</label><input placeholder="jane@email.com" type="email"/></div></div><label className="fl">Subject</label><select><option>General Enquiry</option><option>Course Information</option><option>Pricing</option><option>Technical Support</option></select><label className="fl" style={{marginTop:".5rem"}}>Year Group</label><select><option>Please select...</option><option>Year 3–6 (11+)</option><option>Year 7–9 (KS3)</option><option>Year 10–11 (GCSE)</option><option>Year 12–13 (A-Level)</option></select><label className="fl" style={{marginTop:".5rem"}}>Message</label><textarea placeholder="Tell us about your child and what support you're looking for..."/><button className="btn-p btn-full" style={{marginTop:".25rem"}} onClick={()=>setSent(true)}>Send Message</button></div></div>
      )}</div>
    </div></div>
    <Footer nav={nav}/>
  </>;
}

// ─── login (supports student / admin / tutor) ──────────────
function LoginPage({type,onLogin,nav,tutors}) {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");

  const studentCreds={email:"emma.johnson@student.tutorific.co.uk",pass:"Tutor-4829-X",name:"Emma Johnson"};
  const adminCreds={email:"admin@tutorific.co.uk",pass:"admin123",name:"Admin"};

  const handle=()=>{
    if(type==="student"){
      if(email===studentCreds.email&&pass===studentCreds.pass) onLogin({type:"student",name:studentCreds.name});
      else setErr("Incorrect credentials.");
    } else if(type==="admin"){
      if(email===adminCreds.email&&pass===adminCreds.pass) onLogin({type:"admin",name:"Admin"});
      else setErr("Incorrect credentials.");
    } else if(type==="tutor"){
      const match=tutors.find(t=>t.email===email&&t.pass===pass);
      if(match) onLogin({type:"tutor",name:match.name,tutorId:match.id,subject:match.subject,ratePerHour:match.ratePerHour});
      else setErr("Incorrect tutor credentials.");
    }
  };

  const hint = type==="student"
    ? {email:studentCreds.email,pass:studentCreds.pass}
    : type==="admin"
    ? {email:adminCreds.email,pass:adminCreds.pass}
    : {email:"ahmed@tutorific.co.uk",pass:"Ahmed-2024-T"};

  const title = type==="student"?"Student Portal":type==="admin"?"Admin Portal":"Tutor Portal";
  const subtitle = type==="student"?"Access your lessons and materials":type==="admin"?"Manage students, leads and payments":"View your sessions, earnings and mark attendance";

  return <div className="auth-page"><div className="auth-card fu">
    <div style={{textAlign:"center",marginBottom:"2rem"}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",color:"var(--navy)",fontWeight:600}}>Tutor<span style={{color:"var(--gold2)"}}>ific</span></div>
      {type==="tutor"&&<div style={{display:"inline-block",marginTop:".5rem",background:"rgba(13,122,95,.1)",color:"var(--teal)",border:"1px solid rgba(13,122,95,.2)",borderRadius:"100px",padding:".25rem .9rem",fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase"}}>Tutor Portal</div>}
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.75rem",color:"var(--navy)",marginTop:"1.5rem",marginBottom:".4rem"}}>{title}</h2>
      <p style={{color:"var(--muted)",fontSize:".85rem"}}>{subtitle}</p>
    </div>
    <label className="fl">Email Address</label>
    <input className="fi2" type="email" placeholder={hint.email} value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
    <label className="fl">Password</label>
    <input className="fi2" type="password" placeholder="Your password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
    {err&&<p style={{color:"#b03030",fontSize:".8rem",marginBottom:".75rem"}}>{err}</p>}
    <button className="btn-full btn-navy" onClick={handle}>Sign In</button>
    <div className="auth-hint"><strong>Demo login:</strong><br/>Email: <strong>{hint.email}</strong><br/>Password: <strong>{hint.pass}</strong>{type==="tutor"&&<><br/><span style={{fontSize:".75rem",marginTop:".3rem",display:"block"}}>Also try: clarke@tutorific.co.uk / Clarke-2024-T</span></>}</div>
    <p style={{textAlign:"center",marginTop:"1.25rem",fontSize:".82rem",color:"var(--muted)",cursor:"pointer"}} onClick={()=>nav("home")}>← Back to website</p>
  </div></div>;
}

// ─── student dashboard (unchanged) ────────────────────────
function StudentDash({page,nav,user,onLogout,sessions,onJoin}) {
  const [matTab,setMatTab]=useState("Maths");
  const mySessions=sessions.filter(s=>s.studentId===1);
  const handleJoin=(s)=>{ onJoin(s.id); window.open(s.meet,"_blank"); };
  return <div className="dash-wrap">
    <div className="sidebar">
      <div className="sb-logo">Tutor<span>ific</span></div>
      <div className="sb-nav"><div className="sb-sec">Student Portal</div>
        {[{icon:"🏠",label:"Dashboard",p:"sdash"},{icon:"📅",label:"My Lessons",p:"slessons"},{icon:"📚",label:"Materials",p:"smaterials"}].map(s=><div key={s.p} className={`sb-link${page===s.p?" act":""}`} onClick={()=>nav(s.p)}><span style={{fontSize:"1rem"}}>{s.icon}</span>{s.label}</div>)}
      </div>
      <div className="sb-bottom"><div className="sb-user"><div className="sb-avatar">{initials(user.name)}</div><div><div className="sb-name">{user.name}</div><div className="sb-role">Year 11 Student</div></div></div><div className="sb-link" style={{marginTop:".5rem"}} onClick={onLogout}><span>🚪</span>Sign Out</div></div>
    </div>
    <div className="dm">
      <div className="dh"><div><h2>{page==="sdash"?"Welcome back, Emma":page==="slessons"?"My Upcoming Lessons":"Revision Materials"}</h2><div className="date">Friday, 19 March 2026</div></div></div>
      <div className="dc">
        {page==="sdash"&&<>
          <div className="stat-grid">{[{l:"Upcoming Lessons",v:mySessions.filter(s=>!s.attendState).length,h:"Remaining",c:"hint"},{l:"Materials Available",v:"13",h:"3 new this week",c:"hint"},{l:"Sessions Attended",v:mySessions.filter(s=>s.attendState==="P").length,h:"Auto-tracked",c:"hint"},{l:"Next Lesson",v:"Sat 15",h:"3:00 PM — Maths",c:"hinta"}].map(s=><div className="sb2" key={s.l}><div className="lbl">{s.l}</div><div className="val">{s.v}</div><div className={s.c}>{s.h}</div></div>)}</div>
          <div style={{background:"rgba(13,122,95,.06)",border:"1px solid rgba(13,122,95,.18)",borderRadius:"var(--r)",padding:"1rem 1.25rem",marginBottom:"1.75rem",display:"flex",alignItems:"center",gap:".75rem"}}><span style={{fontSize:"1.1rem"}}>💡</span><p style={{fontSize:".83rem",color:"var(--teal)",lineHeight:1.6}}><strong>Attendance is automatic.</strong> Clicking "Join Session" logs your attendance instantly — no sign-in needed.</p></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
            <div className="card"><div className="card-h"><h3>Upcoming Lessons</h3><span style={{fontSize:".8rem",color:"var(--gold)",cursor:"pointer",fontWeight:600}} onClick={()=>nav("slessons")}>View All →</span></div><div className="card-b">{mySessions.slice(0,3).map(l=><div className="lr" key={l.id}><div className="ldate"><div className="d">{l.date}</div><div className="m">{l.month}</div></div><div className="li2"><div className="t">{l.subj}</div><div className="m2">{l.topic} · {l.time}</div></div>{l.attendState==="P"?<span style={{fontSize:".75rem",color:"var(--teal)",fontWeight:700}}>✓ Attended</span>:<button className="btn-meet" onClick={()=>handleJoin(l)}>Join →</button>}</div>)}</div></div>
            <div className="card"><div className="card-h"><h3>Recent Materials</h3><span style={{fontSize:".8rem",color:"var(--gold)",cursor:"pointer",fontWeight:600}} onClick={()=>nav("smaterials")}>Library →</span></div><div className="card-b">{MATERIALS.Maths.slice(0,3).map(m=><div className="mr" key={m.name}><div className={`fic ic-${m.type.toLowerCase()}`}>{m.type}</div><div className="mi"><div className="n">{m.name}</div><div className="m">{m.size}</div></div><button className="btn-dl">↓</button></div>)}</div></div>
          </div>
        </>}
        {page==="slessons"&&<div className="card"><div className="card-h"><h3>All Sessions</h3></div><div className="card-b">
          <div style={{marginBottom:"1.25rem",padding:"1rem",background:"var(--teal2)",borderRadius:"var(--r)",border:"1px solid rgba(13,122,95,.15)"}}><p style={{fontSize:".83rem",color:"var(--teal)",lineHeight:1.65}}><span className="live-dot" style={{marginRight:6}}></span><strong>Attendance auto-tracked</strong> — clicking Join Session marks you present instantly.</p></div>
          {mySessions.map(l=><div className="lr" key={l.id} style={{padding:"1.25rem 0"}}><div className="ldate"><div className="d">{l.date}</div><div className="m">{l.month}</div></div><div className="li2"><div className="t" style={{fontSize:"1rem"}}>{l.subj} — {l.topic}</div><div className="m2" style={{marginTop:".35rem"}}>{l.time} · {l.tutor}</div></div><div style={{textAlign:"right"}}>{l.attendState==="P"?<div style={{fontSize:".8rem",color:"var(--teal)",fontWeight:700}}>✓ Attended · {l.joinedAt}</div>:<><button className="btn-meet" style={{padding:".5rem 1.25rem",fontSize:".85rem"}} onClick={()=>handleJoin(l)}>Join Session →</button><div style={{fontSize:".72rem",color:"var(--muted)",marginTop:".35rem"}}>Auto-logs attendance</div></>}</div></div>)}
        </div></div>}
        {page==="smaterials"&&<>
          <div className="tabs">{Object.keys(MATERIALS).map(t=><button key={t} className={`tab${matTab===t?" act":""}`} onClick={()=>setMatTab(t)}>{t}</button>)}</div>
          <div className="card"><div className="card-h"><h3>{matTab} — Revision Library</h3></div><div className="card-b">{MATERIALS[matTab].map(m=><div className="mr" key={m.name}><div className={`fic ic-${m.type.toLowerCase()}`}>{m.type}</div><div className="mi"><div className="n">{m.name}</div><div className="m">{m.size} · {m.added}</div></div><button className="btn-dl" onClick={()=>alert("File download — connect to your storage in production.")}>↓ Download</button></div>)}</div></div>
        </>}
      </div>
    </div>
  </div>;
}

// ─── TUTOR DASHBOARD ───────────────────────────────────────
function TutorDash({page, nav, user, onLogout, sessions, setSessions, tutorPayments}) {
  const mySessions = sessions.filter(s => s.tutorId === user.tutorId);
  const myPayments = tutorPayments[user.tutorId] || [];
  const rate = user.ratePerHour;

  // Earnings calculations
  const totalEarned = mySessions
    .filter(s => s.attendState === "P" || s.attendState === "L")
    .reduce((acc, s) => acc + (s.durationHours || 1) * rate, 0);
  const totalPaid = myPayments
    .filter(p => p.status === "Paid")
    .reduce((acc, p) => acc + p.invoiced, 0);
  const outstanding = totalEarned - totalPaid;

  // Attendance marking state
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [pendingMarks, setPendingMarks] = useState({}); // { sessionId: "P"|"A"|"L"|null }
  const [saveFeedback, setSaveFeedback] = useState(null);

  const unmarkedSessions = mySessions.filter(s => s.attendState === null);
  const markedSessions   = mySessions.filter(s => s.attendState !== null);

  const selectedSession  = mySessions.find(s => s.id === selectedSessionId) || null;

  const handleSelectSession = (id) => {
    setSelectedSessionId(Number(id));
    setSaveFeedback(null);
    // Pre-fill if already marked
    const s = mySessions.find(s => s.id === Number(id));
    if(s && s.attendState !== null) setPendingMarks(prev => ({...prev, [Number(id)]: s.attendState}));
    else setPendingMarks(prev => ({...prev, [Number(id)]: null}));
  };

  const handleMark = (mark) => {
    if(!selectedSessionId) return;
    setPendingMarks(prev => ({...prev, [selectedSessionId]: mark}));
    setSaveFeedback(null);
  };

  const handleSave = () => {
    const mark = pendingMarks[selectedSessionId];
    if(!mark) { setSaveFeedback("error"); return; }
    setSessions(prev => prev.map(s =>
      s.id === selectedSessionId
        ? { ...s, attendState: mark, markedAt: nowTime() }
        : s
    ));
    setSaveFeedback("saved");
  };

  const dotClass = s => s==="P"?"ap":s==="A"?"aa":s==="L"?"al":"an";
  const dotLabel = s => s==="P"?"Present":s==="A"?"Absent":s==="L"?"Late":"—";

  const sidebarLinks = [
    {icon:"📊",label:"My Dashboard",p:"tdash"},
    {icon:"✅",label:"Mark Attendance",p:"tattend"},
  ];

  const pageTitle = page === "tdash" ? "My Dashboard" : "Mark Attendance";

  return (
    <div className="dash-wrap">
      <div className="sidebar">
        <div className="sb-logo">Tutor<span>ific</span></div>
        <div className="sb-nav">
          <div className="sb-sec">Tutor Portal</div>
          {sidebarLinks.map(s =>
            <div key={s.p} className={`sb-link${page===s.p?" act":""}`} onClick={()=>nav(s.p)}>
              <span style={{fontSize:"1rem"}}>{s.icon}</span>{s.label}
            </div>
          )}
        </div>
        <div className="sb-bottom">
          <div className="sb-user">
            <div className="sb-avatar" style={{background:"var(--teal)"}}>{initials(user.name)}</div>
            <div><div className="sb-name">{user.name}</div><div className="sb-role">{user.subject}</div></div>
          </div>
          <div className="sb-link" style={{marginTop:".5rem"}} onClick={onLogout}><span>🚪</span>Sign Out</div>
        </div>
      </div>

      <div className="dm">
        <div className="dh">
          <div><h2>{pageTitle}</h2><div className="date">Friday, 19 March 2026</div></div>
          {page==="tdash" && <span style={{fontSize:".8rem",color:"var(--muted)"}}>£{rate}/hr · {mySessions.length} session{mySessions.length!==1?"s":""} this month</span>}
        </div>

        <div className="dc">

          {/* ── TUTOR DASHBOARD PAGE ─────────────────────────────── */}
          {page==="tdash" && <>

            {/* Earnings summary cards */}
            <div className="stat-grid-3" style={{marginBottom:"2rem"}}>
              <div className="earn-card green">
                <div className="lbl" style={{fontSize:".72rem",color:"var(--muted)",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".45rem"}}>Total Earned</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.1rem",color:"var(--teal)",fontWeight:600,lineHeight:1}}>{fmtGBP(totalEarned)}</div>
                <div style={{fontSize:".75rem",color:"var(--muted)",marginTop:".35rem"}}>for attended sessions · £{rate}/hr</div>
              </div>
              <div className="earn-card gold">
                <div className="lbl" style={{fontSize:".72rem",color:"var(--muted)",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".45rem"}}>Paid Out</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.1rem",color:"var(--gold)",fontWeight:600,lineHeight:1}}>{fmtGBP(totalPaid)}</div>
                <div style={{fontSize:".75rem",color:"var(--muted)",marginTop:".35rem"}}>{myPayments.filter(p=>p.status==="Paid").length} payment{myPayments.filter(p=>p.status==="Paid").length!==1?"s":""} received</div>
              </div>
              <div className="earn-card navy">
                <div className="lbl" style={{fontSize:".72rem",color:"var(--muted)",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",marginBottom:".45rem"}}>Outstanding</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.1rem",color:outstanding>0?"var(--navy)":"var(--teal)",fontWeight:600,lineHeight:1}}>{fmtGBP(outstanding)}</div>
                <div style={{fontSize:".75rem",color:outstanding>0?"var(--gold)":"var(--teal)",marginTop:".35rem"}}>{outstanding>0?"awaiting payment":"all up to date ✓"}</div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:"1.5rem"}}>

              {/* Session history table */}
              <div className="card" style={{marginBottom:0}}>
                <div className="card-h"><h3>Session History</h3></div>
                <div style={{overflowX:"auto"}}>
                  <table>
                    <thead><tr><th>Date</th><th>Student</th><th>Subject</th><th>Duration</th><th>Attendance</th><th>Earnings</th></tr></thead>
                    <tbody>
                      {mySessions.length===0&&<tr><td colSpan={6} style={{textAlign:"center",color:"var(--muted)",padding:"2rem"}}>No sessions yet.</td></tr>}
                      {mySessions.map(s=>{
                        const amt = (s.attendState==="P"||s.attendState==="L") ? (s.durationHours||1)*rate : 0;
                        return <tr key={s.id}>
                          <td>{s.date} {s.month}</td>
                          <td style={{fontWeight:600}}>{s.studentName}</td>
                          <td>{s.subj}</td>
                          <td>{s.durationHours||1}h</td>
                          <td>
                            {s.attendState
                              ? <span className={`adot ${dotClass(s.attendState)}`} title={dotLabel(s.attendState)}>{s.attendState}</span>
                              : <span style={{fontSize:".75rem",color:"var(--muted)"}}>Not marked</span>}
                          </td>
                          <td style={{fontWeight:600,color:amt>0?"var(--teal)":"var(--muted)"}}>{amt>0?fmtGBP(amt):"—"}</td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment history */}
              <div className="card" style={{marginBottom:0}}>
                <div className="card-h"><h3>Payment History</h3></div>
                <div style={{padding:"0 1.4rem"}}>
                  {myPayments.length===0&&<p style={{color:"var(--muted)",padding:"2rem 0",textAlign:"center",fontSize:".85rem"}}>No payment records yet.</p>}
                  {myPayments.map((p,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".85rem 0",borderBottom:"1px solid var(--border)"}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:".88rem"}}>{p.month}</div>
                        <div style={{fontSize:".77rem",color:"var(--muted)",marginTop:".1rem"}}>{p.sessions} sessions</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:700,fontSize:"1rem",fontFamily:"'Cormorant Garamond',serif",color:"var(--navy)"}}>£{p.invoiced}</div>
                        <span className={`badge b-${p.status==="Paid"?"green":"amber"}`}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>}

          {/* ── MARK ATTENDANCE PAGE ──────────────────────────────── */}
          {page==="tattend" && <>

            <div style={{background:"rgba(13,122,95,.06)",border:"1px solid rgba(13,122,95,.18)",borderRadius:"var(--r)",padding:"1rem 1.25rem",marginBottom:"1.75rem",display:"flex",alignItems:"center",gap:".75rem"}}>
              <span style={{fontSize:"1.1rem"}}>✅</span>
              <p style={{fontSize:".83rem",color:"var(--teal)",lineHeight:1.6}}>Select a session below, then mark each student's attendance. For 1-to-1 sessions this is the student in that session.</p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",alignItems:"start"}}>

              {/* Left: session picker + attendance form */}
              <div>
                <div className="card" style={{marginBottom:"1.25rem"}}>
                  <div className="card-h"><h3>Select Session</h3></div>
                  <div className="card-b">
                    {mySessions.length === 0 && <p style={{color:"var(--muted)",fontSize:".85rem"}}>No sessions assigned to you.</p>}
                    <div style={{display:"flex",flexDirection:"column",gap:".5rem"}}>
                      {mySessions.map(s=>(
                        <div
                          key={s.id}
                          onClick={()=>handleSelectSession(s.id)}
                          style={{
                            padding:".8rem 1rem",borderRadius:8,cursor:"pointer",border:"1.5px solid",
                            borderColor: selectedSessionId===s.id ? "var(--teal)" : "var(--border)",
                            background: selectedSessionId===s.id ? "rgba(13,122,95,.05)" : "#fff",
                            transition:"all .15s",
                          }}
                        >
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <div>
                              <div style={{fontWeight:600,fontSize:".88rem"}}>{s.date} {s.month} · {s.time}</div>
                              <div style={{fontSize:".77rem",color:"var(--muted)",marginTop:".1rem"}}>{s.studentName} · {s.subj} — {s.topic}</div>
                            </div>
                            {s.attendState
                              ? <span className={`adot ${dotClass(s.attendState)}`}>{s.attendState}</span>
                              : <span style={{fontSize:".7rem",color:"var(--gold)",fontWeight:700,background:"rgba(201,149,11,.1)",padding:"2px 8px",borderRadius:100}}>Unmarked</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Attendance form for selected session */}
                {selectedSession && (
                  <div className="card fade" style={{marginBottom:0}}>
                    <div className="card-h">
                      <h3>Mark Attendance</h3>
                      <span style={{fontSize:".78rem",color:"var(--muted)"}}>{selectedSession.date} {selectedSession.month}</span>
                    </div>
                    <div className="card-b">
                      <div className="attend-toggle-row">
                        <div>
                          <div className="sname">{selectedSession.studentName}</div>
                          <div className="sdetail">{selectedSession.subj} · {selectedSession.durationHours||1}h session</div>
                        </div>
                        <div className="toggle-group">
                          {[["P","Present","present"],["L","Late","late"],["A","Absent","absent"]].map(([code,label,cls])=>(
                            <button
                              key={code}
                              className={`tog${pendingMarks[selectedSessionId]===code?" "+cls:""}`}
                              onClick={()=>handleMark(code)}
                            >{label}</button>
                          ))}
                        </div>
                      </div>

                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"1.1rem",paddingTop:"1rem",borderTop:"1px solid var(--border)"}}>
                        {saveFeedback==="saved" && <span style={{fontSize:".82rem",color:"var(--teal)",fontWeight:600}}>✓ Attendance saved!</span>}
                        {saveFeedback==="error" && <span style={{fontSize:".82rem",color:"#a02020",fontWeight:600}}>Please choose an option first.</span>}
                        {!saveFeedback && <span/>}
                        <button
                          className="btn-meet"
                          style={{padding:".55rem 1.4rem",fontSize:".85rem"}}
                          onClick={handleSave}
                        >Save Attendance</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: summary of marked sessions this month */}
              <div className="card" style={{marginBottom:0}}>
                <div className="card-h"><h3>Attendance Summary</h3><span style={{fontSize:".8rem",color:"var(--muted)"}}>March 2026</span></div>
                <div style={{padding:"1rem 1.6rem"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".75rem",marginBottom:"1.25rem"}}>
                    {[
                      {label:"Present",count:markedSessions.filter(s=>s.attendState==="P").length,cls:"b-green"},
                      {label:"Late",count:markedSessions.filter(s=>s.attendState==="L").length,cls:"b-amber"},
                      {label:"Absent",count:markedSessions.filter(s=>s.attendState==="A").length,cls:"b-red"},
                    ].map(c=>(
                      <div key={c.label} style={{textAlign:"center",padding:".85rem .5rem",background:"var(--bg)",borderRadius:8}}>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.75rem",fontWeight:600,color:"var(--navy)"}}>{c.count}</div>
                        <span className={`badge ${c.cls}`} style={{marginTop:".25rem"}}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:".8rem",color:"var(--muted)",marginBottom:".75rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>All sessions</div>
                  {mySessions.map(s=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:".75rem",padding:".65rem 0",borderBottom:"1px solid var(--border)"}}>
                      <span className={`adot ${s.attendState?dotClass(s.attendState):"an"}`}>{s.attendState||"?"}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:".85rem",fontWeight:600}}>{s.studentName}</div>
                        <div style={{fontSize:".75rem",color:"var(--muted)"}}>{s.date} {s.month} · {s.topic}</div>
                      </div>
                      {s.attendState && <span style={{fontSize:".72rem",color:"var(--muted)"}}>{s.markedAt||""}</span>}
                    </div>
                  ))}
                  {unmarkedSessions.length > 0 && (
                    <div style={{marginTop:".85rem",padding:".65rem .85rem",background:"rgba(201,149,11,.06)",border:"1px solid rgba(201,149,11,.18)",borderRadius:8,fontSize:".78rem",color:"var(--gold)",fontWeight:600}}>
                      ⚠ {unmarkedSessions.length} session{unmarkedSessions.length!==1?"s":""} still need{unmarkedSessions.length===1?"s":""} marking
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>}

        </div>
      </div>
    </div>
  );
}

// ─── admin dashboard (unchanged except atutors now uses tutorPayments state) ─
function AdminDash({page,nav,onLogout,students,setStudents,payments,setPayments,sessions,setSessions,leads,setLeads,showAdd,setShowAdd,tutorPayments,setTutorPayments}) {
  const totalRevenue=payments.filter(p=>p.status==="Paid").reduce((a,p)=>a+p.amount,0);
  const outstanding=payments.filter(p=>p.status!=="Paid").reduce((a,p)=>a+p.amount,0);
  const dotClass=s=>s==="P"?"ap":s==="A"?"aa":s==="L"?"al":"an";

  const handleAddStudent=(s)=>{ setStudents(prev=>[...prev,s]); setPayments(prev=>[...prev,{id:Date.now(),studentId:s.id,student:s.name,parent:s.parent,amount:s.fee,due:"01 Apr",paid:"—",status:"Pending"}]); };
  const markPaid=(id)=>setPayments(prev=>prev.map(p=>p.id===id?{...p,status:"Paid",paid:"Today"}:p));
  const handleConvertFromCRM=(newStudent)=>{ setStudents(prev=>[...prev,newStudent]); setPayments(prev=>[...prev,{id:Date.now(),studentId:newStudent.id,student:newStudent.name,parent:newStudent.parent,amount:newStudent.fee,due:"01 Apr",paid:"—",status:"Pending"}]); };

  // Tutor totals derived from tutorPayments state
  const tutorRows = TUTORS_AUTH.map(t => {
    const pList = tutorPayments[t.id] || [];
    const invoiced = pList.reduce((a,p)=>a+p.invoiced,0);
    const paid = pList.filter(p=>p.status==="Paid").reduce((a,p)=>a+p.invoiced,0);
    const sessions_count = pList.reduce((a,p)=>a+p.sessions,0);
    return { ...t, invoiced, paid, owed: invoiced-paid, sessions: sessions_count };
  });
  const totalOwed = tutorRows.reduce((a,t)=>a+t.owed,0);

  const markTutorPaid = (tutorId) => {
    setTutorPayments(prev => ({
      ...prev,
      [tutorId]: prev[tutorId].map(p => p.status==="Pending" ? {...p, status:"Paid"} : p)
    }));
  };

  const sidebarLinks=[
    {icon:"📊",label:"Overview",p:"adash"},
    {icon:"👥",label:"Students",p:"aStudents"},
    {icon:"🎯",label:"CRM",p:"acrm"},
    {icon:"✅",label:"Attendance",p:"aattend"},
    {icon:"💳",label:"Payments",p:"apayments"},
    {icon:"👨‍🏫",label:"Tutors",p:"atutors"},
  ];
  const pageTitle={adash:"Business Overview",aStudents:"Student Accounts",acrm:"CRM — Pipeline",aattend:"Live Attendance",apayments:"Parent Payments",atutors:"Tutor Payments"}[page]||"Admin";

  return <div className="dash-wrap">
    <div className="sidebar">
      <div className="sb-logo">Tutor<span>ific</span></div>
      <div className="sb-nav">
        <div className="sb-sec">Admin Panel</div>
        {sidebarLinks.map(s=><div key={s.p} className={`sb-link${page===s.p?" act":""}`} onClick={()=>nav(s.p)}><span style={{fontSize:"1rem"}}>{s.icon}</span>{s.label}{s.p==="acrm"&&leads.filter(l=>l.stage==="Lead").length>0&&<span style={{marginLeft:"auto",background:"rgba(232,64,64,.2)",color:"#c02020",borderRadius:"100px",fontSize:".65rem",fontWeight:700,padding:".1rem .5rem"}}>{leads.filter(l=>l.stage==="Lead").length}</span>}</div>)}
      </div>
      <div className="sb-bottom"><div className="sb-user"><div className="sb-avatar" style={{background:"var(--gold)"}}>AD</div><div><div className="sb-name">Admin</div><div className="sb-role">Tutorific HQ</div></div></div><div className="sb-link" style={{marginTop:".5rem"}} onClick={onLogout}><span>🚪</span>Sign Out</div></div>
    </div>
    <div className="dm">
      <div className="dh">
        <div><h2>{pageTitle}</h2><div className="date">Friday, 19 March 2026</div></div>
        {page==="aStudents"&&<button className="btn-p" style={{padding:".55rem 1.25rem",fontSize:".85rem"}} onClick={()=>setShowAdd(true)}>+ Add New Student</button>}
        {page==="acrm"&&<button className="btn-p" style={{padding:".55rem 1.25rem",fontSize:".85rem"}} onClick={()=>{ const name=prompt("Contact name?"); if(name) setLeads(prev=>[...prev,{id:Date.now(),name,parent:"",email:"",phone:"",stage:"Lead",subject:"",year:"",source:"Manual",date:"2026-03-19",reminder:null,timeline:[{type:"enq",text:"Lead added manually",detail:"Added by admin.",ts:"19 Mar, "+nowTime()}]}]); }}>+ Add Lead</button>}
      </div>
      <div className="dc">

        {page==="adash"&&<>
          <div className="stat-grid">{[{l:"Active Students",v:students.length,h:"This term",c:"hint"},{l:"Revenue Collected",v:`£${totalRevenue}`,h:"March 2026",c:"hint"},{l:"Outstanding",v:`£${outstanding}`,h:`${payments.filter(p=>p.status!=="Paid").length} families`,c:"hinta"},{l:"Open Leads",v:leads.filter(l=>l.stage==="Lead"||l.stage==="Trial").length,h:"In pipeline",c:"hinta"}].map(s=><div className="sb2" key={s.l}><div className="lbl">{s.l}</div><div className="val">{s.v}</div><div className={s.c}>{s.h}</div></div>)}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
            <div className="card"><div className="card-h"><h3>Payment Status</h3><span style={{fontSize:".8rem",color:"var(--gold)",cursor:"pointer",fontWeight:600}} onClick={()=>nav("apayments")}>View All →</span></div><div className="card-b" style={{padding:"0 1.6rem"}}><table><thead><tr><th>Student</th><th>Amount</th><th>Status</th></tr></thead><tbody>{payments.slice(0,5).map(p=><tr key={p.id}><td>{p.student}</td><td>£{p.amount}</td><td><span className={`badge b-${p.status==="Paid"?"green":p.status==="Overdue"?"red":"amber"}`}>{p.status}</span></td></tr>)}</tbody></table></div></div>
            <div className="card"><div className="card-h"><h3>CRM Pipeline</h3><span style={{fontSize:".8rem",color:"var(--gold)",cursor:"pointer",fontWeight:600}} onClick={()=>nav("acrm")}>View All →</span></div><div className="card-b">{STAGE_ORDER.map(s=><div key={s} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".65rem 0",borderBottom:"1px solid var(--border)"}}><div style={{display:"flex",alignItems:"center",gap:".6rem"}}><div style={{width:10,height:10,borderRadius:"50%",background:STAGE_DOTS[s]}}></div><span style={{fontSize:".88rem",fontWeight:500}}>{s}</span></div><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:600,color:"var(--navy)"}}>{leads.filter(l=>l.stage===s).length}</span></div>)}</div></div>
          </div>
        </>}

        {page==="aStudents"&&<>
          <div style={{background:"rgba(201,149,11,.06)",border:"1px solid rgba(201,149,11,.18)",borderRadius:"var(--r)",padding:"1rem 1.25rem",marginBottom:"1.75rem",display:"flex",alignItems:"center",gap:".75rem"}}><span style={{fontSize:"1.1rem"}}>🔑</span><p style={{fontSize:".83rem",color:"var(--gold)",lineHeight:1.6}}>Adding a student generates a secure password and emails it to the parent immediately.</p></div>
          <div className="card"><div className="card-h"><h3>All Students ({students.length})</h3></div><div style={{overflowX:"auto"}}><table><thead><tr><th>Student</th><th>Year</th><th>Subject</th><th>Tutor</th><th>Parent</th><th>Portal Email</th><th>Fee</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td style={{fontWeight:600}}>{s.name}</td><td>{s.year}</td><td>{s.subject}</td><td>{s.tutor}</td><td>{s.parent}</td><td style={{fontSize:".78rem",color:"var(--muted)",fontFamily:"monospace"}}>{s.email}</td><td style={{fontWeight:600}}>£{s.fee}/mo</td></tr>)}</tbody></table></div></div>
        </>}

        {page==="acrm"&&<CRMPanel leads={leads} setLeads={setLeads} onConvertToStudent={handleConvertFromCRM}/>}

        {page==="aattend"&&<>
          <div style={{background:"var(--teal2)",border:"1px solid rgba(13,122,95,.2)",borderRadius:"var(--r)",padding:"1rem 1.25rem",marginBottom:"1.75rem",display:"flex",alignItems:"center",gap:".75rem"}}><span className="live-dot"></span><p style={{fontSize:".83rem",color:"var(--teal)",lineHeight:1.6}}><strong>Live tracking.</strong> When a student clicks "Join Session" or a tutor marks attendance, rows update here.</p></div>
          {sessions.filter(s=>s.attendState==="P").length>0&&<div className="card" style={{marginBottom:"1.75rem"}}><div className="card-h"><h3>Session Joins — Live</h3></div><div className="card-b">{sessions.filter(s=>s.attendState==="P").map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:"1rem",padding:".7rem 0",borderBottom:"1px solid var(--border)"}}><span className="adot ap">P</span><div style={{flex:1}}><div style={{fontSize:".88rem",fontWeight:600}}>{s.studentName}</div><div style={{fontSize:".77rem",color:"var(--muted)"}}>{s.subj} — {s.topic} · {s.tutor}{s.joinedAt?" · joined "+s.joinedAt:""}</div></div><span className="badge b-green">Logged</span></div>)}</div></div>}
          <div className="card"><div className="card-h"><h3>All Sessions — March 2026</h3><div className="attend-legend">{[["P","ap","Present"],["A","aa","Absent"],["L","al","Late"]].map(([s,c,l])=><span key={s}><span className={`adot ${c}`}>{s}</span>{l}</span>)}</div></div><div style={{overflowX:"auto"}}><table><thead><tr><th>Student</th><th>Date</th><th>Subject</th><th>Tutor</th><th>Status</th><th>Marked</th></tr></thead><tbody>{sessions.map(s=><tr key={s.id}><td style={{fontWeight:600}}>{s.studentName}</td><td>{s.date} {s.month}</td><td>{s.subj}</td><td>{s.tutor}</td><td>{s.attendState?<span className={`adot ${dotClass(s.attendState)}`}>{s.attendState}</span>:<span style={{fontSize:".75rem",color:"var(--muted)"}}>Pending</span>}</td><td style={{fontSize:".75rem",color:"var(--muted)"}}>{s.markedAt||"—"}</td></tr>)}</tbody></table></div></div>
          <div className="card" style={{marginTop:"1.5rem"}}><div className="card-h"><h3>Historical — Past Sessions</h3><div className="attend-legend">{[["P","ap","Present"],["A","aa","Absent"],["L","al","Late"]].map(([s,c,l])=><span key={s}><span className={`adot ${c}`}>{s}</span>{l}</span>)}</div></div><div style={{overflowX:"auto"}}><table><thead><tr><th>Student</th><th>Year</th><th>Subject</th><th>Tutor</th>{PAST_ATTEND[1].map(w=><th key={w.d}>{w.d}</th>)}<th>Rate</th></tr></thead><tbody>{students.filter(s=>PAST_ATTEND[s.id]).map(s=>{ const hist=PAST_ATTEND[s.id]||[]; const rate=hist.length?Math.round((hist.filter(a=>a.s==="P").length/hist.length)*100):0; return <tr key={s.id}><td style={{fontWeight:600}}>{s.name}</td><td>{s.year}</td><td>{s.subject}</td><td>{s.tutor}</td>{hist.map((a,i)=><td key={i}><span className={`adot ${dotClass(a.s)}`}>{a.s}</span></td>)}<td><span className={`badge b-${rate>=90?"green":rate>=75?"amber":"red"}`}>{rate}%</span></td></tr>; })}</tbody></table></div></div>
        </>}

        {page==="apayments"&&<>
          <div className="stat-grid-3">{[{l:"Collected",v:`£${totalRevenue}`,h:`${payments.filter(p=>p.status==="Paid").length} payments`,c:"hint"},{l:"Outstanding",v:`£${outstanding}`,h:`${payments.filter(p=>p.status!=="Paid").length} families`,c:"hinta"},{l:"Total Expected",v:`£${payments.reduce((a,p)=>a+p.amount,0)}`,h:"March 2026",c:"hint"}].map(s=><div className="sb2" key={s.l}><div className="lbl">{s.l}</div><div className="val">{s.v}</div><div className={s.c}>{s.h}</div></div>)}</div>
          <div className="card"><div className="card-h"><h3>Parent Payments — March 2026</h3></div><table><thead><tr><th>Student</th><th>Parent</th><th>Amount</th><th>Due</th><th>Paid</th><th>Status</th><th>Action</th></tr></thead><tbody>{payments.map(p=><tr key={p.id}><td style={{fontWeight:600}}>{p.student}</td><td>{p.parent}</td><td style={{fontWeight:600}}>£{p.amount}</td><td>{p.due}</td><td>{p.paid}</td><td><span className={`badge b-${p.status==="Paid"?"green":p.status==="Overdue"?"red":"amber"}`}>{p.status}</span></td><td>{p.status!=="Paid"&&<><button onClick={()=>markPaid(p.id)} style={{background:"var(--teal)",color:"#fff",border:"none",borderRadius:6,padding:".32rem .85rem",fontSize:".75rem",cursor:"pointer",fontWeight:700,fontFamily:"'Outfit',sans-serif",marginRight:".4rem"}}>Mark Paid</button><button onClick={()=>alert(`Reminder sent to ${p.parent}.`)} style={{background:"transparent",border:"1px solid var(--border)",borderRadius:6,padding:".32rem .75rem",fontSize:".75rem",cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Remind</button></>}</td></tr>)}</tbody></table></div>
        </>}

        {page==="atutors"&&<>
          <div className="stat-grid-3">{[{l:"Total Tutors",v:tutorRows.length,h:"Active",c:"hint"},{l:"Total Sessions",v:tutorRows.reduce((a,t)=>a+t.sessions,0),h:"This month",c:"hint"},{l:"Outstanding",v:`£${totalOwed}`,h:`To ${tutorRows.filter(t=>t.owed>0).length} tutor(s)`,c:"hinta"}].map(s=><div className="sb2" key={s.l}><div className="lbl">{s.l}</div><div className="val">{s.v}</div><div className={s.c}>{s.h}</div></div>)}</div>
          <div className="card"><div className="card-h"><h3>Tutor Payment Schedule</h3></div><table><thead><tr><th>Tutor</th><th>Subject</th><th>Sessions</th><th>Rate/hr</th><th>Invoiced</th><th>Paid</th><th>Owed</th><th>Action</th></tr></thead><tbody>{tutorRows.map(t=><tr key={t.id}><td style={{fontWeight:600}}>{t.name}</td><td>{t.subject}</td><td style={{textAlign:"center"}}>{t.sessions}</td><td>£{t.ratePerHour}</td><td>£{t.invoiced}</td><td style={{color:"var(--teal)",fontWeight:600}}>£{t.paid}</td><td style={{color:t.owed>0?"var(--gold)":"var(--teal)",fontWeight:700}}>£{t.owed}</td><td>{t.owed>0?<button onClick={()=>markTutorPaid(t.id)} style={{background:"var(--teal)",color:"#fff",border:"none",borderRadius:6,padding:".35rem .85rem",fontSize:".75rem",cursor:"pointer",fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>Mark Paid</button>:<span className="badge b-green">Up to date</span>}</td></tr>)}</tbody></table></div>
          {/* Per-tutor payment breakdown */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.25rem",marginTop:"1.5rem"}}>
            {tutorRows.map(t=>(
              <div className="card" key={t.id} style={{marginBottom:0}}>
                <div className="card-h"><h3 style={{fontSize:".95rem"}}>{t.name}</h3><span style={{fontSize:".75rem",color:"var(--muted)"}}>£{t.ratePerHour}/hr</span></div>
                <div style={{padding:"0 1.4rem"}}>
                  {(tutorPayments[t.id]||[]).map((p,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".75rem 0",borderBottom:"1px solid var(--border)"}}>
                      <div><div style={{fontSize:".85rem",fontWeight:600}}>{p.month}</div><div style={{fontSize:".72rem",color:"var(--muted)"}}>{p.sessions} sessions</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontWeight:700,fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem"}}>£{p.invoiced}</div><span className={`badge b-${p.status==="Paid"?"green":"amber"}`}>{p.status}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>}

      </div>
    </div>
    {showAdd&&<AddStudentModal onClose={()=>setShowAdd(false)} onAdd={handleAddStudent}/>}
  </div>;
}

// ─── app root ──────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState("home");
  const [user,setUser]=useState(null);
  const [showLogin,setShowLogin]=useState(null);
  const [students,setStudents]=useState(INIT_STUDENTS);
  const [payments,setPayments]=useState(PAYMENTS_INIT);
  const [sessions,setSessions]=useState(INIT_SESSIONS);
  const [leads,setLeads]=useState(INIT_LEADS);
  const [showAdd,setShowAdd]=useState(false);
  const [tutorPayments,setTutorPayments]=useState(TUTOR_PAYMENTS_INIT);

  const nav=(p)=>{ setPage(p); setShowLogin(null); window.scrollTo(0,0); };
  const onLogin=(u)=>{ setUser(u); setShowLogin(null); if(u.type==="student") nav("sdash"); else if(u.type==="admin") nav("adash"); else nav("tdash"); };
  const onLogout=()=>{ setUser(null); nav("home"); };
  const handleJoin=(id)=>{ const t=nowTime(); setSessions(prev=>prev.map(s=>s.id===id?{...s,attendState:"P",joinedAt:t}:s)); };

  const nb=<Navbar page={page} nav={nav} user={user} onLogout={onLogout} setShowLogin={setShowLogin}/>;

  if(showLogin) return <><style>{CSS}</style>{nb}<LoginPage type={showLogin} onLogin={onLogin} nav={nav} tutors={TUTORS_AUTH}/></>;

  if(user?.type==="student") return <><style>{CSS}</style>{nb}<StudentDash page={page} nav={nav} user={user} onLogout={onLogout} sessions={sessions} onJoin={handleJoin}/></>;

  if(user?.type==="tutor") return <><style>{CSS}</style>{nb}
    <TutorDash page={page} nav={nav} user={user} onLogout={onLogout} sessions={sessions} setSessions={setSessions} tutorPayments={tutorPayments}/>
  </>;

  if(user?.type==="admin") return <><style>{CSS}</style>{nb}
    <AdminDash page={page} nav={nav} onLogout={onLogout} students={students} setStudents={setStudents} payments={payments} setPayments={setPayments} sessions={sessions} setSessions={setSessions} leads={leads} setLeads={setLeads} showAdd={showAdd} setShowAdd={setShowAdd} tutorPayments={tutorPayments} setTutorPayments={setTutorPayments}/>
  </>;

  return <><style>{CSS}</style>{nb}
    {page==="home"&&<HomePage nav={nav} setShowLogin={setShowLogin}/>}
    {page==="courses"&&<CoursesPage nav={nav}/>}
    {page==="about"&&<AboutPage nav={nav}/>}
    {page==="pricing"&&<PricingPage nav={nav}/>}
    {page==="contact"&&<ContactPage nav={nav}/>}
  </>;
}