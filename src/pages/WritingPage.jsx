import { useState, useRef, useEffect } from "react";
import { WRITING_LEVELS } from "../data/writingData";
import { awardXP } from "../utils/xp";
import { recordMistake } from "../utils/mistakes";
import { speakThai } from "../utils/speech";

export function WritingPage() {
  const [levelIdx, setLevelIdx] = useState(null);
  const [itemIdx, setItemIdx] = useState(0);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null); // null | "correct" | "wrong"
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && result === null) inputRef.current.focus();
  }, [itemIdx, result]);

  if (levelIdx === null) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Writing Practice</div>
          <div className="ph-s">Practice writing Thai script — type Thai characters for the English prompts</div>
        </div>
        <div className="wr-grid">
          {WRITING_LEVELS.map((level, i) => (
            <button key={level.id} className="wr-level-card" onClick={() => { setLevelIdx(i); setItemIdx(0); setScore({ correct: 0, total: 0 }); setDone(false); }}>
              <div className="wr-level-title">{level.title}</div>
              <div className="wr-level-desc">{level.description}</div>
              <div className="wr-level-count">{level.items.length} items</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const level = WRITING_LEVELS[levelIdx];
  const items = level.items;
  const item = items[itemIdx];

  const handleCheck = () => {
    if (!input.trim()) return;
    const isCorrect = input.trim() === item.answer;
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      awardXP("writing_correct");
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScore(s => ({ ...s, total: s.total + 1 }));
      recordMistake({
        source: "writing",
        prompt: item.prompt,
        userAnswer: input.trim(),
        correctAnswer: item.answer,
        score: 0,
      });
    }
  };

  const handleNext = () => {
    if (itemIdx + 1 >= items.length) {
      setDone(true);
    } else {
      setItemIdx(i => i + 1);
      setInput("");
      setResult(null);
      setShowHint(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (result === null) handleCheck();
      else handleNext();
    }
  };

  // ─── Done ───
  if (done) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Writing Practice</div>
          <div className="ph-s">{level.title} — Complete!</div>
        </div>
        <div className="wr-done">
          <div className="wr-done-icon">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
          <div className="wr-done-score">{score.correct}/{score.total} correct ({pct}%)</div>
          <div className="wr-done-msg">
            {pct >= 80 ? "Excellent Thai writing!" : pct >= 50 ? "Good effort! Keep practicing." : "Keep at it — practice makes perfect!"}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <button className="btn btn-sec" onClick={() => { setLevelIdx(null); }}>Pick Another</button>
            <button className="btn btn-pri" onClick={() => { setItemIdx(0); setInput(""); setResult(null); setShowHint(false); setScore({ correct: 0, total: 0 }); setDone(false); }}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((itemIdx + 1) / items.length) * 100;

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Writing Practice</div>
        <div className="ph-s">{level.title}</div>
      </div>

      <div className="wr-container">
        {/* Progress */}
        <div className="rp-prog-label">{itemIdx + 1} of {items.length}</div>
        <div className="rp-prog">
          <div className="rp-prog-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Prompt */}
        <div className="wr-prompt-card">
          <div className="wr-prompt-label">Write in Thai:</div>
          <div className="wr-prompt-text">{item.prompt}</div>
          {!showHint && (
            <button className="btn btn-sec btn-sm" onClick={() => setShowHint(true)} style={{ marginTop: 10 }}>
              Show phonetics hint
            </button>
          )}
          {showHint && (
            <div className="wr-hint">💡 {item.hint}</div>
          )}
        </div>

        {/* Input */}
        {result === null && (
          <div className="wr-input-area">
            <input
              ref={inputRef}
              className="wr-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type Thai script here..."
              autoComplete="off"
              autoCorrect="off"
              lang="th"
            />
            <button className="btn btn-pri" onClick={handleCheck} disabled={!input.trim()} style={{ marginTop: 10 }}>
              Check
            </button>
          </div>
        )}

        {/* Result */}
        {result !== null && (
          <div className={`wr-result ${result}`}>
            {result === "correct" ? (
              <>
                <div className="wr-result-icon">✅ Correct!</div>
                <div className="wr-result-answer">{item.answer}</div>
              </>
            ) : (
              <>
                <div className="wr-result-icon">❌ Not quite</div>
                <div className="wr-result-yours">You wrote: <strong>{input}</strong></div>
                <div className="wr-result-correct">
                  Correct: <strong>{item.answer}</strong>
                  <button className="conv-speak" onClick={() => speakThai(item.answer)} title="Listen">🔊</button>
                </div>
              </>
            )}
            <button className="btn btn-pri" onClick={handleNext} style={{ marginTop: 14 }}>
              {itemIdx + 1 >= items.length ? "See Results" : "Next →"}
            </button>
          </div>
        )}

        <button className="btn btn-sec btn-sm" onClick={() => setLevelIdx(null)} style={{ marginTop: 20 }}>
          ← Back to levels
        </button>
      </div>
    </div>
  );
}
