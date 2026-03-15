import { useState, useEffect, useCallback } from "react";

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRound(chars, count = 6) {
  return shuffleArray(chars).slice(0, Math.min(count, chars.length));
}

export function ScriptMatchingGame({ characters }) {
  const [roundChars, setRoundChars] = useState([]);
  const [shuffledPhonetics, setShuffledPhonetics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [wrongPair, setWrongPair] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const startNewRound = useCallback(() => {
    const picked = pickRound(characters);
    setRoundChars(picked);
    setShuffledPhonetics(shuffleArray(picked));
    setSelected(null);
    setMatchedIds(new Set());
    setWrongPair(null);
    setScore(0);
    setAttempts(0);
  }, [characters]);

  useEffect(() => {
    if (characters && characters.length > 0) startNewRound();
  }, [characters, startNewRound]);

  if (!characters || characters.length < 4) {
    return <div className="match-game">Need at least 4 characters for matching.</div>;
  }

  const handleCharClick = (c) => {
    if (matchedIds.has(c.char) || wrongPair) return;
    setSelected(c.char === selected ? null : c.char);
  };

  const handlePhoneticClick = (c) => {
    if (selected === null || matchedIds.has(c.char) || wrongPair) return;
    setAttempts(a => a + 1);

    if (c.char === selected) {
      setMatchedIds(prev => { const n = new Set(prev); n.add(c.char); return n; });
      setScore(s => s + 1);
      setSelected(null);
    } else {
      setWrongPair({ left: selected, right: c.char });
      setTimeout(() => { setWrongPair(null); setSelected(null); }, 600);
    }
  };

  const allMatched = roundChars.length > 0 && matchedIds.size === roundChars.length;

  return (
    <div className="match-game">
      <div className="match-score">
        {allMatched
          ? `All matched! ${score}/${attempts} correct on first try.`
          : `Matched: ${score} / ${roundChars.length}`}
      </div>

      {allMatched ? (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>Great job! You completed the round.</p>
          <button className="btn btn-pri match-new" onClick={startNewRound}>New Round</button>
        </div>
      ) : (
        <>
          <div className="match-cols">
            <div className="match-col">
              {roundChars.map(c => {
                let cls = "match-card";
                if (matchedIds.has(c.char)) cls += " matched";
                else if (selected === c.char) cls += " selected";
                if (wrongPair && wrongPair.left === c.char) cls += " wrong";
                return (
                  <button key={c.char} className={cls} onClick={() => handleCharClick(c)} disabled={matchedIds.has(c.char)}>
                    <span style={{ fontFamily: "var(--thai)", fontSize: 28, fontWeight: 500 }}>{c.char}</span>
                  </button>
                );
              })}
            </div>
            <div className="match-col">
              {shuffledPhonetics.map(c => {
                let cls = "match-card";
                if (matchedIds.has(c.char)) cls += " matched";
                if (wrongPair && wrongPair.right === c.char) cls += " wrong";
                return (
                  <button key={c.char} className={cls} onClick={() => handlePhoneticClick(c)} disabled={matchedIds.has(c.char)}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>{c.phonetic}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button className="btn btn-pri match-new" onClick={startNewRound}>New Round</button>
          </div>
        </>
      )}
    </div>
  );
}
