import { useState, useEffect, useCallback } from "react";
import { awardXP } from "../utils/xp";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(characters, count = 5) {
  if (characters.length < 3) return [];
  const picked = shuffle(characters).slice(0, Math.min(count, characters.length));

  return picked.map((ch, i) => {
    const others = characters.filter(c => c.char !== ch.char && c.phonetic !== ch.phonetic);
    const distractors = shuffle(others).slice(0, Math.min(3, others.length));

    if (i % 2 === 0) {
      // char → sound
      const options = shuffle([
        { text: ch.phonetic, correct: true },
        ...distractors.map(d => ({ text: d.phonetic, correct: false })),
      ]);
      return {
        type: "char-to-sound",
        display: ch.char,
        prompt: "What sound does this character make?",
        options: options.map(o => o.text),
        correctIdx: options.findIndex(o => o.correct),
      };
    } else {
      // sound → char
      const options = shuffle([
        { text: ch.char, correct: true },
        ...distractors.map(d => ({ text: d.char, correct: false })),
      ]);
      return {
        type: "sound-to-char",
        display: ch.phonetic,
        prompt: "Which character makes this sound?",
        options: options.map(o => o.text),
        correctIdx: options.findIndex(o => o.correct),
      };
    }
  });
}

export function ScriptMiniQuiz({ characters }) {
  const [phase, setPhase] = useState("ready"); // ready | playing | answered | done
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const current = questions[idx] || null;

  const start = useCallback(() => {
    const qs = generateQuestions(characters);
    if (qs.length === 0) return;
    setQuestions(qs);
    setIdx(0);
    setSelected(null);
    setScore(0);
    setPhase("playing");
  }, [characters]);

  if (characters.length < 3) {
    return <div className="mini-aq-msg">Need at least 3 characters for a quiz.</div>;
  }

  if (phase === "ready") {
    return (
      <div className="mini-aq-start-area">
        <p className="mini-aq-desc">Test your character recognition — identify sounds and shapes.</p>
        <button className="btn btn-pri btn-sm" onClick={start}>
          Start ({Math.min(5, characters.length)} questions)
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

  if (!current) return null;
  const answered = phase === "answered";
  const isCharDisplay = current.type === "char-to-sound";

  return (
    <div className="mini-aq">
      <div className="mini-aq-header">
        <span>{idx + 1}/{questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="script-quiz-display">
        {isCharDisplay ? (
          <div className="script-quiz-char">{current.display}</div>
        ) : (
          <div className="script-quiz-phonetic">{current.display}</div>
        )}
        <div className="script-quiz-prompt">{current.prompt}</div>
      </div>

      <div className="mini-aq-options">
        {current.options.map((opt, i) => {
          let cls = "mini-aq-opt";
          if (answered) {
            if (i === current.correctIdx) cls += " correct";
            else if (i === selected) cls += " wrong";
          }
          const isThaiOption = current.type === "sound-to-char";
          return (
            <button
              key={i}
              className={cls}
              disabled={answered}
              onClick={() => {
                if (answered) return;
                setSelected(i);
                const correct = i === current.correctIdx;
                if (correct) { setScore(s => s + 1); awardXP("script_quiz_correct"); }
                else { awardXP("script_quiz_attempt"); }
                setPhase("answered");
              }}
            >
              <span className="mini-aq-opt-letter">{"ABCD"[i]}</span>
              <span style={isThaiOption ? { fontFamily: "var(--thai)", fontSize: 22 } : undefined}>{opt}</span>
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
