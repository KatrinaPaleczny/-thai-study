import { useState, useMemo, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";

export function ListeningPage() {
  const { allVocab } = useApp();
  const [cat, setCat] = useState("All");
  const [wordIdx, setWordIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState(null); // null | "correct" | "close" | "wrong"
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [mode, setMode] = useState("thai"); // "thai" | "phonetic"
  const [speed, setSpeed] = useState("normal"); // "normal" | "slow"
  const [playedOnce, setPlayedOnce] = useState(false);

  const cats = useMemo(() => ["All", ...new Set(allVocab.map(w => w.category))], [allVocab]);
  const words = useMemo(() => {
    const filtered = cat === "All" ? allVocab : allVocab.filter(w => w.category === cat);
    return filtered.length > 0 ? filtered : allVocab;
  }, [allVocab, cat]);
  const word = words[wordIdx % words.length];

  const playAudio = useCallback(() => {
    if (!word) return;
    speakThai(word.thai, { rate: speed === "slow" ? 0.5 : 0.85 });
    setPlayedOnce(true);
  }, [word, speed]);

  const normalizeForCompare = (text) => {
    return text.replace(/[\s\u200B\u200C\u200D]/g, "").toLowerCase().trim();
  };

  const checkAnswer = () => {
    if (!userInput.trim() || !word) return;
    const input = normalizeForCompare(userInput);

    // Check against Thai script
    const thaiMatch = normalizeForCompare(word.thai) === input;
    // Check against phonetics
    const phonMatch = word.phonetics && normalizeForCompare(word.phonetics) === normalizeForCompare(userInput.trim());
    // Partial match (character overlap)
    const target = mode === "phonetic" ? normalizeForCompare(word.phonetics || "") : normalizeForCompare(word.thai);
    let overlap = 0;
    const targetChars = new Set(target);
    const inputChars = new Set(input);
    for (const c of inputChars) if (targetChars.has(c)) overlap++;
    const similarity = targetChars.size > 0 ? overlap / Math.max(targetChars.size, inputChars.size) : 0;

    let res;
    if (thaiMatch || phonMatch) {
      res = "correct";
      awardXP("practice_correct");
    } else if (similarity >= 0.6) {
      res = "close";
    } else {
      res = "wrong";
    }

    setResult(res);
    setScore(prev => ({
      correct: prev.correct + (res === "correct" ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextWord = () => {
    setWordIdx(i => (i + 1) % words.length);
    setUserInput("");
    setResult(null);
    setShowAnswer(false);
    setPlayedOnce(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (result) nextWord();
      else checkAnswer();
    }
  };

  if (!word) return <div className="page"><div className="empty">No vocabulary loaded</div></div>;

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Listening Dictation</div>
        <div className="ph-s">Hear Thai and type what you hear — train your ear</div>
      </div>

      {/* Controls */}
      <div className="ld-controls">
        <select className="pron-cat-select" value={cat} onChange={e => { setCat(e.target.value); setWordIdx(0); setResult(null); setUserInput(""); }}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="ld-mode-toggle">
          <button className={`btn btn-sm ${mode === "thai" ? "btn-pri" : "btn-sec"}`} onClick={() => setMode("thai")}>Type Thai</button>
          <button className={`btn btn-sm ${mode === "phonetic" ? "btn-pri" : "btn-sec"}`} onClick={() => setMode("phonetic")}>Type Phonetic</button>
        </div>
        {score.total > 0 && (
          <span className="ld-score">{score.correct}/{score.total} correct</span>
        )}
      </div>

      {/* Audio Card */}
      <div className="ld-card">
        <div className="ld-emoji">{word.emoji}</div>
        <div className="ld-hint">{word.english}</div>

        <div className="ld-play-area">
          <button className="ld-play-btn" onClick={playAudio}>
            {playedOnce ? "🔊 Play Again" : "🔊 Listen"}
          </button>
          <div className="ld-speed-toggle">
            <button className={`btn btn-sm ${speed === "normal" ? "btn-pri" : "btn-sec"}`} onClick={() => { setSpeed("normal"); }}>Normal</button>
            <button className={`btn btn-sm ${speed === "slow" ? "btn-pri" : "btn-sec"}`} onClick={() => { setSpeed("slow"); }}>Slow</button>
          </div>
        </div>

        {/* Input */}
        <div className="ld-input-area">
          <input
            className="rp-input"
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === "thai" ? "Type in Thai script..." : "Type the phonetic spelling..."}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={!!result}
          />
          {!result ? (
            <div className="ld-btn-row">
              <button className="btn btn-pri" onClick={checkAnswer} disabled={!userInput.trim()}>Check</button>
              <button className="btn btn-sec btn-sm" onClick={() => setShowAnswer(true)}>Show Answer</button>
            </div>
          ) : (
            <button className="btn btn-pri" onClick={nextWord} style={{ marginTop: 10 }}>Next Word →</button>
          )}
        </div>

        {/* Show answer */}
        {showAnswer && !result && (
          <div className="ld-answer-reveal">
            <div className="ld-answer-thai">{word.thai}</div>
            <div className="ld-answer-phon">{word.phonetics}</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`ld-result ${result}`}>
            {result === "correct" && <div className="ld-result-icon">✅ Correct!</div>}
            {result === "close" && <div className="ld-result-icon">🟡 Close!</div>}
            {result === "wrong" && <div className="ld-result-icon">❌ Not quite</div>}
            <div className="ld-result-answer">
              <strong>{word.thai}</strong> — {word.phonetics}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="pron-nav">
        <button className="btn btn-sec" onClick={() => { setWordIdx(i => (i - 1 + words.length) % words.length); setResult(null); setUserInput(""); setShowAnswer(false); setPlayedOnce(false); }}>← Previous</button>
        <span className="pron-nav-count">{(wordIdx % words.length) + 1} / {words.length}</span>
        <button className="btn btn-pri" onClick={nextWord}>Next →</button>
      </div>
    </div>
  );
}
