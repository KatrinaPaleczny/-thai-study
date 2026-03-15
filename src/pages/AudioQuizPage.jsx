import { useState, useMemo, useCallback, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";
import { SpeakerIcon } from "../components/Icons";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(pool, count = 10) {
  if (pool.length < 4) return [];
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
  return picked.map(word => {
    // Pick 3 distractors with different English meanings
    const others = pool.filter(w => w.id !== word.id && w.english.toLowerCase() !== word.english.toLowerCase());
    const distractors = shuffle(others).slice(0, 3).map(w => w.english);
    const options = shuffle([word.english, ...distractors]);
    return {
      word,
      options,
      correctIdx: options.indexOf(word.english),
    };
  });
}

function QuizOption({ text, idx, selected, correctIdx, answered }) {
  let cls = "aq-option";
  if (answered) {
    if (idx === correctIdx) cls += " correct";
    else if (idx === selected) cls += " wrong";
  } else if (idx === selected) {
    cls += " selected";
  }
  return (
    <button className={cls} disabled={answered}>
      <span className="aq-option-letter">{"ABCD"[idx]}</span>
      <span className="aq-option-text">{text}</span>
    </button>
  );
}

export function AudioQuizPage() {
  const { allVocab, studied } = useApp();
  const [phase, setPhase] = useState("setup"); // setup | playing | answered | results
  const [source, setSource] = useState("studied");
  const [speed, setSpeed] = useState("normal");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);

  const pool = useMemo(() => {
    if (source === "studied") {
      return allVocab.filter(v => studied.has(v.id));
    }
    return allVocab;
  }, [allVocab, studied, source]);

  const current = questions[currentIdx] || null;

  const playAudio = useCallback(() => {
    if (!current) return;
    speakThai(current.word.thai, { rate: speed === "slow" ? 0.5 : 0.85 });
  }, [current, speed]);

  // Auto-play on new question
  useEffect(() => {
    if (phase === "playing" && current) {
      const t = setTimeout(playAudio, 300);
      return () => clearTimeout(t);
    }
  }, [phase, currentIdx, current, playAudio]);

  const startRound = () => {
    const round = generateRound(pool);
    if (round.length === 0) return;
    setQuestions(round);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setHistory([]);
    setPhase("playing");
  };

  const handleSelect = (idx) => {
    if (phase !== "playing" || selected !== null) return;
    setSelected(idx);
    const correct = idx === current.correctIdx;
    if (correct) {
      setScore(s => s + 1);
      awardXP("audio_quiz_correct");
    } else {
      awardXP("audio_quiz_attempt");
    }
    setHistory(h => [...h, {
      word: current.word,
      selectedIdx: idx,
      correctIdx: current.correctIdx,
      correct,
      options: current.options,
    }]);
    setPhase("answered");
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      setPhase("results");
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setPhase("playing");
    }
  };

  const studiedCount = allVocab.filter(v => studied.has(v.id)).length;

  // ── Setup Phase ──
  if (phase === "setup") {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">🎧 Audio Quiz</div>
          <div className="ph-s">Listen and identify — no text hints!</div>
        </div>

        <div className="aq-setup">
          <div className="aq-setup-section">
            <div className="aq-setup-label">Word Pool</div>
            <div className="chips">
              <button
                className={`chip${source === "studied" ? " on" : ""}`}
                onClick={() => setSource("studied")}
              >
                My Words ({studiedCount})
              </button>
              <button
                className={`chip${source === "all" ? " on" : ""}`}
                onClick={() => setSource("all")}
              >
                All Words ({allVocab.length})
              </button>
            </div>
          </div>

          <div className="aq-setup-section">
            <div className="aq-setup-label">Speed</div>
            <div className="chips">
              <button
                className={`chip${speed === "normal" ? " on" : ""}`}
                onClick={() => setSpeed("normal")}
              >
                Normal
              </button>
              <button
                className={`chip${speed === "slow" ? " on" : ""}`}
                onClick={() => setSpeed("slow")}
              >
                Slow
              </button>
            </div>
          </div>

          {pool.length < 4 && (
            <div className="aq-warning">
              Need at least 4 words in your pool. {source === "studied" ? "Study more words or switch to \"All Words\"." : ""}
            </div>
          )}

          <button
            className="aq-start"
            onClick={startRound}
            disabled={pool.length < 4}
          >
            Start Round ({Math.min(10, pool.length)} questions)
          </button>
        </div>
      </div>
    );
  }

  // ── Playing / Answered Phase ──
  if (phase === "playing" || phase === "answered") {
    const answered = phase === "answered";
    return (
      <div className="page">
        <div className="aq-header">
          <span className="aq-counter">{currentIdx + 1} / {questions.length}</span>
          <span className="aq-score">Score: {score}</span>
          <div className="chips" style={{ marginLeft: "auto" }}>
            <button
              className={`chip${speed === "normal" ? " on" : ""}`}
              onClick={() => setSpeed("normal")}
              style={{ fontSize: 11, padding: "3px 10px" }}
            >
              1x
            </button>
            <button
              className={`chip${speed === "slow" ? " on" : ""}`}
              onClick={() => setSpeed("slow")}
              style={{ fontSize: 11, padding: "3px 10px" }}
            >
              0.5x
            </button>
          </div>
        </div>

        <div className="aq-progress">
          <div className="aq-progress-fill" style={{ width: `${((currentIdx + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>

        <div className="aq-play-area">
          <button className="aq-play-btn" onClick={playAudio} title="Play audio">
            <SpeakerIcon />
            <span>🔊</span>
          </button>
          <div className="aq-play-hint">
            {answered ? "" : "Listen and choose the correct meaning"}
          </div>
        </div>

        {/* Reveal after answering */}
        {answered && (
          <div className="aq-reveal">
            <div className="aq-reveal-thai">{current.word.thai}</div>
            <div className="aq-reveal-ph">{current.word.phonetics}</div>
            <div className="aq-reveal-en">{current.word.english}</div>
            {selected === current.correctIdx ? (
              <div className="aq-feedback correct">Correct!</div>
            ) : (
              <div className="aq-feedback wrong">
                Wrong — the answer was &ldquo;{current.options[current.correctIdx]}&rdquo;
              </div>
            )}
          </div>
        )}

        <div className="aq-options">
          {current.options.map((opt, i) => (
            <div key={i} onClick={() => handleSelect(i)}>
              <QuizOption
                text={opt}
                idx={i}
                selected={selected}
                correctIdx={current.correctIdx}
                answered={answered}
              />
            </div>
          ))}
        </div>

        {answered && (
          <button className="aq-next" onClick={nextQuestion}>
            {currentIdx + 1 >= questions.length ? "See Results" : "Next →"}
          </button>
        )}
      </div>
    );
  }

  // ── Results Phase ──
  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">🎧 Round Complete!</div>
      </div>

      <div className="aq-results">
        <div className="aq-results-score">
          <div className="aq-results-num">{score}/{questions.length}</div>
          <div className="aq-results-label">
            {score === questions.length ? "Perfect! 🎉" :
             score >= questions.length * 0.7 ? "Great job! 👏" :
             score >= questions.length * 0.5 ? "Good effort! 💪" :
             "Keep practicing! 📚"}
          </div>
          <div className="aq-results-xp">
            +{score * 5 + (questions.length - score) * 1} XP earned
          </div>
        </div>

        <div className="aq-history">
          <div className="aq-history-title">Round Review</div>
          {history.map((h, i) => (
            <div key={i} className={`aq-history-row${h.correct ? " correct" : " wrong"}`}>
              <span className="aq-history-num">{i + 1}</span>
              <span className="aq-history-icon">{h.correct ? "✓" : "✗"}</span>
              <div className="aq-history-word">
                <span className="aq-history-thai">{h.word.thai}</span>
                <span className="aq-history-ph">{h.word.phonetics}</span>
              </div>
              <span className="aq-history-en">{h.word.english}</span>
              <button
                className="gb-speak"
                onClick={() => speakThai(h.word.thai, { rate: speed === "slow" ? 0.5 : 0.85 })}
              >
                <SpeakerIcon />
              </button>
            </div>
          ))}
        </div>

        <button className="aq-start" onClick={() => { setPhase("setup"); }}>
          Play Again
        </button>
      </div>
    </div>
  );
}
