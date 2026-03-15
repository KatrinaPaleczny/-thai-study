import { useState } from "react";
import { SCENARIOS_DATA } from "../data/scenariosData";
import { loadLS, K_ROLEPLAY } from "../utils/storage";
import { RolePlaySession } from "../components/RolePlaySession";
import { levelStyle } from "../appStyles";

export function RolePlayPage() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [levelFilter, setLevelFilter] = useState("All");
  const scores = loadLS(K_ROLEPLAY, {});

  if (selectedIdx !== null) {
    return (
      <div className="page">
        <RolePlaySession
          scenario={SCENARIOS_DATA[selectedIdx]}
          scenarioIndex={selectedIdx}
          onExit={() => setSelectedIdx(null)}
        />
      </div>
    );
  }

  const filtered = SCENARIOS_DATA.map((sc, i) => ({ sc, i })).filter(({ sc }) => levelFilter === "All" || sc.level === levelFilter);

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Conversation Role-Play</div>
        <div className="ph-s">Pick a scenario and practice responding in Thai. Type your answers using romanized phonetics.</div>
      </div>

      <div className="wk-tabs">
        {["All", "A1", "A2", "B1", "B2"].map(w => (
          <button key={w} className={`wk-tab${levelFilter === w ? " on" : ""}`} onClick={() => setLevelFilter(w)}>
            {w}
          </button>
        ))}
      </div>

      <div className="rp-grid">
        {filtered.map(({ sc, i }) => {
          const saved = scores[i];
          const pct = saved ? Math.round(saved.bestScore * 100) : null;
          const stars = pct !== null ? (pct >= 90 ? 3 : pct >= 70 ? 2 : 1) : 0;
          const userTurnCount = sc.turns.filter(t => t.role === "You").length;

          return (
            <button
              key={i}
              className={`rp-card${saved ? " completed" : ""}`}
              onClick={() => setSelectedIdx(i)}
            >
              <div className="rp-card-head">
                <span className="rp-card-title">{sc.title}</span>
                {sc.level && <span className="rp-card-level" style={levelStyle(sc.level)}>{sc.level}</span>}
                {saved && (
                  <span className="rp-card-badge">
                    {"⭐".repeat(stars)} {pct}%
                  </span>
                )}
              </div>
              <div className="rp-card-goal">{sc.goal}</div>
              <div className="rp-card-meta">
                <span>{sc.turns.length} turns</span>
                <span>{userTurnCount} responses</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
