import { useState, useMemo, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchPage() {
  const { allVocab } = useApp();
  const [cat, setCat] = useState("All");
  const [phase, setPhase] = useState("setup"); // setup | playing | done
  const [pairCount, setPairCount] = useState(6);
  const [pairs, setPairs] = useState([]);
  const [thaiCards, setThaiCards] = useState([]);
  const [engCards, setEngCards] = useState([]);
  const [selectedThai, setSelectedThai] = useState(null);
  const [selectedEng, setSelectedEng] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrong, setWrong] = useState(null); // { thai, eng } for flash
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [bestTime, setBestTime] = useState(null);

  const cats = useMemo(() => ["All", ...new Set(allVocab.map(w => w.category))], [allVocab]);
  const words = useMemo(() => {
    const filtered = cat === "All" ? allVocab : allVocab.filter(w => w.category === cat);
    return filtered.length >= 4 ? filtered : allVocab;
  }, [allVocab, cat]);

  // Timer
  useEffect(() => {
    if (phase !== "playing" || !startTime) return;
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 100);
    return () => clearInterval(interval);
  }, [phase, startTime]);

  const startGame = useCallback(() => {
    const count = Math.min(pairCount, words.length);
    const selected = shuffle(words).slice(0, count);
    setPairs(selected);
    setThaiCards(shuffle(selected.map((w, i) => ({ id: i, text: w.thai, wordId: w.id }))));
    setEngCards(shuffle(selected.map((w, i) => ({ id: i, text: w.english, wordId: w.id }))));
    setMatched(new Set());
    setSelectedThai(null);
    setSelectedEng(null);
    setWrong(null);
    setMistakes(0);
    setStartTime(Date.now());
    setElapsed(0);
    setPhase("playing");
  }, [pairCount, words]);

  const checkMatch = useCallback((thaiId, engId) => {
    if (thaiId === engId) {
      // Correct match
      setMatched(prev => new Set([...prev, thaiId]));
      setSelectedThai(null);
      setSelectedEng(null);
      speakThai(pairs[thaiId]?.thai);

      if (matched.size + 1 === pairs.length) {
        // All matched!
        const time = Math.floor((Date.now() - startTime) / 1000);
        setElapsed(time);
        setPhase("done");
        awardXP("practice_correct");
      }
    } else {
      // Wrong match
      setWrong({ thai: thaiId, eng: engId });
      setMistakes(m => m + 1);
      setTimeout(() => {
        setWrong(null);
        setSelectedThai(null);
        setSelectedEng(null);
      }, 600);
    }
  }, [pairs, matched, startTime]);

  const handleThaiClick = (id) => {
    if (matched.has(id) || wrong) return;
    setSelectedThai(id);
    if (selectedEng !== null) checkMatch(id, selectedEng);
  };

  const handleEngClick = (id) => {
    if (matched.has(id) || wrong) return;
    setSelectedEng(id);
    if (selectedThai !== null) checkMatch(selectedThai, id);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;

  // ─── Setup Screen ───
  if (phase === "setup") {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Match Pairs</div>
          <div className="ph-s">Match Thai words with their English meanings as fast as you can</div>
        </div>
        <div className="mp-setup">
          <div className="mp-setup-row">
            <label>Category</label>
            <select className="pron-cat-select" value={cat} onChange={e => setCat(e.target.value)}>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mp-setup-row">
            <label>Pairs</label>
            <div className="ld-mode-toggle">
              {[4, 6, 8].map(n => (
                <button key={n} className={`btn btn-sm ${pairCount === n ? "btn-pri" : "btn-sec"}`} onClick={() => setPairCount(n)}>{n}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-pri" onClick={startGame} style={{ marginTop: 20, width: "100%" }}>Start Game</button>
        </div>
      </div>
    );
  }

  // ─── Done Screen ───
  if (phase === "done") {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Match Pairs</div>
        </div>
        <div className="match-done">
          <div className="rp-stars">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <div className="match-done-time">{formatTime(elapsed)}</div>
          <div className="match-done-stats">
            {pairs.length} pairs matched · {mistakes} mistake{mistakes !== 1 ? "s" : ""}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <button className="btn btn-sec" onClick={() => setPhase("setup")}>Settings</button>
            <button className="btn btn-pri" onClick={startGame}>Play Again</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Playing Screen ───
  return (
    <div className="page">
      <div className="match-header">
        <button className="btn btn-sec btn-sm" onClick={() => setPhase("setup")}>✕ Exit</button>
        <span className="match-timer">⏱️ {formatTime(elapsed)}</span>
        <span className="match-progress">{matched.size}/{pairs.length}</span>
      </div>

      <div className="rp-prog" style={{ marginBottom: 16 }}>
        <div className="rp-prog-fill" style={{ width: `${(matched.size / pairs.length) * 100}%` }} />
      </div>

      <div className="match-board">
        <div className="match-col">
          <div className="match-col-label">Thai</div>
          {thaiCards.map(c => {
            const isMatched = matched.has(c.id);
            const isSelected = selectedThai === c.id;
            const isWrong = wrong?.thai === c.id;
            return (
              <button
                key={`th-${c.id}`}
                className={`match-card thai${isMatched ? " matched" : ""}${isSelected ? " selected" : ""}${isWrong ? " wrong" : ""}`}
                onClick={() => handleThaiClick(c.id)}
                disabled={isMatched}
              >
                {c.text}
              </button>
            );
          })}
        </div>
        <div className="match-col">
          <div className="match-col-label">English</div>
          {engCards.map(c => {
            const isMatched = matched.has(c.id);
            const isSelected = selectedEng === c.id;
            const isWrong = wrong?.eng === c.id;
            return (
              <button
                key={`en-${c.id}`}
                className={`match-card eng${isMatched ? " matched" : ""}${isSelected ? " selected" : ""}${isWrong ? " wrong" : ""}`}
                onClick={() => handleEngClick(c.id)}
                disabled={isMatched}
              >
                {c.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
