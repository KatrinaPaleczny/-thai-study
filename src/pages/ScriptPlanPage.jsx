import { useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { SCRIPT_PLAN, WEEK_INFO, getDay, TOTAL_DAYS } from "../data/scriptPlanData";
import { ScriptLessonView } from "../components/ScriptLessonView";
import { ScriptMiniQuiz } from "../components/ScriptMiniQuiz";
import { ToneRuleDrill } from "../components/ToneRuleDrill";
import { PassageCard, PASSAGES } from "../components/ReadingPractice";
import { UNIT_READINGS } from "../data/unitReadingData";

const PASS_THRESHOLD = 70;

/* ─── Overview page (route: /script30) ─── */
export function ScriptPlanPage() {
  const navigate = useNavigate();
  const { scriptPlanData } = useApp();
  const completed = useMemo(() => new Set(scriptPlanData.completedDays || []), [scriptPlanData.completedDays]);
  const dayScores = scriptPlanData.dayScores || {};

  const completedCount = completed.size;
  const progressPct = Math.round((completedCount / TOTAL_DAYS) * 100);
  const nextDay = SCRIPT_PLAN.find(d => !completed.has(d.day))?.day || 1;

  return (
    <div className="page script-plan">
      <div className="script-plan-hero">
        <div className="script-plan-hero-icon">อ</div>
        <div>
          <div className="script-plan-hero-title">30-Day Thai Script Challenge</div>
          <div className="script-plan-hero-sub">15 minutes a day to read Thai. Flexible — do days in any order.</div>
        </div>
      </div>

      <div className="script-plan-progress-card">
        <div className="script-plan-progress-row">
          <span>{completedCount}/{TOTAL_DAYS} days complete</span>
          <span className="script-plan-progress-pct">{progressPct}%</span>
        </div>
        <div className="path-pbar"><div className="path-pfill" style={{ width: progressPct + "%" }} /></div>
        {completedCount < TOTAL_DAYS && (
          <button className="btn btn-pri" style={{ marginTop: 12, width: "100%" }} onClick={() => navigate(`/script30/day/${nextDay}`)}>
            {completedCount === 0 ? `Start Day 1 →` : `Continue with Day ${nextDay} →`}
          </button>
        )}
        {completedCount === TOTAL_DAYS && (
          <div className="script-plan-celebrate">🎉 You finished the challenge! Well done.</div>
        )}
      </div>

      {WEEK_INFO.map(wk => {
        const days = SCRIPT_PLAN.filter(d => d.week === wk.week);
        const wkComplete = days.filter(d => completed.has(d.day)).length;
        return (
          <div key={wk.week} className="script-plan-week">
            <div className="script-plan-week-label">
              <span>{wk.icon}</span>
              <span>{wk.label}</span>
              <span className="script-plan-week-count">{wkComplete}/{days.length}</span>
            </div>
            <div className="path-grid">
              {days.map(d => {
                const isDone = completed.has(d.day);
                const isCurrent = !isDone && d.day === nextDay;
                const score = dayScores[d.day];
                const cls = `path-unit-card${isDone ? " day-complete" : ""}${isCurrent ? " day-current" : ""}`;
                return (
                  <button
                    key={d.day}
                    className={cls}
                    onClick={() => navigate(`/script30/day/${d.day}`)}
                  >
                    <div className="script-plan-day-num">Day {d.day}</div>
                    <div className="script-plan-day-title">{d.title}</div>
                    {isDone && <div className="script-plan-day-badge">✅ {score ? `${score}%` : "Done"}</div>}
                    {!isDone && score != null && <div className="script-plan-day-badge muted">Best: {score}%</div>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Day view (route: /script30/day/:n) ─── */
export function ScriptPlanDayPage() {
  const { n } = useParams();
  const navigate = useNavigate();
  const dayNum = parseInt(n, 10);
  const day = getDay(dayNum);

  const { scriptStudied, toggleScriptStudied, scriptPlanData, recordDayScore, markDayComplete } = useApp();

  // Track best quiz score this session — combined with persistent best
  const persistedBest = scriptPlanData.dayScores?.[dayNum] || 0;
  const [sessionBest, setSessionBest] = useState(persistedBest);
  const isComplete = (scriptPlanData.completedDays || []).includes(dayNum);

  const handleQuizComplete = useCallback(({ score, total }) => {
    if (!total) return;
    const pct = Math.round((score / total) * 100);
    setSessionBest(prev => Math.max(prev, pct));
    recordDayScore(dayNum, pct);
  }, [dayNum, recordDayScore]);

  const handleMarkComplete = () => {
    markDayComplete(dayNum);
    navigate("/script30");
  };

  if (!day) {
    return (
      <div className="page">
        <button className="path-back" onClick={() => navigate("/script30")}>← Back to challenge</button>
        <div className="empty">Day not found.</div>
      </div>
    );
  }

  // Build a "lesson"-shaped object for ScriptLessonView. Section opt-in via day.sections.
  const lessonForView = useMemo(() => ({
    id: `script-plan-day-${day.day}`,
    title: day.title,
    intro: day.intro,
    characters: day.characters || [],
  }), [day]);

  const showLessonView = (day.characters?.length || 0) > 0;
  const showToneRule = day.sections?.includes("tone-rule");
  const showReading = day.sections?.includes("reading");
  const showQuiz = day.sections?.includes("quiz");

  // Build the list of passages for reading days
  const passagesForDay = useMemo(() => {
    if (!day.passageIds) return [];
    return day.passageIds.map(p => {
      if (p.source === "passages") return PASSAGES.find(pp => pp.id === p.id);
      if (p.source === "unit-reading") return (UNIT_READINGS[p.key] || []).find(pp => pp.id === p.id);
      return null;
    }).filter(Boolean);
  }, [day]);

  // Pick chars for the day quiz: prefer reviewChars, else day.characters
  const quizChars = (day.reviewChars && day.reviewChars.length >= 3) ? day.reviewChars : (day.characters || []);
  const canQuiz = quizChars.length >= 3;

  const prevDay = day.day > 1 ? day.day - 1 : null;
  const nextDay = day.day < TOTAL_DAYS ? day.day + 1 : null;
  const passed = sessionBest >= PASS_THRESHOLD;

  return (
    <div className="page script-plan-day">
      <button className="path-back" onClick={() => navigate("/script30")}>← Back to challenge</button>

      <div className="script-plan-day-hdr">
        <div className="script-plan-day-hdr-week">Week {day.week} · Day {day.day} of {TOTAL_DAYS}</div>
        <div className="script-plan-day-hdr-title">{day.title}</div>
      </div>

      {/* Lesson content (intro / drill / cards / stroke / matching / quiz come from ScriptLessonView) */}
      {showLessonView && (
        <ScriptLessonView
          key={lessonForView.id}
          lesson={lessonForView}
          scriptStudied={scriptStudied}
          toggleScriptStudied={toggleScriptStudied}
          onQuizComplete={handleQuizComplete}
          quizLabel="Day Quiz"
        />
      )}

      {/* Intro-only days (e.g. tone rules) — show the about block ourselves */}
      {!showLessonView && day.intro && (
        <div className="unit-section" style={{ marginTop: 16 }}>
          <div className="unit-section-hdr" style={{ pointerEvents: "none" }}>
            <span>📖</span>
            <span>About</span>
          </div>
          <div className="unit-section-body">
            <div className="path-grammar"><div className="path-grammar-body" style={{ whiteSpace: "pre-line" }}>{day.intro}</div></div>
          </div>
        </div>
      )}

      {/* Tone rule drill — for Days 18–21 */}
      {showToneRule && (
        <div className="unit-section" style={{ marginTop: 16 }}>
          <div className="unit-section-hdr" style={{ pointerEvents: "none" }}>
            <span>🎯</span>
            <span>Day Drill</span>
          </div>
          <div className="unit-section-body">
            <ToneRuleDrill key={`trd-${day.day}`} mode={day.toneRuleMode} onComplete={handleQuizComplete} />
          </div>
        </div>
      )}

      {/* Reading passages — Days 27–30 */}
      {showReading && passagesForDay.length > 0 && (
        <div className="unit-section" style={{ marginTop: 16 }}>
          <div className="unit-section-hdr" style={{ pointerEvents: "none" }}>
            <span>📖</span>
            <span>Read</span>
          </div>
          <div className="unit-section-body">
            <div className="unit-reading-intro">Tap any word to see its meaning.</div>
            {passagesForDay.map(p => (
              <PassageCard key={p.id} passage={p} level={day.readingLevel || 1} />
            ))}
          </div>
        </div>
      )}

      {/* Day quiz for non-character days (reading days etc.) — uses reviewChars */}
      {showQuiz && canQuiz && !showToneRule && !showLessonView && (
        <div className="unit-section" style={{ marginTop: 16 }}>
          <div className="unit-section-hdr" style={{ pointerEvents: "none" }}>
            <span>🧠</span>
            <span>Day Quiz</span>
          </div>
          <div className="unit-section-body">
            <ScriptMiniQuiz key={`day-quiz-${day.day}`} characters={quizChars} onComplete={handleQuizComplete} />
          </div>
        </div>
      )}

      {/* Mark complete button */}
      <div className="script-plan-complete-area">
        {isComplete ? (
          <div className="script-plan-complete-done">
            ✅ Day {day.day} complete{persistedBest > 0 ? ` — best score ${persistedBest}%` : ""}
          </div>
        ) : (
          <>
            <button
              className="btn btn-pri ut-test-btn"
              disabled={!passed}
              onClick={handleMarkComplete}
            >
              {passed ? `🎉 Mark Day ${day.day} Complete (+15 XP)` : `🔒 Score ${PASS_THRESHOLD}%+ to complete`}
            </button>
            {!passed && (
              <div className="script-plan-complete-hint">
                {sessionBest > 0 ? `Best so far: ${sessionBest}% — try the quiz again to reach ${PASS_THRESHOLD}%.` : `Take the day quiz and score ${PASS_THRESHOLD}% or higher to mark this day complete.`}
              </div>
            )}
          </>
        )}
      </div>

      {/* Prev / Next */}
      <div className="script-plan-day-nav">
        {prevDay ? (
          <button className="btn btn-sec btn-sm" onClick={() => navigate(`/script30/day/${prevDay}`)}>← Day {prevDay}</button>
        ) : <span />}
        {nextDay ? (
          <button className="btn btn-sec btn-sm" onClick={() => navigate(`/script30/day/${nextDay}`)}>Day {nextDay} →</button>
        ) : <span />}
      </div>
    </div>
  );
}
