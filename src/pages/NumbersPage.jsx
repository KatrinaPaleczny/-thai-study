import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { NUMBERS_DATA } from "../data/numbersData";
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
      <div className="ph"><div className="ph-t">ตัวเลข — Numbers</div></div>
      <div className="tabs">
        {[["reference","Reference"],["flashcards","🃏 Flashcards"],["drill","Type Drill"],["quickfire","⚡ Quick Fire"]].map(([k,l])=>
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
    </div>
  );
}
