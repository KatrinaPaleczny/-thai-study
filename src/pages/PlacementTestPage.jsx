import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { VOCAB_DATA } from "../data/vocabData";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";
import { loadLS, saveLS } from "../utils/storage";

const K_PLACEMENT = "katthai_placement_v1";

// Questions grouped by difficulty / unit level
// Each question tests vocab or grammar from a specific unit range
const QUESTIONS = [
  // Level 1 — Unit 1: Greetings & Survival
  {
    level: 1, unit: "u1",
    type: "translate",
    prompt: "What does สวัสดี mean?",
    options: ["Hello / Goodbye", "Thank you", "Sorry", "How are you?"],
    answer: 0,
  },
  {
    level: 1, unit: "u1",
    type: "translate",
    prompt: "What does ขอบคุณ mean?",
    options: ["Excuse me", "Thank you", "Please", "Goodbye"],
    answer: 1,
  },
  {
    level: 1, unit: "u1",
    type: "audio",
    thai: "ขอโทษ",
    prompt: "Listen and choose the meaning:",
    options: ["Thank you", "Sorry / Excuse me", "Hello", "No problem"],
    answer: 1,
  },
  // Level 2 — Unit 2: Building Blocks
  {
    level: 2, unit: "u2",
    type: "translate",
    prompt: "What does ไม่ได้ mean?",
    options: ["Can", "Don't want", "Cannot", "Don't know"],
    answer: 2,
  },
  {
    level: 2, unit: "u2",
    type: "fill",
    prompt: "Complete: ที่ไหน means ___",
    options: ["What?", "Where?", "When?", "Who?"],
    answer: 1,
  },
  {
    level: 2, unit: "u2",
    type: "translate",
    prompt: "What does แล้วก็ mean?",
    options: ["But", "Or", "And then", "Because"],
    answer: 2,
  },
  // Level 3 — Unit 3: Numbers & Time
  {
    level: 3, unit: "u3",
    type: "translate",
    prompt: "What is ยี่สิบ in English?",
    options: ["12", "20", "22", "200"],
    answer: 1,
  },
  {
    level: 3, unit: "u3",
    type: "translate",
    prompt: "What does เท่าไร mean?",
    options: ["How many?", "How much?", "How old?", "How far?"],
    answer: 1,
  },
  // Level 4 — Unit 4: Food & Daily Life
  {
    level: 4, unit: "u4",
    type: "translate",
    prompt: "What does อร่อย mean?",
    options: ["Spicy", "Sweet", "Delicious", "Hungry"],
    answer: 2,
  },
  {
    level: 4, unit: "u4",
    type: "audio",
    thai: "เผ็ดมาก",
    prompt: "Listen — what does this mean?",
    options: ["Very delicious", "Very spicy", "Very salty", "Very sweet"],
    answer: 1,
  },
  // Level 5 — Unit 5: People & Feelings
  {
    level: 5, unit: "u5",
    type: "translate",
    prompt: "What does พ่อแม่ mean?",
    options: ["Children", "Friends", "Parents", "Siblings"],
    answer: 2,
  },
  {
    level: 5, unit: "u5",
    type: "translate",
    prompt: "What does เพื่อน mean?",
    options: ["Family", "Friend(s)", "Cousin", "Neighbor"],
    answer: 1,
  },
  // Level 6 — Unit 6: Directions
  {
    level: 6, unit: "u6",
    type: "translate",
    prompt: "What does เลี้ยวซ้าย mean?",
    options: ["Turn right", "Go straight", "Turn left", "Go back"],
    answer: 2,
  },
  {
    level: 6, unit: "u6",
    type: "fill",
    prompt: "ใกล้ means ___ and ไกล means ___",
    options: ["Far / Near", "Near / Far", "Left / Right", "Here / There"],
    answer: 1,
  },
  // Level 7 — Unit 7: Social
  {
    level: 7, unit: "u7",
    type: "translate",
    prompt: "What does เที่ยว mean?",
    options: ["Eat", "Sleep", "Travel / go out", "Work"],
    answer: 2,
  },
  {
    level: 7, unit: "u7",
    type: "translate",
    prompt: "What does เพลง mean?",
    options: ["Movie", "Song / music", "Book", "Game"],
    answer: 1,
  },
  // Level 8 — Tone awareness
  {
    level: 8, unit: "tones",
    type: "tone",
    prompt: "มา (maa, mid tone) means 'come'. What does หมา (mǎa, rising tone) mean?",
    options: ["Horse", "Dog", "Cat", "Come"],
    answer: 1,
  },
  {
    level: 8, unit: "tones",
    type: "tone",
    prompt: "ใกล้ (glâi, falling tone) means 'near'. What does ไกล (glai, mid tone) mean?",
    options: ["Close", "Far", "Here", "Lost"],
    answer: 1,
  },
];

const UNIT_MAP = {
  u1: { label: "Unit 1: Sound & Survival", path: "/unit/u1" },
  u2: { label: "Unit 2: Building Blocks", path: "/unit/u2" },
  u3: { label: "Unit 3: Numbers & Time", path: "/unit/u3" },
  u4: { label: "Unit 4: Food & Daily Life", path: "/unit/u4" },
  u5: { label: "Unit 5: People & Feelings", path: "/unit/u5" },
  u6: { label: "Unit 6: Out & About", path: "/unit/u6" },
  u7: { label: "Unit 7: Social Thai", path: "/unit/u7" },
  u8: { label: "Unit 8: Your Thai", path: "/unit/u8" },
  tones: { label: "Pronunciation Practice", path: "/pronunciation" },
};

function getRecommendation(answers) {
  // Find the first level where the user got both wrong
  const levelScores = {};
  QUESTIONS.forEach((q, i) => {
    if (!levelScores[q.level]) levelScores[q.level] = { correct: 0, total: 0 };
    levelScores[q.level].total++;
    if (answers[i]) levelScores[q.level].correct++;
  });

  let recommendedUnit = "u1";
  let highestPassed = 0;
  for (let lvl = 1; lvl <= 8; lvl++) {
    const s = levelScores[lvl];
    if (s && s.correct / s.total >= 0.5) {
      highestPassed = lvl;
    } else {
      break;
    }
  }

  // Recommend starting at the next unit after what they passed
  const unitKeys = ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8"];
  recommendedUnit = unitKeys[Math.min(highestPassed, unitKeys.length - 1)];

  const totalCorrect = Object.values(answers).filter(Boolean).length;
  const percentage = Math.round((totalCorrect / QUESTIONS.length) * 100);

  let levelLabel;
  if (percentage <= 15) levelLabel = "Complete Beginner";
  else if (percentage <= 35) levelLabel = "Beginner";
  else if (percentage <= 55) levelLabel = "Elementary";
  else if (percentage <= 75) levelLabel = "Pre-Intermediate";
  else if (percentage <= 90) levelLabel = "Intermediate";
  else levelLabel = "Upper-Intermediate";

  return { recommendedUnit, highestPassed, totalCorrect, percentage, levelLabel };
}

export function PlacementTestPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({}); // { qIdx: true/false }
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
  const [previousResult, setPreviousResult] = useState(() => loadLS(K_PLACEMENT, null));

  const q = QUESTIONS[qIdx];
  const progress = ((qIdx + 1) / QUESTIONS.length) * 100;
  const answered = selected !== null;

  const handleSelect = useCallback((optIdx) => {
    if (answered) return;
    setSelected(optIdx);
    const correct = optIdx === q.answer;
    setAnswers(prev => ({ ...prev, [qIdx]: correct }));
    if (correct) awardXP("practice_correct");
  }, [answered, q, qIdx]);

  const handleNext = useCallback(() => {
    if (qIdx + 1 >= QUESTIONS.length) {
      const rec = getRecommendation(answers);
      setResult(rec);
      setDone(true);
      saveLS(K_PLACEMENT, { ...rec, date: new Date().toISOString() });
      setPreviousResult({ ...rec, date: new Date().toISOString() });
    } else {
      setQIdx(qIdx + 1);
      setSelected(null);
    }
  }, [qIdx, answers]);

  const restart = () => {
    setStarted(true);
    setQIdx(0);
    setSelected(null);
    setAnswers({});
    setDone(false);
    setResult(null);
  };

  // ── Intro screen ──
  if (!started) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Placement Test</div>
          <div className="ph-s">Find out where to start in the curriculum</div>
        </div>
        <div className="pt-intro">
          <div className="pt-intro-icon">📋</div>
          <h3>How it works</h3>
          <p>
            Answer {QUESTIONS.length} quick questions covering vocabulary, grammar, and tones.
            We'll recommend the best starting unit for your current level.
          </p>
          <ul className="pt-intro-list">
            <li>Takes about 3–5 minutes</li>
            <li>Multiple choice — no typing required</li>
            <li>Some questions include audio</li>
            <li>You can retake it anytime</li>
          </ul>
          {previousResult && (
            <div className="pt-prev-result">
              <div className="pt-prev-label">Previous result</div>
              <div className="pt-prev-level">{previousResult.levelLabel}</div>
              <div className="pt-prev-score">{previousResult.totalCorrect}/{QUESTIONS.length} correct ({previousResult.percentage}%)</div>
              <div className="pt-prev-date">Taken {new Date(previousResult.date).toLocaleDateString()}</div>
            </div>
          )}
          <button className="btn btn-pri" onClick={() => setStarted(true)} style={{ marginTop: 20 }}>
            Start Test
          </button>
        </div>
      </div>
    );
  }

  // ── Results screen ──
  if (done && result) {
    const rec = UNIT_MAP[result.recommendedUnit];
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Placement Test</div>
          <div className="ph-s">Your results</div>
        </div>
        <div className="pt-results">
          <div className="pt-results-icon">🎯</div>
          <div className="pt-results-level">{result.levelLabel}</div>
          <div className="pt-results-score">
            {result.totalCorrect} / {QUESTIONS.length} correct ({result.percentage}%)
          </div>

          <div className="pt-bar-container">
            <div className="pt-bar">
              <div className="pt-bar-fill" style={{ width: `${result.percentage}%` }} />
            </div>
            <div className="pt-bar-labels">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Advanced</span>
            </div>
          </div>

          <div className="pt-recommendation">
            <div className="pt-rec-label">We recommend starting at</div>
            <div className="pt-rec-unit">{rec.label}</div>
            <button className="btn btn-pri" onClick={() => navigate(rec.path)} style={{ marginTop: 12 }}>
              Go to {rec.label}
            </button>
          </div>

          <div className="pt-breakdown">
            <div className="pt-breakdown-title">Score Breakdown</div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(lvl => {
              const qs = QUESTIONS.map((q, i) => ({ ...q, idx: i })).filter(q => q.level === lvl);
              const correct = qs.filter(q => answers[q.idx]).length;
              const unitKey = qs[0]?.unit || "u1";
              const unitLabel = lvl <= 7 ? `Unit ${lvl}` : "Tones";
              return (
                <div key={lvl} className="pt-bd-row">
                  <span className="pt-bd-label">{unitLabel}</span>
                  <div className="pt-bd-bar-wrap">
                    <div
                      className={`pt-bd-bar ${correct === qs.length ? "perfect" : correct > 0 ? "partial" : "none"}`}
                      style={{ width: `${(correct / qs.length) * 100}%` }}
                    />
                  </div>
                  <span className="pt-bd-score">{correct}/{qs.length}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-actions">
            <button className="btn btn-sec" onClick={restart}>Retake Test</button>
            <button className="btn btn-sec" onClick={() => navigate("/")}>Back to My Path</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Question screen ──
  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Placement Test</div>
        <div className="ph-s">Question {qIdx + 1} of {QUESTIONS.length}</div>
      </div>

      <div className="pt-container">
        <div className="rp-prog-label">{qIdx + 1} / {QUESTIONS.length}</div>
        <div className="rp-prog">
          <div className="rp-prog-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="pt-level-badge">Level {q.level}</div>

        <div className="pt-question-card">
          {q.type === "audio" && q.thai && (
            <div className="pt-audio-row">
              <button className="btn btn-sec btn-sm" onClick={() => speakThai(q.thai)}>
                🔊 Listen
              </button>
              <button className="btn btn-sec btn-sm" onClick={() => speakThai(q.thai, { rate: 0.5 })}>
                🐢 Slow
              </button>
            </div>
          )}
          <div className="pt-question-text">{q.prompt}</div>
        </div>

        <div className="pt-options">
          {q.options.map((opt, i) => {
            let cls = "pt-option";
            if (answered) {
              if (i === q.answer) cls += " correct";
              else if (i === selected) cls += " wrong";
            } else if (i === selected) cls += " selected";
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={answered}>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="pt-feedback-row">
            <div className={`pt-feedback ${selected === q.answer ? "correct" : "wrong"}`}>
              {selected === q.answer ? "Correct!" : `The answer is: ${q.options[q.answer]}`}
            </div>
            <button className="btn btn-pri" onClick={handleNext}>
              {qIdx + 1 >= QUESTIONS.length ? "See Results" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
