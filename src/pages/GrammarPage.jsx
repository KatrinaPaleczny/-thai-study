import { useState, memo } from "react";
import { GRAMMAR_DATA } from "../data/grammarData";
import { ChevD } from "../components/Icons";
import { BuildTab } from "../components/BuildTab";
import { speakThai } from "../utils/speech";
import { levelStyle } from "../appStyles";

// ── Grammar Card ──────────────────────────────────────────────────────────────
const GrammarCard = memo(function GrammarCard({ g }) {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState("understand");

  const toggle = () => { setOpen(o => !o); setTab("understand"); };

  const TABS = [
    ["understand", "Understand"],
    ["build",      "Build"],
    ["why",        "Why this works"],
  ];

  return (
    <div className="gram-card">
      <div className="gram-hdr" onClick={toggle}>
        <span className="gram-ic">{g.icon}</span>
        <span className="gram-tt">{g.title}</span>
        <span className="gram-lv" style={levelStyle(g.level)}>{g.level}</span>
        <div style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s", display: "flex" }}>
          <ChevD/>
        </div>
      </div>

      {open && (
        <div className="gram-body">

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--bdr)", marginBottom: 16 }}>
            {TABS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: "7px 14px", border: "none", background: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 500, transition: "color .15s",
                  color: tab === key ? "var(--olive)" : "var(--t3)",
                  borderBottom: `2px solid ${tab === key ? "var(--olive)" : "transparent"}`,
                  marginBottom: -1,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Understand tab */}
          {tab === "understand" && (
            <>
              <div className="gram-sum">{g.summary}</div>
              {g.formula && (
                <div style={{
                  fontSize: 13, fontWeight: 500, color: "var(--olive)",
                  background: "var(--olive-soft)", border: "1px solid var(--olive-mid)",
                  borderRadius: 7, padding: "7px 12px", marginBottom: 12,
                }}>
                  {g.formula}
                </div>
              )}
              <div className="gram-exs">
                {g.examples.map((ex, i) => (
                  <div key={i} className="gram-ex">
                    <div className="gram-ex-th">
                      {ex.thai}
                      <button className="conv-speak" onClick={() => speakThai(ex.thai)} title="Listen">🔊</button>
                    </div>
                    <div className="gram-ex-ph">{ex.phonetics}</div>
                    <div className="gram-ex-en">{ex.english}</div>
                  </div>
                ))}
              </div>
              {g.notes && <div className="gram-note">💡 {g.notes}</div>}
            </>
          )}

          {/* Build tab — key forces remount (state reset) each time tab is visited */}
          {tab === "build" && (
            <BuildTab key={`${g.id}-build`} exercises={g.exercises} />
          )}

          {/* Why tab */}
          {tab === "why" && (
            <div style={{
              fontSize: 13, color: "var(--t2)", lineHeight: 1.8,
              background: "var(--sur2)", borderRadius: 8, padding: "14px 16px",
              borderLeft: "3px solid var(--olive)",
            }}>
              {g.why}
            </div>
          )}

        </div>
      )}
    </div>
  );
});

// ── Grammar Page ──────────────────────────────────────────────────────────────
export function GrammarPage() {
  const [wk, setWk] = useState("All");
  const shown = GRAMMAR_DATA.filter(g => wk === "All" || g.level === wk);

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Grammar</div>
        <div className="ph-s">{GRAMMAR_DATA.length} patterns · Understand, practice, and build</div>
      </div>
      <div className="wk-tabs">
        {["All", "A1", "A2", "B1", "B2"].map(w => (
          <button key={w} className={`wk-tab${wk === w ? " on" : ""}`} onClick={() => setWk(w)}>
            {w}
          </button>
        ))}
      </div>
      <div className="gram-list">
        {shown.map(g => <GrammarCard key={g.id} g={g} />)}
      </div>
    </div>
  );
}
