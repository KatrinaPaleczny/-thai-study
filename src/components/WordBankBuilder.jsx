import { useState, useMemo } from "react";

export function WordBankBuilder({ exercises }) {
  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [checked, setChecked] = useState(false);

  if (!exercises?.length) {
    return <div style={{ fontSize: 13, color: "var(--t3)", padding: "8px 0" }}>No sentence exercises for this lesson.</div>;
  }

  const ex = exercises[idx];
  const total = exercises.length;

  // Shuffle the pool (word bank + distractors) once per exercise
  const pool = useMemo(() => {
    const all = [...(ex.wordBank || []), ...(ex.distractors || [])];
    return all.sort(() => Math.random() - 0.5);
  }, [idx, ex]);

  const isCorrect = checked && placed.join("") === ex.thai.replace(/\s+/g, "");

  const addWord = word => {
    if (checked) return;
    setPlaced(p => [...p, word]);
  };
  const removeWord = i => {
    if (checked) return;
    setPlaced(p => p.filter((_, j) => j !== i));
  };
  const check = () => setChecked(true);
  const next = () => { setIdx(i => i + 1); setPlaced([]); setChecked(false); };
  const retry = () => { setPlaced([]); setChecked(false); };

  // Track which pool words are used
  const usedCounts = {};
  placed.forEach(w => { usedCounts[w] = (usedCounts[w] || 0) + 1; });

  const poolAvailable = pool.map(w => {
    const totalInPool = pool.filter(p => p === w).length;
    const used = usedCounts[w] || 0;
    return { word: w, available: used < totalInPool };
  });

  return (
    <div className="wbank">
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
        {exercises.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", transition: "background .2s",
            background: i === idx ? "var(--olive)" : i < idx ? "var(--olive-mid)" : "var(--bdr)",
          }} />
        ))}
      </div>

      <div style={{ fontSize: 10, color: "var(--t3)", fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>
        Exercise {idx + 1} of {total} &middot; {ex.pattern}
      </div>

      {/* English prompt */}
      <div className="wbank-english">"{ex.english}"</div>
      <div className="wbank-hint">Hint: {ex.hint}</div>

      {/* Build zone */}
      <div className={`wbank-build${checked ? (isCorrect ? " correct" : " wrong") : ""}`}>
        {placed.length === 0 && !checked && (
          <span className="wbank-placeholder">Tap words below to build the sentence...</span>
        )}
        {placed.map((w, i) => (
          <button key={i} className="wbank-chip placed" onClick={() => removeWord(i)} disabled={checked}>
            <span className="wbank-chip-thai">{w}</span>
            {ex.phoneticsMap?.[w] && <span className="wbank-chip-ph">{ex.phoneticsMap[w]}</span>}
          </button>
        ))}
      </div>

      {/* Word pool */}
      {!checked && (
        <div className="wbank-pool">
          {poolAvailable.map((item, i) => (
            <button
              key={i}
              className={`wbank-chip pool${!item.available ? " used" : ""}`}
              onClick={() => item.available && addWord(item.word)}
              disabled={!item.available}
            >
              <span className="wbank-chip-thai">{item.word}</span>
              {ex.phoneticsMap?.[item.word] && <span className="wbank-chip-ph">{ex.phoneticsMap[item.word]}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Buttons */}
      {!checked && (
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button className="btn btn-sec btn-sm" onClick={retry} disabled={placed.length === 0}>Clear</button>
          <button className="btn btn-pri btn-sm" onClick={check} disabled={placed.length === 0}>Check</button>
        </div>
      )}

      {/* Result */}
      {checked && (
        <div className={`wbank-result ${isCorrect ? "ok" : "no"}`}>
          {isCorrect ? (
            <div>{"\u2713"} Correct!</div>
          ) : (
            <>
              <div>{"\u2717"} Not quite. The correct sentence:</div>
              <div className="wbank-answer">{ex.thai}</div>
              <div className="wbank-phonetics">{ex.phonetics}</div>
            </>
          )}
          <div className="wbank-tip">{ex.tip}</div>
        </div>
      )}

      {checked && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {!isCorrect && <button className="btn btn-sec btn-sm" onClick={retry}>Try again</button>}
          {idx < total - 1 ? (
            <button className="btn btn-pri btn-sm" onClick={next}>Next {"\u2192"}</button>
          ) : (
            <div style={{ fontSize: 12, color: "var(--olive)", fontWeight: 600 }}>
              All exercises done {"\u2713"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
