import { useState, useCallback, useEffect, useRef } from "react";
import { speakThai } from "../utils/speech";

export function ScriptFlashcardDeck({ characters, studied, onToggle }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!characters?.length) {
    return <div className="empty">No characters to study.</div>;
  }

  const ch = characters[idx];
  const total = characters.length;
  const isDone = studied.has(ch.char);

  const flip = () => setFlipped(f => !f);
  const goTo = useCallback(i => { setIdx(i); setFlipped(false); }, []);
  const prev = () => goTo(Math.max(0, idx - 1));
  const next = () => goTo(Math.min(total - 1, idx + 1));
  const markEasy = () => {
    if (!isDone) onToggle(ch.char);
    if (idx < total - 1) next(); else setFlipped(false);
  };
  const markReview = () => {
    if (idx < total - 1) next(); else setFlipped(false);
  };

  // Keyboard shortcuts
  const hRef = useRef({ prev, next, flip, markEasy, markReview, flipped });
  hRef.current = { prev, next, flip, markEasy, markReview, flipped };
  useEffect(() => {
    const h = e => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const a = hRef.current;
      if (e.key === "ArrowLeft") { e.preventDefault(); a.prev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); a.next(); }
      else if (e.key === " ") { e.preventDefault(); a.flip(); }
      else if (a.flipped && (e.key === "e" || e.key === "1")) a.markEasy();
      else if (a.flipped && (e.key === "r" || e.key === "2")) a.markReview();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const studiedCount = characters.filter(c => studied.has(c.char)).length;

  return (
    <div className="fc-wrap">
      <div className="fc-prog">{idx + 1} / {total} &middot; {studiedCount} studied</div>

      <div className="fc" onClick={flip}>
        {!flipped ? (
          <>
            <span className={`script-class ${ch.class}`}>{ch.class}</span>
            <div className="fc-front-ph" style={{ fontSize: 32, marginTop: 8 }}>{ch.phonetic}</div>
            <div className="fc-front-lbl" style={{ marginTop: 6 }}>{ch.name}</div>
            <div className="fc-hint-lbl">tap to flip</div>
          </>
        ) : (
          <div className="fc-rev">
            <div style={{ fontFamily: "var(--thai)", fontSize: 64, fontWeight: 500, lineHeight: 1.2, marginBottom: 8 }}>
              {ch.char}
            </div>
            <div className="fc-rev-ph">{ch.phonetic} &middot; {ch.name}</div>
            <span className={`script-class ${ch.class}`} style={{ marginBottom: 8 }}>{ch.class}</span>
            <button
              className="fc-speak-btn"
              onClick={e => { e.stopPropagation(); speakThai(ch.char.replace("\u25CB", "").replace("\u25CC", "")); }}
            >
              🔊
            </button>
          </div>
        )}
      </div>

      {/* Mnemonic hint shown when flipped */}
      {flipped && ch.mnemonic && (
        <div className="fc-ex" style={{ marginTop: 14 }}>
          <div className="fc-ex-in">
            <div className="fc-ex-lbl">Mnemonic</div>
            <div style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.55 }}>{ch.mnemonic}</div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="fc-btns">
        <button className="fc-btn nav" onClick={prev} disabled={idx === 0}>← Prev</button>
        {flipped ? (
          <>
            <button className="fc-btn easy" onClick={markEasy}>
              {isDone ? "✓ Next" : "✓ Easy"}
            </button>
            <button className="fc-btn rev" onClick={markReview}>↻ Review</button>
          </>
        ) : null}
        <button className="fc-btn nav" onClick={next} disabled={idx >= total - 1}>Next →</button>
      </div>
      <div className="fc-keys">← → navigate &middot; space flip &middot; e easy &middot; r review</div>
    </div>
  );
}
