import { useState, useCallback, useEffect, useRef } from "react";
import { speakThai } from "../utils/speech";
import { PronunciationGuide } from "./PronunciationGuide";
import { SparkleEffect, XPPopup } from "./Celebrations";
import { Mascot } from "./Mascot";

const CONF_LABELS = ["New", "Learning", "Familiar", "Mastered"];
const CONF_COLORS = ["var(--t3)", "#D4BA6E", "#0A8A7A", "#087068"];

export function FlashcardDeck({ words, studied, toggleStudied, confidence = {}, updateConfidence }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [thaiFirst, setThaiFirst] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!words?.length) {
    return (
      <div className="empty" style={{ textAlign: "center", padding: "40px 20px" }}>
        <Mascot mood="thinking" size="md" />
        <div style={{ marginTop: 12 }}>No words to study.</div>
      </div>
    );
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
    // Show celebration effects
    setShowSparkle(true);
    setShowXP(true);
    setTimeout(() => setShowSparkle(false), 1000);
    setTimeout(() => setShowXP(false), 1200);
    if (idx < total - 1) next(); else { setFlipped(false); setTimeout(() => setCompleted(true), 300); }
  };
  const markReview = () => {
    if (updateConfidence) updateConfidence(word.id, -1);
    if (idx < total - 1) next(); else { setFlipped(false); setTimeout(() => setCompleted(true), 300); }
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

  // Hide emoji on front for categories where it gives away the answer
  const HIDE_EMOJI_FRONT = new Set(["Colours", "Numbers"]);
  const hideEmoji = HIDE_EMOJI_FRONT.has(word.category);

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
      {hideEmoji ? (
        <div className="fc-front-ph" style={{ fontSize: 28 }}>{word.phonetics}</div>
      ) : (
        <>
          <div className="fc-ej">{word.emoji}</div>
          <div className="fc-front-ph">{word.phonetics}</div>
        </>
      )}
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
      {hideEmoji && <div className="fc-ej" style={{ marginTop: 4 }}>{word.emoji}</div>}
      <button className="fc-speak-btn" onClick={e => { e.stopPropagation(); speakThai(word.thai); }}>🔊</button>
    </div>
  );

  const restartDeck = () => { setIdx(0); setFlipped(false); setCompleted(false); };

  if (completed) {
    const masteredCount = confCounts ? confCounts[3] : 0;
    return (
      <div className="fc-wrap">
        <div className="fc-done">
          <Mascot mood="happy" size="md" />
          <div className="fc-done-title">Deck Complete!</div>
          <div className="fc-done-stats">
            <div className="fc-done-stat"><span className="fc-done-num">{studiedCount}</span> studied</div>
            <div className="fc-done-stat"><span className="fc-done-num">{masteredCount}</span> mastered</div>
            <div className="fc-done-stat"><span className="fc-done-num">{total}</span> total</div>
          </div>
          {studiedCount < total && (
            <div className="fc-done-hint">{total - studiedCount} word{total - studiedCount !== 1 ? "s" : ""} still to learn</div>
          )}
          <button className="btn btn-sec" onClick={restartDeck} style={{ marginTop: 16 }}>↻ Review Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fc-wrap">
      <div className="fc-prog">
        {idx + 1} / {total} &middot; {studiedCount} studied
        {confCounts && confCounts[3] > 0 && <span className="fc-conf-summary"> &middot; {confCounts[3]} mastered</span>}
        <button className={`fc-toggle-thai${thaiFirst ? " on" : ""}`} onClick={() => setThaiFirst(t => !t)} title={thaiFirst ? "Show phonetics first" : "Show Thai script first"}>
          {thaiFirst ? "ก→A" : "A→ก"}
        </button>
      </div>

      <div className="fc" onClick={flip} style={{ position: "relative" }}>
        {!flipped ? frontContent : backContent}
        {!flipped && <div className="fc-hint-lbl">tap to flip</div>}
        <SparkleEffect show={showSparkle} />
        <XPPopup points={5} show={showXP} />
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
