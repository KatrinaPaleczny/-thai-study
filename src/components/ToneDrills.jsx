import { useState, useCallback } from "react";
import { speakThai } from "../utils/speech";

const TONE_PAIRS = [
  { a: { thai: "มา", phonetics: "maa", english: "come", tone: "mid" }, b: { thai: "หมา", phonetics: "mǎa", english: "dog", tone: "rising" }},
  { a: { thai: "ไก่", phonetics: "gài", english: "chicken", tone: "low" }, b: { thai: "ไข่", phonetics: "khài", english: "egg", tone: "low" }},
  { a: { thai: "ใกล้", phonetics: "glâi", english: "near", tone: "falling" }, b: { thai: "ไกล", phonetics: "glai", english: "far", tone: "mid" }},
  { a: { thai: "สวย", phonetics: "sǔay", english: "beautiful", tone: "rising" }, b: { thai: "ซวย", phonetics: "suay", english: "unlucky", tone: "mid" }},
  { a: { thai: "ข้าว", phonetics: "khâao", english: "rice", tone: "falling" }, b: { thai: "เข้า", phonetics: "khâo", english: "enter", tone: "falling" }},
  { a: { thai: "คา", phonetics: "kaa", english: "stuck", tone: "mid" }, b: { thai: "ค่า", phonetics: "khâa", english: "value/cost", tone: "falling" }},
  { a: { thai: "ป้า", phonetics: "bpâa", english: "aunt", tone: "falling" }, b: { thai: "ป่า", phonetics: "bpàa", english: "forest", tone: "low" }},
  { a: { thai: "น้ำ", phonetics: "náam", english: "water", tone: "high" }, b: { thai: "นำ", phonetics: "nam", english: "lead/guide", tone: "mid" }},
];

function pickRandom() {
  const pairIdx = Math.floor(Math.random() * TONE_PAIRS.length);
  const pair = TONE_PAIRS[pairIdx];
  const targetKey = Math.random() < 0.5 ? "a" : "b";
  return { pair, targetKey };
}

export function ToneDrills() {
  const [round, setRound] = useState(() => pickRandom());
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const target = round.pair[round.targetKey];
  const optA = round.pair.a;
  const optB = round.pair.b;
  const isCorrect = chosen !== null && chosen === round.targetKey;
  const answered = chosen !== null;

  const handleChoice = useCallback((key) => {
    if (answered) return;
    setChosen(key);
    setScore((prev) => ({
      correct: prev.correct + (key === round.targetKey ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [answered, round.targetKey]);

  const handleNext = useCallback(() => {
    setRound(pickRandom());
    setChosen(null);
  }, []);

  const optClass = (key) => {
    if (!answered) return "tone-opt";
    if (key === round.targetKey) return "tone-opt correct";
    if (key === chosen) return "tone-opt wrong";
    return "tone-opt";
  };

  return (
    <div className="tone-drill">
      <div className="tone-score">
        Score: {score.correct} / {score.total}
      </div>

      <div className="tone-q">
        <div className="tone-prompt">Which word means...</div>
        <div className="tone-target">{target.english}</div>
      </div>

      <div className="tone-opts">
        <button className={optClass("a")} onClick={() => handleChoice("a")} disabled={answered}>
          <span className="tone-opt-thai">{optA.thai}</span>
          <span
            className="num-speak"
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); speakThai(optA.thai); }}
            aria-label={`Listen to ${optA.phonetics}`}
          >
            🔊
          </span>
        </button>

        <button className={optClass("b")} onClick={() => handleChoice("b")} disabled={answered}>
          <span className="tone-opt-thai">{optB.thai}</span>
          <span
            className="num-speak"
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); speakThai(optB.thai); }}
            aria-label={`Listen to ${optB.phonetics}`}
          >
            🔊
          </span>
        </button>
      </div>

      {answered && (
        <div className="tone-feedback">
          <div className={isCorrect ? "tone-result-correct" : "tone-result-wrong"}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
          <div className="tone-info">
            <div>
              <strong>{optA.thai}</strong> ({optA.phonetics}) = {optA.english} — <em>{optA.tone} tone</em>
            </div>
            <div>
              <strong>{optB.thai}</strong> ({optB.phonetics}) = {optB.english} — <em>{optB.tone} tone</em>
            </div>
          </div>
          <button className="btn btn-pri" onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
}
