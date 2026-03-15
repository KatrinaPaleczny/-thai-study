import { useState, useEffect, useCallback } from "react";
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

function generateQuestions(words, count = 5) {
  if (words.length < 4) return [];
  const picked = shuffle(words).slice(0, Math.min(count, words.length));
  return picked.map(word => {
    const others = words.filter(w => w.id !== word.id && w.english.toLowerCase() !== word.english.toLowerCase());
    const distractors = shuffle(others).slice(0, 3).map(w => w.english);
    const options = shuffle([word.english, ...distractors]);
    return { word, options, correctIdx: options.indexOf(word.english) };
  });
}

export function MiniAudioQuiz({ words }) {
  const [phase, setPhase] = useState("ready"); // ready | playing | answered | done
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const current = questions[idx] || null;

  const start = useCallback(() => {
    const qs = generateQuestions(words);
    if (qs.length === 0) return;
    setQuestions(qs);
    setIdx(0);
    setSelected(null);
    setScore(0);
    setPhase("playing");
  }, [words]);

  // Auto-play audio on new question
  useEffect(() => {
    if (phase === "playing" && current) {
      const t = setTimeout(() => speakThai(current.word.thai, { rate: 0.85 }), 300);
      return () => clearTimeout(t);
    }
  }, [phase, idx, current]);

  if (words.length < 4) {
    return <div className="mini-aq-msg">Need at least 4 words for audio practice.</div>;
  }

  if (phase === "ready") {
    return (
      <div className="mini-aq-start-area">
        <p className="mini-aq-desc">Listen to Thai audio and pick the correct English meaning.</p>
        <button className="btn btn-pri btn-sm" onClick={start}>
          Start ({Math.min(5, words.length)} questions)
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="mini-aq-done">
        <div className="mini-aq-done-score">{score}/{questions.length} correct</div>
        <div className="mini-aq-done-msg">
          {score === questions.length ? "Perfect! 🎉" :
           score >= questions.length * 0.7 ? "Nice work! 👏" : "Keep practicing! 💪"}
        </div>
        <button className="btn btn-sec btn-sm" onClick={start} style={{ marginTop: 12 }}>
          Try Again
        </button>
      </div>
    );
  }

  const answered = phase === "answered";

  return (
    <div className="mini-aq">
      <div className="mini-aq-header">
        <span>{idx + 1}/{questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="mini-aq-play">
        <button className="mini-aq-play-btn" onClick={() => speakThai(current.word.thai, { rate: 0.85 })}>
          🔊
        </button>
        <button className="mini-aq-slow-btn" onClick={() => speakThai(current.word.thai, { rate: 0.5 })}>
          🐢 Slow
        </button>
      </div>

      {answered && (
        <div className="mini-aq-reveal">
          <span className="mini-aq-reveal-ph">{current.word.phonetics}</span>
          <span className="mini-aq-reveal-en">= {current.word.english}</span>
        </div>
      )}

      <div className="mini-aq-options">
        {current.options.map((opt, i) => {
          let cls = "mini-aq-opt";
          if (answered) {
            if (i === current.correctIdx) cls += " correct";
            else if (i === selected) cls += " wrong";
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={answered}
              onClick={() => {
                if (answered) return;
                setSelected(i);
                const correct = i === current.correctIdx;
                if (correct) { setScore(s => s + 1); awardXP("audio_quiz_correct"); }
                else { awardXP("audio_quiz_attempt"); }
                setPhase("answered");
              }}
            >
              <span className="mini-aq-opt-letter">{"ABCD"[i]}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          className="btn btn-pri btn-sm"
          style={{ marginTop: 12, width: "100%" }}
          onClick={() => {
            if (idx + 1 >= questions.length) setPhase("done");
            else { setIdx(i => i + 1); setSelected(null); setPhase("playing"); }
          }}
        >
          {idx + 1 >= questions.length ? "See Results" : "Next →"}
        </button>
      )}
    </div>
  );
}
