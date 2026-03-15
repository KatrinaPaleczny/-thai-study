import { useState, useCallback, useMemo } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CURRICULUM, FULL_PATH } from "../data/curriculumData";
import { SCRIPT_LESSONS } from "../data/scriptData";
import { generateUnitTest, generateScriptTest, loadUnitTests, saveUnitTestResult } from "../utils/unitTests";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";
import { recordMistake } from "../utils/mistakes";

export function UnitTestPage() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { allVocab } = useApp();

  const unit = CURRICULUM.find(u => u.id === unitId) || SCRIPT_LESSONS.find(u => u.id === unitId);
  const isScript = unit?.type === "script";
  const prevResult = loadUnitTests()[unitId];

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  // Drill mode for missed words
  const [drillMode, setDrillMode] = useState(false);
  const [drillWords, setDrillWords] = useState([]);
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillFlipped, setDrillFlipped] = useState(false);

  const itemCount = useMemo(() => {
    if (!unit) return 0;
    if (isScript) return unit.lessons.flatMap(l => l.characters || []).length;
    return new Set(unit.lessons.flatMap(l => l.vocabIds || [])).size;
  }, [unit, isScript]);

  const startTest = useCallback(() => {
    const qs = isScript ? generateScriptTest(unitId) : generateUnitTest(unitId, allVocab);
    setQuestions(qs);
    setQIdx(0);
    setSelected(null);
    setAnswers({});
    setDone(false);
    setFinalResult(null);
    setStarted(true);
  }, [unitId, allVocab, isScript]);

  if (!unit) {
    return <Navigate to="/" replace />;
  }

  const q = questions[qIdx];
  const answered = selected !== null;
  const progress = questions.length ? ((qIdx + 1) / questions.length) * 100 : 0;

  const handleSelect = (optIdx) => {
    if (answered) return;
    setSelected(optIdx);
    const correct = optIdx === q.answerIdx;
    setAnswers(prev => ({ ...prev, [qIdx]: correct }));

    if (!correct && q.wordId) {
      const word = allVocab.find(v => v.id === q.wordId);
      if (word) recordMistake(word, "unit_test");
    }
  };

  const handleNext = () => {
    if (qIdx + 1 >= questions.length) {
      const score = Object.values(answers).filter(Boolean).length;
      const total = questions.length;
      const result = saveUnitTestResult(unitId, score, total);
      if (result.passed && result.attempts === 1) {
        awardXP("unit_test_pass");
      }
      setFinalResult({ score, total, ...result });
      setDone(true);
    } else {
      setQIdx(qIdx + 1);
      setSelected(null);
    }
  };

  // Unit display name
  const unitLabel = isScript ? unit.title : `Unit ${CURRICULUM.indexOf(unit) + 1}`;

  // ── Drill mode: study missed words ──
  if (drillMode && drillWords.length > 0) {
    const dw = drillWords[drillIdx];
    const drillTotal = drillWords.length;
    const isLast = drillIdx >= drillTotal - 1;
    const drillDone = drillIdx >= drillTotal;

    if (drillDone) {
      return (
        <div className="page">
          <div className="ph">
            <div className="ph-t">{unitLabel} Test</div>
            <div className="ph-s">Review Complete</div>
          </div>
          <div className="ut-drill-done">
            <div className="ut-drill-done-icon">💪</div>
            <h3>Nice! You reviewed {drillTotal} word{drillTotal !== 1 ? "s" : ""}</h3>
            <p>Ready to give the test another try?</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
              <button className="btn btn-pri" onClick={() => { setDrillMode(false); startTest(); }}>Retake Test</button>
              <button className="btn btn-sec" onClick={() => setDrillMode(false)}>Back to Results</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Study Missed Words</div>
          <div className="ph-s">{drillIdx + 1} of {drillTotal}</div>
        </div>
        <div className="ut-drill-container">
          <div className="rp-prog">
            <div className="rp-prog-fill" style={{ width: `${((drillIdx + 1) / drillTotal) * 100}%` }} />
          </div>

          <div
            className={`ut-drill-card${drillFlipped ? " flipped" : ""}`}
            onClick={() => setDrillFlipped(f => !f)}
          >
            {!drillFlipped ? (
              <>
                <div className="ut-drill-emoji">{dw.emoji}</div>
                <div className="ut-drill-phonetics">{dw.phonetics}</div>
                <button className="ut-drill-speak" onClick={e => { e.stopPropagation(); speakThai(dw.thai); }}>🔊 Listen</button>
                <div className="ut-drill-hint">tap to reveal</div>
              </>
            ) : (
              <>
                <div className="ut-drill-english">{dw.english}</div>
                <div className="ut-drill-thai">{dw.thai}</div>
                <div className="ut-drill-phonetics">{dw.phonetics}</div>
                <button className="ut-drill-speak" onClick={e => { e.stopPropagation(); speakThai(dw.thai); }}>🔊 Listen</button>
              </>
            )}
          </div>

          <div className="ut-drill-actions">
            {drillIdx > 0 && (
              <button className="btn btn-sec" onClick={() => { setDrillIdx(i => i - 1); setDrillFlipped(false); }}>← Prev</button>
            )}
            <button
              className="btn btn-pri"
              onClick={() => { setDrillIdx(i => i + 1); setDrillFlipped(false); }}
            >
              {isLast ? "Finish Review" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Intro screen ──
  if (!started) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">{unitLabel} Test</div>
          <div className="ph-s">{unit.title}</div>
        </div>
        <div className="pt-intro">
          <div className="pt-intro-icon">📝</div>
          <h3>Unit Test</h3>
          <p>
            Test your knowledge of {itemCount} {isScript ? "characters" : "words and grammar"} from {unit.title}.
            You need 75% to pass{!isScript ? " and unlock the next unit" : ""}.
          </p>
          <ul className="pt-intro-list">
            <li>Multiple choice questions</li>
            {isScript ? (
              <li>Character recognition, sounds, and classes</li>
            ) : (
              <li>Vocabulary, grammar, and audio questions</li>
            )}
            <li>75% required to pass</li>
            <li>You can retake anytime</li>
          </ul>
          {prevResult && (
            <div className="pt-prev-result">
              <div className="pt-prev-label">Previous best</div>
              <div className="pt-prev-level">{prevResult.passed ? "Passed" : "Not passed"}</div>
              <div className="pt-prev-score">Best: {prevResult.bestPct}% ({prevResult.attempts} attempt{prevResult.attempts !== 1 ? "s" : ""})</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center" }}>
            <button className="btn btn-pri" onClick={startTest}>Start Test</button>
            <button className="btn btn-sec" onClick={() => navigate(`/unit/${unitId}`)}>Back to Unit</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Results screen ──
  if (done && finalResult) {
    const pct = Math.round((finalResult.score / finalResult.total) * 100);
    const passed = pct >= 75;
    // Find next unit from FULL_PATH (works for both vocab and script units)
    const pathIdx = FULL_PATH.findIndex(u => u.id === unitId);
    const nextUnit = pathIdx >= 0 && pathIdx + 1 < FULL_PATH.length ? FULL_PATH[pathIdx + 1] : null;

    // Collect wrong answers for review
    const wrongAnswers = questions
      .map((q, i) => ({ ...q, idx: i }))
      .filter((_, i) => !answers[i]);

    const startDrill = () => {
      const words = wrongAnswers
        .map(q => allVocab.find(v => v.id === q.wordId))
        .filter(Boolean);
      if (words.length === 0) return;
      setDrillWords(words);
      setDrillIdx(0);
      setDrillFlipped(false);
      setDrillMode(true);
    };

    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">{unitLabel} Test</div>
          <div className="ph-s">Results</div>
        </div>
        <div className="pt-results">
          <div className="pt-results-icon">{passed ? "🎉" : "📚"}</div>
          <div className={`ut-pass-banner ${passed ? "pass" : "fail"}`}>
            {passed ? "Passed!" : "Not quite — keep studying!"}
          </div>
          <div className="pt-results-score">
            {finalResult.score} / {finalResult.total} correct ({pct}%)
          </div>

          <div className="pt-bar-container">
            <div className="pt-bar">
              <div className="pt-bar-fill" style={{ width: `${pct}%` }} />
              <div className="ut-pass-marker" />
            </div>
            <div className="pt-bar-labels">
              <span>0%</span>
              <span style={{ color: "var(--olive)" }}>75% to pass</span>
              <span>100%</span>
            </div>
          </div>

          {passed && (
            <div className="ut-xp-bonus">+25 XP bonus!</div>
          )}

          {/* Wrong answer review */}
          {wrongAnswers.length > 0 && (
            <div className="ut-review">
              <div className="ut-review-title">Review incorrect answers</div>
              {wrongAnswers.map((q, i) => (
                <div key={i} className="ut-review-item">
                  <div className="ut-review-q">{q.prompt}</div>
                  <div className="ut-review-a">Correct: <strong>{q.options[q.answerIdx]}</strong></div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-actions">
            {passed && nextUnit && (
              <button className="btn btn-pri" onClick={() => navigate(`/unit/${nextUnit.id}`)}>
                Continue to {nextUnit.title} →
              </button>
            )}
            {!passed && (
              <>
                {wrongAnswers.length > 0 && wrongAnswers.some(q => q.wordId) && (
                  <button className="btn btn-pri" onClick={startDrill}>📖 Study Missed Words</button>
                )}
                <button className="btn btn-sec" onClick={startTest}>Retake Test</button>
                <button className="btn btn-sec" onClick={() => navigate(`/unit/${unitId}`)}>Review Unit</button>
              </>
            )}
            <button className="btn btn-sec" onClick={() => navigate("/")}>Back to My Path</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Question screen ──
  if (!q) return null;

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">{unitLabel} Test</div>
        <div className="ph-s">Question {qIdx + 1} of {questions.length}</div>
      </div>

      <div className="pt-container">
        <div className="rp-prog-label">{qIdx + 1} / {questions.length}</div>
        <div className="rp-prog">
          <div className="rp-prog-fill" style={{ width: `${progress}%` }} />
        </div>

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
              if (i === q.answerIdx) cls += " correct";
              else if (i === selected) cls += " wrong";
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={answered}>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="pt-feedback-row">
            <div className={`pt-feedback ${selected === q.answerIdx ? "correct" : "wrong"}`}>
              {selected === q.answerIdx ? "Correct!" : `Answer: ${q.options[q.answerIdx]}`}
            </div>
            <button className="btn btn-pri" onClick={handleNext}>
              {qIdx + 1 >= questions.length ? "See Results" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
