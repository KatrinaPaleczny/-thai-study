import { useState, useMemo, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ImageVocabPage() {
  const { allVocab } = useApp();
  const [cat, setCat] = useState("All");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [phase, setPhase] = useState("setup"); // setup | playing | done

  const cats = useMemo(() => ["All", ...new Set(allVocab.map(w => w.category))], [allVocab]);
  const words = useMemo(() => {
    const filtered = cat === "All" ? allVocab : allVocab.filter(w => w.category === cat);
    return filtered.length >= 4 ? filtered : allVocab;
  }, [allVocab, cat]);

  const generateQuestions = useCallback((count = 10) => {
    const qs = [];
    const pool = shuffle(words);
    for (let i = 0; i < Math.min(count, pool.length); i++) {
      const correct = pool[i];
      // Pick 3 wrong options from different words
      const others = shuffle(pool.filter(w => w.id !== correct.id)).slice(0, 3);
      const options = shuffle([correct, ...others]);
      qs.push({ correct, options });
    }
    return qs;
  }, [words]);

  const startGame = () => {
    const qs = generateQuestions(10);
    setQuestions(qs);
    setQuestionIdx(0);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setPhase("playing");
    // Auto-speak the first word
    if (qs[0]) speakThai(qs[0].correct.thai);
  };

  const handleSelect = (word) => {
    if (selected !== null) return;
    const q = questions[questionIdx];
    const isCorrect = word.id === q.correct.id;
    setSelected(word.id);

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      setStreak(s => s + 1);
      awardXP("practice_correct");
      speakThai(q.correct.thai);
    } else {
      setStreak(0);
      // Speak the correct answer
      setTimeout(() => speakThai(q.correct.thai), 300);
    }
  };

  const nextQuestion = () => {
    if (questionIdx + 1 >= questions.length) {
      setPhase("done");
      return;
    }
    const nextIdx = questionIdx + 1;
    setQuestionIdx(nextIdx);
    setSelected(null);
    speakThai(questions[nextIdx].correct.thai);
  };

  // ─── Setup ───
  if (phase === "setup") {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Image Vocab</div>
          <div className="ph-s">No English allowed — match Thai audio to the right emoji/image</div>
        </div>
        <div className="mp-setup">
          <div className="mp-setup-row">
            <label>Category</label>
            <select className="pron-cat-select" value={cat} onChange={e => setCat(e.target.value)}>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <p className="iv-desc">You'll hear a Thai word. Pick the matching emoji. No English hints — pure immersion!</p>
          <button className="btn btn-pri" onClick={startGame} style={{ marginTop: 20, width: "100%" }}>Start</button>
        </div>
      </div>
    );
  }

  // ─── Done ───
  if (phase === "done") {
    const pct = Math.round((score.correct / score.total) * 100);
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : 1;
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Image Vocab</div>
        </div>
        <div className="match-done">
          <div className="rp-stars">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <div className="rp-score-big">{pct}%</div>
          <div className="match-done-stats">
            {score.correct}/{score.total} correct
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <button className="btn btn-sec" onClick={() => setPhase("setup")}>Settings</button>
            <button className="btn btn-pri" onClick={startGame}>Play Again</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Playing ───
  const q = questions[questionIdx];
  const progress = ((questionIdx + 1) / questions.length) * 100;

  return (
    <div className="page">
      <div className="match-header">
        <button className="btn btn-sec btn-sm" onClick={() => setPhase("setup")}>✕ Exit</button>
        <span className="match-progress">{questionIdx + 1}/{questions.length}</span>
        {streak >= 2 && <span className="iv-streak">🔥 {streak}</span>}
      </div>

      <div className="rp-prog" style={{ marginBottom: 16 }}>
        <div className="rp-prog-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Audio prompt — no English */}
      <div className="iv-prompt">
        <div className="iv-thai">{q.correct.thai}</div>
        <div className="iv-phonetic">{q.correct.phonetics}</div>
        <button className="ld-play-btn" onClick={() => speakThai(q.correct.thai)}>🔊 Listen Again</button>
      </div>

      {/* Emoji options */}
      <div className="iv-options">
        {q.options.map(opt => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.id === q.correct.id;
          let cls = "iv-option";
          if (selected !== null) {
            if (isCorrect) cls += " correct";
            else if (isSelected) cls += " wrong";
          } else {
            cls += " selectable";
          }
          return (
            <button key={opt.id} className={cls} onClick={() => handleSelect(opt)} disabled={selected !== null}>
              <span className="iv-option-emoji">{opt.emoji}</span>
              {selected !== null && (
                <span className="iv-option-label">{opt.thai}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* After answer */}
      {selected !== null && (
        <div className="iv-after">
          <div className={`iv-feedback ${selected === q.correct.id ? "correct" : "wrong"}`}>
            {selected === q.correct.id ? "✅ Correct!" : `❌ It was ${q.correct.emoji} ${q.correct.thai}`}
          </div>
          <button className="btn btn-pri" onClick={nextQuestion} style={{ marginTop: 12 }}>
            {questionIdx + 1 >= questions.length ? "See Results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
