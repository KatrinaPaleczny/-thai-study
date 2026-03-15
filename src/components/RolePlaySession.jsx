import { useState, useRef, useEffect, useCallback } from "react";
import { compareThai } from "../utils/thaiMatch";
import { speakThai } from "../utils/speech";
import { loadLS, saveLS, K_ROLEPLAY } from "../utils/storage";
import { callClaude, MODELS } from "../utils/ai";
import { awardXP } from "../utils/xp";
import { recordMistake } from "../utils/mistakes";

const MAX_AI_TURNS = 8;

export function RolePlaySession({ scenario, scenarioIndex, onExit, aiMode = false }) {
  const [phase, setPhase] = useState("intro"); // intro | playing | summary
  const [turnIdx, setTurnIdx] = useState(0);
  const [turnPhase, setTurnPhase] = useState("show"); // show | input | feedback
  const [userInput, setUserInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null); // { score, level }
  const [results, setResults] = useState([]); // { turnIdx, score, attempts, userAnswer }
  const inputRef = useRef(null);

  // ─── AI Mode state ───
  const [aiMessages, setAiMessages] = useState([]); // { role: "user"|"assistant", content }
  const [aiTeacherText, setAiTeacherText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTurnCount, setAiTurnCount] = useState(0);
  const [aiCorrections, setAiCorrections] = useState([]); // { userMsg, correction }
  const [aiError, setAiError] = useState(null);
  const aiChatEndRef = useRef(null);
  const aiInputRef = useRef(null);

  const turns = scenario.turns;
  const turn = turns[turnIdx] || {};
  const isUser = turn.role === "You";
  const totalTurns = turns.length;
  const userTurns = turns.filter(t => t.role === "You");

  // Focus input when it's user's turn (scripted mode)
  useEffect(() => {
    if (turnPhase === "input" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [turnPhase]);

  // When entering a new turn, decide what to show (scripted mode)
  useEffect(() => {
    if (phase !== "playing" || aiMode) return;
    setUserInput("");
    setAttempts(0);
    setFeedback(null);

    if (isUser) {
      setTurnPhase("input");
    } else {
      setTurnPhase("show");
      const timer = setTimeout(() => {
        speakThai(turn.thai || turn.thai_hint);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [turnIdx, phase]);

  // AI mode: scroll to bottom and focus input
  useEffect(() => {
    if (aiMode) {
      aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiMessages, aiLoading]);

  useEffect(() => {
    if (aiMode && !aiLoading && aiInputRef.current && phase === "playing") {
      aiInputRef.current.focus();
    }
  }, [aiLoading, aiMessages, phase]);

  // AI mode: start conversation when entering playing phase
  useEffect(() => {
    if (aiMode && phase === "playing" && aiMessages.length === 0) {
      sendAIMessage(null);
    }
  }, [phase, aiMode]);

  // ─── AI Mode Logic ───
  const buildSystemPrompt = () => {
    return `You are playing a role in a Thai language practice scenario.

Scenario: ${scenario.title}
Goal: ${scenario.goal}
Level: ${scenario.level || "A1"}

INSTRUCTIONS:
- You are the "teacher" / conversation partner in this scenario
- Speak naturally in Thai first, then provide English translation in parentheses
- Format: Thai text (English translation)
- Keep responses short (1-3 sentences)
- Match the student's ${scenario.level || "A1"} level — use simple vocabulary and grammar
- If the user writes in Thai with mistakes, include a "💡 Correction:" section at the end showing the correct Thai with explanation
- If this is the start of conversation, greet the user naturally in Thai and set up the scenario
- Be encouraging and patient
- After about ${MAX_AI_TURNS} exchanges, naturally wrap up the conversation`;
  };

  const sendAIMessage = async (userMsg) => {
    setAiLoading(true);
    setAiError(null);

    const newMessages = [...aiMessages];
    if (userMsg) {
      newMessages.push({ role: "user", content: userMsg });
    }

    try {
      const apiMessages = newMessages.length > 0
        ? newMessages
        : [{ role: "user", content: "สวัสดีครับ (start the scenario)" }];

      const reply = await callClaude({
        system: buildSystemPrompt(),
        messages: apiMessages,
        model: MODELS.SONNET,
        maxTokens: 300,
      });

      // Check for corrections
      const correctionMatch = reply.match(/💡\s*Correction:?\s*([\s\S]*?)$/i);
      if (correctionMatch && userMsg) {
        const correction = correctionMatch[1].trim();
        setAiCorrections(c => [...c, { userMsg, correction }]);
        recordMistake({
          source: "roleplay",
          prompt: userMsg,
          userAnswer: userMsg,
          correctAnswer: correction,
          score: 0.5,
        });
      }

      if (userMsg) {
        awardXP("roleplay_turn");
        setAiTurnCount(c => c + 1);
      }

      const updated = [...newMessages, { role: "assistant", content: reply }];
      setAiMessages(updated);
      setAiTeacherText(reply);

      // Auto-speak the Thai part
      const thaiParts = reply.split(/\s*\(/).map(p => p.replace(/\).*/, "").trim());
      const thaiText = thaiParts[0]?.replace(/💡[\s\S]*$/, "").trim();
      if (thaiText) {
        setTimeout(() => speakThai(thaiText), 300);
      }

    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAISend = () => {
    if (!userInput.trim() || aiLoading) return;
    const msg = userInput.trim();
    setUserInput("");

    // Check if we've reached the turn limit
    if (aiTurnCount + 1 >= MAX_AI_TURNS) {
      // Send the last message then go to summary
      setAiMessages(prev => [...prev, { role: "user", content: msg }]);
      awardXP("roleplay_turn");
      setAiTurnCount(c => c + 1);
      setPhase("summary");
      return;
    }

    sendAIMessage(msg);
  };

  const handleAIKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAISend();
    }
  };

  // ─── Scripted Mode Logic ───
  const recordAndAdvance = useCallback((newResult) => {
    setResults(prev => {
      const updated = [...prev, newResult];
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
          <div className="rp-intro-icon">{aiMode ? "🤖" : "💬"}</div>
          <h2 className="rp-intro-title">{scenario.title}</h2>
          <p className="rp-intro-goal">{scenario.goal}</p>
          {aiMode ? (
            <div className="rp-intro-info">
              <span>🤖 AI Mode — Dynamic conversation</span>
            </div>
          ) : (
            <div className="rp-intro-info">
              <span>🗣️ {turns.length} turns</span>
              <span>✍️ {userTurns.length} responses</span>
            </div>
          )}
          <p className="rp-intro-tip">
            {aiMode
              ? "Type in Thai (script or romanized) or English. Claude will respond naturally and correct your Thai."
              : "Type the romanized pronunciation (phonetics) to respond. Politeness particles (ค่ะ/ครับ) are optional."}
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <button className="btn btn-sec" onClick={onExit}>Back</button>
            <button className="btn btn-pri" onClick={() => setPhase("playing")}>
              {aiMode ? "Start AI Chat" : "Start Role-Play"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── AI Summary Screen ──────────────────────────────────
  if (phase === "summary" && aiMode) {
    return (
      <div className="rp-container">
        <div className="rp-summary">
          <div className="rp-stars">{"⭐".repeat(aiTurnCount >= 6 ? 3 : aiTurnCount >= 3 ? 2 : 1)}</div>
          <div className="rp-score-big">{aiTurnCount}</div>
          <p className="rp-score-label">
            {aiTurnCount >= 6
              ? "Great conversation! You kept going!"
              : aiTurnCount >= 3
                ? "Good practice! Try for more turns next time."
                : "Keep at it! The more you chat, the more you learn."}
          </p>
          <p style={{ fontSize: 13, color: "var(--t2)", marginBottom: 20 }}>
            {aiTurnCount} turn{aiTurnCount !== 1 ? "s" : ""} exchanged
            {aiCorrections.length > 0 ? ` · ${aiCorrections.length} correction${aiCorrections.length !== 1 ? "s" : ""}` : ""}
          </p>

          {aiCorrections.length > 0 && (
            <div className="rp-breakdown" style={{ marginBottom: 20 }}>
              <h3>Corrections</h3>
              {aiCorrections.map((c, i) => (
                <div key={i} className="rp-breakdown-row wrong">
                  <div className="rp-breakdown-prompt">You said: {c.userMsg}</div>
                  <div className="rp-breakdown-detail">
                    <span className="rp-breakdown-expected">Correction: {c.correction}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
            <button className="btn btn-sec" onClick={onExit}>Pick Another</button>
            <button className="btn btn-pri" onClick={() => {
              setAiMessages([]);
              setAiTurnCount(0);
              setAiCorrections([]);
              setAiTeacherText("");
              setAiError(null);
              setUserInput("");
              setPhase("intro");
            }}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Scripted Summary Screen ────────────────────────────
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

  // ─── AI Playing Screen ──────────────────────────────────
  if (aiMode) {
    return (
      <div className="rp-container">
        {/* Header */}
        <div className="rp-header">
          <button className="btn btn-sec btn-sm" onClick={onExit}>✕ Exit</button>
          <span className="rp-header-title">🤖 {scenario.title}</span>
        </div>

        {/* Progress */}
        <div className="rp-prog-label">Turn {aiTurnCount} of ~{MAX_AI_TURNS}</div>
        <div className="rp-prog">
          <div className="rp-prog-fill" style={{ width: `${Math.min((aiTurnCount / MAX_AI_TURNS) * 100, 100)}%` }} />
        </div>

        {/* Chat Messages */}
        <div className="aic-chat-messages" style={{ minHeight: 200, maxHeight: 400 }}>
          {aiMessages.map((m, i) => (
            <div key={i} className={`aic-msg ${m.role}`}>
              <div className="aic-msg-bubble">
                {m.content}
                {m.role === "assistant" && (
                  <button
                    className="aic-speak-btn"
                    onClick={() => {
                      const thaiParts = m.content.split(/\s*\(/).map(p => p.replace(/\).*/, "").trim());
                      speakThai(thaiParts[0]?.replace(/💡[\s\S]*$/, "").trim() || m.content);
                    }}
                    title="Listen"
                  >🔊</button>
                )}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div className="aic-msg assistant">
              <div className="aic-msg-bubble aic-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={aiChatEndRef} />
        </div>

        {aiError && <div className="aic-error">{aiError}</div>}

        {/* Input */}
        <div className="aic-input-bar">
          <input
            ref={aiInputRef}
            className="aic-input"
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={handleAIKeyDown}
            placeholder="Type in Thai or English..."
            disabled={aiLoading}
            autoComplete="off"
            lang="th"
          />
          <button className="btn btn-pri" onClick={handleAISend} disabled={aiLoading || !userInput.trim()}>
            Send
          </button>
        </div>

        {/* End Chat button */}
        {aiTurnCount >= 2 && (
          <button
            className="btn btn-sec btn-sm"
            onClick={() => setPhase("summary")}
            style={{ marginTop: 12, display: "block", marginLeft: "auto", marginRight: "auto" }}
          >
            End Conversation
          </button>
        )}

        {/* Corrections this session */}
        {aiCorrections.length > 0 && (
          <div className="aic-corrections">
            <div className="aic-corrections-title">Corrections this session</div>
            {aiCorrections.map((c, i) => (
              <div key={i} className="aic-correction-item">
                <span className="aic-correction-you">You: {c.userMsg}</span>
                <span className="aic-correction-fix">→ {c.correction}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Scripted Playing Screen ────────────────────────────
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
              <button className="conv-speak" onClick={() => speakThai(turn.thai || turn.thai_hint)} title="Listen again">🔊</button>
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
                  <button className="conv-speak" onClick={() => speakThai(turn.thai || turn.thai_hint)} title="Listen">🔊</button>
                </>
              )}
              {feedback.level === "wrong" && (
                <>
                  <div className="rp-fb-icon">❌ Not quite</div>
                  <div className="rp-fb-detail">Your answer: <strong>{userInput}</strong></div>
                  <div className="rp-fb-expected">Correct answer: <strong>{turn.thai_hint}</strong></div>
                  <button className="conv-speak" onClick={() => speakThai(turn.thai || turn.thai_hint)} title="Listen">🔊</button>
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
