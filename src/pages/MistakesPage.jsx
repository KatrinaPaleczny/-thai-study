import { useState, useEffect } from "react";
import { loadMistakes, markReviewed, removeMistake, clearReviewed, getMistakeStats } from "../utils/mistakes";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";
import { callClaude, hasAIAccess, MODELS } from "../utils/ai";

const SOURCE_LABELS = {
  flashcard: "🃏 Flashcard",
  roleplay: "💬 Role-Play",
  practice: "🎯 Practice",
  writing: "✍️ Writing",
  other: "📝 Other",
};

export function MistakesPage() {
  const [mistakes, setMistakes] = useState([]);
  const [filter, setFilter] = useState("all"); // all | unreviewed | flashcard | roleplay | practice | writing
  const [stats, setStats] = useState({ total: 0, unreviewed: 0, bySource: {} });
  const [explanations, setExplanations] = useState({}); // { [id]: { loading, text, error } }

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

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Mistake Journal</div>
        <div className="ph-s">Review your wrong answers and turn mistakes into mastery</div>
      </div>

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
