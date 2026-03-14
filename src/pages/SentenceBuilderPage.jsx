import { useState, useRef, useEffect } from "react";
import { SENTENCE_EXERCISES } from "../data/sentenceExercises";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";
import { recordMistake } from "../utils/mistakes";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SentenceBuilderPage() {
  const [week, setWeek] = useState(null);
  const [exIdx, setExIdx] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState([]);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const dropRef = useRef(null);

  const weeks = [1, 2, 3, 4];
  const exercisesForWeek = week !== null ? SENTENCE_EXERCISES.filter(e => e.week === week) : [];
  const exercise = exercisesForWeek[exIdx];

  useEffect(() => {
    if (exercise) {
      const allWords = shuffle([...exercise.wordBank, ...exercise.distractors]);
      setPool(allWords);
      setPlaced([]);
      setResult(null);
      setShowHint(false);
    }
  }, [exIdx, week]);

  if (week === null) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Sentence Builder</div>
          <div className="ph-s">Drag Thai words into the correct order to build sentences</div>
        </div>
        <div className="snb-week-grid">
          {weeks.map(w => {
            const count = SENTENCE_EXERCISES.filter(e => e.week === w).length;
            return (
              <button key={w} className="snb-week-card" onClick={() => { setWeek(w); setExIdx(0); setScore({ correct: 0, total: 0 }); setDone(false); }}>
                <div className="snb-week-num">Week {w}</div>
                <div className="snb-week-count">{count} sentences</div>
                <div className="snb-week-patterns">
                  {SENTENCE_EXERCISES.filter(e => e.week === w).map(e => e.pattern).join(" · ")}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!exercise || done) {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Sentence Builder</div>
          <div className="ph-s">Week {week} — Complete!</div>
        </div>
        <div className="snb-done">
          <div className="snb-done-icon">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
          <div className="snb-done-score">{score.correct}/{score.total} correct ({pct}%)</div>
          <div className="snb-done-msg">
            {pct >= 80 ? "Excellent sentence building!" : pct >= 50 ? "Good progress! Keep practicing." : "Keep at it — grammar takes time!"}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <button className="btn btn-sec" onClick={() => setWeek(null)}>Pick Another Week</button>
            <button className="btn btn-pri" onClick={() => { setExIdx(0); setScore({ correct: 0, total: 0 }); setDone(false); }}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  const handlePoolClick = (word) => {
    if (result) return;
    setPool(p => { const i = p.indexOf(word); return [...p.slice(0, i), ...p.slice(i + 1)]; });
    setPlaced(p => [...p, word]);
  };

  const handlePlacedClick = (word) => {
    if (result) return;
    setPlaced(p => { const i = p.indexOf(word); return [...p.slice(0, i), ...p.slice(i + 1)]; });
    setPool(p => [...p, word]);
  };

  const handleCheck = () => {
    const userAnswer = placed.join("");
    const correct = exercise.thai;
    const isCorrect = userAnswer === correct;
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      awardXP("practice_correct");
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScore(s => ({ ...s, total: s.total + 1 }));
      recordMistake({
        source: "practice",
        prompt: exercise.english,
        userAnswer,
        correctAnswer: correct,
        score: 0,
      });
    }
  };

  const handleNext = () => {
    if (exIdx + 1 >= exercisesForWeek.length) {
      setDone(true);
    } else {
      setExIdx(i => i + 1);
    }
  };

  const handleReset = () => {
    const allWords = shuffle([...exercise.wordBank, ...exercise.distractors]);
    setPool(allWords);
    setPlaced([]);
    setResult(null);
    setShowHint(false);
  };

  // Drag handlers
  const handleDragStart = (e, word, source) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ word, source }));
    setDragIdx(word);
  };
  const handleDragEnd = () => setDragIdx(null);
  const handleDragOver = (e) => e.preventDefault();
  const handleDropOnPlaced = (e) => {
    e.preventDefault();
    try {
      const { word, source } = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (source === "pool" && !result) {
        setPool(p => { const i = p.indexOf(word); return [...p.slice(0, i), ...p.slice(i + 1)]; });
        setPlaced(p => [...p, word]);
      }
    } catch {}
    setDragIdx(null);
  };
  const handleDropOnPool = (e) => {
    e.preventDefault();
    try {
      const { word, source } = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (source === "placed" && !result) {
        setPlaced(p => { const i = p.indexOf(word); return [...p.slice(0, i), ...p.slice(i + 1)]; });
        setPool(p => [...p, word]);
      }
    } catch {}
    setDragIdx(null);
  };

  const progress = ((exIdx + 1) / exercisesForWeek.length) * 100;
  const phon = exercise.phoneticsMap || {};

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Sentence Builder</div>
        <div className="ph-s">Week {week} · {exercise.pattern}</div>
      </div>

      <div className="snb-container">
        <div className="rp-prog-label">{exIdx + 1} of {exercisesForWeek.length}</div>
        <div className="rp-prog">
          <div className="rp-prog-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* English prompt */}
        <div className="snb-prompt-card">
          <div className="snb-prompt-label">Build this sentence in Thai:</div>
          <div className="snb-prompt-text">{exercise.english}</div>
          {!showHint && (
            <button className="btn btn-sec btn-sm" onClick={() => setShowHint(true)} style={{ marginTop: 10 }}>
              Show hint
            </button>
          )}
          {showHint && (
            <div className="snb-hint">💡 {exercise.hint} — {exercise.tip}</div>
          )}
        </div>

        {/* Drop zone for placed words */}
        <div
          className={`snb-placed${placed.length === 0 ? " empty" : ""}${result === "correct" ? " correct" : result === "wrong" ? " wrong" : ""}`}
          ref={dropRef}
          onDragOver={handleDragOver}
          onDrop={handleDropOnPlaced}
        >
          {placed.length === 0 && <span className="snb-placed-hint">Tap or drag words here</span>}
          {placed.map((word, i) => (
            <button
              key={`${word}-${i}`}
              className={`snb-word placed${dragIdx === word ? " dragging" : ""}`}
              onClick={() => handlePlacedClick(word)}
              draggable={!result}
              onDragStart={e => handleDragStart(e, word, "placed")}
              onDragEnd={handleDragEnd}
            >
              <span className="snb-word-thai">{word}</span>
              <span className="snb-word-phon">{phon[word] || ""}</span>
            </button>
          ))}
        </div>

        {/* Word bank */}
        <div
          className="snb-pool"
          onDragOver={handleDragOver}
          onDrop={handleDropOnPool}
        >
          {pool.map((word, i) => (
            <button
              key={`${word}-${i}`}
              className={`snb-word${dragIdx === word ? " dragging" : ""}`}
              onClick={() => handlePoolClick(word)}
              draggable={!result}
              onDragStart={e => handleDragStart(e, word, "pool")}
              onDragEnd={handleDragEnd}
            >
              <span className="snb-word-thai">{word}</span>
              <span className="snb-word-phon">{phon[word] || ""}</span>
            </button>
          ))}
        </div>

        {/* Result */}
        {result && (
          <div className={`snb-result ${result}`}>
            {result === "correct" ? (
              <>
                <div className="snb-result-icon">✅ Correct!</div>
                <div className="snb-result-thai">{exercise.thai}</div>
                <div className="snb-result-phon">{exercise.phonetics}</div>
                <button className="conv-speak" onClick={() => speakThai(exercise.thai)} title="Listen">🔊</button>
              </>
            ) : (
              <>
                <div className="snb-result-icon">❌ Not quite</div>
                <div className="snb-result-yours">You built: <strong>{placed.join("")}</strong></div>
                <div className="snb-result-correct">
                  Correct: <strong>{exercise.thai}</strong> ({exercise.phonetics})
                  <button className="conv-speak" onClick={() => speakThai(exercise.thai)} title="Listen">🔊</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="snb-actions">
          {!result && (
            <>
              <button className="btn btn-sec" onClick={handleReset}>Reset</button>
              <button className="btn btn-pri" onClick={handleCheck} disabled={placed.length === 0}>Check</button>
            </>
          )}
          {result && (
            <button className="btn btn-pri" onClick={handleNext}>
              {exIdx + 1 >= exercisesForWeek.length ? "See Results" : "Next →"}
            </button>
          )}
        </div>

        <button className="btn btn-sec btn-sm" onClick={() => setWeek(null)} style={{ marginTop: 20 }}>
          ← Back to weeks
        </button>
      </div>
    </div>
  );
}
