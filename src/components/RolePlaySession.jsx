import { useState, useRef, useEffect, useCallback } from "react";
import { compareThai } from "../utils/thaiMatch";
import { speakThai } from "../utils/speech";
import { loadLS, saveLS, K_ROLEPLAY } from "../utils/storage";

export function RolePlaySession({ scenario, scenarioIndex, onExit }) {
  const [phase, setPhase] = useState("intro"); // intro | playing | summary
  const [turnIdx, setTurnIdx] = useState(0);
  const [turnPhase, setTurnPhase] = useState("show"); // show | input | feedback
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null); // { score, level }
  const [results, setResults] = useState([]); // { turnIdx, score, attempts, userAnswer }
  const inputRef = useRef(null);

  const turns = scenario.turns;
  const turn = turns[turnIdx] || {};
  const isUser = turn.role === "You";
  const totalTurns = turns.length;
  const userTurns = turns.filter(t => t.role === "You");

  // Focus input when it's user's turn
  useEffect(() => {
    if (turnPhase === "input" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [turnPhase]);

  // When entering a new turn, decide what to show
  useEffect(() => {
    if (phase !== "playing") return;
    setUserInput("");
    setAttempts(0);
    setFeedback(null);

    if (isUser) {
      setTurnPhase("input");
    } else {
      setTurnPhase("show");
      // Auto-speak teacher's Thai after a short delay
      const timer = setTimeout(() => {
        speakThai(turn.thai_hint);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [turnIdx, phase]);

  const recordAndAdvance = useCallback((newResult) => {
    setResults(prev => {
      const updated = [...prev, newResult];
      // If this was the last turn, save best score
      if (turnIdx + 1 >= totalTurns) {
        const userResults = updated.filter(r => turns[r.turnIdx]?.role === "You");
        if (userResults.length > 0) {
          const avgScore = userResults.reduce((s, r) => s + r.score, 0) / userResults.length;
          const saved = loadLS(K_ROLEPLAY, {});
          const prev = saved[scenarioIndex];
          if (!prev || avgScore > prev.bestScore) {
            saved[scenarioIndex] = { bestScore: avgScore, bestDate: new Date().toISOString().slice(0, 10) };
            saveLS(K_ROLEPLAY, saved);
          }
        }
      }
      return updated;
    });
    if (turnIdx + 1 >= totalTurns) {
      setPhase("summary");
    } else {
      setTurnIdx(i => i + 1);
    }
  }, [turnIdx, totalTurns, scenarioIndex, turns]);

  const advanceTurn = useCallback(() => {
    if (turnIdx + 1 >= totalTurns) {
      setPhase("summary");
    } else {
      setTurnIdx(i => i + 1);
    }
  }, [turnIdx, totalTurns]);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const result = compareThai(userInput, turn.thai_hint);
    setFeedback(result);
    setAttempts(a => a + 1);
    setTurnPhase("feedback");
  };

  const handleRetry = () => {
    setUserInput("");
    setFeedback(null);
    setTurnPhase("input");
  };

  const handleSkip = () => {
    recordAndAdvance({ turnIdx, score: feedback?.score || 0, attempts, userAnswer: userInput });
  };

  const handleAcceptAndContinue = () => {
    recordAndAdvance({ turnIdx, score: feedback?.score || 0, attempts, userAnswer: userInput });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && turnPhase === "input") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Calculate summary stats
  const getSummary = () => {
    const userResults = results.filter(r => turns[r.turnIdx]?.role === "You");
    const totalScore = userResults.reduce((s, r) => s + r.score, 0);
    const avgScore = userResults.length > 0 ? totalScore / userResults.length : 0;
    const stars = avgScore >= 0.9 ? 3 : avgScore >= 0.7 ? 2 : 1;
    return { userResults, avgScore, stars };
  };

  // ─── Intro Screen ──────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="rp-container">
        <div className="rp-intro">
          <div className="rp-intro-icon">💬</div>
          <h2 className="rp-intro-title">{scenario.title}</h2>
          <p className="rp-intro-goal">{scenario.goal}</p>
          <div className="rp-intro-info">
            <span>🗣️ {turns.length} turns</span>
            <span>✍️ {userTurns.length} responses</span>
          </div>
          <p className="rp-intro-tip">Type the romanized pronunciation (phonetics) to respond. Politeness particles (ค่ะ/ครับ) are optional.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <button className="btn btn-sec" onClick={onExit}>Back</button>
            <button className="btn btn-pri" onClick={() => setPhase("playing")}>Start Role-Play</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Summary Screen ────────────────────────────────────
  if (phase === "summary") {
    const { userResults, avgScore, stars } = getSummary();
    return (
      <div className="rp-container">
        <div className="rp-summary">
          <div className="rp-stars">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <div className="rp-score-big">{Math.round(avgScore * 100)}%</div>
          <p className="rp-score-label">
            {avgScore >= 0.9 ? "Amazing! You nailed it!" : avgScore >= 0.7 ? "Great job! Keep practicing!" : "Good effort! Try again to improve!"}
          </p>

          <div className="rp-breakdown">
            <h3>Turn-by-turn breakdown</h3>
            {userResults.map((r, i) => {
              const t = turns[r.turnIdx];
              return (
                <div key={i} className={`rp-breakdown-row ${r.score >= 0.9 ? "perfect" : r.score >= 0.6 ? "close" : "wrong"}`}>
                  <div className="rp-breakdown-prompt">{t.prompt_en}</div>
                  <div className="rp-breakdown-detail">
                    <span className="rp-breakdown-yours">You: {r.userAnswer}</span>
                    <span className="rp-breakdown-expected">Expected: {t.thai_hint}</span>
                  </div>
                  <div className="rp-breakdown-score">
                    {r.score >= 0.9 ? "✅" : r.score >= 0.6 ? "🟡" : "❌"} {Math.round(r.score * 100)}%
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
            <button className="btn btn-sec" onClick={onExit}>Pick Another</button>
            <button className="btn btn-pri" onClick={() => { setTurnIdx(0); setResults([]); setPhase("intro"); }}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Playing Screen ────────────────────────────────────
  const progress = ((turnIdx + 1) / totalTurns) * 100;

  return (
    <div className="rp-container">
      {/* Header */}
      <div className="rp-header">
        <button className="btn btn-sec btn-sm" onClick={onExit}>✕ Exit</button>
        <span className="rp-header-title">{scenario.title}</span>
      </div>

      {/* Progress */}
      <div className="rp-prog-label">Turn {turnIdx + 1} of {totalTurns}</div>
      <div className="rp-prog">
        <div className="rp-prog-fill" style={{ width: `${progress}%` }}/>
      </div>

      {/* Turn Content */}
      {!isUser ? (
        /* ─── Teacher Turn ─── */
        <div className="rp-turn">
          <div className="rp-role teacher">Teacher</div>
          <div className="rp-teacher-bub">
            <div className="rp-prompt">{turn.prompt_en}</div>
            <div className="rp-thai">
              {turn.thai_hint}
              <button className="conv-speak" onClick={() => speakThai(turn.thai_hint)} title="Listen again">🔊</button>
            </div>
          </div>
          <button className="btn btn-pri" onClick={advanceTurn} style={{ marginTop: 12 }}>
            Continue →
          </button>
        </div>
      ) : (
        /* ─── User Turn ─── */
        <div className="rp-turn">
          <div className="rp-role you">Your Turn</div>
          <div className="rp-prompt-card">
            <div className="rp-prompt">{turn.prompt_en}</div>
          </div>

          {turnPhase === "input" && (
            <div className="rp-input-area">
              <input
                ref={inputRef}
                className="rp-input"
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your Thai response..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <button className="btn btn-pri" onClick={handleSubmit} disabled={!userInput.trim()} style={{ marginTop: 10 }}>
                Check →
              </button>
              {attempts > 0 && (
                <button className="btn btn-sec btn-sm" onClick={() => { handleSkip(); }} style={{ marginTop: 6, marginLeft: 8 }}>
                  Skip this turn
                </button>
              )}
            </div>
          )}

          {turnPhase === "feedback" && feedback && (
            <div className={`rp-fb ${feedback.level}`}>
              {feedback.level === "perfect" && (
                <>
                  <div className="rp-fb-icon">✅ Perfect!</div>
                  <div className="rp-fb-detail">Your answer: <strong>{userInput}</strong></div>
                </>
              )}
              {feedback.level === "close" && (
                <>
                  <div className="rp-fb-icon">🟡 Close!</div>
                  <div className="rp-fb-detail">Your answer: <strong>{userInput}</strong></div>
                  <div className="rp-fb-expected">Expected: <strong>{turn.thai_hint}</strong></div>
                  <button className="conv-speak" onClick={() => speakThai(turn.thai_hint)} title="Listen">🔊</button>
                </>
              )}
              {feedback.level === "wrong" && (
                <>
                  <div className="rp-fb-icon">❌ Not quite</div>
                  <div className="rp-fb-detail">Your answer: <strong>{userInput}</strong></div>
                  <div className="rp-fb-expected">Correct answer: <strong>{turn.thai_hint}</strong></div>
                  <button className="conv-speak" onClick={() => speakThai(turn.thai_hint)} title="Listen">🔊</button>
                </>
              )}

              <div className="rp-fb-actions">
                {feedback.level === "perfect" ? (
                  <button className="btn btn-pri" onClick={handleAcceptAndContinue}>Continue →</button>
                ) : attempts < 3 ? (
                  <>
                    <button className="btn btn-pri" onClick={handleRetry}>Try Again</button>
                    <button className="btn btn-sec" onClick={handleSkip}>Skip</button>
                  </>
                ) : (
                  <button className="btn btn-pri" onClick={handleSkip}>Continue →</button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
