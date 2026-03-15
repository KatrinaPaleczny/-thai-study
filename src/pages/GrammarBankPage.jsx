import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GRAMMAR_DATA } from "../data/grammarData";
import { levelStyle } from "../appStyles";
import { speakThai } from "../utils/speech";
import { SearchIcon, SpeakerIcon } from "../components/Icons";

function GrammarCard({ g, expanded, onToggle }) {
  const navigate = useNavigate();

  return (
    <div className={`gb-card${expanded ? " gb-expanded" : ""}`} onClick={onToggle}>
      <div className="gb-card-top">
        <span className="gb-icon">{g.icon}</span>
        <div className="gb-card-info">
          <div className="gb-card-title">{g.title}</div>
          <div className="gb-card-meta">
            <span className="gb-formula">{g.formula}</span>
            <span className="vc-lvl" style={levelStyle(g.level)}>{g.level}</span>
          </div>
        </div>
      </div>

      {/* Always show first example */}
      {g.examples[0] && (
        <div className="gb-example">
          <div className="gb-ex-row">
            <span className="gb-ex-thai">{g.examples[0].thai}</span>
            <button
              className="gb-speak"
              onClick={e => { e.stopPropagation(); speakThai(g.examples[0].thai); }}
              title="Play"
            >
              <SpeakerIcon />
            </button>
          </div>
          <div className="gb-ex-ph">{g.examples[0].phonetics}</div>
          <div className="gb-ex-en">{g.examples[0].english}</div>
        </div>
      )}

      {/* Expanded: more examples, notes, link */}
      {expanded && (
        <div className="gb-detail">
          <div className="gb-summary">{g.summary}</div>

          {g.examples.length > 1 && (
            <div className="gb-more-examples">
              {g.examples.slice(1).map((ex, i) => (
                <div key={i} className="gb-example">
                  <div className="gb-ex-row">
                    <span className="gb-ex-thai">{ex.thai}</span>
                    <button
                      className="gb-speak"
                      onClick={e => { e.stopPropagation(); speakThai(ex.thai); }}
                      title="Play"
                    >
                      <SpeakerIcon />
                    </button>
                  </div>
                  <div className="gb-ex-ph">{ex.phonetics}</div>
                  <div className="gb-ex-en">{ex.english}</div>
                </div>
              ))}
            </div>
          )}

          {g.notes && <div className="gb-notes"><strong>Note:</strong> {g.notes}</div>}

          <button
            className="gb-link"
            onClick={e => { e.stopPropagation(); navigate("/grammar"); }}
          >
            📐 Go to full Grammar lesson →
          </button>
        </div>
      )}
    </div>
  );
}

export function GrammarBankPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    let items = GRAMMAR_DATA;
    if (level !== "All") {
      items = items.filter(g => g.level === level);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.formula.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        (g.notes && g.notes.toLowerCase().includes(q)) ||
        g.examples.some(ex =>
          ex.thai.includes(q) ||
          ex.phonetics.toLowerCase().includes(q) ||
          ex.english.toLowerCase().includes(q)
        )
      );
    }
    return items;
  }, [search, level]);

  const levels = ["All", "A1", "A2", "B1", "B2"];

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">📋 Grammar Bank</div>
        <div className="ph-s">{GRAMMAR_DATA.length} patterns — quick reference lookup</div>
      </div>

      <div className="gb-controls">
        <div className="gb-search">
          <SearchIcon />
          <input
            placeholder="Search patterns, formulas, keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="chips">
          {levels.map(l => (
            <button
              key={l}
              className={`chip${level === l ? " on" : ""}`}
              onClick={() => setLevel(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="gb-count">{filtered.length} pattern{filtered.length !== 1 ? "s" : ""}</div>

      <div className="gb-grid">
        {filtered.map(g => (
          <GrammarCard
            key={g.id}
            g={g}
            expanded={expandedId === g.id}
            onToggle={() => setExpandedId(expandedId === g.id ? null : g.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="empty">No grammar patterns match your search</div>
        )}
      </div>
    </div>
  );
}
