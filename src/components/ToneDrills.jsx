import { useState, useCallback } from "react";
import { speakThai } from "../utils/speech";

const TONE_PAIRS = [
  // Original pairs
  { a: { thai: "มา", phonetics: "maa", english: "come", tone: "mid" }, b: { thai: "หมา", phonetics: "mǎa", english: "dog", tone: "rising" }},
  { a: { thai: "ไก่", phonetics: "gài", english: "chicken", tone: "low" }, b: { thai: "ไข่", phonetics: "khài", english: "egg", tone: "low" }},
  { a: { thai: "ใกล้", phonetics: "glâi", english: "near", tone: "falling" }, b: { thai: "ไกล", phonetics: "glai", english: "far", tone: "mid" }},
  { a: { thai: "สวย", phonetics: "sǔay", english: "beautiful", tone: "rising" }, b: { thai: "ซวย", phonetics: "suay", english: "unlucky", tone: "mid" }},
  { a: { thai: "ข้าว", phonetics: "khâao", english: "rice", tone: "falling" }, b: { thai: "เข้า", phonetics: "khâo", english: "enter", tone: "falling" }},
  { a: { thai: "คา", phonetics: "kaa", english: "stuck", tone: "mid" }, b: { thai: "ค่า", phonetics: "khâa", english: "value/cost", tone: "falling" }},
  { a: { thai: "ป้า", phonetics: "bpâa", english: "aunt", tone: "falling" }, b: { thai: "ป่า", phonetics: "bpàa", english: "forest", tone: "low" }},
  { a: { thai: "น้ำ", phonetics: "náam", english: "water", tone: "high" }, b: { thai: "นำ", phonetics: "nam", english: "lead/guide", tone: "mid" }},
  // ได้/ไม่ได้ pattern (from tutor lessons)
  { a: { thai: "ได้", phonetics: "dâi", english: "can / yes", tone: "falling" }, b: { thai: "ไม่ได้", phonetics: "mâi dâi", english: "cannot", tone: "falling+falling" }},
  { a: { thai: "ได้ไหม", phonetics: "dâi mái", english: "can ...?", tone: "falling+high" }, b: { thai: "ได้ยิน", phonetics: "dâi yin", english: "hear", tone: "falling+mid" }},
  // More minimal pairs — same/similar consonants, different tones
  { a: { thai: "สี่", phonetics: "sìi", english: "four", tone: "low" }, b: { thai: "สี", phonetics: "sǐi", english: "color", tone: "rising" }},
  { a: { thai: "เสื้อ", phonetics: "sûea", english: "shirt", tone: "rising" }, b: { thai: "เสือ", phonetics: "sʉ̌a", english: "tiger", tone: "rising" }},
  { a: { thai: "หมา", phonetics: "mǎa", english: "dog", tone: "rising" }, b: { thai: "ม้า", phonetics: "máa", english: "horse", tone: "high" }},
  { a: { thai: "ขา", phonetics: "khǎa", english: "leg", tone: "rising" }, b: { thai: "ข่า", phonetics: "khàa", english: "galangal", tone: "low" }},
  { a: { thai: "เผ็ด", phonetics: "pèt", english: "spicy", tone: "low" }, b: { thai: "เป็ด", phonetics: "bpèt", english: "duck", tone: "low" }},
  { a: { thai: "กา", phonetics: "gaa", english: "crow / kettle", tone: "mid" }, b: { thai: "ก่า", phonetics: "gàa", english: "old (archaic)", tone: "low" }},
  { a: { thai: "สูง", phonetics: "sǔung", english: "tall", tone: "rising" }, b: { thai: "ซุง", phonetics: "sung", english: "log / timber", tone: "mid" }},
  { a: { thai: "ร้อน", phonetics: "rɔ́ɔn", english: "hot", tone: "high" }, b: { thai: "ร้อง", phonetics: "rɔ́ɔng", english: "cry / sing", tone: "high" }},
  { a: { thai: "กิน", phonetics: "gin", english: "eat", tone: "mid" }, b: { thai: "กิ่น", phonetics: "gìn", english: "smell (old)", tone: "low" }},
  { a: { thai: "ดี", phonetics: "dii", english: "good", tone: "mid" }, b: { thai: "ตี", phonetics: "dtii", english: "hit / strike", tone: "mid" }},
  { a: { thai: "หิว", phonetics: "hǐw", english: "hungry", tone: "rising" }, b: { thai: "หิ้ว", phonetics: "hîw", english: "carry (by hand)", tone: "falling" }},
  { a: { thai: "มา", phonetics: "maa", english: "come", tone: "mid" }, b: { thai: "ม้า", phonetics: "máa", english: "horse", tone: "high" }},
  { a: { thai: "ช้า", phonetics: "cháa", english: "slow", tone: "high" }, b: { thai: "ชา", phonetics: "chaa", english: "tea", tone: "mid" }},
  { a: { thai: "สุก", phonetics: "sùk", english: "ripe / cooked", tone: "low" }, b: { thai: "สุข", phonetics: "sùk", english: "happy", tone: "low" }},
  { a: { thai: "เค็ม", phonetics: "kem", english: "salty", tone: "mid" }, b: { thai: "เข็ม", phonetics: "khěm", english: "needle", tone: "rising" }},
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
