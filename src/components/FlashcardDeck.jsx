import { useState, useCallback, useEffect, useRef } from "react";
import { speakThai } from "../utils/speech";
import { PronunciationGuide } from "./PronunciationGuide";

const CONF_LABELS = ["New", "Learning", "Familiar", "Mastered"];
const CONF_COLORS = ["var(--t3)", "#D4BA6E", "#0A8A7A", "#087068"];

export function FlashcardDeck({ words, studied, toggleStudied, confidence = {}, updateConfidence }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [thaiFirst, setThaiFirst] = useState(false);

  if (!words?.length) {
    return <div className="empty">No words to study.</div>;
  }

  const word = words[idx];
  const total = words.length;
  const isDone = studied.has(word.id);

  const flip = () => setFlipped(f => !f);
  const goTo = useCallback(i => { setIdx(i); setFlipped(false); }, []);
  const prev = () => goTo(Math.max(0, idx - 1));
  const next = () => goTo(Math.min(total - 1, idx + 1));
  const markEasy = () => {
    if (!isDone) toggleStudied(word.id);
    if (updateConfidence) updateConfidence(word.id, 1);
    if (idx < total - 1) next(); else setFlipped(false);
  };
  const markReview = () => {
    if (updateConfidence) updateConfidence(word.id, -1);
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

  const studiedCount = words.filter(w => studied.has(w.id)).length;
  const confCounts = confidence ? [0, 0, 0, 0] : null;
  if (confCounts) words.forEach(w => { const c = confidence[w.id] || 0; confCounts[c]++; });

  // Determine front/back content based on thaiFirst toggle
  const frontContent = thaiFirst ? (
    <>
      <div className="fc-cat">{word.category}</div>
      <div className="fc-thai">{word.thai}</div>
      <button className="fc-speak-btn" onClick={e => { e.stopPropagation(); speakThai(word.thai); }}>🔊</button>
      <div className="fc-front-lbl">tap to reveal English</div>
    </>
  ) : (
    <>
      <div className="fc-cat">{word.category}</div>
      <div className="fc-ej">{word.emoji}</div>
      <div className="fc-front-ph">{word.phonetics}</div>
      <div className="fc-front-lbl">tap to reveal</div>
    </>
  );

  const backContent = thaiFirst ? (
    <div className="fc-rev">
      <div className="fc-en" style={{ fontSize: 22, marginBottom: 8 }}>{word.english}</div>
      <div className="fc-rev-ph">{word.phonetics}</div>
      <div className="fc-ej">{word.emoji}</div>
    </div>
  ) : (
    <div className="fc-rev">
      <div className="fc-thai">{word.thai}</div>
      <div className="fc-rev-ph">{word.phonetics}</div>
      <div className="fc-en">{word.english}</div>
      <button className="fc-speak-btn" onClick={e => { e.stopPropagation(); speakThai(word.thai); }}>🔊</button>
    </div>
  );

  return (
    <div className="fc-wrap">
      <div className="fc-prog">
        {idx + 1} / {total} &middot; {studiedCount} studied
        {confCounts && confCounts[3] > 0 && <span className="fc-conf-summary"> &middot; {confCounts[3]} mastered</span>}
        <button className={`fc-toggle-thai${thaiFirst ? " on" : ""}`} onClick={() => setThaiFirst(t => !t)} title={thaiFirst ? "Show phonetics first" : "Show Thai script first"}>
          {thaiFirst ? "ก→A" : "A→ก"}
        </button>
      </div>

      <div className="fc" onClick={flip}>
        {!flipped ? frontContent : backContent}
        {!flipped && <div className="fc-hint-lbl">tap to flip</div>}
        {confidence && (confidence[word.id] || 0) > 0 && (
          <div className="fc-conf" style={{ color: CONF_COLORS[confidence[word.id]] }}>
            {"●".repeat(confidence[word.id])}{"○".repeat(3 - confidence[word.id])} {CONF_LABELS[confidence[word.id]]}
          </div>
        )}
      </div>

      {/* Example sentence */}
      {flipped && word.example_thai && (
        <div className="fc-ex">
          <div className="fc-ex-in">
            <div className="fc-ex-lbl">Example</div>
            <div className="fc-ex-th">{word.example_thai}</div>
            {word.example_phonetics && <div className="fc-ex-ph">{word.example_phonetics}</div>}
            {word.example_english && <div className="fc-ex-en">{word.example_english}</div>}
          </div>
        </div>
      )}

      {/* Pronunciation guide */}
      {flipped && <PronunciationGuide wordId={word.id} thai={word.thai} />}

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
