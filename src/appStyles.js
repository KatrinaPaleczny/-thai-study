// Shared CEFR level colors used across all pages
export const LEVEL_COLORS = {
  A1: { color: "#1a7f37", background: "#dafbe1", borderColor: "#1a7f37" },
  A2: { color: "#0969da", background: "#ddf4ff", borderColor: "#0969da" },
  B1: { color: "#9a6700", background: "#fff8c5", borderColor: "#9a6700" },
  B2: { color: "#bc4c00", background: "#fff1e5", borderColor: "#bc4c00" },
};
export const levelStyle = (l) => LEVEL_COLORS[l] || {};

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Noto+Sans+Thai:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FAFAF8;--sur:#ffffff;--sur2:#F7F5F0;--bdr:#E8E4DC;--act:#0A8A7A;
  --sb-bg:#0A6E64;--sb-t1:#F0F9F7;--sb-t2:#A8D5CF;--sb-t3:#7FBAB2;--sb-bdr:#0D7D70;--sb-hover:#0C7A6E;--sb-active-bg:rgba(197,163,71,.18);--sb-active-txt:#F0D060;
  --t1:#1A1A1A;--t2:#555555;--t3:#888888;
  --olive:#C5A347;--olive-soft:#FBF6E8;--olive-mid:#D4BA6E;--olive-dark:#9B7E2E;
  --walnut:#0A8A7A;--walnut-soft:#E6F5F3;
  --concrete:#6B7280;--concrete-soft:#F3F4F6;
  --thai:'Noto Sans Thai',sans-serif;--body:'DM Sans',sans-serif;--disp:'DM Sans',sans-serif;
  --shadow-xs:0 1px 2px rgba(0,0,0,.04);
  --shadow-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --shadow-md:0 4px 12px rgba(0,0,0,.07),0 2px 4px rgba(0,0,0,.04);
  --shadow-lg:0 12px 28px rgba(0,0,0,.09),0 4px 10px rgba(0,0,0,.04);
  --shadow-hover:0 8px 24px rgba(0,0,0,.11),0 3px 8px rgba(0,0,0,.05);
  --radius-sm:12px;--radius-md:16px;--radius-lg:20px;--radius-xl:24px;
}
html,body{height:100%;overflow:hidden}
body{background:linear-gradient(160deg,#FAFAF8 0%,#F7F5F0 50%,#F5F3EE 100%);color:var(--t1);font-family:var(--body);font-size:14px;line-height:1.55}
button{font-family:var(--body)}
button:focus-visible{outline:2px solid var(--olive);outline-offset:2px;border-radius:4px}

/* ── App Layout ── */
.app{display:flex;height:100vh;overflow:hidden}

/* ── Sidebar ── */
.sb{width:220px;min-width:220px;background:linear-gradient(180deg,#0A7A6E 0%,#087068 100%);border-right:1px solid var(--sb-bdr);display:flex;flex-direction:column;padding:24px 0;height:100vh;overflow-y:auto;flex-shrink:0}
.sb::-webkit-scrollbar-thumb{background:var(--sb-bdr);border-radius:3px}
.sb-logo{padding:0 22px 22px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:10px}
.sb-th{font-family:var(--thai);font-size:21px;font-weight:600;color:var(--sb-active-txt);text-shadow:0 1px 8px rgba(197,163,71,.2)}
.sb-sub{font-family:var(--disp);font-style:italic;font-size:11px;color:var(--sb-t3);margin-top:3px;letter-spacing:.02em}
.sb-lbl{font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--sb-t3);padding:0 22px;margin-bottom:3px;margin-top:14px}
.sb-btn{display:flex;align-items:center;gap:10px;padding:9px 22px;cursor:pointer;font-size:13px;color:var(--sb-t2);border:none;border-left:2.5px solid transparent;background:none;width:100%;text-align:left;transition:all .2s ease}
.sb-btn:hover{color:var(--sb-t1);background:rgba(255,255,255,.04)}
.sb-btn.on{color:var(--sb-active-txt);background:var(--sb-active-bg);font-weight:500;border-left-color:var(--olive);padding-left:20px;backdrop-filter:blur(6px)}
.sb-ic{width:18px;text-align:center;font-size:14px}
.sb-chev{margin-left:auto;font-size:10px;color:var(--sb-t3);flex-shrink:0;transition:transform .2s ease;opacity:.8}
.sb-sub-list{background:rgba(0,0,0,.18);padding:3px 0 6px 0;overflow:hidden}
.sb-sub-btn{display:flex;align-items:center;gap:8px;padding:7px 12px 7px 30px;cursor:pointer;font-size:11.5px;color:var(--sb-t2);border:none;border-left:2px solid transparent;background:none;width:100%;text-align:left;transition:all .15s ease}
.sb-sub-btn:hover{color:var(--sb-t1);background:rgba(255,255,255,.05);border-left-color:var(--olive-mid)}
.sb-sub-ic{font-size:11px;width:16px;text-align:center;flex-shrink:0}
.sb-sub-lbl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}

/* ── Main Content ── */
.main{flex:1;overflow-y:auto;overflow-x:hidden;position:relative;scroll-behavior:smooth;-webkit-overflow-scrolling:touch}
.page{padding:36px 44px;max-width:1040px;overflow-x:hidden}

/* ── Page Header ── */
.ph{margin-bottom:24px;padding-bottom:18px;border-bottom:1px solid var(--bdr)}
.ph-t{font-family:var(--disp);font-size:26px;font-weight:600;letter-spacing:-.01em}
.ph-s{font-size:12.5px;color:var(--t3);margin-top:4px;letter-spacing:.01em}

/* ── Stats Cards ── */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.stat{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:18px;box-shadow:var(--shadow-sm);transition:all .2s ease}
.stat:hover{box-shadow:var(--shadow-md);transform:translateY(-1px)}
.stat-n{font-family:var(--disp);font-size:28px;font-weight:400}
.stat-l{font-size:11px;color:var(--t3);margin-top:2px}

/* ── Chips & Filters ── */
.chip{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--sur);color:var(--t2);transition:all .2s ease;white-space:nowrap;box-shadow:var(--shadow-xs)}
.chip:hover{border-color:var(--olive);color:var(--olive);box-shadow:var(--shadow-sm)}
.chip.on{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%);border-color:var(--olive);color:#fff;box-shadow:0 2px 8px rgba(197,163,71,.25)}
.chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px}

/* ── Search ── */
.srch{position:relative;margin-bottom:16px}
.srch input{width:100%;padding:10px 16px 10px 38px;border:1px solid var(--bdr);border-radius:var(--radius-sm);font-size:13px;background:var(--sur);color:var(--t1);outline:none;transition:all .2s ease;box-shadow:var(--shadow-xs)}
.srch input:focus{border-color:var(--olive);box-shadow:0 0 0 3px rgba(197,163,71,.1)}
.srch input::placeholder{color:var(--t3)}
.srch-ic{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--t3);pointer-events:none}

/* ── Vocab Cards ── */
.vc{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:12px 16px;cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-sm)}
.vc:hover{border-color:var(--olive-mid);box-shadow:var(--shadow-md);transform:translateY(-1px)}
.vc.open{border-color:var(--olive);box-shadow:0 0 0 3px rgba(197,163,71,.08),var(--shadow-sm)}
.vc.custom{border:1.5px solid var(--walnut);box-shadow:inset 0 0 0 3px var(--walnut-soft),var(--shadow-sm)}
.vc.pinned{border:1.5px solid var(--olive);box-shadow:inset 0 0 0 3px var(--olive-soft),var(--shadow-sm)}
.vc.studied:not(.pinned){opacity:0.5}
.vc-top{display:flex;align-items:center;gap:8px}
.vc-bot{display:flex;align-items:center;gap:8px;margin-top:3px;padding-left:30px}
.vc-ej{font-size:15px;width:22px;text-align:center;flex-shrink:0}
.vc-th{font-family:var(--thai);font-size:16px;font-weight:500}
.vc-ph{font-size:12px;color:var(--t3);font-style:italic}
.vc-en{font-size:12.5px;color:var(--t2);flex:1;text-align:right;margin-right:4px}
.vc-cat{font-size:10px;color:var(--t3);padding:2px 8px;border:1px solid var(--bdr);border-radius:20px;white-space:nowrap;background:var(--sur2)}
.vc-lvl{font-size:10px;padding:2px 8px;border-radius:20px;white-space:nowrap;font-weight:700;border:1px solid;letter-spacing:.03em}
.vc-acts{display:flex;align-items:center;gap:5px;margin-top:8px;padding-top:8px;border-top:1px solid var(--bdr)}
.ic-btn{background:none;border:none;cursor:pointer;color:var(--t3);padding:4px;border-radius:6px;display:flex;align-items:center;transition:all .2s ease}
.ic-btn:hover{color:var(--t1);background:var(--sur2)}
.ic-btn.fav{color:var(--walnut)}.ic-btn.stu{color:var(--olive)}.ic-btn.pin{color:var(--olive)}.ic-btn.del{color:#e57373}
.vc-ex{margin-top:10px;padding-top:10px;border-top:1px solid var(--bdr)}
.vc-ex-th{font-family:var(--thai);font-size:13px;margin-bottom:2px}
.vc-ex-ph{font-size:10.5px;color:var(--t3);font-style:italic;margin-bottom:1px}
.vc-ex-en{font-size:11.5px;color:var(--t2)}
.vocab-list{display:flex;flex-direction:column;gap:6px}
.filter-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.filter-ct{font-size:11px;color:var(--t3)}
.vt-btn{padding:5px 12px;border-radius:var(--radius-sm);font-size:11px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--sur);color:var(--t2);transition:all .2s ease;box-shadow:var(--shadow-xs)}
.vt-btn.on{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%);border-color:var(--olive);color:#fff;box-shadow:0 2px 6px rgba(197,163,71,.2)}
.pinned-banner{background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.6) 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-md);padding:13px 16px;margin-bottom:16px;font-size:12px;color:var(--olive);box-shadow:var(--shadow-xs)}

/* ── Flashcard ── */
.fc-wrap{display:flex;flex-direction:column;align-items:center;padding-top:8px}
.fc-prog{font-size:11px;color:var(--t3);margin-bottom:18px;letter-spacing:.05em;font-weight:500}
.fc{width:100%;max-width:480px;min-height:280px;background:linear-gradient(145deg,#ffffff 0%,#faf9f7 100%);border:1px solid var(--bdr);border-radius:var(--radius-xl);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px;cursor:pointer;box-shadow:var(--shadow-lg);position:relative;text-align:center;transition:all .25s ease}
.fc:hover{box-shadow:0 16px 40px rgba(0,0,0,.12),0 4px 12px rgba(0,0,0,.06);transform:translateY(-2px)}
.fc-cat{font-size:10px;color:var(--t3);letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px;font-weight:600}
.fc-ej{font-size:24px;margin-bottom:10px}
.fc-front-ph{font-size:24px;font-weight:500;margin-bottom:4px}
.fc-front-lbl{font-size:10.5px;color:var(--t3)}
.fc-rev{animation:fadeUp .25s ease;width:100%;text-align:center;margin-top:12px}
.fc-rev-ph{font-size:12px;color:var(--t3);font-style:italic;margin-bottom:8px}
.fc-thai{font-family:var(--thai);font-size:44px;font-weight:500;line-height:1.3;margin-bottom:8px}
.fc-en{font-size:18px;color:var(--t2)}
.fc-hint-lbl{font-size:10.5px;color:var(--t3);position:absolute;bottom:14px}
.fc-btns{display:flex;align-items:center;gap:10px;margin-top:20px}
.fc-btn{padding:9px 18px;border-radius:var(--radius-sm);font-size:12.5px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);transition:all .2s ease;box-shadow:var(--shadow-xs)}
.fc-btn:active{transform:translateY(1px);box-shadow:none}
.fc-btn.nav{background:var(--sur);color:var(--t2)}.fc-btn.nav:hover{border-color:var(--olive);color:var(--olive);box-shadow:var(--shadow-sm)}
.fc-btn.easy{background:linear-gradient(135deg,var(--act) 0%,#087068 100%);color:#fff;border-color:var(--act);box-shadow:0 2px 8px rgba(10,138,122,.2)}.fc-btn.easy:hover{box-shadow:0 4px 14px rgba(10,138,122,.3)}
.fc-btn.rev{background:var(--sur);color:var(--walnut);border-color:var(--walnut)}.fc-btn.rev:hover{background:var(--walnut-soft);box-shadow:0 2px 8px rgba(10,138,122,.15)}
.fc-btn:disabled{opacity:.4;cursor:default;transform:none}
.fc-speak-btn{background:none;border:none;cursor:pointer;font-size:20px;margin-top:12px;padding:6px 10px;border-radius:var(--radius-sm);transition:all .2s ease}
.fc-speak-btn:hover{background:var(--sur2);transform:scale(1.1)}
.fc-keys{font-size:10px;color:var(--t3);text-align:center;margin-top:8px;opacity:.6;letter-spacing:.02em}
.fc-toggle-thai{margin-left:10px;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;cursor:pointer;border:1px solid var(--bdr);background:var(--sur);color:var(--t3);transition:all .2s ease;font-family:var(--body)}
.fc-toggle-thai:hover{border-color:var(--olive);color:var(--olive)}
.fc-toggle-thai.on{background:var(--olive-soft);border-color:var(--olive);color:var(--olive)}
.fc-ex{margin-top:18px;max-width:480px;width:100%}
.fc-ex-in{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:14px 16px;box-shadow:var(--shadow-xs)}
.fc-ex-lbl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px;font-weight:600}
.fc-ex-th{font-family:var(--thai);font-size:14px;margin-bottom:2px}
.fc-ex-ph{font-size:10.5px;color:var(--t3);font-style:italic;margin-bottom:2px}
.fc-ex-en{font-size:11.5px;color:var(--t2)}

/* ── Modal ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--sur);border-radius:var(--radius-lg);padding:28px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,.2),0 4px 16px rgba(0,0,0,.1);max-height:90vh;overflow-y:auto}
.modal-t{font-family:var(--disp);font-size:19px;font-weight:600;margin-bottom:4px}
.modal-s{font-size:12px;color:var(--t3);margin-bottom:22px}
.field{margin-bottom:14px}
.field label{display:block;font-size:11.5px;font-weight:500;color:var(--t2);margin-bottom:6px}
.field input,.field select,.field textarea{width:100%;padding:9px 12px;border:1px solid var(--bdr);border-radius:var(--radius-sm);font-size:13px;font-family:var(--body);background:var(--sur);color:var(--t1);outline:none;transition:all .2s ease;resize:vertical}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--olive);box-shadow:0 0 0 3px rgba(197,163,71,.1)}
.field input::placeholder,.field textarea::placeholder{color:var(--t3)}
.modal-btns{display:flex;gap:10px;margin-top:20px;justify-content:flex-end}
.modal-btn{padding:9px 20px;border-radius:var(--radius-sm);font-size:12.5px;font-weight:500;cursor:pointer;transition:all .2s ease}
.modal-btn.prim{background:linear-gradient(135deg,var(--act) 0%,#087068 100%);color:#fff;border:none;box-shadow:0 2px 8px rgba(10,138,122,.2)}.modal-btn.prim:hover{box-shadow:0 4px 14px rgba(10,138,122,.3)}
.modal-btn.sec{background:var(--sur);color:var(--t2);border:1px solid var(--bdr)}.modal-btn.sec:hover{border-color:var(--olive);color:var(--olive)}

/* ── Category Cards ── */
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(225px,1fr));gap:14px}
.cat-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:18px;cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-sm)}
.cat-card:hover{border-color:var(--olive);box-shadow:var(--shadow-hover);transform:translateY(-2px)}
.cat-ej{font-size:17px;margin-bottom:8px;letter-spacing:2px}.cat-tt{font-family:var(--disp);font-size:14.5px;font-weight:500;margin-bottom:3px}.cat-ct{font-size:11px;color:var(--t3)}
.cat-acts{display:flex;gap:6px;margin-top:10px}

/* ── Grammar Reference ── */
.gram-list{display:flex;flex-direction:column;gap:8px}
.gram-card{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);transition:all .2s ease}
.gram-card:hover{box-shadow:var(--shadow-md)}
.gram-hdr{display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;transition:background .2s ease}
.gram-hdr:hover{background:var(--sur2)}
.gram-ic{font-size:17px;width:26px;text-align:center;flex-shrink:0}
.gram-tt{font-family:var(--disp);font-size:14.5px;font-weight:500;flex:1}
.gram-lv{font-size:9.5px;padding:3px 9px;border-radius:20px;white-space:nowrap;font-weight:600;border:1px solid}
.gram-body{padding:0 16px 16px;border-top:1px solid var(--bdr)}
.gram-sum{font-size:13px;color:var(--t2);margin:13px 0;line-height:1.6}
.gram-exs{display:flex;flex-direction:column;gap:8px;margin-bottom:13px}
.gram-ex{background:var(--sur2);border-radius:var(--radius-sm);padding:11px 13px}
.gram-ex-th{font-family:var(--thai);font-size:16px;margin-bottom:2px}
.gram-ex-ph{font-size:11px;color:var(--t3);font-style:italic;margin-bottom:2px}
.gram-ex-en{font-size:12px;color:var(--t2)}
.gram-note{font-size:11.5px;color:var(--olive-dark);background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.6) 100%);border-left:3px solid var(--olive);border-radius:0 var(--radius-sm) var(--radius-sm) 0;padding:10px 13px}

/* ── Numbers ── */
.num-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-bottom:22px}
.num-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:14px;text-align:center;box-shadow:var(--shadow-xs);transition:all .2s ease}
.num-card:hover{box-shadow:var(--shadow-sm);transform:translateY(-1px)}
.num-val{font-family:var(--disp);font-size:20px;color:var(--t3);margin-bottom:3px}
.num-th{font-family:var(--thai);font-size:18px;margin-bottom:2px}.num-ph{font-size:11px;color:var(--t3);font-style:italic}
.num-speak{background:none;border:none;cursor:pointer;font-size:14px;padding:3px 5px;border-radius:6px;color:var(--t3);transition:all .2s ease;margin-top:4px;display:inline-block}
.num-speak:hover{color:var(--olive);background:var(--olive-soft)}
.num-drill{max-width:400px;margin:0 auto}
.num-q{background:linear-gradient(145deg,#ffffff 0%,#faf9f7 100%);border:1px solid var(--bdr);border-radius:var(--radius-lg);padding:32px;text-align:center;box-shadow:var(--shadow-md);margin-bottom:18px}
.num-ql{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px;font-weight:600}
.num-disp{font-family:var(--disp);font-size:52px;margin-bottom:5px}
.num-qf-thai{font-family:var(--thai);font-size:46px;margin-bottom:5px}
.num-res{margin-top:12px;font-size:13px;padding:8px 14px;border-radius:var(--radius-sm);font-weight:500}
.num-res.ok{background:var(--olive-soft);color:var(--olive)}.num-res.no{background:var(--walnut-soft);color:var(--walnut)}
.num-inp{width:100%;padding:10px 14px;border:1.5px solid var(--bdr);border-radius:var(--radius-sm);font-size:15px;font-family:var(--thai);outline:none;text-align:center;margin-bottom:10px;background:var(--sur);color:var(--t1);transition:all .2s ease;box-shadow:var(--shadow-xs)}
.num-inp:focus{border-color:var(--olive);box-shadow:0 0 0 3px rgba(197,163,71,.1)}
.num-b{padding:8px 18px;border-radius:var(--radius-sm);font-size:12.5px;font-weight:500;cursor:pointer;transition:all .2s ease}
.num-b.p{background:linear-gradient(135deg,var(--act) 0%,#087068 100%);color:#fff;border:none;box-shadow:0 2px 8px rgba(10,138,122,.2)}.num-b.p:hover{box-shadow:0 4px 14px rgba(10,138,122,.3)}
.num-b.s{background:var(--sur);color:var(--t2);border:1px solid var(--bdr)}.num-b.s:hover{border-color:var(--olive);color:var(--olive)}
.qf-btns{display:flex;gap:12px;justify-content:center;margin-top:14px}
.qf-btn{padding:11px 30px;border-radius:var(--radius-md);font-size:13.5px;font-weight:500;cursor:pointer;border:none;transition:all .2s ease}
.qf-btn:active{transform:translateY(1px)}
.qf-btn.got{background:linear-gradient(135deg,var(--act) 0%,#087068 100%);color:#fff;box-shadow:0 2px 8px rgba(10,138,122,.2)}.qf-btn.got:hover{box-shadow:0 4px 14px rgba(10,138,122,.3)}
.qf-btn.miss{background:var(--sur);color:var(--walnut);border:1px solid var(--walnut);box-shadow:var(--shadow-xs)}.qf-btn.miss:hover{background:var(--walnut-soft);box-shadow:0 2px 8px rgba(10,138,122,.15)}
.qf-streak{font-size:12px;color:var(--t3);margin-top:12px;text-align:center}

/* ── Conversation ── */
.conv-list{display:flex;flex-direction:column;gap:8px}
.conv-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:16px 18px;cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-xs)}
.conv-card:hover{border-color:var(--olive-mid);box-shadow:var(--shadow-md);transform:translateY(-1px)}
.conv-card.done{border-color:var(--olive);background:var(--olive-soft)}
.conv-tt{font-family:var(--disp);font-size:14px;font-weight:500;margin-bottom:3px}
.conv-goal{font-size:11.5px;color:var(--t2)}
.conv-meta{display:flex;align-items:center;gap:8px;margin-top:9px}
.conv-badge{font-size:10px;padding:3px 9px;border-radius:20px;font-weight:500}
.conv-badge.done{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%);color:#fff}.conv-badge.cnt{background:var(--sur2);color:var(--t3)}
.conv-scene{max-width:580px}
.conv-turn{display:flex;gap:11px;margin-bottom:13px;align-items:flex-start}
.conv-role{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;min-width:48px;padding-top:2px;color:var(--t3)}
.conv-role.you{color:var(--olive)}
.conv-bub{flex:1}
.conv-pr{font-size:13px;color:var(--t2);margin-bottom:5px;line-height:1.5}
.conv-hint{background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.6) 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-sm);padding:7px 12px;font-size:13px;color:var(--olive);display:inline-block}
.conv-rb{font-size:11px;color:var(--t3);border:1px solid var(--bdr);background:none;cursor:pointer;padding:4px 10px;border-radius:6px;transition:all .2s ease}
.conv-rb:hover{border-color:var(--olive);color:var(--olive);background:var(--olive-soft)}
.conv-done-btn{padding:8px 18px;border-radius:var(--radius-sm);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s ease}
.conv-done-btn.mark{background:linear-gradient(135deg,var(--act) 0%,#087068 100%);color:#fff;border:none;box-shadow:0 2px 8px rgba(10,138,122,.2)}
.conv-done-btn.unmark{background:var(--sur);color:var(--t2);border:1px solid var(--bdr)}
.turn-row{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px}
.turn-del{background:none;border:none;cursor:pointer;color:var(--t3);padding:4px;border-radius:4px;flex-shrink:0;margin-top:2px}
.turn-del:hover{color:#e57373}

/* ── Spelling Bee / Dictation ── */
.sb-page{background:linear-gradient(145deg,#ffffff 0%,#faf9f7 100%);border:1px solid var(--bdr);border-radius:var(--radius-lg);padding:32px;max-width:520px;margin:0 auto;box-shadow:var(--shadow-md)}
.sb-q{text-align:center;margin-bottom:26px}
.sb-pattern{font-size:10px;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px;font-weight:600}
.sb-english{font-size:23px;font-weight:500;font-family:var(--disp);margin-bottom:8px}
.sb-hint{font-size:12px;color:var(--t3);font-style:italic}
.sb-inp{width:100%;padding:12px 16px;border:2px solid var(--bdr);border-radius:var(--radius-md);font-size:16px;font-family:var(--thai);outline:none;text-align:center;background:var(--sur);color:var(--t1);transition:all .2s ease;margin-bottom:16px}
.sb-inp:focus{border-color:var(--olive);box-shadow:0 0 0 3px rgba(197,163,71,.1)}
.sb-inp.correct{border-color:var(--olive);background:var(--olive-soft)}
.sb-inp.wrong{border-color:var(--walnut);background:var(--walnut-soft)}
.sb-result{padding:16px;border-radius:var(--radius-md);text-align:center;margin-bottom:16px}
.sb-result.ok{background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.6) 100%);border:1px solid var(--olive-mid)}
.sb-result.no{background:linear-gradient(135deg,var(--walnut-soft) 0%,rgba(230,245,243,.6) 100%);border:1px solid #c9967a}
.sb-result-th{font-family:var(--thai);font-size:24px;margin-bottom:4px}
.sb-result-ph{font-size:12px;color:var(--t3);font-style:italic;margin-bottom:6px}
.sb-result-tip{font-size:12px;color:var(--t2)}
.sb-btns{display:flex;gap:10px;justify-content:center}
.sb-act-btn{padding:10px 24px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;cursor:pointer;transition:all .2s ease}
.sb-act-btn:active{transform:translateY(1px)}
.sb-act-btn.check{background:linear-gradient(135deg,var(--act) 0%,#087068 100%);color:#fff;border:none;box-shadow:0 2px 8px rgba(10,138,122,.2)}.sb-act-btn.check:hover{box-shadow:0 4px 14px rgba(10,138,122,.3)}
.sb-act-btn.skip{background:var(--sur);color:var(--t2);border:1px solid var(--bdr)}.sb-act-btn.skip:hover{border-color:var(--olive);color:var(--olive)}
.sb-act-btn.next{background:linear-gradient(135deg,var(--act) 0%,#087068 100%);color:#fff;border:none;box-shadow:0 2px 8px rgba(10,138,122,.2)}.sb-act-btn.next:hover{box-shadow:0 4px 14px rgba(10,138,122,.3)}
.sb-score{display:flex;gap:14px;justify-content:center;font-size:12px;color:var(--t3);margin-bottom:20px}
.sb-score b{color:var(--t1)}
.wk-tabs{display:flex;gap:5px;margin-bottom:20px;flex-wrap:wrap}
.wk-tab{padding:6px 14px;border-radius:20px;font-size:11px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--sur);color:var(--t2);transition:all .2s ease;box-shadow:var(--shadow-xs)}
.wk-tab:hover{border-color:var(--olive);color:var(--olive)}.wk-tab.on{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%);border-color:var(--olive);color:#fff;box-shadow:0 2px 6px rgba(197,163,71,.2)}

/* ── Tabs ── */
.tabs{display:flex;gap:4px;margin-bottom:20px;border-bottom:1.5px solid var(--bdr)}
.tab{padding:8px 14px;font-size:12.5px;font-weight:500;cursor:pointer;border:none;background:none;color:var(--t3);border-bottom:2.5px solid transparent;margin-bottom:-1.5px;transition:all .2s ease}
.tab:hover{color:var(--t1)}.tab.on{color:var(--olive);border-bottom-color:var(--olive);font-weight:600}

/* ── Buttons ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:var(--radius-sm);font-size:12.5px;font-weight:500;cursor:pointer;transition:all .2s ease}
.btn:active{transform:translateY(1px)}
.btn-pri{background:linear-gradient(135deg,var(--act) 0%,#087068 100%);color:#fff;border:none;box-shadow:0 2px 8px rgba(10,138,122,.2)}.btn-pri:hover{box-shadow:0 4px 14px rgba(10,138,122,.3)}
.btn-sec{background:var(--sur);color:var(--t2);border:1px solid var(--bdr);box-shadow:var(--shadow-xs)}.btn-sec:hover{border-color:var(--olive);color:var(--olive)}
.btn-sm{padding:6px 11px;font-size:11.5px;border-radius:7px}
.empty{text-align:center;padding:48px;color:var(--t3);font-size:14px}
.sec-gap{margin-top:26px}
.back-btn{font-size:12px;padding:6px 12px;border:1px solid var(--bdr);border-radius:var(--radius-sm);background:var(--sur);cursor:pointer;color:var(--t2);transition:all .2s ease;margin-bottom:20px;display:inline-flex;align-items:center;gap:6px;box-shadow:var(--shadow-xs)}
.back-btn:hover{border-color:var(--olive);color:var(--olive)}
.dash2{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:22px}
.sec-t{font-family:var(--disp);font-size:14.5px;font-weight:500;margin-bottom:12px}
.rec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(165px,1fr));gap:8px;margin-top:18px}
.rec-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:12px;box-shadow:var(--shadow-xs)}
.rec-th{font-family:var(--thai);font-size:18px;margin-bottom:1px}.rec-ph{font-size:10.5px;color:var(--t3);font-style:italic;margin-bottom:2px}.rec-en{font-size:11.5px;color:var(--t2)}
.ql-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 12px;border-radius:var(--radius-sm);font-size:12px;border:1px solid var(--bdr);background:var(--sur);cursor:pointer;color:var(--t2);transition:all .2s ease;margin:3px;box-shadow:var(--shadow-xs)}
.ql-btn:hover{border-color:var(--olive);color:var(--olive);background:var(--olive-soft)}

/* ── Animations ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

/* ── Coffee Watermark ── */
.main::after{content:"☕";position:fixed;bottom:18px;right:24px;font-size:96px;opacity:.045;pointer-events:none;user-select:none;z-index:0;line-height:1}

/* ── Scrollbar ── */
::-webkit-scrollbar{width:7px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#d0ccc6;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#b0aca7}
.main::-webkit-scrollbar{width:6px}
.main::-webkit-scrollbar-thumb{background:transparent;border-radius:4px;transition:background .3s}
.main:hover::-webkit-scrollbar-thumb{background:#c8c4be}
.main:hover::-webkit-scrollbar-thumb:hover{background:#a8a4a0}
.main{scrollbar-width:thin;scrollbar-color:transparent transparent}
.main:hover{scrollbar-color:#c8c4be transparent}

/* ── Responsive ── */
/* Mobile top bar — hidden on desktop */
.sb-mobile-bar{display:none}
.sb-overlay{display:none}

@media(max-width:820px){
  .sb-mobile-bar{display:flex;align-items:center;gap:10px;position:fixed;top:0;left:0;right:0;height:48px;background:linear-gradient(180deg,#0A7A6E 0%,#087068 100%);padding:0 14px;z-index:1001;border-bottom:1px solid var(--sb-bdr)}
  .sb-hamburger{background:none;border:none;color:var(--sb-t1);font-size:20px;cursor:pointer;padding:4px 8px;line-height:1}
  .sb-mobile-title{font-family:var(--disp);font-size:14px;font-weight:500;color:var(--sb-t1);flex:1}
  .sb-mobile-xp{font-size:11px;color:var(--sb-t3);white-space:nowrap}
  .sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:999}
  .sb-open ~ .sb-overlay,.sb.sb-open + .sb-overlay{display:none}
  /* Show overlay when sidebar is open — handled via sibling */
  .sb{position:fixed;top:48px;left:0;bottom:0;width:260px;z-index:1000;transform:translateX(-100%);transition:transform .25s ease;padding-top:14px}
  .sb.sb-open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,.3)}
  .sb-overlay{position:fixed;inset:0;top:48px;background:rgba(0,0,0,.4);z-index:999;display:none}
  body:has(.sb.sb-open) .sb-overlay{display:block}
  .app{display:block}
  .main{margin-top:48px;height:calc(100vh - 48px);width:100%;overflow-y:auto}
  .page{padding:18px 14px}
  .stats{grid-template-columns:repeat(2,1fr)}
  .dash2{grid-template-columns:1fr}
  .fc-thai{font-size:34px}
  .fc{min-height:240px;padding:28px}
  .path-grid{grid-template-columns:1fr}
}

/* ══════════════════════════════════════════════════
   My Path Page
   ══════════════════════════════════════════════════ */
.path-pbar{height:6px;background:var(--sur2);border-radius:4px;overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,.06)}
.path-pbar-top{margin-top:14px;height:8px}
.path-pbar-sm{width:60px}
.path-pfill{height:100%;background:linear-gradient(90deg,var(--olive) 0%,var(--olive-mid) 100%);border-radius:4px;transition:width .4s ease-out}
.path-units{display:flex;flex-direction:column;gap:12px;margin-top:22px}
.path-unit{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm)}
.path-unit.locked{opacity:.6}
.path-unit-hdr{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;cursor:pointer;transition:background .2s ease}
.path-unit-hdr:hover{background:var(--sur2)}
.path-unit-left{display:flex;align-items:center;gap:14px}
.path-unit-ic{font-size:28px}
.path-unit-t{font-family:var(--disp);font-weight:600;font-size:15px;color:var(--t1)}
.path-unit-desc{font-size:12px;color:var(--t3);margin-top:2px}
.path-unit-right{display:flex;align-items:center;gap:10px}
.path-unit-pct{font-weight:600;font-size:13px;color:var(--olive)}
.path-lessons{border-top:1px solid var(--bdr);padding:8px 12px}
.path-lesson{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:var(--radius-sm);transition:background .2s ease}
.path-lesson:hover{background:var(--sur2)}
.path-lesson.complete{background:rgba(197,163,71,.06)}
.path-lesson-left{display:flex;align-items:center;gap:12px}
.path-lesson-num{width:28px;height:28px;border-radius:50%;background:var(--sur2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--t2)}
.path-lesson.complete .path-lesson-num{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%);color:#fff;box-shadow:0 2px 6px rgba(197,163,71,.2)}
.path-lesson-name{font-size:14px;font-weight:500;color:var(--t1)}
.path-lesson-meta{font-size:11px;color:var(--t3);margin-top:1px}
.path-lesson-badge{font-size:13px;font-weight:500;color:var(--t2)}
.path-back{background:none;border:none;color:var(--olive);font-weight:500;cursor:pointer;padding:4px 0;margin-bottom:14px;font-size:14px;transition:opacity .2s ease}
.path-back:hover{text-decoration:underline;opacity:.8}
.path-lesson-hdr{margin-bottom:18px}
.path-lesson-t{font-family:var(--disp);font-size:21px;font-weight:600;color:var(--t1)}
.path-lesson-prog{font-size:13px;color:var(--t3);margin:4px 0 8px}

/* ── Grammar Box (in lessons) ── */
.path-grammar{background:linear-gradient(135deg,rgba(197,163,71,.1),rgba(197,163,71,.03));border:1px solid rgba(197,163,71,.2);border-radius:var(--radius-md);padding:18px;margin-bottom:22px;box-shadow:var(--shadow-xs)}
.path-grammar-t{font-weight:600;font-size:13px;color:var(--olive);margin-bottom:7px}
.path-grammar-body{font-size:13px;color:var(--t2);line-height:1.65}

/* ── Path Cards (old) ── */
.path-words{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.path-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);overflow:hidden;transition:all .2s ease;box-shadow:var(--shadow-xs)}
.path-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px)}
.path-card.done{border-color:var(--olive);background:rgba(197,163,71,.03)}
.path-card-inner{padding:16px;cursor:pointer;min-height:100px}
.path-card-front{display:flex;align-items:center;gap:10px}
.path-card.flip .path-card-front{display:none}
.path-card-back{display:none}
.path-card.flip .path-card-back{display:block}
.path-card-ej{font-size:24px}
.path-card-th{font-family:var(--thai);font-size:20px;font-weight:500;color:var(--t1);flex:1}
.path-card-ph{font-size:14px;color:var(--olive);margin-bottom:4px}
.path-card-en{font-size:15px;color:var(--t1);font-weight:500}
.path-card-ex{margin-top:10px;padding-top:8px;border-top:1px solid var(--bdr)}
.path-speak{background:none;border:none;cursor:pointer;padding:4px;color:var(--t3);border-radius:4px;transition:color .2s ease}
.path-speak:hover{color:var(--olive)}
.path-mark{width:100%;padding:9px;border:none;border-top:1px solid var(--bdr);background:var(--sur2);font-size:12px;font-weight:500;color:var(--t2);cursor:pointer;transition:all .2s ease}
.path-mark:hover{background:rgba(197,163,71,.1);color:var(--olive)}
.path-mark.on{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%);color:#fff}

/* ── Script Cards (old) ── */
.script-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.script-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);overflow:hidden;transition:all .2s ease;box-shadow:var(--shadow-xs)}
.script-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px)}
.script-card.done{border-color:var(--olive);background:rgba(197,163,71,.03)}
.script-card-inner{padding:18px 16px;cursor:pointer;min-height:120px}
.script-card-front{display:flex;align-items:center;gap:14px}
.script-card.flip .script-card-front{display:none}
.script-card-back{display:none}
.script-card.flip .script-card-back{display:block}
.script-char{font-family:var(--thai);font-size:44px;font-weight:500;color:var(--t1);line-height:1.1;text-shadow:0 2px 4px rgba(0,0,0,.06)}
.script-name{font-size:13px;color:var(--t2);margin-bottom:2px}
.script-phonetic{font-size:16px;font-weight:500;color:var(--olive)}
.script-class{display:inline-block;font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding:3px 9px;border-radius:20px;margin-top:4px}
.script-class.mid{background:#e8eaf6;color:#3949ab}
.script-class.high{background:#fce4ec;color:#c62828}
.script-class.low{background:#fff3e0;color:#e65100}
.script-class.short{background:#e0f7fa;color:#00838f}
.script-class.long{background:#f3e5f5;color:#7b1fa2}
.script-class.mark{background:#fff8e1;color:#f57f17}
.script-class.practice{background:var(--olive-soft);color:var(--olive)}
.script-mnemonic{font-size:12.5px;color:var(--t2);line-height:1.5;margin-top:10px;padding-top:8px;border-top:1px solid var(--bdr)}
.script-speak{background:none;border:none;cursor:pointer;padding:4px;color:var(--t3);border-radius:4px;transition:color .2s ease}
.script-speak:hover{color:var(--olive)}

/* ── Script Unit Badge ── */
.path-unit.script-unit{border-left:3px solid #7986cb}
.path-unit.script-unit .path-unit-t{color:#3949ab}
.path-lesson.script-lesson .path-lesson-num{background:#e8eaf6;color:#3949ab}
.path-lesson.script-lesson.complete .path-lesson-num{background:linear-gradient(135deg,#3949ab,#283593);color:#fff;box-shadow:0 2px 6px rgba(57,73,171,.2)}

/* ══════════════════════════════════════════════════
   Continue Learning Banner
   ══════════════════════════════════════════════════ */
.continue-card{background:linear-gradient(135deg,rgba(197,163,71,.12) 0%,rgba(197,163,71,.04) 100%);border:1.5px solid rgba(197,163,71,.25);border-radius:var(--radius-lg);padding:20px 24px;margin-bottom:28px;cursor:pointer;transition:all .25s ease;box-shadow:0 2px 12px rgba(197,163,71,.08);position:relative;overflow:hidden}
.continue-card::after{content:"→";position:absolute;right:24px;top:50%;transform:translateY(-50%);font-size:22px;color:var(--olive);opacity:.4;transition:all .25s ease}
.continue-card:hover{border-color:var(--olive);box-shadow:0 6px 24px rgba(197,163,71,.15);transform:translateY(-1px)}
.continue-card:hover::after{opacity:.7;right:20px}
.continue-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.continue-label{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--olive)}
.continue-pct{font-size:14px;font-weight:600;color:var(--olive)}
.continue-title{font-family:var(--disp);font-size:17px;font-weight:600;color:var(--t1);margin-bottom:4px}
.continue-sub{font-size:12px;color:var(--t3)}
.continue-bar{height:6px;background:rgba(197,163,71,.12);border-radius:4px;overflow:hidden;margin-top:12px}
.continue-fill{height:100%;background:linear-gradient(90deg,var(--olive) 0%,var(--olive-mid) 100%);border-radius:4px;transition:width .4s ease-out}

/* ── Streak Badge ── */
.streak-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:linear-gradient(135deg,var(--walnut-soft) 0%,rgba(230,245,243,.6) 100%);border:1px solid rgba(10,138,122,.2);color:var(--walnut);margin-left:10px;vertical-align:middle}

/* ── Quick Review ── */
.quick-review-btn{display:block;width:100%;padding:14px;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;border:1.5px dashed var(--olive-mid);background:linear-gradient(135deg,rgba(197,163,71,.06) 0%,rgba(197,163,71,.02) 100%);color:var(--olive);margin-bottom:20px;transition:all .2s ease;font-family:var(--body);text-align:center}
.quick-review-btn:hover{border-style:solid;background:rgba(197,163,71,.1);box-shadow:var(--shadow-sm)}
.quick-review-wrap{margin-bottom:24px;background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-lg);padding:24px;box-shadow:var(--shadow-md)}
.quick-review-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.quick-review-title{font-family:var(--disp);font-size:15px;font-weight:600;color:var(--t1)}
.quick-review-close{background:none;border:none;cursor:pointer;color:var(--t3);font-size:20px;padding:4px 8px;border-radius:6px;line-height:1;transition:all .15s ease}
.quick-review-close:hover{color:var(--t1);background:var(--sur2)}

/* ══════════════════════════════════════════════════
   My Path Grid (flat unit cards)
   ══════════════════════════════════════════════════ */
.path-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-top:10px}
.path-unit-card{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-lg);padding:20px 22px;cursor:pointer;transition:all .25s ease;box-shadow:var(--shadow-sm);position:relative;overflow:hidden}
.path-unit-card::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--olive) 0%,var(--olive-mid) 100%);opacity:0;transition:opacity .25s ease}
.path-unit-card:hover{border-color:var(--olive-mid);box-shadow:var(--shadow-hover);transform:translateY(-2px)}
.path-unit-card:hover::before{opacity:1}
.path-unit-card.complete{border-color:var(--olive);background:rgba(197,163,71,.02)}
.path-unit-card.complete::before{opacity:1}
.path-unit-card.script{border-left:3px solid #7986cb}
.path-unit-card.script::before{background:linear-gradient(90deg,#7986cb 0%,#9fa8da 100%)}
.path-uc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.path-uc-icon{font-size:30px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:var(--sur2);border-radius:var(--radius-md);box-shadow:var(--shadow-xs)}
.path-uc-pct{font-size:14px;font-weight:700;color:var(--olive)}
.path-uc-title{font-family:var(--disp);font-size:15.5px;font-weight:600;color:var(--t1);margin-bottom:4px}
.path-unit-card.script .path-uc-title{color:#3949ab}
.path-uc-desc{font-size:12px;color:var(--t3);line-height:1.45;margin-bottom:8px}
.path-uc-meta{font-size:11px;color:var(--t3);font-weight:500}

/* ══════════════════════════════════════════════════
   Unit Page
   ══════════════════════════════════════════════════ */
.unit-header{margin-bottom:24px;padding-bottom:18px;border-bottom:1px solid var(--bdr)}
.unit-header-top{display:flex;align-items:center;gap:16px;margin-bottom:12px}
.unit-header-icon{font-size:36px;width:52px;height:52px;display:flex;align-items:center;justify-content:center;background:var(--sur2);border-radius:var(--radius-md);box-shadow:var(--shadow-xs)}
.unit-header-title{font-family:var(--disp);font-size:24px;font-weight:600;color:var(--t1);letter-spacing:-.01em}
.unit-header-desc{font-size:12.5px;color:var(--t3);margin-top:3px}
.unit-header-prog{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;font-size:12.5px;color:var(--t3)}
.unit-header-pct{font-weight:700;color:var(--olive);font-size:14px}

/* ── Lesson Tabs (pill-style) ── */
.unit-tabs{display:flex;gap:6px;margin-bottom:28px;padding:4px;background:var(--sur2);border-radius:var(--radius-md);overflow-x:auto;-webkit-overflow-scrolling:touch}
.unit-tab{padding:10px 18px;font-size:13px;font-weight:500;cursor:pointer;border:none;background:none;color:var(--t3);border-radius:var(--radius-sm);transition:all .2s ease;white-space:nowrap;display:flex;align-items:center;gap:7px}
.unit-tab:hover{color:var(--t1);background:rgba(255,255,255,.6)}
.unit-tab.on{color:var(--olive-dark);background:var(--sur);box-shadow:var(--shadow-sm);font-weight:600}
.unit-tab-badge{font-size:10px;opacity:.65}

/* ── Unit Sections (accordion) ── */
.unit-section{margin-bottom:8px;border:1px solid var(--bdr);border-radius:var(--radius-md);overflow:hidden;background:var(--sur);box-shadow:var(--shadow-xs)}
.unit-section-hdr{font-family:var(--disp);font-size:15px;font-weight:600;color:var(--t1);padding:13px 16px;border:none;border-bottom:1px solid transparent;background:none;width:100%;text-align:left;display:flex;align-items:center;gap:8px;cursor:pointer;transition:background .15s ease}
.unit-section-hdr:hover{background:var(--sur2)}
.unit-section-hdr[aria-expanded="true"]{border-bottom-color:var(--bdr)}
.unit-section-chev{margin-left:auto;font-size:11px;color:var(--t3);flex-shrink:0;transition:transform .2s ease}
.unit-section-body{padding:16px}
.unit-practice-block{margin-bottom:22px}
.unit-practice-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);margin-bottom:12px}
.unit-lesson-content{margin-top:8px;display:flex;flex-direction:column;gap:0}

/* ══════════════════════════════════════════════════
   Vocab Table
   ══════════════════════════════════════════════════ */
.vtable{width:100%;font-size:13px}
.vtable-hdr{display:flex;align-items:center;gap:8px;padding:10px 14px;background:linear-gradient(135deg,var(--sur2) 0%,#eceae6 100%);border-radius:var(--radius-md) var(--radius-md) 0 0;border:1px solid var(--bdr);border-bottom:none;font-size:10.5px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em}
.vtable-row{display:flex;align-items:center;gap:8px;padding:11px 14px;border:1px solid var(--bdr);border-top:none;background:var(--sur);transition:all .15s}
.vtable-row:nth-child(even){background:rgba(248,247,245,.6)}
.vtable-row:last-child{border-radius:0 0 var(--radius-md) var(--radius-md)}
.vtable-row:hover{background:var(--olive-soft)}
.vtable-row.done{background:rgba(197,163,71,.06);border-left:2px solid var(--olive)}
.vtable-col-ej{width:26px;text-align:center;flex-shrink:0}
.vtable-col-th{min-width:100px;display:flex;align-items:center;gap:7px}
.vtable-col-ph{min-width:120px;color:var(--t3);font-style:italic;font-size:12px}
.vtable-col-en{flex:1;color:var(--t2)}
.vtable-col-act{width:34px;flex-shrink:0;text-align:center}
.vtable-thai{font-family:var(--thai);font-weight:500;font-size:15px}
.vtable-speak{background:none;border:none;cursor:pointer;padding:3px;color:var(--t3);display:flex;align-items:center;transition:color .2s ease}
.vtable-speak:hover{color:var(--olive)}
.vtable-mark{width:28px;height:28px;border-radius:50%;border:1.5px solid var(--bdr);background:var(--sur);cursor:pointer;font-size:12px;color:var(--t3);display:flex;align-items:center;justify-content:center;transition:all .2s ease}
.vtable-mark:hover{border-color:var(--olive);color:var(--olive);box-shadow:0 0 0 3px rgba(197,163,71,.1)}
.vtable-mark.on{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%);border-color:var(--olive);color:#fff;box-shadow:0 2px 6px rgba(197,163,71,.2)}

/* ══════════════════════════════════════════════════
   Script Cards (romanized-first)
   ══════════════════════════════════════════════════ */
.scards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.scard{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);overflow:hidden;transition:all .25s ease;box-shadow:var(--shadow-sm)}
.scard:hover{border-color:var(--olive-mid);box-shadow:var(--shadow-md);transform:translateY(-1px)}
.scard.done{border-color:var(--olive);background:rgba(197,163,71,.03)}
.scard-main{display:flex;align-items:center;justify-content:space-between;padding:18px;cursor:pointer;gap:14px}
.scard-left{flex:1}
.scard-sound{font-size:24px;font-weight:600;color:var(--olive);margin-bottom:3px}
.scard-name{font-size:12px;color:var(--t2);margin-bottom:5px}
.scard-right{display:flex;align-items:center;gap:10px}
.scard-thai{font-family:var(--thai);font-size:34px;color:var(--t3);opacity:.5;text-shadow:0 1px 3px rgba(0,0,0,.04)}
.scard-speak{background:none;border:none;cursor:pointer;padding:5px;color:var(--t3);transition:all .2s ease;border-radius:6px}
.scard-speak:hover{color:var(--olive);background:var(--sur2)}
.scard-expand{padding:0 18px 14px;border-top:1px solid var(--bdr);animation:fadeUp .25s ease}
.scard-mnemonic{font-size:12.5px;color:var(--t2);line-height:1.55;padding-top:12px}
.scard-mark{width:auto!important;height:auto!important;border-radius:0!important;border:none!important;border-top:1px solid var(--bdr)!important;padding:9px!important;font-size:12px!important;font-weight:500;cursor:pointer;background:var(--sur2);color:var(--t2);transition:all .2s ease;text-align:center;display:block!important;width:100%!important}
.scard-mark:hover{background:rgba(197,163,71,.1);color:var(--olive)}
.scard-mark.on{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%)!important;color:#fff!important;border-color:var(--olive)!important}

/* ══════════════════════════════════════════════════
   Grammar Learn
   ══════════════════════════════════════════════════ */
.glearn{display:flex;flex-direction:column;gap:16px}
.glearn-card{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);padding:20px;box-shadow:var(--shadow-sm);transition:box-shadow .2s ease}
.glearn-card:hover{box-shadow:var(--shadow-md)}
.glearn-hdr{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.glearn-ic{font-size:17px}
.glearn-title{font-family:var(--disp);font-size:15px;font-weight:600;color:var(--t1)}
.glearn-formula{font-size:13px;font-weight:500;color:var(--olive);background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.6) 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-sm);padding:9px 14px;margin-bottom:12px}
.glearn-summary{font-size:13px;color:var(--t2);line-height:1.65;margin-bottom:12px}
.glearn-examples{display:flex;flex-direction:column;gap:7px;margin-bottom:12px}
.glearn-ex{background:var(--sur2);border-radius:var(--radius-sm);padding:10px 14px}
.glearn-ex-th{font-family:var(--thai);font-size:15px;margin-bottom:1px}
.glearn-ex-ph{font-size:11px;color:var(--t3);font-style:italic;margin-bottom:1px}
.glearn-ex-en{font-size:12px;color:var(--t2)}
.glearn-note{font-size:11.5px;color:var(--olive-dark);background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.6) 100%);border-left:3px solid var(--olive);border-radius:0 var(--radius-sm) var(--radius-sm) 0;padding:10px 13px;margin-bottom:12px}
.glearn-why{background:var(--sur2);border-radius:var(--radius-sm);padding:14px 16px;border-left:3px solid var(--olive)}
.glearn-why-t{font-size:11px;font-weight:700;color:var(--olive);margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em}
.glearn-why-body{font-size:12.5px;color:var(--t2);line-height:1.7}

/* ══════════════════════════════════════════════════
   Conversation Section (inline in unit)
   ══════════════════════════════════════════════════ */
.conv-sec{max-width:600px}
.conv-sec-goal{font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.55}

/* ══════════════════════════════════════════════════
   Word Bank Builder
   ══════════════════════════════════════════════════ */
.wbank{max-width:560px}
.wbank-english{font-family:var(--disp);font-size:21px;font-weight:500;color:var(--t1);margin-bottom:7px}
.wbank-hint{font-size:12px;color:var(--t3);font-style:italic;margin-bottom:18px}
.wbank-build{min-height:56px;background:var(--sur);border:2px dashed var(--bdr);border-radius:var(--radius-md);padding:12px 16px;display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin-bottom:16px;transition:all .25s ease;box-shadow:inset 0 2px 4px rgba(0,0,0,.03)}
.wbank-build.correct{border-color:var(--olive);border-style:solid;background:rgba(197,163,71,.04);box-shadow:0 0 0 3px rgba(197,163,71,.08)}
.wbank-build.wrong{border-color:var(--walnut);border-style:solid;background:rgba(10,138,122,.04);box-shadow:0 0 0 3px rgba(10,138,122,.08)}
.wbank-placeholder{font-size:13px;color:var(--t3);font-style:italic}
.wbank-chip{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 16px;border-radius:var(--radius-sm);cursor:pointer;border:1.5px solid var(--bdr);background:var(--sur);color:var(--t1);transition:all .2s ease;font-weight:500;box-shadow:var(--shadow-xs)}
.wbank-chip-thai{font-family:var(--thai);font-size:15px;line-height:1.3}
.wbank-chip-ph{font-family:var(--body);font-size:10px;color:var(--t3);font-style:italic;font-weight:400;line-height:1.2}
.wbank-chip:hover:not(:disabled){border-color:var(--olive);color:var(--olive);background:var(--olive-soft);box-shadow:var(--shadow-sm)}
.wbank-chip.placed{background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.7) 100%);border-color:var(--olive-mid);color:var(--olive-dark)}
.wbank-chip.used{opacity:.25;cursor:default;box-shadow:none}
.wbank-pool{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:6px}
.wbank-result{padding:16px 18px;border-radius:var(--radius-md);margin-top:16px}
.wbank-result.ok{background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.6) 100%);border:1px solid var(--olive-mid);color:var(--olive-dark)}
.wbank-result.no{background:linear-gradient(135deg,var(--walnut-soft) 0%,rgba(230,245,243,.6) 100%);border:1px solid #c9967a;color:#6d3a1a}
.wbank-answer{font-family:var(--thai);font-size:21px;margin:7px 0 3px}
.wbank-phonetics{font-size:12px;font-style:italic;opacity:.8;margin-bottom:7px}
.wbank-tip{font-size:12px;margin-top:7px;opacity:.85;line-height:1.5}

/* ══════════════════════════════════════════════════
   Conversation 3-Step Flow
   ══════════════════════════════════════════════════ */
.conv-steps{display:flex;gap:6px;margin-bottom:12px}
.conv-step{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--radius-sm);font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--sur);color:var(--t3);transition:all .2s ease}
.conv-step:hover{border-color:var(--olive);color:var(--olive)}
.conv-step.on{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%);border-color:var(--olive);color:#fff;box-shadow:0 2px 6px rgba(197,163,71,.2)}
.conv-step-num{width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}
.conv-step.on .conv-step-num{background:rgba(255,255,255,.2)}
.conv-step-desc{font-size:11.5px;color:var(--t3);margin-bottom:14px;font-style:italic}
.conv-speak{background:none;border:none;cursor:pointer;font-size:14px;padding:2px 5px;margin-left:8px;border-radius:4px;transition:all .15s ease}
.conv-speak:hover{background:rgba(197,163,71,.1)}

/* ══════════════════════════════════════════════════
   Matching Game
   ══════════════════════════════════════════════════ */
.match-game{max-width:600px;margin:0 auto}
.match-score{font-size:12px;color:var(--t3);text-align:center;margin-bottom:16px}
.match-cols{display:flex;gap:20px;justify-content:center}
.match-col{display:flex;flex-direction:column;gap:10px;flex:1;max-width:240px}
.match-card{padding:16px;border-radius:var(--radius-md);border:1.5px solid var(--bdr);background:var(--sur);cursor:pointer;text-align:center;font-size:15px;font-weight:500;transition:all .2s ease;box-shadow:var(--shadow-xs);min-height:52px;display:flex;align-items:center;justify-content:center}
.match-card:hover:not(.matched):not(.wrong){border-color:var(--olive);box-shadow:var(--shadow-sm);transform:translateY(-1px)}
.match-card.selected{border-color:var(--olive);background:var(--olive-soft);box-shadow:0 0 0 3px rgba(197,163,71,.15)}
.match-card.matched{border-color:var(--olive);background:rgba(197,163,71,.1);opacity:.6;cursor:default}
.match-card.wrong{border-color:var(--walnut);background:var(--walnut-soft);animation:shake .4s ease}
.match-card .match-thai{font-family:var(--thai);font-size:18px}
.match-card .match-ph{font-size:10px;color:var(--t3);font-style:italic;margin-top:2px}
.match-new{margin-top:20px;text-align:center}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}

/* ══════════════════════════════════════════════════
   Tone Drills
   ══════════════════════════════════════════════════ */
.tone-drill{max-width:480px;margin:0 auto}
.tone-score{font-size:12px;color:var(--t3);text-align:center;margin-bottom:16px}
.tone-q{background:linear-gradient(145deg,#ffffff 0%,#faf9f7 100%);border:1px solid var(--bdr);border-radius:var(--radius-lg);padding:32px;text-align:center;box-shadow:var(--shadow-md);margin-bottom:20px}
.tone-prompt{font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;font-weight:600}
.tone-target{font-family:var(--disp);font-size:28px;font-weight:500;color:var(--t1);margin-bottom:20px}
.tone-opts{display:flex;gap:16px;justify-content:center}
.tone-opt{padding:18px 28px;border-radius:var(--radius-md);border:1.5px solid var(--bdr);background:var(--sur);cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-sm);text-align:center;min-width:120px;font-family:var(--thai);font-size:28px;font-weight:500}
.tone-opt:hover:not(.correct):not(.wrong){border-color:var(--olive);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.tone-opt.correct{border-color:var(--olive);background:var(--olive-soft);box-shadow:0 0 0 3px rgba(197,163,71,.15)}
.tone-opt.wrong{border-color:var(--walnut);background:var(--walnut-soft)}
.tone-feedback{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:16px;margin-top:16px;box-shadow:var(--shadow-xs)}

/* ══════════════════════════════════════════════════
   Reading Practice
   ══════════════════════════════════════════════════ */
.reading{max-width:640px}
.reading-levels{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap}
.reading-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:20px;margin-bottom:14px;box-shadow:var(--shadow-sm)}
.reading-title{font-family:var(--disp);font-size:15px;font-weight:600;color:var(--t1);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.reading-body{font-family:var(--thai);font-size:22px;line-height:2;letter-spacing:.02em;position:relative}
.reading-word{cursor:pointer;padding:2px 4px;border-radius:4px;transition:background .15s ease;position:relative;display:inline-block}
.reading-word:hover{background:var(--olive-soft)}
.reading-word.active{background:var(--olive-soft);box-shadow:0 0 0 2px rgba(197,163,71,.2)}
.reading-tip{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:var(--act);color:#fff;padding:6px 12px;border-radius:var(--radius-sm);font-size:11px;font-family:var(--body);white-space:nowrap;z-index:10;box-shadow:var(--shadow-md);pointer-events:none;margin-bottom:4px}
.reading-tip::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:var(--act)}
.reading-en{font-family:var(--body);font-size:13px;color:var(--t2);margin-top:10px;padding-top:10px;border-top:1px solid var(--bdr);line-height:1.55}
.reading-reveal{margin-top:10px}
.reading-ph{font-family:var(--body);font-size:10px;color:var(--t3);font-style:italic}

/* ══════════════════════════════════════════════════
   Classifier Table
   ══════════════════════════════════════════════════ */
.clf-table{max-width:680px}
.clf-intro{font-size:13px;color:var(--t2);line-height:1.65;margin-bottom:20px;padding:14px 16px;background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.6) 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-md)}
.clf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.clf-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:14px 16px;box-shadow:var(--shadow-xs);transition:all .2s ease}
.clf-card:hover{box-shadow:var(--shadow-sm);transform:translateY(-1px)}
.clf-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.clf-emoji{font-size:18px}
.clf-main{display:flex;align-items:baseline;gap:8px;flex:1}
.clf-thai{font-family:var(--thai);font-size:22px;font-weight:500}
.clf-ph{font-size:12px;color:var(--t3);font-style:italic}
.clf-use{font-size:12px;color:var(--t2);margin-bottom:4px;line-height:1.45}
.clf-ex{font-size:11px;color:var(--t3);font-style:italic}

/* ══════════════════════════════════════════════════
   Daily Session
   ══════════════════════════════════════════════════ */
.ds-wrap{padding:36px 44px;max-width:720px}
.ds-launch-btn{display:block;width:100%;padding:16px;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;border:2px solid var(--olive);background:linear-gradient(135deg,rgba(197,163,71,.08) 0%,rgba(197,163,71,.02) 100%);color:var(--olive);margin-bottom:20px;transition:all .25s ease;font-family:var(--body);text-align:center}
.ds-launch-btn:hover{background:rgba(197,163,71,.15);box-shadow:0 4px 16px rgba(197,163,71,.15);transform:translateY(-1px)}
.ds-ready{text-align:center;padding:48px 32px}
.ds-ready-icon{font-size:48px;margin-bottom:16px}
.ds-ready-title{font-family:var(--disp);font-size:24px;font-weight:600;margin-bottom:8px}
.ds-ready-desc{font-size:13px;color:var(--t2);margin-bottom:24px;line-height:1.6}
.ds-ready-steps{display:flex;gap:12px;justify-content:center;margin-bottom:28px}
.ds-ready-step{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:var(--radius-sm);background:var(--sur2);font-size:12px;color:var(--t2)}
.ds-timer-bar{height:4px;background:var(--sur2);border-radius:4px;overflow:hidden;margin-bottom:16px}
.ds-timer-fill{height:100%;background:linear-gradient(90deg,var(--olive) 0%,var(--walnut) 100%);border-radius:4px;transition:width 1s linear}
.ds-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.ds-time{font-family:var(--disp);font-size:18px;font-weight:600;color:var(--t1)}
.ds-steps{display:flex;gap:6px;margin-bottom:20px}
.ds-step{padding:8px 16px;border-radius:var(--radius-sm);font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--sur);color:var(--t3);transition:all .2s ease}
.ds-step.on{background:linear-gradient(135deg,var(--olive) 0%,var(--olive-dark) 100%);border-color:var(--olive);color:#fff}
.ds-step.done{color:var(--olive);border-color:var(--olive-mid)}
.ds-content{min-height:300px}
.ds-step-label{font-size:12px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:16px;text-align:center}
.ds-done{text-align:center;padding:48px 32px}
.ds-done-icon{font-size:48px;margin-bottom:16px}
.ds-done-title{font-family:var(--disp);font-size:24px;font-weight:600;margin-bottom:8px}
.ds-done-desc{font-size:14px;color:var(--t2);margin-bottom:24px}

/* Confidence indicators */
.fc-conf{position:absolute;top:8px;right:12px;font-size:11px;font-weight:500;letter-spacing:0.03em}
.fc-conf-summary{font-size:11px;color:#3d8b37}
.conf-summary{display:flex;gap:16px;justify-content:center;padding:8px 0 4px;font-size:12px;font-weight:500}
.conf-dot{display:inline-flex;align-items:center;gap:3px}
.vtable-conf{display:block;font-size:10px;line-height:1;margin-top:2px;letter-spacing:1px}

/* Cultural Notes */
.culture-notes{display:flex;flex-direction:column;gap:14px}
.culture-note{background:linear-gradient(135deg,var(--walnut-soft) 0%,rgba(230,245,243,.5) 100%);border:1px solid rgba(10,138,122,.2);border-left:3px solid var(--walnut);border-radius:0 var(--radius-md) var(--radius-md) 0;padding:16px 18px;box-shadow:var(--shadow-xs)}
.culture-note-title{font-family:var(--disp);font-size:14px;font-weight:600;color:var(--walnut);margin-bottom:6px}
.culture-note-body{font-size:12.5px;color:var(--t2);line-height:1.7}

/* Pronunciation Guide */
.pron-guide{max-width:480px;width:100%;margin:14px auto 0;background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:14px 16px;box-shadow:var(--shadow-xs);animation:fadeUp .25s ease}
.pron-label{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;font-weight:600}
.pron-syllables{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;justify-content:center}
.pron-syl{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 14px;border-radius:var(--radius-sm);border:1.5px solid var(--bdr);background:var(--sur2);cursor:pointer;transition:all .2s ease;min-width:60px}
.pron-syl:hover{border-color:var(--olive);background:var(--olive-soft);box-shadow:var(--shadow-sm)}
.pron-syl.active{border-color:var(--olive);background:var(--olive-soft);box-shadow:0 0 0 3px rgba(197,163,71,.12);transform:scale(1.05)}
.pron-syl-thai{font-family:var(--thai);font-size:18px;font-weight:500;line-height:1.3}
.pron-syl-ph{font-size:12px;color:var(--t2);font-style:italic}
.pron-syl-tone{font-size:10px;font-weight:600;letter-spacing:.03em}
.pron-controls{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.pron-btn{padding:6px 14px;border-radius:var(--radius-sm);font-size:11.5px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--sur);color:var(--t2);transition:all .2s ease;box-shadow:var(--shadow-xs)}
.pron-btn:hover{border-color:var(--olive);color:var(--olive);box-shadow:var(--shadow-sm)}

/* ══════════════════════════════════════════════════
   Role-Play Conversation Mode
   ══════════════════════════════════════════════════ */
.rp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.rp-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:18px 20px;cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-xs);text-align:left;width:100%;font-family:var(--body)}
.rp-card:hover{border-color:var(--olive-mid);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.rp-card.completed{border-color:var(--olive);background:linear-gradient(135deg,rgba(251,246,232,.4) 0%,var(--sur) 100%)}
.rp-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.rp-card-title{font-family:var(--disp);font-size:14px;font-weight:500;color:var(--t1)}
.rp-card-badge{font-size:11px;color:var(--olive);font-weight:500;white-space:nowrap}
.rp-card-goal{font-size:12px;color:var(--t2);line-height:1.5;margin-bottom:8px}
.rp-card-meta{display:flex;gap:14px;font-size:11px;color:var(--t3)}

/* Role-Play Container */
.rp-container{max-width:640px;margin:0 auto}
.rp-header{display:flex;align-items:center;gap:14px;margin-bottom:20px}
.rp-header-title{font-family:var(--disp);font-size:16px;font-weight:500;color:var(--t2)}

/* Intro Screen */
.rp-intro{text-align:center;padding:32px 24px}
.rp-intro-icon{font-size:48px;margin-bottom:14px}
.rp-intro-title{font-family:var(--disp);font-size:22px;font-weight:600;margin-bottom:8px}
.rp-intro-goal{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:16px;max-width:420px;margin-left:auto;margin-right:auto}
.rp-intro-info{display:flex;gap:16px;justify-content:center;margin-bottom:14px;font-size:12px;color:var(--t3)}
.rp-intro-tip{font-size:11.5px;color:var(--t3);font-style:italic;line-height:1.5;max-width:380px;margin:0 auto;padding:10px 14px;background:var(--sur2);border-radius:var(--radius-sm);border:1px solid var(--bdr)}

/* Progress Bar */
.rp-prog-label{font-size:11px;color:var(--t3);margin-bottom:6px;text-align:center;font-weight:500}
.rp-prog{background:var(--sur2);border-radius:20px;height:6px;margin-bottom:24px;overflow:hidden;border:1px solid var(--bdr)}
.rp-prog-fill{height:100%;background:linear-gradient(90deg,var(--olive) 0%,var(--olive-dark) 100%);border-radius:20px;transition:width .4s ease}

/* Turn Display */
.rp-turn{animation:fadeUp .3s ease}
.rp-role{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;padding:4px 12px;border-radius:20px;display:inline-block}
.rp-role.teacher{background:var(--sur2);color:var(--t3)}
.rp-role.you{background:var(--olive-soft);color:var(--olive)}
.rp-prompt{font-size:14px;color:var(--t2);line-height:1.55}

/* Teacher Bubble */
.rp-teacher-bub{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:18px 20px;box-shadow:var(--shadow-sm)}
.rp-thai{font-family:var(--thai);font-size:18px;font-weight:500;color:var(--olive);margin-top:10px;display:flex;align-items:center;gap:4px}

/* User Input */
.rp-prompt-card{background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.5) 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-md);padding:18px 20px;margin-bottom:6px}
.rp-input-area{margin-top:12px}
.rp-input{width:100%;padding:14px 16px;border:2px solid var(--bdr);border-radius:var(--radius-sm);font-size:16px;font-family:var(--thai);background:var(--sur);color:var(--t1);transition:border-color .2s ease,box-shadow .2s ease}
.rp-input:focus{border-color:var(--olive);box-shadow:0 0 0 3px rgba(197,163,71,.1);outline:none}
.rp-input::placeholder{color:var(--t3);font-family:var(--body);font-size:13px}

/* Feedback */
.rp-fb{border-radius:var(--radius-md);padding:16px 20px;margin-top:14px;animation:fadeUp .25s ease}
.rp-fb.perfect{background:#e8f5e9;border:1px solid #a5d6a7}
.rp-fb.close{background:#fff8e1;border:1px solid #ffe082}
.rp-fb.wrong{background:#fce4ec;border:1px solid #ef9a9a}
.rp-fb-icon{font-size:15px;font-weight:600;margin-bottom:8px}
.rp-fb-detail{font-size:13px;color:var(--t2);margin-bottom:4px}
.rp-fb-expected{font-size:13px;color:var(--t2);margin-bottom:8px}
.rp-fb-actions{display:flex;gap:8px;margin-top:12px}

/* Summary */
.rp-summary{text-align:center;padding:24px 0}
.rp-stars{font-size:36px;margin-bottom:8px}
.rp-score-big{font-family:var(--disp);font-size:52px;font-weight:600;color:var(--olive);line-height:1.1}
.rp-score-label{font-size:14px;color:var(--t2);margin-top:8px;margin-bottom:28px}
.rp-breakdown{text-align:left;max-width:500px;margin:0 auto}
.rp-breakdown h3{font-family:var(--disp);font-size:15px;font-weight:600;margin-bottom:12px;color:var(--t1)}
.rp-breakdown-row{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:8px;box-shadow:var(--shadow-xs)}
.rp-breakdown-row.perfect{border-left:3px solid #66bb6a}
.rp-breakdown-row.close{border-left:3px solid #ffa726}
.rp-breakdown-row.wrong{border-left:3px solid #ef5350}
.rp-breakdown-prompt{font-size:12px;color:var(--t3);margin-bottom:6px}
.rp-breakdown-detail{display:flex;flex-direction:column;gap:2px;font-size:12.5px;margin-bottom:4px}
.rp-breakdown-yours{color:var(--t1)}
.rp-breakdown-expected{color:var(--t3);font-style:italic}
.rp-breakdown-score{font-size:11px;font-weight:600;color:var(--t2)}

@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

/* ══════════════════════════════════════════════════
   Sidebar XP Widget & Badge
   ══════════════════════════════════════════════════ */
.sb-xp-widget{margin:0 14px 8px;padding:10px 12px;background:rgba(197,163,71,.12);border-radius:var(--radius-sm);border:1px solid rgba(197,163,71,.15)}
.sb-xp-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.sb-streak{font-size:13px;font-weight:600;color:var(--sb-active-txt)}
.sb-level{font-size:10px;color:var(--sb-t2);font-weight:500}
.sb-xp-bar{height:4px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden}
.sb-xp-fill{height:100%;background:linear-gradient(90deg,var(--olive) 0%,#D4BA6E 100%);border-radius:4px;transition:width .5s ease}
.sb-xp-label{font-size:9px;color:var(--sb-t3);margin-top:4px;text-align:center}
.sb-badge{margin-left:auto;background:var(--walnut);color:#fff;font-size:9px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 5px;flex-shrink:0}

/* ══════════════════════════════════════════════════
   SRS Review Page
   ══════════════════════════════════════════════════ */
.srs-empty{text-align:center;padding:40px 20px;max-width:440px;margin:0 auto}
.srs-empty-icon{font-size:56px;margin-bottom:14px}
.srs-empty h3{font-family:var(--disp);font-size:18px;margin-bottom:8px}
.srs-empty p{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:20px}

.srs-stats-bar{display:flex;gap:14px;margin-bottom:24px;flex-wrap:wrap}
.srs-stat{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-sm);padding:12px 18px;text-align:center;flex:1;min-width:80px;box-shadow:var(--shadow-xs)}
.srs-stat-num{font-family:var(--disp);font-size:22px;font-weight:600;color:var(--olive)}
.srs-stat-lbl{font-size:10px;color:var(--t3);margin-top:2px;text-transform:uppercase;letter-spacing:.08em}

.srs-done{text-align:center;padding:40px 20px}
.srs-done-icon{font-size:48px;margin-bottom:10px}
.srs-done h3{font-family:var(--disp);font-size:18px;margin-bottom:8px}
.srs-done p{font-size:13px;color:var(--t2)}

.srs-card-area{max-width:420px;margin:0 auto;text-align:center}
.srs-card{background:var(--sur);border:2px solid var(--bdr);border-radius:var(--radius-lg);padding:36px 28px;cursor:pointer;transition:all .3s ease;box-shadow:var(--shadow-md);min-height:220px;display:flex;align-items:center;justify-content:center}
.srs-card:hover{box-shadow:var(--shadow-hover);transform:translateY(-2px)}
.srs-front,.srs-back{display:flex;flex-direction:column;align-items:center;gap:8px}
.srs-emoji{font-size:42px}
.srs-english{font-family:var(--disp);font-size:22px;font-weight:500;color:var(--t1)}
.srs-cat{font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em}
.srs-tap-hint{font-size:11px;color:var(--t3);font-style:italic;margin-top:12px}
.srs-thai-big{font-family:var(--thai);font-size:36px;font-weight:600;color:var(--olive)}
.srs-phon{font-size:14px;color:var(--t2);font-style:italic}
.srs-english-sm{font-size:14px;color:var(--t2);margin-top:4px}

.srs-grades{display:flex;gap:8px;margin-top:20px;justify-content:center;flex-wrap:wrap}
.srs-grade{display:flex;align-items:center;gap:6px;padding:10px 18px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--bdr);background:var(--sur);transition:all .2s ease;box-shadow:var(--shadow-xs)}
.srs-grade:hover{transform:translateY(-1px);box-shadow:var(--shadow-sm)}
.srs-grade.wrong:hover{border-color:#ef5350;background:#fce4ec}
.srs-grade.hard:hover{border-color:#ffa726;background:#fff8e1}
.srs-grade.good:hover{border-color:#66bb6a;background:#e8f5e9}
.srs-grade.easy:hover{border-color:var(--olive);background:var(--olive-soft)}

/* ══════════════════════════════════════════════════
   Mistake Journal
   ══════════════════════════════════════════════════ */
.mj-stats{display:flex;gap:14px;margin-bottom:18px;flex-wrap:wrap}
.mj-stat{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-sm);padding:10px 16px;text-align:center;box-shadow:var(--shadow-xs)}
.mj-stat-num{font-family:var(--disp);font-size:18px;font-weight:600;color:var(--olive);display:block}
.mj-stat-lbl{font-size:10px;color:var(--t3)}

.mj-filters{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap;align-items:center}
.mj-filter{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--sur);color:var(--t2);transition:all .2s ease}
.mj-filter:hover{border-color:var(--olive);color:var(--olive)}
.mj-filter.on{background:var(--olive);color:#fff;border-color:var(--olive)}

.mj-empty{text-align:center;padding:40px 20px}
.mj-empty-icon{font-size:48px;margin-bottom:10px}
.mj-empty h3{font-family:var(--disp);font-size:16px;margin-bottom:6px}
.mj-empty p{font-size:13px;color:var(--t2);max-width:380px;margin:0 auto}

.mj-list{display:flex;flex-direction:column;gap:10px}
.mj-card{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);padding:16px 20px;box-shadow:var(--shadow-xs);transition:all .2s ease}
.mj-card.reviewed{opacity:.6;border-left:3px solid var(--olive)}
.mj-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.mj-card-source{font-size:11px;font-weight:500;color:var(--olive);background:var(--olive-soft);padding:2px 8px;border-radius:10px}
.mj-card-date{font-size:10px;color:var(--t3)}
.mj-card-prompt{font-size:14px;font-weight:500;color:var(--t1);margin-bottom:8px}
.mj-card-answers{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
.mj-lbl{font-size:11px;color:var(--t3);margin-right:4px}
.mj-wrong{font-size:13px;color:#c62828;font-weight:500}
.mj-right{font-family:var(--thai);font-size:14px;color:var(--olive);font-weight:500}
.mj-card-actions{display:flex;gap:8px}

/* ══════════════════════════════════════════════════
   Writing Practice
   ══════════════════════════════════════════════════ */
.wr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.wr-level-card{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);padding:22px;cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-xs);text-align:left;width:100%;font-family:var(--body)}
.wr-level-card:hover{border-color:var(--olive-mid);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.wr-level-title{font-family:var(--disp);font-size:15px;font-weight:600;margin-bottom:5px;color:var(--t1)}
.wr-level-desc{font-size:12px;color:var(--t2);margin-bottom:8px;line-height:1.5}
.wr-level-count{font-size:11px;color:var(--t3)}

.wr-container{max-width:520px;margin:0 auto}
.wr-prompt-card{background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.5) 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-md);padding:24px;text-align:center;margin-bottom:20px}
.wr-prompt-label{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--t3);margin-bottom:8px}
.wr-prompt-text{font-family:var(--disp);font-size:20px;font-weight:500;color:var(--t1)}
.wr-hint{font-size:12px;color:var(--olive);font-style:italic;margin-top:10px;padding:6px 12px;background:rgba(197,163,71,.08);border-radius:var(--radius-sm)}

.wr-input-area{text-align:center}
.wr-input{width:100%;padding:16px 18px;border:2px solid var(--bdr);border-radius:var(--radius-sm);font-size:22px;font-family:var(--thai);background:var(--sur);color:var(--t1);text-align:center;transition:border-color .2s ease}
.wr-input:focus{border-color:var(--olive);outline:none;box-shadow:0 0 0 3px rgba(197,163,71,.1)}

.wr-result{border-radius:var(--radius-md);padding:20px;text-align:center;animation:fadeUp .25s ease}
.wr-result.correct{background:#e8f5e9;border:1px solid #a5d6a7}
.wr-result.wrong{background:#fce4ec;border:1px solid #ef9a9a}
.wr-result-icon{font-size:16px;font-weight:600;margin-bottom:8px}
.wr-result-answer{font-family:var(--thai);font-size:28px;font-weight:500;color:var(--olive)}
.wr-result-yours{font-size:13px;color:var(--t2);margin-bottom:4px}
.wr-result-correct{font-size:13px;color:var(--t2)}

.wr-done{text-align:center;padding:40px 20px}
.wr-done-icon{font-size:48px;margin-bottom:10px}
.wr-done-score{font-family:var(--disp);font-size:28px;font-weight:600;color:var(--olive);margin-bottom:8px}
.wr-done-msg{font-size:14px;color:var(--t2)}

/* ══════════════════════════════════════════════════
   Contextual Scenes
   ══════════════════════════════════════════════════ */
.sc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.sc-scene-card{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);padding:22px;cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-xs);text-align:center;width:100%;font-family:var(--body)}
.sc-scene-card:hover{border-color:var(--olive-mid);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.sc-scene-emoji{font-size:42px;margin-bottom:8px}
.sc-scene-title{font-family:var(--disp);font-size:15px;font-weight:600;margin-bottom:4px}
.sc-scene-desc{font-size:12px;color:var(--t2);margin-bottom:8px}
.sc-scene-count{font-size:11px;color:var(--t3)}

.sc-progress{font-size:12px;color:var(--t2);margin-bottom:16px;text-align:center}
.sc-area{position:relative;width:100%;height:360px;border-radius:var(--radius-lg);border:2px solid var(--bdr);box-shadow:var(--shadow-sm);overflow:hidden;margin-bottom:20px}
.sc-item{position:absolute;transform:translate(-50%,-50%);background:var(--sur);border:2px solid var(--bdr);border-radius:50%;width:52px;height:52px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-sm);padding:0}
.sc-item:hover{transform:translate(-50%,-50%) scale(1.2);box-shadow:var(--shadow-md);border-color:var(--olive)}
.sc-item.active{border-color:var(--olive);background:var(--olive-soft);box-shadow:0 0 0 4px rgba(197,163,71,.15)}
.sc-item.learned{border-color:var(--olive-mid)}
.sc-item-emoji{font-size:22px}
.sc-item-check{position:absolute;bottom:-2px;right:-2px;font-size:10px;background:var(--olive);color:#fff;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center}

.sc-detail{background:var(--sur);border:1.5px solid var(--olive-mid);border-radius:var(--radius-md);padding:18px;text-align:center;margin-bottom:16px;animation:fadeUp .2s ease;display:flex;align-items:center;gap:16px;justify-content:center;flex-wrap:wrap}
.sc-detail-emoji{font-size:32px}
.sc-detail-thai{font-family:var(--thai);font-size:22px;font-weight:600;color:var(--olive)}
.sc-detail-phon{font-size:13px;color:var(--t2);font-style:italic}
.sc-detail-eng{font-size:13px;color:var(--t1)}

.sc-phrases-section{margin-top:12px}
.sc-phrases{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.sc-phrase{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-sm);padding:12px 16px;box-shadow:var(--shadow-xs)}
.sc-phrase-thai{font-family:var(--thai);font-size:16px;color:var(--olive);font-weight:500;display:flex;align-items:center;gap:4px}
.sc-phrase-phon{font-size:12px;color:var(--t3);font-style:italic;margin-top:2px}
.sc-phrase-eng{font-size:12px;color:var(--t2);margin-top:2px}

/* ══════════════════════════════════════════════════
   Pronunciation Practice
   ══════════════════════════════════════════════════ */
.pron-no-support{text-align:center;padding:40px 20px;max-width:400px;margin:0 auto}
.pron-no-support h3{font-family:var(--disp);font-size:16px;margin-bottom:8px}
.pron-no-support p{font-size:13px;color:var(--t2);line-height:1.6}

.pron-cats{display:flex;gap:10px;align-items:center;margin-bottom:20px;flex-wrap:wrap}
.pron-cat-select{padding:7px 12px;border:1px solid var(--bdr);border-radius:var(--radius-sm);font-size:12px;background:var(--sur);color:var(--t1);font-family:var(--body)}
.pron-cat-count{font-size:11px;color:var(--t3)}
.pron-session-score{font-size:12px;color:var(--olive);font-weight:500;margin-left:auto}

.pron-card{max-width:400px;margin:0 auto 24px;background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-lg);padding:28px;text-align:center;box-shadow:var(--shadow-sm)}
.pron-card-emoji{font-size:42px;margin-bottom:8px}
.pron-card-thai{font-family:var(--thai);font-size:32px;font-weight:600;color:var(--olive);margin-bottom:4px}
.pron-card-phon{font-size:14px;color:var(--t2);font-style:italic;margin-bottom:4px}
.pron-card-eng{font-size:14px;color:var(--t1);margin-bottom:14px}
.pron-listen-row{display:flex;gap:8px;justify-content:center}

.pron-mic-area{text-align:center;margin-bottom:20px}
.pron-mic{width:72px;height:72px;border-radius:50%;border:3px solid var(--bdr);background:var(--sur);cursor:pointer;font-size:30px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;transition:all .3s ease;box-shadow:var(--shadow-md)}
.pron-mic:hover{border-color:var(--olive);box-shadow:var(--shadow-hover)}
.pron-mic.listening{border-color:#ef5350;background:rgba(239,83,80,.08);animation:pulse 1.5s infinite}
.pron-mic-label{font-size:12px;color:var(--t3)}

@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(239,83,80,.3)}50%{box-shadow:0 0 0 12px rgba(239,83,80,0)}}

.pron-result{max-width:400px;margin:0 auto 20px;border-radius:var(--radius-md);padding:16px 20px;text-align:center;animation:fadeUp .25s ease}
.pron-result.good{background:#e8f5e9;border:1px solid #a5d6a7}
.pron-result.close{background:#fff8e1;border:1px solid #ffe082}
.pron-result.wrong{background:#fce4ec;border:1px solid #ef9a9a}
.pron-result.no-speech{background:var(--sur2);border:1px solid var(--bdr)}
.pron-result-icon{font-size:15px;font-weight:600;margin-bottom:6px}
.pron-result-heard{font-size:13px;color:var(--t2);margin-bottom:3px}
.pron-result-expected{font-size:13px;color:var(--t2)}

.pron-nav{display:flex;align-items:center;gap:14px;justify-content:center;margin-top:16px}
.pron-nav-count{font-size:12px;color:var(--t3)}

/* ══════════════════════════════════════════════════
   Analytics Dashboard
   ══════════════════════════════════════════════════ */
.an-overview{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:28px}
.an-card{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);padding:18px;text-align:center;box-shadow:var(--shadow-xs)}
.an-card-icon{font-size:24px;margin-bottom:6px}
.an-card-val{font-family:var(--disp);font-size:22px;font-weight:600;color:var(--olive)}
.an-card-lbl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-top:2px}

.an-section{margin-bottom:28px}
.an-section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.an-section-title{font-family:var(--disp);font-size:15px;font-weight:600;color:var(--t1);margin-bottom:12px}
.an-section-head .an-section-title{margin-bottom:0}

.an-today{max-width:400px}
.an-today-bar{height:10px;background:var(--sur2);border-radius:10px;overflow:hidden;border:1px solid var(--bdr)}
.an-today-fill{height:100%;background:linear-gradient(90deg,var(--olive) 0%,#D4BA6E 100%);border-radius:10px;transition:width .5s ease}
.an-today-label{font-size:12px;color:var(--t2);margin-top:6px}

.an-range-btns{display:flex;gap:4px}
.an-range-btn{padding:4px 10px;border-radius:var(--radius-sm);font-size:11px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--sur);color:var(--t3);transition:all .2s ease}
.an-range-btn.on{background:var(--olive);color:#fff;border-color:var(--olive)}

.an-chart{display:flex;align-items:flex-end;gap:3px;height:120px;background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:14px 10px 24px;box-shadow:var(--shadow-xs)}
.an-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%}
.an-bar-wrap{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center}
.an-bar{width:70%;max-width:20px;background:var(--olive-mid);border-radius:3px 3px 0 0;min-height:2px;transition:height .3s ease}
.an-bar.goal-met{background:var(--olive)}
.an-bar-date{font-size:8px;color:var(--t3);margin-top:4px;white-space:nowrap}

.an-srs-row{display:flex;gap:14px;flex-wrap:wrap}
.an-srs-item{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-sm);padding:12px 18px;text-align:center;flex:1;min-width:80px}
.an-srs-num{font-family:var(--disp);font-size:20px;font-weight:600;color:var(--olive);display:block}
.an-srs-lbl{font-size:10px;color:var(--t3)}

.an-conf-dist{display:flex;flex-direction:column;gap:8px;max-width:500px}
.an-conf-item{display:flex;align-items:center;gap:10px}
.an-conf-lbl{font-size:12px;color:var(--t2);width:70px;flex-shrink:0}
.an-conf-bar-wrap{flex:1;height:8px;background:var(--sur2);border-radius:4px;overflow:hidden;border:1px solid var(--bdr)}
.an-conf-bar{height:100%;border-radius:4px;transition:width .5s ease}
.an-conf-count{font-size:11px;color:var(--t3);width:70px;flex-shrink:0;text-align:right}

.an-cats{display:flex;flex-direction:column;gap:6px;max-width:600px}
.an-cat-row{display:flex;align-items:center;gap:10px}
.an-cat-name{font-size:12px;color:var(--t2);width:100px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.an-cat-bar-wrap{flex:1;height:8px;background:var(--sur2);border-radius:4px;overflow:hidden;border:1px solid var(--bdr)}
.an-cat-bar{height:100%;background:var(--olive);border-radius:4px;transition:width .5s ease}
.an-cat-nums{font-size:11px;color:var(--t3);width:50px;flex-shrink:0;text-align:right}

.an-mistakes-summary{font-size:13px;color:var(--t2);background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-sm);padding:12px 16px}

/* ══════════════════════════════════════════════════
   Sentence Builder
   ══════════════════════════════════════════════════ */
.snb-week-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.snb-week-card{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);padding:22px;cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-xs);text-align:left;width:100%;font-family:var(--body)}
.snb-week-card:hover{border-color:var(--olive-mid);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.snb-week-num{font-family:var(--disp);font-size:16px;font-weight:600;color:var(--t1);margin-bottom:4px}
.snb-week-count{font-size:12px;color:var(--olive);font-weight:500;margin-bottom:6px}
.snb-week-patterns{font-size:11px;color:var(--t3);line-height:1.5}

.snb-container{max-width:560px;margin:0 auto}
.snb-prompt-card{background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.5) 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-md);padding:24px;text-align:center;margin-bottom:20px}
.snb-prompt-label{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--t3);margin-bottom:8px}
.snb-prompt-text{font-family:var(--disp);font-size:20px;font-weight:500;color:var(--t1)}
.snb-hint{font-size:12px;color:var(--olive);font-style:italic;margin-top:10px;padding:8px 12px;background:rgba(197,163,71,.08);border-radius:var(--radius-sm);line-height:1.5}

.snb-placed{min-height:64px;border:2px dashed var(--bdr);border-radius:var(--radius-md);padding:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;margin-bottom:14px;transition:all .2s ease;background:var(--sur)}
.snb-placed.empty{background:var(--sur2)}
.snb-placed.correct{border-color:#66bb6a;background:#e8f5e9}
.snb-placed.wrong{border-color:#ef5350;background:#fce4ec}
.snb-placed-hint{font-size:13px;color:var(--t3);font-style:italic}

.snb-pool{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:20px;min-height:48px;padding:12px;border:1px solid var(--bdr);border-radius:var(--radius-md);background:var(--sur2)}

.snb-word{padding:8px 16px;border-radius:var(--radius-sm);border:1.5px solid var(--olive-mid);background:var(--sur);cursor:grab;transition:all .15s ease;display:flex;flex-direction:column;align-items:center;gap:2px;font-family:var(--body);user-select:none;touch-action:manipulation}
.snb-word:hover{border-color:var(--olive);box-shadow:var(--shadow-sm);transform:translateY(-1px)}
.snb-word:active{cursor:grabbing;transform:scale(.95)}
.snb-word.placed{border-color:var(--olive);background:var(--olive-soft)}
.snb-word.dragging{opacity:.4}
.snb-word-thai{font-family:var(--thai);font-size:16px;font-weight:500;color:var(--olive-dark)}
.snb-word-phon{font-size:10px;color:var(--t3);font-style:italic}

.snb-result{border-radius:var(--radius-md);padding:18px;text-align:center;margin-bottom:14px;animation:fadeUp .25s ease}
.snb-result.correct{background:#e8f5e9;border:1px solid #a5d6a7}
.snb-result.wrong{background:#fce4ec;border:1px solid #ef9a9a}
.snb-result-icon{font-size:16px;font-weight:600;margin-bottom:6px}
.snb-result-thai{font-family:var(--thai);font-size:22px;font-weight:500;color:var(--olive);margin-bottom:4px}
.snb-result-phon{font-size:13px;color:var(--t2);font-style:italic;margin-bottom:8px}
.snb-result-yours{font-size:13px;color:var(--t2);margin-bottom:6px}
.snb-result-correct{font-size:13px;color:var(--t2)}

.snb-actions{display:flex;gap:10px;justify-content:center;margin-bottom:10px}

.snb-done{text-align:center;padding:40px 20px}
.snb-done-icon{font-size:48px;margin-bottom:10px}
.snb-done-score{font-family:var(--disp);font-size:28px;font-weight:600;color:var(--olive);margin-bottom:8px}
.snb-done-msg{font-size:14px;color:var(--t2)}

/* ══════════════════════════════════════════════════
   Daily Challenge
   ══════════════════════════════════════════════════ */
.dc-container{max-width:480px;margin:0 auto}
.dc-streak-bar{display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,rgba(197,163,71,.08) 0%,rgba(197,163,71,.04) 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-md);padding:12px 18px;margin-bottom:24px}
.dc-streak-icon{font-size:22px}
.dc-streak-num{font-family:var(--disp);font-size:18px;font-weight:600;color:var(--olive)}
.dc-streak-label{font-size:12px;color:var(--t3)}

.dc-word-card{background:var(--sur);border:2px solid var(--bdr);border-radius:var(--radius-lg);padding:32px 24px;text-align:center;box-shadow:var(--shadow-md);margin-bottom:24px}
.dc-word-label{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--t3);margin-bottom:4px}
.dc-word-date{font-size:12px;color:var(--olive);font-weight:500;margin-bottom:16px}
.dc-word-emoji{font-size:48px;margin-bottom:8px}
.dc-word-thai{font-family:var(--thai);font-size:36px;font-weight:600;color:var(--olive);margin-bottom:6px}
.dc-word-phon{font-size:14px;color:var(--t2);font-style:italic;margin-bottom:4px}
.dc-word-english{font-family:var(--disp);font-size:18px;font-weight:500;color:var(--t1);margin-bottom:6px;animation:fadeUp .2s ease}
.dc-word-cat{font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em}

.dc-example{margin-top:18px;padding-top:16px;border-top:1px solid var(--bdr);text-align:left}
.dc-example-label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--t3);margin-bottom:6px}
.dc-example-thai{font-family:var(--thai);font-size:15px;color:var(--olive);font-weight:500}
.dc-example-phon{font-size:12px;color:var(--t3);font-style:italic;margin-top:2px}
.dc-example-eng{font-size:12px;color:var(--t2);margin-top:2px}

.dc-quiz{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-xs)}
.dc-quiz-label{font-family:var(--disp);font-size:14px;font-weight:500;margin-bottom:16px;color:var(--t1);text-align:center}
.dc-quiz-options{display:flex;flex-direction:column;gap:8px}
.dc-quiz-opt{padding:12px 16px;border:1.5px solid var(--bdr);border-radius:var(--radius-sm);background:var(--sur);font-size:14px;cursor:pointer;transition:all .2s ease;text-align:left;font-family:var(--body);color:var(--t1)}
.dc-quiz-opt:hover:not(:disabled){border-color:var(--olive);background:var(--olive-soft)}
.dc-quiz-opt.correct{border-color:#66bb6a;background:#e8f5e9;font-weight:600}
.dc-quiz-opt.wrong{border-color:#ef5350;background:#fce4ec}

.dc-quiz-result{margin-top:14px;padding:10px;border-radius:var(--radius-sm);text-align:center;font-size:14px;font-weight:500;animation:fadeUp .2s ease}
.dc-quiz-result.correct{background:#e8f5e9;color:#2e7d32}
.dc-quiz-result.wrong{background:#fce4ec;color:#c62828}

.dc-completed{text-align:center;padding:30px 20px;background:var(--sur);border:1.5px solid var(--olive-mid);border-radius:var(--radius-md);box-shadow:var(--shadow-xs)}
.dc-completed-icon{font-size:42px;margin-bottom:8px}
.dc-completed-msg{font-family:var(--disp);font-size:16px;font-weight:500;color:var(--olive);margin-bottom:4px}
.dc-completed-sub{font-size:12px;color:var(--t3)}

/* ══════════════════════════════════════════════════
   AI Conversation Partner
   ══════════════════════════════════════════════════ */
.aic-setup{max-width:440px;margin:0 auto;text-align:center}
.aic-setup-icon{font-size:48px;margin-bottom:12px}
.aic-setup-text{font-size:13px;color:var(--t2);line-height:1.7;text-align:left;white-space:pre-line;margin-bottom:20px;background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);padding:18px}
.aic-key-input-row{display:flex;gap:8px}
.aic-key-input{flex:1;padding:10px 14px;border:1.5px solid var(--bdr);border-radius:var(--radius-sm);font-size:13px;font-family:monospace;background:var(--sur);color:var(--t1)}
.aic-key-input:focus{border-color:var(--olive);outline:none}
.aic-error{margin-top:10px;padding:8px 12px;background:#fce4ec;border:1px solid #ef9a9a;border-radius:var(--radius-sm);color:#c62828;font-size:12px}

.aic-scenarios{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
.aic-scenario-card{background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--radius-md);padding:22px;cursor:pointer;transition:all .2s ease;box-shadow:var(--shadow-xs);text-align:center;width:100%;font-family:var(--body)}
.aic-scenario-card:hover{border-color:var(--olive-mid);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.aic-scenario-emoji{font-size:36px;margin-bottom:8px}
.aic-scenario-title{font-family:var(--disp);font-size:15px;font-weight:600;margin-bottom:4px}
.aic-scenario-desc{font-size:12px;color:var(--t2)}

.aic-page{display:flex;flex-direction:column;height:calc(100vh - 40px);padding-bottom:0 !important}
.aic-chat-header{margin-bottom:14px;flex-shrink:0}
.aic-chat-title{font-family:var(--disp);font-size:18px;font-weight:600;margin-top:8px}
.aic-chat-desc{font-size:12px;color:var(--t3)}

.aic-chat-messages{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding:8px 0 16px;min-height:0}
.aic-msg{display:flex}
.aic-msg.user{justify-content:flex-end}
.aic-msg.assistant{justify-content:flex-start}
.aic-msg-bubble{max-width:80%;padding:12px 16px;border-radius:var(--radius-md);font-size:14px;line-height:1.6;position:relative;word-break:break-word}
.aic-msg.assistant .aic-msg-bubble{background:var(--sur);border:1px solid var(--bdr);color:var(--t1);border-bottom-left-radius:4px}
.aic-msg.user .aic-msg-bubble{background:var(--olive);color:#fff;border-bottom-right-radius:4px}
.aic-speak-btn{background:none;border:none;cursor:pointer;font-size:14px;margin-left:6px;opacity:.7;transition:opacity .2s}
.aic-speak-btn:hover{opacity:1}

.aic-typing span{display:inline-block;width:6px;height:6px;background:var(--t3);border-radius:50%;margin:0 2px;animation:typingDot 1.2s infinite}
.aic-typing span:nth-child(2){animation-delay:.2s}
.aic-typing span:nth-child(3){animation-delay:.4s}
@keyframes typingDot{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}

.aic-input-bar{display:flex;gap:8px;padding:12px 0;border-top:1px solid var(--bdr);flex-shrink:0}
.aic-input{flex:1;padding:12px 16px;border:1.5px solid var(--bdr);border-radius:var(--radius-md);font-size:15px;font-family:var(--thai);background:var(--sur);color:var(--t1)}
.aic-input:focus{border-color:var(--olive);outline:none;box-shadow:0 0 0 3px rgba(197,163,71,.1)}

.aic-corrections{margin-top:8px;padding:12px 16px;background:var(--sur);border:1px solid var(--olive-mid);border-radius:var(--radius-md);flex-shrink:0;max-height:140px;overflow-y:auto}
.aic-corrections-title{font-size:12px;font-weight:600;color:var(--olive);margin-bottom:8px}
.aic-correction-item{font-size:12px;margin-bottom:6px;padding:4px 0;border-bottom:1px solid var(--bdr)}
.aic-correction-you{color:var(--t3);display:block}
.aic-correction-fix{color:var(--olive);font-weight:500;display:block;margin-top:2px}

/* ── Handwriting Practice ── */
.hw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.hw-set-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-lg);padding:24px;cursor:pointer;text-align:center;transition:all .2s ease}
.hw-set-card:hover{box-shadow:var(--shadow-hover);transform:translateY(-2px)}
.hw-set-chars{font-family:var(--thai);font-size:28px;letter-spacing:6px;margin-bottom:12px;color:var(--olive)}
.hw-set-title{font-family:var(--disp);font-size:17px;font-weight:500;margin-bottom:6px}
.hw-set-desc{font-size:12px;color:var(--t3);margin-bottom:8px}
.hw-set-count{font-size:11px;color:var(--t3);font-weight:500}
.hw-container{max-width:480px;margin:0 auto}
.hw-char-info{text-align:center;margin-bottom:16px}
.hw-target-char{font-family:var(--thai);font-size:72px;line-height:1.1}
.hw-char-name{font-size:13px;color:var(--t2);margin-top:4px}
.hw-char-phonetic{font-size:14px;color:var(--olive);font-weight:500;margin-top:2px}
.hw-hint{background:var(--olive-soft);border:1px solid var(--olive-mid);border-radius:var(--radius-sm);padding:10px 14px;font-size:12px;color:var(--olive-dark);margin-bottom:16px;text-align:center}
.hw-canvas-wrapper{position:relative;width:300px;height:300px;margin:0 auto 16px;border:2px solid var(--bdr);border-radius:var(--radius-md);background:var(--sur);overflow:hidden;touch-action:none}
.hw-guide-canvas{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}
.hw-draw-canvas{position:absolute;top:0;left:0;width:100%;height:100%;cursor:crosshair;z-index:1}
.hw-controls{display:flex;gap:8px;align-items:center;justify-content:center;margin-bottom:12px;flex-wrap:wrap}
.hw-toggle{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--t2);cursor:pointer;margin-right:8px}
.hw-toggle input{accent-color:var(--olive)}
.hw-feedback{display:flex;align-items:center;gap:8px;padding:12px 16px;border-radius:var(--radius-md);font-size:13px;margin-bottom:12px}
.hw-feedback.good{background:var(--olive-soft);border:1px solid var(--olive-mid);color:var(--olive-dark)}
.hw-feedback.try-again{background:var(--walnut-soft);border:1px solid #c9967a;color:#7a4a2a}
.hw-fb-icon{font-size:18px}
.hw-nav{display:flex;gap:10px;justify-content:center}
@media(max-width:820px){
  .hw-canvas-wrapper{width:260px;height:260px}
  .hw-target-char{font-size:56px}
}

/* ── Story Mode ── */
.st-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.st-story-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-lg);padding:24px;cursor:pointer;text-align:center;transition:all .2s ease}
.st-story-card:hover{box-shadow:var(--shadow-hover);transform:translateY(-2px)}
.st-story-emoji{font-size:40px;margin-bottom:8px}
.st-story-title{font-family:var(--thai);font-size:20px;font-weight:500;margin-bottom:4px}
.st-story-title-en{font-family:var(--disp);font-size:14px;color:var(--t2);margin-bottom:8px}
.st-story-desc{font-size:12px;color:var(--t3);margin-bottom:10px}
.st-story-meta{display:flex;gap:10px;justify-content:center;align-items:center;font-size:11px;color:var(--t3)}
.st-level{padding:2px 8px;border-radius:10px;font-weight:600;font-size:10px;border:1px solid}
.rp-card-level{font-size:9.5px;padding:2px 8px;border-radius:10px;font-weight:600;border:1px solid;margin-left:8px;white-space:nowrap}
.sc-scene-meta{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--t3);margin-top:6px}
.sc-scene-level{font-size:9.5px;padding:2px 8px;border-radius:10px;font-weight:600;border:1px solid;white-space:nowrap}
.path-uc-level{font-size:9px;padding:2px 7px;border-radius:10px;font-weight:600;border:1px solid;margin-left:6px;white-space:nowrap;vertical-align:middle}
.st-reader{max-width:560px;margin:0 auto}
.st-sentence-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-lg);padding:28px;margin:16px 0;box-shadow:var(--shadow-sm)}
.st-thai-line{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:16px;line-height:2}
.st-word{font-family:var(--thai);font-size:26px;padding:4px 8px;border:1.5px solid transparent;border-radius:var(--radius-sm);cursor:pointer;background:none;color:var(--t1);transition:all .15s ease}
.st-word:hover{background:var(--olive-soft);border-color:var(--olive-mid)}
.st-word.active{background:var(--olive-soft);border-color:var(--olive);color:var(--olive-dark)}
.st-word-detail{background:linear-gradient(135deg,var(--olive-soft) 0%,rgba(251,246,232,.5) 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-md);padding:14px;text-align:center;margin-bottom:14px;animation:fadeUp .2s ease}
.st-word-thai{font-family:var(--thai);font-size:28px;font-weight:500}
.st-word-phon{font-size:13px;color:var(--olive);font-style:italic;margin:4px 0}
.st-word-eng{font-size:15px;font-weight:500;color:var(--t1)}
.st-word-actions{display:flex;gap:8px;justify-content:center;margin-top:8px}
.st-sentence-audio{display:flex;gap:8px;justify-content:center;margin-bottom:12px}
.st-toggles{display:flex;gap:8px;justify-content:center;margin-bottom:10px}
.st-toggle-btn{font-size:11px;padding:5px 12px;border:1px solid var(--bdr);border-radius:14px;background:var(--sur2);color:var(--t2);cursor:pointer;transition:all .15s ease}
.st-toggle-btn:hover{border-color:var(--olive-mid)}
.st-toggle-btn.on{background:var(--olive-soft);border-color:var(--olive);color:var(--olive-dark)}
.st-phonetic{text-align:center;font-size:14px;color:var(--olive);font-style:italic;margin-bottom:6px}
.st-english{text-align:center;font-size:14px;color:var(--t2);font-style:italic}
.st-nav{display:flex;gap:10px;justify-content:center;margin:16px 0}
.st-overview{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:12px}
.st-overview-dot{width:28px;height:28px;border-radius:50%;border:1.5px solid var(--bdr);background:var(--sur);font-size:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t3);transition:all .15s ease}
.st-overview-dot:hover{border-color:var(--olive)}
.st-overview-dot.current{background:var(--olive);color:#fff;border-color:var(--olive)}
.st-overview-dot.read{background:var(--olive-soft);border-color:var(--olive-mid);color:var(--olive-dark)}
.st-quiz-container{max-width:520px;margin:0 auto}
.st-quiz-question{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-lg);padding:24px;text-align:center;margin:16px 0}
.st-quiz-q-thai{font-family:var(--thai);font-size:22px;margin-bottom:6px}
.st-quiz-q-en{font-size:13px;color:var(--t3);font-style:italic;margin-bottom:8px}
.st-quiz-options{display:grid;gap:10px}
.st-quiz-opt{padding:14px 18px;border:1.5px solid var(--bdr);border-radius:var(--radius-md);background:var(--sur);font-family:var(--thai);font-size:18px;cursor:pointer;text-align:left;transition:all .15s ease}
.st-quiz-opt:hover:not(:disabled){border-color:var(--olive);background:var(--olive-soft)}
.st-quiz-opt.correct{background:var(--olive-soft);border-color:var(--olive);color:var(--olive-dark)}
.st-quiz-opt.wrong{background:var(--walnut-soft);border-color:#c9967a;color:#7a4a2a}
.st-quiz-done{text-align:center;padding:40px 20px}
.st-quiz-done-icon{font-size:48px;margin-bottom:12px}
.st-quiz-done-score{font-family:var(--disp);font-size:24px;font-weight:500;margin-bottom:8px}
.st-quiz-done-msg{font-size:14px;color:var(--t2)}
@media(max-width:820px){
  .st-word{font-size:22px}
  .st-quiz-q-thai{font-size:18px}
  .st-quiz-opt{font-size:16px}
}

/* ── My Path Revamp ── */
.mp-hero{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,var(--olive-soft) 0%,#F5F3EE 100%);border:1px solid var(--olive-mid);border-radius:var(--radius-xl);padding:28px 32px;margin-bottom:20px}
.mp-greeting{font-family:var(--disp);font-size:22px;font-weight:500;color:var(--t1);margin-bottom:4px}
.mp-level{font-size:13px;color:var(--olive-dark);font-weight:500}
.mp-stats{display:flex;gap:24px}
.mp-stat{text-align:center}
.mp-stat-val{font-family:var(--disp);font-size:24px;font-weight:600;color:var(--olive-dark)}
.mp-stat-lbl{font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.06em}
.mp-xp-bar{margin-bottom:24px}
.mp-xp-label{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--t2);margin-bottom:6px}
.mp-xp-done{color:var(--olive-dark);font-weight:600}
.mp-xp-next{font-size:11px;color:var(--t3);margin-top:4px}
.mp-section{margin-bottom:24px}
.mp-section-title{font-family:var(--disp);font-size:17px;font-weight:500;color:var(--t1);margin-bottom:6px}
.mp-section-sub{font-size:12px;color:var(--t3);margin-bottom:10px}
.mp-quick-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.mp-quick-card{display:flex;flex-direction:column;align-items:center;gap:4px;padding:18px 12px;background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-lg);cursor:pointer;transition:all .2s ease;text-align:center}
.mp-quick-card:hover{border-color:var(--olive);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.mp-quick-emoji{font-size:24px}
.mp-quick-label{font-size:13px;font-weight:500;color:var(--t1)}
.mp-quick-sub{font-size:11px;color:var(--t3)}
.mp-weak-list{display:flex;flex-direction:column;gap:8px}
.mp-weak-item{display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md)}
.mp-weak-cat{font-size:13px;font-weight:500;color:var(--t1);min-width:100px;text-transform:capitalize}
.mp-weak-bar-wrap{flex:1;display:flex;align-items:center;gap:8px}
.mp-weak-bar{flex:1;height:6px;background:var(--sur2);border-radius:3px;overflow:hidden}
.mp-weak-fill{height:100%;border-radius:3px;transition:width .3s ease}
.mp-weak-pct{font-size:12px;color:var(--t3);min-width:32px;text-align:right}
.mp-paths-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
.mp-path-card{display:flex;flex-direction:column;align-items:center;gap:4px;padding:20px 14px;background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-lg);cursor:pointer;transition:all .2s ease;text-align:center}
.mp-path-card:hover{border-color:var(--olive);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.mp-path-emoji{font-size:28px}
.mp-path-title{font-family:var(--disp);font-size:15px;font-weight:500;color:var(--t1)}
.mp-path-desc{font-size:11px;color:var(--t3);line-height:1.4}
.mp-curriculum-toggle{display:flex;align-items:center;gap:10px;width:100%;padding:14px 18px;background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-md);cursor:pointer;font-family:var(--disp);font-size:15px;font-weight:500;color:var(--t1);transition:all .15s ease}
.mp-curriculum-toggle:hover{border-color:var(--olive);background:var(--olive-soft)}
.mp-curriculum-meta{font-family:var(--body);font-size:12px;color:var(--t3);font-weight:400}
.mp-curriculum-chev{margin-left:auto;font-size:11px;color:var(--t3)}
@media(max-width:700px){
  .mp-hero{flex-direction:column;gap:12px;padding:16px;text-align:center}
  .mp-hero-left .mp-greeting{font-size:18px}
  .mp-stats{justify-content:center;gap:16px}
  .mp-stat-val{font-size:20px}
  .mp-quick-grid{grid-template-columns:repeat(2,1fr)}
  .mp-paths-grid{grid-template-columns:repeat(2,1fr)}
  .mp-weak-cat{min-width:70px;font-size:12px}
}

/* ══════════════════════════════════════════════════
   Listening Dictation Page
   ══════════════════════════════════════════════════ */
.ld-controls{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:16px}
.ld-mode-toggle{display:flex;gap:4px}
.ld-score{font-size:13px;font-weight:600;color:var(--olive);margin-left:auto}
.ld-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius);padding:24px;text-align:center;box-shadow:var(--shadow-sm);max-width:520px;margin:0 auto}
.ld-emoji{font-size:48px;margin-bottom:8px}
.ld-hint{font-size:13px;color:var(--t3);margin-bottom:16px}
.ld-play-area{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:20px}
.ld-play-btn{background:var(--olive);color:#fff;border:none;border-radius:var(--radius-sm);padding:12px 24px;font-size:16px;cursor:pointer;font-weight:600;transition:background .15s}
.ld-play-btn:hover{background:var(--walnut)}
.ld-speed-toggle{display:flex;gap:4px}
.ld-input-area{display:flex;flex-direction:column;align-items:center;gap:8px}
.ld-btn-row{display:flex;gap:8px;margin-top:8px}
.ld-answer-reveal{margin-top:16px;padding:12px;background:rgba(197,163,71,.08);border-radius:var(--radius-sm)}
.ld-answer-thai{font-size:24px;font-weight:600;color:var(--t1);font-family:var(--disp)}
.ld-answer-phon{font-size:13px;color:var(--t3);margin-top:4px}
.ld-result{margin-top:16px;padding:14px;border-radius:var(--radius-sm);text-align:center}
.ld-result.correct{background:rgba(102,187,106,.12);border:1px solid rgba(102,187,106,.3)}
.ld-result.close{background:rgba(255,167,38,.12);border:1px solid rgba(255,167,38,.3)}
.ld-result.wrong{background:rgba(239,83,80,.12);border:1px solid rgba(239,83,80,.3)}
.ld-result-icon{font-size:16px;font-weight:600;margin-bottom:4px}
.ld-result-answer{font-size:14px;color:var(--t1)}

/* ══════════════════════════════════════════════════
   Match Pairs Page
   ══════════════════════════════════════════════════ */
.mp-setup{max-width:420px;margin:0 auto;background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow-sm)}
.mp-setup-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.mp-setup-row label{font-size:14px;font-weight:600;color:var(--t1)}
.match-header{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.match-timer{font-size:14px;font-weight:600;color:var(--t2);font-family:monospace}
.match-progress{font-size:13px;color:var(--t3);margin-left:auto}
.match-board{display:flex;gap:16px;max-width:600px;margin:0 auto}
.match-col{flex:1;display:flex;flex-direction:column;gap:8px}
.match-col-label{font-size:11px;font-weight:600;color:var(--t3);text-transform:uppercase;text-align:center;margin-bottom:4px}
.match-card{padding:12px 10px;border:2px solid var(--bdr);border-radius:var(--radius-sm);background:var(--sur);font-size:14px;cursor:pointer;transition:all .15s;text-align:center;font-weight:500}
.match-card:hover:not(:disabled){border-color:var(--olive);background:rgba(197,163,71,.06)}
.match-card.selected{border-color:var(--olive);background:rgba(197,163,71,.12);box-shadow:0 0 0 2px rgba(197,163,71,.2)}
.match-card.matched{border-color:#66bb6a;background:rgba(102,187,106,.1);opacity:.6;cursor:default}
.match-card.wrong{border-color:#ef5350;background:rgba(239,83,80,.1);animation:shake .3s}
.match-card.thai{font-family:var(--disp);font-size:16px}
.match-done{text-align:center;padding:32px 24px;max-width:400px;margin:0 auto}
.match-done-time{font-family:var(--disp);font-size:36px;font-weight:700;color:var(--olive);margin-bottom:8px}
.match-done-stats{font-size:14px;color:var(--t2)}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}

/* ══════════════════════════════════════════════════
   Image Vocab Page
   ══════════════════════════════════════════════════ */
.iv-desc{font-size:13px;color:var(--t3);line-height:1.5;margin-top:12px}
.iv-streak{font-size:14px;font-weight:600;color:#ff6b35}
.iv-prompt{text-align:center;margin-bottom:20px}
.iv-thai{font-family:var(--disp);font-size:28px;font-weight:600;color:var(--t1);margin-bottom:4px}
.iv-phonetic{font-size:13px;color:var(--t3);margin-bottom:12px}
.iv-options{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:400px;margin:0 auto 20px}
.iv-option{display:flex;flex-direction:column;align-items:center;gap:6px;padding:20px 12px;border:2px solid var(--bdr);border-radius:var(--radius);background:var(--sur);cursor:pointer;transition:all .15s}
.iv-option.selectable:hover{border-color:var(--olive);background:rgba(197,163,71,.06);transform:translateY(-2px)}
.iv-option.correct{border-color:#66bb6a;background:rgba(102,187,106,.12)}
.iv-option.wrong{border-color:#ef5350;background:rgba(239,83,80,.1);animation:shake .3s}
.iv-option-emoji{font-size:40px}
.iv-option-label{font-size:12px;color:var(--t2);font-weight:500}
.iv-after{text-align:center}
.iv-feedback{font-size:15px;font-weight:600;padding:10px;border-radius:var(--radius-sm)}
.iv-feedback.correct{color:#388e3c}
.iv-feedback.wrong{color:#d32f2f}

/* ── Settings Page ── */
.sett-section{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--radius-lg);padding:24px;margin-bottom:20px}
.sett-h{font-family:var(--disp);font-size:18px;font-weight:600;color:var(--t1);margin-bottom:6px}
.sett-desc{font-size:13px;color:var(--t2);margin-bottom:16px;line-height:1.5}
.sett-stats{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px}
.sett-stat{background:var(--sur2);border:1px solid var(--bdr);border-radius:var(--radius-sm);padding:12px 16px;display:flex;flex-direction:column;align-items:center;min-width:80px;flex:1}
.sett-stat-n{font-family:var(--disp);font-size:22px;font-weight:600;color:var(--olive-dark)}
.sett-stat-l{font-size:11px;color:var(--t3);margin-top:2px;text-transform:uppercase;letter-spacing:.04em}
.sett-warn{background:#fef3cd;border:1px solid #ffc107;border-left:3px solid #ffa000;border-radius:var(--radius-sm);padding:10px 14px;font-size:12.5px;color:#856404;margin-bottom:14px;line-height:1.5}
.sett-file{margin-bottom:14px;font-size:13px}
.sett-confirm{background:var(--sur2);border:1px solid var(--bdr);border-radius:var(--radius-sm);padding:14px;margin-top:12px}
.sett-confirm p{font-size:13px;color:var(--t2);margin-bottom:10px}
.sett-confirm-btns{display:flex;gap:10px}
.sett-msg{padding:12px 16px;border-radius:var(--radius-sm);font-size:13px;margin-bottom:16px;font-weight:500}
.sett-msg-success{background:#e8f5e9;border:1px solid #a5d6a7;color:#2e7d32}
.sett-msg-error{background:#ffebee;border:1px solid #ef9a9a;color:#c62828}
.sett-danger{border-color:#ef9a9a;background:#fff8f8}
.sett-btn-clear{background:#ef5350;color:white;border:none;padding:8px 18px;border-radius:var(--radius-sm);cursor:pointer;font-weight:500;font-size:13px}
.sett-btn-clear:hover{background:#e53935}

/* ── AI Chat Security Warning ── */
.aic-security-warning{background:#fff8e1;border:1px solid #ffe082;border-left:3px solid #ffa000;border-radius:var(--radius-sm);padding:12px 14px;font-size:12px;color:#6d4c00;line-height:1.6;margin-top:14px}
.aic-session-toggle{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--t2);margin-top:10px;cursor:pointer}
.aic-session-toggle input{accent-color:var(--olive);cursor:pointer}
.aic-key-footer{display:flex;align-items:center;gap:14px;margin-top:20px}
.aic-key-note{font-size:11.5px;color:var(--t3)}

/* ── Settings Proxy & Backup ── */
.sett-proxy-row{display:flex;gap:10px;margin-bottom:10px}
.sett-proxy-input{flex:1;padding:8px 12px;border:1px solid var(--bdr);border-radius:var(--radius-sm);font-size:13px;font-family:var(--body)}
.sett-proxy-input:focus{outline:none;border-color:var(--olive)}
.sett-proxy-status{font-size:12px;color:#2e7d32;font-weight:500}
.sett-last-export{font-size:12px;color:var(--t3);margin-top:10px}

/* ── Sidebar Backup Nudge ── */
.sb-backup-nudge{display:block;width:calc(100% - 28px);margin:6px 14px;padding:8px 10px;background:rgba(255,160,0,.12);border:1px solid rgba(255,160,0,.25);border-radius:var(--radius-sm);font-size:10.5px;color:#ffd180;cursor:pointer;text-align:left;line-height:1.4}
.sb-backup-nudge:hover{background:rgba(255,160,0,.2)}
`;
