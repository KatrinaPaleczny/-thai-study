import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { NUMBERS_DATA } from "../data/numbersData";
import { TIME_SYSTEM_NOTES, TIME_DRILLS } from "../data/timeData";
import { speakThai } from "../utils/speech";

const NUM_SEGMENTS = [
  { label: "1–10", filter: n => n.value >= 1 && n.value <= 10 },
  { label: "11–20", filter: n => n.value >= 11 && n.value <= 20 },
  { label: "Tens (20–90)", filter: n => n.value >= 20 && n.value <= 90 && n.value % 10 === 0 },
  { label: "100+", filter: n => n.value >= 100 },
  { label: "All", filter: () => true },
];

function NumberFlashcards() {
  const [seg, setSeg] = useState(0);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(() => NUMBERS_DATA.filter(NUM_SEGMENTS[seg].filter), [seg]);
  const total = cards.length;
  const curr = cards[idx] || cards[0];

  const goTo = useCallback(i => { setIdx(i); setFlipped(false); }, []);
  const flip = () => setFlipped(f => !f);
  const prev = () => goTo(Math.max(0, idx - 1));
  const next = () => goTo(Math.min(total - 1, idx + 1));

  const changeSeg = s => { setSeg(s); setIdx(0); setFlipped(false); };

  // Keyboard shortcuts
  const hRef = useRef({ prev, next, flip, flipped });
  hRef.current = { prev, next, flip, flipped };
  useEffect(() => {
    const h = e => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const a = hRef.current;
      if (e.key === "ArrowLeft") { e.preventDefault(); a.prev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); a.next(); }
      else if (e.key === " ") { e.preventDefault(); a.flip(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (!curr) return null;

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, justifyContent: "center", flexWrap: "wrap" }}>
        {NUM_SEGMENTS.map((s, i) => (
          <button key={i} className={`vt-btn${seg === i ? " on" : ""}`} onClick={() => changeSeg(i)}>{s.label}</button>
        ))}
      </div>

      <div className="fc-wrap">
        <div className="fc-prog">{idx + 1} / {total}</div>

        <div className="fc" onClick={flip}>
          {!flipped ? (
            <>
              <div style={{ fontFamily: "var(--disp)", fontSize: 56, marginBottom: 6 }}>{curr.value}</div>
              <div className="fc-front-lbl">tap to reveal Thai</div>
              <div className="fc-hint-lbl">tap to flip</div>
            </>
          ) : (
            <div className="fc-rev">
              <div style={{ fontFamily: "var(--thai)", fontSize: 44, fontWeight: 500, marginBottom: 8 }}>{curr.thai}</div>
              <div className="fc-rev-ph">{curr.phonetics}</div>
              <div className="fc-en" style={{ fontSize: 28, fontFamily: "var(--disp)" }}>{curr.value}</div>
              <button className="fc-speak-btn" onClick={e => { e.stopPropagation(); speakThai(curr.thai); }}>🔊</button>
            </div>
          )}
        </div>

        <div className="fc-btns">
          <button className="fc-btn nav" onClick={prev} disabled={idx === 0}>← Prev</button>
          <button className="fc-btn nav" onClick={next} disabled={idx >= total - 1}>Next →</button>
        </div>
        <div className="fc-keys">← → navigate &middot; space flip</div>
      </div>
    </div>
  );
}

/* ── Clock face SVG for visual time display ── */
function ClockFace({ hour }) {
  const h12 = hour % 12;
  const angle = (h12 / 12) * 360 - 90;
  const hx = 50 + 28 * Math.cos(angle * Math.PI / 180);
  const hy = 50 + 28 * Math.sin(angle * Math.PI / 180);
  return (
    <svg viewBox="0 0 100 100" width="120" height="120" style={{ display: "block", margin: "0 auto 12px" }}>
      <circle cx="50" cy="50" r="46" fill="var(--sur2)" stroke="var(--bor)" strokeWidth="2" />
      {[...Array(12)].map((_, i) => {
        const a = ((i + 1) / 12) * 360 - 90;
        const x = 50 + 38 * Math.cos(a * Math.PI / 180);
        const y = 50 + 38 * Math.sin(a * Math.PI / 180);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="8" fill="var(--t2)">{i + 1}</text>;
      })}
      {/* minute hand at 12 */}
      <line x1="50" y1="50" x2="50" y2="16" stroke="var(--t2)" strokeWidth="1.5" strokeLinecap="round" />
      {/* hour hand */}
      <line x1="50" y1="50" x2={hx} y2={hy} stroke="var(--pri)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3" fill="var(--pri)" />
    </svg>
  );
}

/* ── Telling Time tab content ── */
function TellingTime() {
  const [mode, setMode] = useState("guide"); // guide | drill
  const [tIdx, setTIdx] = useState(() => Math.floor(Math.random() * TIME_DRILLS.length));
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);

  const curr = TIME_DRILLS[tIdx];
  const nextQ = () => { setTIdx(Math.floor(Math.random() * TIME_DRILLS.length)); setRevealed(false); };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, justifyContent: "center" }}>
        <button className={`vt-btn${mode === "guide" ? " on" : ""}`} onClick={() => setMode("guide")}>Guide</button>
        <button className={`vt-btn${mode === "drill" ? " on" : ""}`} onClick={() => setMode("drill")}>Practice</button>
      </div>

      {mode === "guide" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--t2)", textAlign: "center", marginBottom: 16 }}>
            Thai splits the day into periods — each with its own word. It's different from the 12-hour AM/PM system.
          </p>
          <div className="num-grid" style={{ gridTemplateColumns: "1fr" }}>
            {TIME_SYSTEM_NOTES.map((t, i) => (
              <div key={i} className="num-card" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0 14px", alignItems: "center", textAlign: "left" }}>
                <div style={{ fontSize: 12, color: "var(--t3)", fontWeight: 600, whiteSpace: "nowrap" }}>{t.period}</div>
                <div>
                  <span style={{ fontFamily: "var(--thai)", fontSize: 20 }}>{t.word}</span>
                  <span style={{ fontSize: 12, color: "var(--t3)", marginLeft: 8 }}>{t.phonetics}</span>
                </div>
                <div></div>
                <div style={{ fontSize: 12, color: "var(--t2)" }}>{t.note}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, textAlign: "center" }}>All 24 Hours</div>
            <div className="num-grid">
              {TIME_DRILLS.map((t, i) => (
                <div key={i} className="num-card">
                  <div className="num-val" style={{ fontSize: 14 }}>{t.display}</div>
                  <div className="num-th">{t.thai}</div>
                  <div className="num-ph">{t.phonetics}</div>
                  <button className="num-speak" onClick={() => speakThai(t.thai)} title="Hear pronunciation">🔊</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === "drill" && (
        <div className="num-drill">
          <div style={{ marginBottom: 8, fontSize: 12, color: "var(--t2)", textAlign: "center" }}>
            See the clock — say the time in Thai, then reveal to check.
          </div>

          <div className="num-q">
            <ClockFace hour={curr.hour} />
            <div className="num-disp" style={{ fontSize: 22 }}>{curr.display}</div>
            <div className="num-ql">How do you say this in Thai?</div>

            {revealed && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--sur2)", borderRadius: 8 }}>
                <div style={{ fontFamily: "var(--thai)", fontSize: 24 }}>{curr.thai}</div>
                <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 4 }}>{curr.phonetics}</div>
                <button className="num-speak" onClick={() => speakThai(curr.thai)} style={{ marginTop: 6 }} title="Hear pronunciation">🔊</button>
              </div>
            )}
          </div>

          {!revealed
            ? <div style={{ textAlign: "center" }}><button className="num-b p" onClick={() => setRevealed(true)}>Reveal</button></div>
            : <div className="qf-btns">
                <button className="qf-btn miss" onClick={() => { setStreak(0); nextQ(); }}>✗ Missed it</button>
                <button className="qf-btn got" onClick={() => { setStreak(s => s + 1); nextQ(); }}>✓ Got it</button>
              </div>}
          <div className="qf-streak">Streak: <strong>{streak}</strong></div>
        </div>
      )}
    </div>
  );
}

export function NumbersPage() {
  const [tab, setTab] = useState("reference");
  const [dir, setDir] = useState("num-to-thai");
  const [drillIdx, setDrillIdx] = useState(()=>Math.floor(Math.random()*NUMBERS_DATA.length));
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [qfIdx, setQfIdx] = useState(()=>Math.floor(Math.random()*NUMBERS_DATA.length));
  const [qfRevealed, setQfRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const inpRef = useRef();

  const curr = NUMBERS_DATA[drillIdx];
  const qfCurr = NUMBERS_DATA[qfIdx];

  const check = () => {
    if (!input.trim()) return;
    const ok = dir==="num-to-thai" ? input.trim()===curr.thai : parseInt(input.trim())===curr.value;
    setResult(ok?"ok":"no");
  };
  const nextDrill = () => { setDrillIdx(Math.floor(Math.random()*NUMBERS_DATA.length)); setInput(""); setResult(null); setTimeout(()=>inpRef.current?.focus(),50); };
  const qfNext = () => { setQfIdx(Math.floor(Math.random()*NUMBERS_DATA.length)); setQfRevealed(false); };

  return (
    <div className="page">
      <div className="ph"><div className="ph-t">ตัวเลข — Numbers & Time</div></div>
      <div className="tabs">
        {[["reference","Reference"],["flashcards","🃏 Flashcards"],["drill","Type Drill"],["quickfire","⚡ Quick Fire"],["time","🕐 Telling Time"]].map(([k,l])=>
          <button key={k} className={`tab${tab===k?" on":""}`} onClick={()=>setTab(k)}>{l}</button>)}
      </div>

      {tab==="flashcards" && <NumberFlashcards />}

      {tab==="reference" && (
        <div className="num-grid">
          {NUMBERS_DATA.map(n=>(
            <div key={n.value} className="num-card">
              <div className="num-val">{n.value}</div>
              <div className="num-th">{n.thai}</div>
              <div className="num-ph">{n.phonetics}</div>
              <button className="num-speak" onClick={()=>speakThai(n.thai)} title="Hear pronunciation">🔊</button>
            </div>
          ))}
        </div>
      )}

      {tab==="drill" && (
        <div className="num-drill">
          <div style={{display:"flex",gap:6,marginBottom:16,justifyContent:"center"}}>
            {[["num-to-thai","Number → Thai"],["thai-to-num","Thai → Number"]].map(([k,l])=>
              <button key={k} className={`vt-btn${dir===k?" on":""}`} onClick={()=>{setDir(k);setInput("");setResult(null);}}>{l}</button>)}
          </div>
          <div className="num-q">
            <div className="num-ql">{dir==="num-to-thai"?"Type the Thai word for:":"What number is this?"}</div>
            {dir==="num-to-thai"
              ? <div className="num-disp">{curr.value}</div>
              : (
                <div>
                  <div className="num-qf-thai">{curr.thai}</div>
                  <div style={{fontSize:13,color:"var(--t3)"}}>{curr.phonetics}</div>
                  <button className="num-speak" onClick={()=>speakThai(curr.thai)} title="Hear pronunciation">🔊</button>
                </div>
              )}
            {result && (
              <div className={`num-res ${result}`}>
                {result==="ok"
                  ? "✓ Correct!"
                  : <span>✗ Answer: <strong>{dir==="num-to-thai"?curr.thai:curr.value}</strong>{dir==="num-to-thai" && <button className="num-speak" onClick={()=>speakThai(curr.thai)} style={{marginLeft:6}}>🔊</button>}</span>}
              </div>
            )}
          </div>
          <input ref={inpRef} className="num-inp" placeholder={dir==="num-to-thai"?"Thai word…":"Number…"}
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"){result?nextDrill():check();}}}/>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            {!result ? <button className="num-b p" onClick={check}>Check</button>
              : <button className="num-b p" onClick={nextDrill}>Next →</button>}
            <button className="num-b s" onClick={nextDrill}>Skip</button>
          </div>
        </div>
      )}

      {tab==="quickfire" && (
        <div className="num-drill">
          <div style={{marginBottom:8,fontSize:12,color:"var(--t2)",textAlign:"center"}}>No typing — just tap Got it or Missed it. Build speed recognition.</div>
          <div style={{display:"flex",gap:6,marginBottom:16,justifyContent:"center"}}>
            {[["num-to-thai","Number → Thai"],["thai-to-num","Thai → Number"]].map(([k,l])=>
              <button key={k} className={`vt-btn${dir===k?" on":""}`} onClick={()=>{setDir(k);setQfRevealed(false);setStreak(0);}}>{l}</button>)}
          </div>
          <div className="num-q">
            <div className="num-ql">{dir==="num-to-thai"?"What is this in Thai?":"What number is this?"}</div>
            {dir==="num-to-thai"
              ? <div className="num-disp">{qfCurr.value}</div>
              : (
                <div>
                  <div className="num-qf-thai">{qfCurr.thai}</div>
                  <div style={{fontSize:13,color:"var(--t3)"}}>{qfCurr.phonetics}</div>
                  <button className="num-speak" onClick={()=>speakThai(qfCurr.thai)} title="Hear pronunciation">🔊</button>
                </div>
              )}
            {qfRevealed && (
              <div style={{marginTop:12,padding:"10px 14px",background:"var(--sur2)",borderRadius:8}}>
                <div style={{fontFamily:"var(--thai)",fontSize:22}}>{qfCurr.thai}</div>
                <div style={{fontSize:12,color:"var(--t3)"}}>{qfCurr.phonetics} · {qfCurr.value}</div>
                <button className="num-speak" onClick={()=>speakThai(qfCurr.thai)} title="Hear pronunciation">🔊</button>
              </div>
            )}
          </div>
          {!qfRevealed
            ? <div style={{textAlign:"center"}}><button className="num-b p" onClick={()=>setQfRevealed(true)}>Reveal</button></div>
            : <div className="qf-btns">
                <button className="qf-btn miss" onClick={()=>{setStreak(0);qfNext();}}>✗ Missed it</button>
                <button className="qf-btn got" onClick={()=>{setStreak(s=>s+1);qfNext();}}>✓ Got it</button>
              </div>}
          <div className="qf-streak">Streak: <strong>{streak}</strong></div>
        </div>
      )}

      {tab==="time" && <TellingTime />}
    </div>
  );
}
