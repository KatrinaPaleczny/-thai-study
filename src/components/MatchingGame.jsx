import { useState, useEffect, useCallback } from "react";

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRoundWords(words, count = 6) {
  const shuffled = shuffleArray(words);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function MatchingGame({ words }) {
  const [roundWords, setRoundWords] = useState([]);
  const [shuffledEnglish, setShuffledEnglish] = useState([]);
  const [selected, setSelected] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [wrongPair, setWrongPair] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const startNewRound = useCallback(() => {
    const picked = pickRoundWords(words);
    setRoundWords(picked);
    setShuffledEnglish(shuffleArray(picked));
    setSelected(null);
    setMatchedIds(new Set());
    setWrongPair(null);
    setScore(0);
    setAttempts(0);
  }, [words]);

  useEffect(() => {
    if (words && words.length > 0) {
      startNewRound();
    }
  }, [words, startNewRound]);

  const handleThaiClick = (word) => {
    if (matchedIds.has(word.id) || wrongPair) return;
    setSelected(word.id === selected ? null : word.id);
  };

  const handleEnglishClick = (word) => {
    if (selected === null || matchedIds.has(word.id) || wrongPair) return;

    setAttempts((prev) => prev + 1);

    if (word.id === selected) {
      setMatchedIds((prev) => {
        const next = new Set(prev);
        next.add(word.id);
        return next;
      });
      setScore((prev) => prev + 1);
      setSelected(null);
    } else {
      setWrongPair({ thai: selected, english: word.id });
      setTimeout(() => {
        setWrongPair(null);
        setSelected(null);
      }, 600);
    }
  };

  const allMatched = roundWords.length > 0 && matchedIds.size === roundWords.length;

  if (!words || words.length === 0) {
    return <div className="match-game">No words available for matching.</div>;
  }

  return (
    <div className="match-game">
      <div className="match-score">
        {allMatched
          ? `All matched! ${score}/${attempts} correct on first try.`
          : `Matched: ${score} / ${roundWords.length}`}
      </div>

      {allMatched ? (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>Great job! You completed the round.</p>
          <button className="btn btn-pri match-new" onClick={startNewRound}>
            New Round
          </button>
        </div>
      ) : (
        <>
          <div className="match-cols">
            <div className="match-col">
              {roundWords.map((w) => {
                let cls = "match-card";
                if (matchedIds.has(w.id)) cls += " matched";
                else if (selected === w.id) cls += " selected";
                if (wrongPair && wrongPair.thai === w.id) cls += " wrong";

                return (
                  <button
                    key={w.id}
                    className={cls}
                    onClick={() => handleThaiClick(w)}
                    disabled={matchedIds.has(w.id)}
                  >
                    <span className="match-card-thai">{w.thai}</span>
                    <span className="match-card-phonetic">{w.phonetics}</span>
                  </button>
                );
              })}
            </div>

            <div className="match-col">
              {shuffledEnglish.map((w) => {
                let cls = "match-card";
                if (matchedIds.has(w.id)) cls += " matched";
                if (wrongPair && wrongPair.english === w.id) cls += " wrong";

                return (
                  <button
                    key={w.id}
                    className={cls}
                    onClick={() => handleEnglishClick(w)}
                    disabled={matchedIds.has(w.id)}
                  >
                    {w.english}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button className="btn btn-pri match-new" onClick={startNewRound}>
              New Round
            </button>
          </div>
        </>
      )}
    </div>
  );
}
