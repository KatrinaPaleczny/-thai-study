import { useState, useMemo, useEffect, useRef } from "react";
import { awardXP } from "../utils/xp";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Curated pools — using only characters taught in the 30-day plan.
// Each item is a complete syllable with a known correct answer and rule explanation.

const POOL_DEAD_LIVE = [
  { syl: "กา", phonetic: "gaa", answer: "live", rule: "Long vowel ending — live syllable." },
  { syl: "ดี", phonetic: "dii", answer: "live", rule: "Long vowel ending — live syllable." },
  { syl: "ปู", phonetic: "puu", answer: "live", rule: "Long vowel ending — live syllable." },
  { syl: "กัน", phonetic: "gan", answer: "live", rule: "Ends in น (sonorant) — live syllable." },
  { syl: "ตาม", phonetic: "dtaam", answer: "live", rule: "Ends in ม (sonorant) — live syllable." },
  { syl: "ยาว", phonetic: "yaao", answer: "live", rule: "Ends in ว (sonorant) — live syllable." },
  { syl: "นาน", phonetic: "naan", answer: "live", rule: "Ends in น (sonorant) — live syllable." },
  { syl: "มา", phonetic: "maa", answer: "live", rule: "Long vowel ending — live syllable." },
  { syl: "กับ", phonetic: "gàp", answer: "dead", rule: "Ends in บ (stop p) — dead syllable." },
  { syl: "จัด", phonetic: "jàt", answer: "dead", rule: "Ends in ด (stop t) — dead syllable." },
  { syl: "รัก", phonetic: "rák", answer: "dead", rule: "Ends in ก (stop k) — dead syllable." },
  { syl: "กะ", phonetic: "gà", answer: "dead", rule: "Short vowel, no final — dead syllable." },
  { syl: "ติ", phonetic: "dtì", answer: "dead", rule: "Short vowel, no final — dead syllable." },
  { syl: "ชอบ", phonetic: "châwp", answer: "dead", rule: "Ends in บ (stop p) — dead syllable." },
  { syl: "คิด", phonetic: "kít", answer: "dead", rule: "Ends in ด (stop t) — dead syllable." },
  { syl: "ลืม", phonetic: "lʉʉm", answer: "live", rule: "Ends in ม (sonorant) — live syllable." },
];

const POOL_MID_CLASS = [
  { syl: "กา", phonetic: "gaa", answer: "mid", rule: "Mid class + live + no mark → mid tone." },
  { syl: "ดี", phonetic: "dii", answer: "mid", rule: "Mid class + live + no mark → mid tone." },
  { syl: "ปู", phonetic: "puu", answer: "mid", rule: "Mid class + live + no mark → mid tone." },
  { syl: "ก่า", phonetic: "gàa", answer: "low", rule: "Mid class + mai ek (่) → low tone." },
  { syl: "ต่อ", phonetic: "dtàw", answer: "low", rule: "Mid class + mai ek (่) → low tone." },
  { syl: "ป่า", phonetic: "pàa", answer: "low", rule: "Mid class + mai ek (่) → low tone." },
  { syl: "ก้า", phonetic: "gâa", answer: "falling", rule: "Mid class + mai tho (้) → falling tone." },
  { syl: "ด้า", phonetic: "dâa", answer: "falling", rule: "Mid class + mai tho (้) → falling tone." },
  { syl: "ต้น", phonetic: "dtôn", answer: "falling", rule: "Mid class + mai tho (้) → falling tone." },
  { syl: "กับ", phonetic: "gàp", answer: "low", rule: "Mid class + dead syllable → low tone." },
  { syl: "จัด", phonetic: "jàt", answer: "low", rule: "Mid class + dead syllable → low tone." },
  { syl: "ติด", phonetic: "dtìt", answer: "low", rule: "Mid class + dead syllable → low tone." },
];

const POOL_ALL_CLASS = [
  // High class
  { syl: "สา", phonetic: "sǎa", answer: "rising", rule: "High class + live + no mark → rising tone." },
  { syl: "ขา", phonetic: "khǎa", answer: "rising", rule: "High class + live + no mark → rising tone." },
  { syl: "ถาม", phonetic: "thǎam", answer: "rising", rule: "High class + live + no mark → rising tone." },
  { syl: "ส่า", phonetic: "sàa", answer: "low", rule: "High class + mai ek → low tone." },
  { syl: "ข่า", phonetic: "khàa", answer: "low", rule: "High class + mai ek → low tone." },
  { syl: "ข้า", phonetic: "khâa", answer: "falling", rule: "High class + mai tho → falling tone." },
  { syl: "ส้ม", phonetic: "sôm", answer: "falling", rule: "High class + mai tho → falling tone." },
  { syl: "ขับ", phonetic: "khàp", answer: "low", rule: "High class + dead syllable → low tone." },
  // Low class
  { syl: "มา", phonetic: "maa", answer: "mid", rule: "Low class + live + no mark → mid tone." },
  { syl: "นา", phonetic: "naa", answer: "mid", rule: "Low class + live + no mark → mid tone." },
  { syl: "คน", phonetic: "khon", answer: "mid", rule: "Low class + live + no mark → mid tone." },
  { syl: "ม่า", phonetic: "mâa", answer: "falling", rule: "Low class + mai ek → falling tone." },
  { syl: "น่า", phonetic: "nâa", answer: "falling", rule: "Low class + mai ek → falling tone." },
  { syl: "ม้า", phonetic: "máa", answer: "high", rule: "Low class + mai tho → high tone." },
  { syl: "น้ำ", phonetic: "náam", answer: "high", rule: "Low class + mai tho → high tone." },
  { syl: "ร้อน", phonetic: "ráwn", answer: "high", rule: "Low class + mai tho → high tone." },
  { syl: "มัก", phonetic: "mák", answer: "high", rule: "Low class + dead syllable (short) → high tone." },
  { syl: "นัก", phonetic: "nák", answer: "high", rule: "Low class + dead syllable (short) → high tone." },
  { syl: "มาก", phonetic: "mâak", answer: "falling", rule: "Low class + dead syllable (long) → falling tone." },
  { syl: "ลาก", phonetic: "lâak", answer: "falling", rule: "Low class + dead syllable (long) → falling tone." },
];

const POOL_CUMULATIVE = [...POOL_MID_CLASS, ...POOL_ALL_CLASS];

const POOLS = {
  "dead-live": POOL_DEAD_LIVE,
  "mid-class": POOL_MID_CLASS,
  "all-class": POOL_ALL_CLASS,
  "cumulative": POOL_CUMULATIVE,
};

const OPTIONS_TONE = ["mid", "low", "falling", "high", "rising"];
const OPTIONS_DEAD_LIVE = ["dead", "live"];

const PROMPTS = {
  "dead-live": "Is this a dead or live syllable?",
  "mid-class": "What tone is this syllable?",
  "all-class": "What tone is this syllable?",
  "cumulative": "What tone is this syllable?",
};

const MODE_LABELS = {
  "dead-live": "Dead vs Live Syllables",
  "mid-class": "Mid-class Tone Rules",
  "all-class": "High & Low Class Tone Rules",
  "cumulative": "All Tone Rules — Cumulative",
};

const QUESTION_COUNT = 8;

export function ToneRuleDrill({ mode = "mid-class", onComplete }) {
  const pool = POOLS[mode] || POOL_MID_CLASS;
  const prompt = PROMPTS[mode];
  const options = mode === "dead-live" ? OPTIONS_DEAD_LIVE : OPTIONS_TONE;

  const [phase, setPhase] = useState("ready"); // ready | playing | answered | done
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const firedRef = useRef(false);

  const current = questions[idx] || null;

  const start = () => {
    const picked = shuffle(pool).slice(0, Math.min(QUESTION_COUNT, pool.length));
    setQuestions(picked);
    setIdx(0);
    setSelected(null);
    setScore(0);
    firedRef.current = false;
    setPhase("playing");
  };

  useEffect(() => {
    if (phase === "done" && !firedRef.current && questions.length > 0) {
      firedRef.current = true;
      onComplete?.({ score, total: questions.length });
    }
  }, [phase, score, questions.length, onComplete]);

  if (phase === "ready") {
    return (
      <div className="mini-aq-start-area">
        <div className="trd-header">{MODE_LABELS[mode]}</div>
        <p className="mini-aq-desc">
          {mode === "dead-live"
            ? "A dead syllable ends in a stop (ก ด บ) or a short vowel with no final. A live syllable ends in a long vowel or a sonorant (ม น ง ย ว ล ร)."
            : "Look at the syllable's consonant class, vowel length, and tone marks to determine the tone."}
        </p>
        <button className="btn btn-pri btn-sm" onClick={start}>
          Start ({Math.min(QUESTION_COUNT, pool.length)} questions)
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mini-aq-done">
        <div className="mini-aq-done-score">{score}/{questions.length} correct ({pct}%)</div>
        <div className="mini-aq-done-msg">
          {pct === 100 ? "Perfect! 🎉" :
           pct >= 70 ? "Nice work! 👏" : "Keep practicing! 💪"}
        </div>
        <button className="btn btn-sec btn-sm" onClick={start} style={{ marginTop: 12 }}>
          Try Again
        </button>
      </div>
    );
  }

  if (!current) return null;
  const answered = phase === "answered";

  return (
    <div className="mini-aq trd">
      <div className="mini-aq-header">
        <span>{idx + 1}/{questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="script-quiz-display">
        <div className="script-quiz-char trd-syl">{current.syl}</div>
        <div className="trd-phonetic">{current.phonetic}</div>
        <div className="script-quiz-prompt">{prompt}</div>
      </div>

      <div className="mini-aq-options trd-options">
        {options.map((opt, i) => {
          let cls = "mini-aq-opt";
          const isCorrect = opt === current.answer;
          const isSelected = selected === opt;
          if (answered) {
            if (isCorrect) cls += " correct";
            else if (isSelected) cls += " wrong";
          }
          return (
            <button
              key={opt}
              className={cls}
              disabled={answered}
              onClick={() => {
                if (answered) return;
                setSelected(opt);
                if (isCorrect) { setScore(s => s + 1); awardXP("script_drill_correct"); }
                else { awardXP("script_drill_attempt"); }
                setPhase("answered");
              }}
            >
              <span className="mini-aq-opt-letter">{"ABCDE"[i]}</span>
              <span style={{ textTransform: "capitalize" }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="trd-explain">
          <strong>{selected === current.answer ? "Correct!" : "Not quite."}</strong> {current.rule}
        </div>
      )}

      {answered && (
        <button
          className="btn btn-pri btn-sm"
          style={{ marginTop: 12, width: "100%" }}
          onClick={() => {
            if (idx + 1 >= questions.length) setPhase("done");
            else { setIdx(i => i + 1); setSelected(null); setPhase("playing"); }
          }}
        >
          {idx + 1 >= questions.length ? "See Results" : "Next →"}
        </button>
      )}
    </div>
  );
}
