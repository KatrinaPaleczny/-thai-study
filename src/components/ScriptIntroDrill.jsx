import { useState, useMemo } from "react";
import { awardXP } from "../utils/xp";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateDrillQuestions(pool, count) {
  const targets = shuffle(pool).slice(0, count);
  return targets.map((target, i) => {
    // All pool chars are options (2-4 options depending on pool size)
    if (i % 2 === 0) {
      // sound → char
      const options = shuffle(pool).map(c => ({ text: c.char, correct: c.char === target.char }));
      return {
        type: "sound-to-char",
        display: target.phonetic,
        prompt: `Which character makes the "${target.phonetic}" sound?`,
        options: options.map(o => o.text),
        correctIdx: options.findIndex(o => o.correct),
      };
    } else {
      // char → sound
      const options = shuffle(pool).map(c => ({ text: c.phonetic, correct: c.phonetic === target.phonetic }));
      return {
        type: "char-to-sound",
        display: target.char,
        prompt: "What sound does this character make?",
        options: options.map(o => o.text),
        correctIdx: options.findIndex(o => o.correct),
      };
    }
  });
}

function generateSteps(characters) {
  if (characters.length < 3) return [];

  const steps = [];
  const introduced = [];

  // Split into groups: first 2, then 1-2 at a time
  const groups = [];
  groups.push(characters.slice(0, 2));
  let remaining = characters.slice(2);
  while (remaining.length > 0) {
    const take = remaining.length === 1 ? 1 : 2;
    groups.push(remaining.slice(0, take));
    remaining = remaining.slice(take);
  }

  for (const group of groups) {
    introduced.push(...group);
    steps.push({ type: "intro", newChars: group, pool: [...introduced] });
    const qCount = introduced.length <= 2 ? 2 : 3;
    steps.push({ type: "drill", questions: generateDrillQuestions([...introduced], qCount), pool: [...introduced] });
  }

  // Final cumulative drill if multiple groups
  if (groups.length > 1) {
    steps.push({ type: "drill", questions: generateDrillQuestions(characters, 3), pool: [...characters], isFinal: true });
  }

  return steps;
}

export function ScriptIntroDrill({ characters }) {
  const [steps, setSteps] = useState(() => generateSteps(characters));
  const [stepIdx, setStepIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("active"); // active | done
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const totalQuestions = useMemo(
    () => steps.reduce((sum, s) => sum + (s.type === "drill" ? s.questions.length : 0), 0),
    [steps]
  );

  if (characters.length < 3) {
    return <div className="mini-aq-msg">Need at least 3 characters for the intro drill.</div>;
  }

  const restart = () => {
    const newSteps = generateSteps(characters);
    setSteps(newSteps);
    setStepIdx(0);
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setTotal(0);
    setPhase("active");
  };

  if (phase === "done") {
    return (
      <div className="mini-aq-done">
        <div className="mini-aq-done-score">{score}/{total} correct</div>
        <div className="mini-aq-done-msg">
          {score === total ? "Perfect! 🎉" :
           score >= total * 0.7 ? "Nice work! 👏" : "Keep practicing! 💪"}
        </div>
        <div className="sid-done-chars">
          {characters.map(c => (
            <span key={c.char} className="sid-done-char" style={{ fontFamily: "var(--thai)" }}>{c.char}</span>
          ))}
        </div>
        <div className="sid-done-hint">Now try the Matching Game below!</div>
        <button className="btn btn-sec btn-sm" onClick={restart} style={{ marginTop: 12 }}>
          Practice Again
        </button>
      </div>
    );
  }

  const step = steps[stepIdx];
  if (!step) return null;

  const advanceStep = () => {
    if (stepIdx + 1 >= steps.length) {
      setPhase("done");
    } else {
      setStepIdx(stepIdx + 1);
      setQIdx(0);
      setSelected(null);
    }
  };

  // Progress: which step pair are we on?
  const introSteps = steps.filter(s => s.type === "intro");
  const currentIntroIdx = steps.slice(0, stepIdx + 1).filter(s => s.type === "intro").length;
  const hasFinal = steps[steps.length - 1]?.isFinal;
  const totalRounds = introSteps.length + (hasFinal ? 1 : 0);
  const currentRound = step.type === "intro"
    ? currentIntroIdx
    : step.isFinal
      ? totalRounds
      : currentIntroIdx;

  /* ── Intro phase ── */
  if (step.type === "intro") {
    return (
      <div className="sid-wrap">
        <div className="sid-progress">
          <span>Round {currentRound} of {totalRounds}</span>
          <span className="sid-progress-label">Meet new characters</span>
        </div>
        <div className="sid-intro-cards">
          {step.newChars.map(ch => (
            <div key={ch.char} className="sid-intro-card">
              <div className="sid-intro-char" style={{ fontFamily: "var(--thai)" }}>{ch.char}</div>
              <div className="sid-intro-phonetic">{ch.phonetic}</div>
              <div className="sid-intro-name">{ch.name}</div>
              <span className={`script-class ${ch.class}`}>{ch.class}</span>
              {ch.mnemonic && <div className="sid-intro-mnemonic">{ch.mnemonic}</div>}
            </div>
          ))}
        </div>
        <button className="btn btn-pri btn-sm" style={{ width: "100%", marginTop: 16 }} onClick={advanceStep}>
          Got it — Drill me!
        </button>
      </div>
    );
  }

  /* ── Drill phase ── */
  const q = step.questions[qIdx];
  if (!q) return null;
  const answered = selected !== null;
  const isCharDisplay = q.type === "char-to-sound";
  const isThaiOption = q.type === "sound-to-char";

  return (
    <div className="sid-wrap">
      <div className="sid-progress">
        <span>Round {currentRound} of {totalRounds}{step.isFinal ? " — Final review" : ""}</span>
        <span>Q {qIdx + 1}/{step.questions.length} · Score: {score}</span>
      </div>

      <div className="script-quiz-display">
        {isCharDisplay ? (
          <div className="script-quiz-char">{q.display}</div>
        ) : (
          <div className="script-quiz-phonetic">{q.display}</div>
        )}
        <div className="script-quiz-prompt">{q.prompt}</div>
      </div>

      <div className="mini-aq-options">
        {q.options.map((opt, i) => {
          let cls = "mini-aq-opt";
          if (answered) {
            if (i === q.correctIdx) cls += " correct";
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
                const correct = i === q.correctIdx;
                if (correct) { setScore(s => s + 1); awardXP("script_drill_correct"); }
                else { awardXP("script_drill_attempt"); }
                setTotal(t => t + 1);
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
            if (qIdx + 1 >= step.questions.length) {
              advanceStep();
            } else {
              setQIdx(qIdx + 1);
              setSelected(null);
            }
          }}
        >
          {qIdx + 1 >= step.questions.length
            ? (stepIdx + 1 >= steps.length ? "See Results" : "Next →")
            : "Next →"}
        </button>
      )}
    </div>
  );
}
