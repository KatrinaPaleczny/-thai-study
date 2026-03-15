import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { FREQ_TIERS, FREQ_RANK } from "../data/frequencyData";
import { levelStyle } from "../appStyles";
import { speakThai } from "../utils/speech";
import { SearchIcon, CheckIcon, SpeakerIcon } from "../components/Icons";

function FreqRow({ w, rank, isStudied, onToggle }) {
  const [speaking, setSpeaking] = useState(false);
  const play = (e) => {
    e.stopPropagation();
    setSpeaking(true);
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(w.thai);
    u.lang = "th-TH"; u.rate = 0.85;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className={`freq-row${isStudied ? " done" : ""}`}>
      <span className="freq-rank">#{rank}</span>
      <span className="freq-ej">{w.emoji || "📝"}</span>
      <div className="freq-main">
        <span className="freq-th">{w.thai}</span>
        <span className="freq-ph">{w.phonetics}</span>
      </div>
      <span className="freq-en">{w.english}</span>
      <span className="vc-lvl" style={levelStyle(w.level)}>{w.level}</span>
      <button className="freq-speak" onClick={play} title="Play audio">
        <SpeakerIcon on={speaking} />
      </button>
      <button
        className={`freq-mark${isStudied ? " on" : ""}`}
        onClick={(e) => { e.stopPropagation(); onToggle(w.id); }}
        title={isStudied ? "Studied" : "Add to study"}
      >
        {isStudied ? <CheckIcon /> : "+"}
      </button>
    </div>
  );
}

export function FrequencyPage() {
  const { allVocab, studied, toggleStudied } = useApp();
  const [tier, setTier] = useState(100);
  const [search, setSearch] = useState("");

  const vocabMap = useMemo(() => {
    const m = {};
    allVocab.forEach(v => { m[v.id] = v; });
    return m;
  }, [allVocab]);

  const tierWords = useMemo(() => {
    const ids = FREQ_TIERS[tier] || [];
    return ids.map(id => vocabMap[id]).filter(Boolean);
  }, [tier, vocabMap]);

  const filtered = useMemo(() => {
    if (!search.trim()) return tierWords;
    const q = search.toLowerCase();
    return tierWords.filter(w =>
      w.thai.includes(q) ||
      (w.phonetics && w.phonetics.toLowerCase().includes(q)) ||
      w.english.toLowerCase().includes(q)
    );
  }, [tierWords, search]);

  const studiedInTier = useMemo(() =>
    tierWords.filter(w => studied.has(w.id)).length
  , [tierWords, studied]);

  const tiers = [100, 200, 500];

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">📊 Core Words</div>
        <div className="ph-s">Most common Thai words by frequency — learn these first</div>
      </div>

      <div className="freq-stats">
        {tiers.map(t => {
          const ids = FREQ_TIERS[t] || [];
          const count = ids.filter(id => studied.has(id)).length;
          return (
            <div key={t} className={`stat${tier === t ? " stat-active" : ""}`} onClick={() => setTier(t)}>
              <div className="stat-n">{count}/{ids.length}</div>
              <div className="stat-l">Top {t}</div>
              <div className="freq-bar">
                <div className="freq-bar-fill" style={{ width: `${ids.length ? (count / ids.length) * 100 : 0}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="freq-controls">
        <div className="chips">
          {tiers.map(t => (
            <button key={t} className={`chip${tier === t ? " on" : ""}`} onClick={() => setTier(t)}>
              Top {t}
            </button>
          ))}
        </div>
        <div className="freq-search">
          <SearchIcon />
          <input
            placeholder="Search words..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="freq-info">
        <span className="freq-count">{filtered.length} words</span>
        <span className="freq-studied">{studiedInTier} studied</span>
      </div>

      <div className="freq-list">
        <div className="freq-hdr">
          <span className="freq-hdr-rank">#</span>
          <span className="freq-hdr-ej"></span>
          <span className="freq-hdr-word">Word</span>
          <span className="freq-hdr-en">Meaning</span>
          <span className="freq-hdr-lvl">Level</span>
          <span className="freq-hdr-act"></span>
          <span className="freq-hdr-act"></span>
        </div>
        {filtered.map(w => (
          <FreqRow
            key={w.id}
            w={w}
            rank={FREQ_RANK[w.id] || "—"}
            isStudied={studied.has(w.id)}
            onToggle={toggleStudied}
          />
        ))}
        {filtered.length === 0 && (
          <div className="empty">No words match your search</div>
        )}
      </div>
    </div>
  );
}
