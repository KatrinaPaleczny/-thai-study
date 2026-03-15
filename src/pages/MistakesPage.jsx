import { useState, useEffect, useCallback } from "react";
import { loadMistakes, markReviewed, removeMistake, clearReviewed, getMistakeStats } from "../utils/mistakes";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";
import { callClaude, hasAIAccess, MODELS } from "../utils/ai";

const SOURCE_LABELS = {
  flashcard: "🃏 Flashcard",
  roleplay: "💬 Role-Play",
  practice: "🎯 Practice",
  writing: "✍️ Writing",
  unit_test: "📝 Unit Test",
  other: "📝 Other",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateMistakeQuiz(mistakes) {
  // Need at least 2 mistakes to create distractors
  if (mistakes.length < 2) return [];

  // Use mistakes that have both prompt and correctAnswer
  const quizzable = mistakes.filter(m => m.prompt && m.correctAnswer);
  if (quizzable.length < 2) return [];

  const picked = shuffle(quizzable).slice(0, Math.min(10, quizzable.length));

  return picked.map(m => {
    // Get distractors from other mistakes' correct answers
    const others = quizzable.filter(o => o.id !== m.id && o.correctAnswer !== m.correctAnswer);
    const distractorPool = others.length >= 3
      ? shuffle(others).slice(0, 3).map(o => o.correctAnswer)
      : [...shuffle(others).map(o => o.correctAnswer), ...["(none)", "(skip)", "(other)"]].slice(0, 3);
    const options = shuffle([m.correctAnswer, ...distractorPool]);
    return {
      mistake: m,
      prompt: m.prompt,
      options,
      correctIdx: options.indexOf(m.correctAnswer),
    };
  });
}

function MistakeQuiz({ mistakes, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("playing"); // playing | answered | done
  const [history, setHistory] = useState([]);

  const start = useCallback(() => {
    const qs = generateMistakeQuiz(mistakes);
    setQuestions(qs);
    setIdx(0);
    setSelected(null);
    setScore(0);
    setPhase("playing");
    setHistory([]);
  }, [mistakes]);

  useEffect(() => { start(); }, [start]);

  const current = questions[idx];

  if (questions.length === 0) {
    return (
      <div className="mq-empty">
        <p>Need at least 2 mistakes with recorded answers to create a quiz.</p>
        <button className="btn btn-sec" onClick={onFinish}>Back to Journal</button>
      </div>
    );
  }

  if (phase === "done") {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    return (
      <div className="mq-done">
        <div className="mq-done-icon">{pct >= 80 ? "🎉" : pct >= 50 ? "👏" : "💪"}</div>
        <div className="mq-done-score">{score}/{questions.length} correct ({pct}%)</div>
        <div className="mq-done-msg">
          {pct === 100 ? "Perfect! You've mastered these!" :
           pct >= 80 ? "Great job! Almost there!" :
           pct >= 50 ? "Good effort — keep reviewing!" :
           "These need more practice — keep at it!"}
        </div>

        {/* Show what you got wrong */}
        {history.filter(h => !h.correct).length > 0 && (
          <div className="mq-review">
            <div className="mq-review-title">Still needs work:</div>
            {history.filter(h => !h.correct).map((h, i) => (
              <div key={i} className="mq-review-item">
                <div className="mq-review-prompt">{h.prompt}</div>
                <div className="mq-review-answer">
                  Answer: <strong>{h.correctAnswer}</strong>
                  {h.correctAnswer && (
                    <button className="conv-speak" onClick={() => speakThai(h.correctAnswer)} title="Listen">🔊</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mq-done-actions">
          <button className="btn btn-pri" onClick={start}>Try Again</button>
          <button className="btn btn-sec" onClick={onFinish}>Back to Journal</button>
        </div>
      </div>
    );
  }

  if (!current) return null;
  const answered = phase === "answered";

  return (
    <div className="mq-quiz">
      <div className="mq-header">
        <span>{idx + 1}/{questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="mq-progress">
        <div className="mq-progress-fill" style={{ width: `${((idx + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <div className="mq-prompt">{current.prompt}</div>

      <div className="mq-options">
        {current.options.map((opt, i) => {
          let cls = "mq-opt";
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
                if (correct) {
                  setScore(s => s + 1);
                  awardXP("mistake_quiz_correct");
                }
                setHistory(h => [...h, {
                  prompt: current.prompt,
                  correctAnswer: current.mistake.correctAnswer,
                  correct,
                }]);
                setPhase("answered");
              }}
            >
              <span className="mq-opt-letter">{"ABCD"[i]}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mq-feedback-row">
          <div className={`mq-feedback ${selected === current.correctIdx ? "correct" : "wrong"}`}>
            {selected === current.correctIdx ? "✓ Correct!" : `✗ Answer: ${current.options[current.correctIdx]}`}
          </div>
          {current.mistake.correctAnswer && (
            <button className="btn btn-sec btn-sm" onClick={() => speakThai(current.mistake.correctAnswer)}>
              🔊 Listen
            </button>
          )}
        </div>
      )}

      {answered && (
        <button
          className="btn btn-pri"
          style={{ width: "100%", marginTop: 12 }}
          onClick={() => {
            if (idx + 1 >= questions.length) {
              setPhase("done");
            } else {
              setIdx(i => i + 1);
              setSelected(null);
              setPhase("playing");
            }
          }}
        >
          {idx + 1 >= questions.length ? "See Results" : "Next →"}
        </button>
      )}
    </div>
  );
}

export function MistakesPage() {
  const [mistakes, setMistakes] = useState([]);
  const [filter, setFilter] = useState("all"); // all | unreviewed | flashcard | roleplay | practice | writing
  const [stats, setStats] = useState({ total: 0, unreviewed: 0, bySource: {} });
  const [explanations, setExplanations] = useState({}); // { [id]: { loading, text, error } }
  const [quizMode, setQuizMode] = useState(false);

  const refresh = () => {
    setMistakes(loadMistakes());
    setStats(getMistakeStats());
  };

  useEffect(() => { refresh(); }, []);

  const filtered = mistakes.filter(m => {
    if (filter === "all") return true;
    if (filter === "unreviewed") return !m.reviewed;
    return m.source === filter;
  });

  const quizzable = mistakes.filter(m => m.prompt && m.correctAnswer);

  const handleReview = (id) => {
    markReviewed(id);
    awardXP("mistake_review");
    refresh();
  };

  const handleRemove = (id) => {
    removeMistake(id);
    refresh();
  };

  const handleClearReviewed = () => {
    clearReviewed();
    refresh();
  };

  const handleWhy = async (m) => {
    setExplanations(prev => ({ ...prev, [m.id]: { loading: true } }));
    try {
      const text = await callClaude({
        system: "You are a Thai language teacher. A student got an answer wrong. Explain briefly (2-3 sentences) why their answer was wrong and teach the correct answer. Include Thai script, romanized pronunciation, and meaning. Be encouraging and helpful. Keep it concise.",
        messages: [{ role: "user", content: `Question: ${m.prompt}\nMy answer: ${m.userAnswer}\nCorrect answer: ${m.correctAnswer}` }],
        model: MODELS.HAIKU,
        maxTokens: 200,
      });
      setExplanations(prev => ({ ...prev, [m.id]: { text } }));
      awardXP("ai_explain");
    } catch (err) {
      setExplanations(prev => ({ ...prev, [m.id]: { error: err.message } }));
    }
  };

  // ── Quiz Mode ──
  if (quizMode) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">🧠 Mistake Quiz</div>
          <div className="ph-s">Test yourself on words you got wrong</div>
        </div>
        <MistakeQuiz
          mistakes={mistakes}
          onFinish={() => { setQuizMode(false); refresh(); }}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Mistake Journal</div>
        <div className="ph-s">Review your wrong answers and turn mistakes into mastery</div>
      </div>

      {/* Quiz Me Button */}
      {quizzable.length >= 2 && (
        <button className="mq-start-btn" onClick={() => setQuizMode(true)}>
          🧠 Quiz Me on My Mistakes
        </button>
      )}

      {/* Stats Bar */}
      <div className="mj-stats">
        <div className="mj-stat">
          <span className="mj-stat-num">{stats.total}</span>
          <span className="mj-stat-lbl">Total</span>
        </div>
        <div className="mj-stat">
          <span className="mj-stat-num">{stats.unreviewed}</span>
          <span className="mj-stat-lbl">To Review</span>
        </div>
        {Object.entries(stats.bySource || {}).map(([src, count]) => (
          <div key={src} className="mj-stat">
            <span className="mj-stat-num">{count}</span>
            <span className="mj-stat-lbl">{SOURCE_LABELS[src]?.split(" ")[1] || src}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mj-filters">
        {[
          ["all", "All"],
          ["unreviewed", "To Review"],
          ["flashcard", "Flashcards"],
          ["roleplay", "Role-Play"],
          ["practice", "Practice"],
          ["writing", "Writing"],
        ].map(([k, l]) => (
          <button
            key={k}
            className={`mj-filter${filter === k ? " on" : ""}`}
            onClick={() => setFilter(k)}
          >
            {l}
          </button>
        ))}
        {mistakes.some(m => m.reviewed) && (
          <button className="btn btn-sec btn-sm" onClick={handleClearReviewed} style={{ marginLeft: "auto" }}>
            Clear Reviewed
          </button>
        )}
      </div>

      {/* Mistakes List */}
      {filtered.length === 0 ? (
        <div className="mj-empty">
          <div className="mj-empty-icon">✨</div>
          <h3>{filter === "all" ? "No mistakes yet!" : "No mistakes in this category"}</h3>
          <p>Keep studying — mistakes will be collected automatically from flashcards, role-play, and practice.</p>
        </div>
      ) : (
        <div className="mj-list">
          {filtered.map(m => (
            <div key={m.id} className={`mj-card${m.reviewed ? " reviewed" : ""}`}>
              <div className="mj-card-head">
                <span className="mj-card-source">{SOURCE_LABELS[m.source] || SOURCE_LABELS.other}</span>
                <span className="mj-card-date">{new Date(m.date).toLocaleDateString()}</span>
              </div>
              <div className="mj-card-prompt">{m.prompt || "(no prompt recorded)"}</div>
              <div className="mj-card-answers">
                <div className="mj-card-yours">
                  <span className="mj-lbl">You said:</span> <span className="mj-wrong">{m.userAnswer || "—"}</span>
                </div>
                <div className="mj-card-correct">
                  <span className="mj-lbl">Correct:</span>{" "}
                  <span className="mj-right">{m.correctAnswer || "—"}</span>
                  {m.correctAnswer && <button className="conv-speak" onClick={() => speakThai(m.correctAnswer)} title="Listen">🔊</button>}
                </div>
              </div>
              <div className="mj-card-actions">
                {!m.reviewed && (
                  <button className="btn btn-pri btn-sm" onClick={() => handleReview(m.id)}>
                    ✅ Mark Reviewed
                  </button>
                )}
                <button className="btn btn-sec btn-sm" onClick={() => handleRemove(m.id)}>
                  Remove
                </button>
                {hasAIAccess() && m.prompt && m.correctAnswer && !explanations[m.id]?.text && (
                  <button
                    className="btn btn-sec btn-sm"
                    onClick={() => handleWhy(m)}
                    disabled={explanations[m.id]?.loading}
                  >
                    {explanations[m.id]?.loading ? "Thinking..." : "🤔 Why?"}
                  </button>
                )}
              </div>
              {explanations[m.id]?.text && (
                <div className="ai-explain">
                  <div className="ai-explain-label">🤖 AI Explanation</div>
                  <div className="ai-explain-text">{explanations[m.id].text}</div>
                </div>
              )}
              {explanations[m.id]?.error && (
                <div className="ai-explain-error">{explanations[m.id].error}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
