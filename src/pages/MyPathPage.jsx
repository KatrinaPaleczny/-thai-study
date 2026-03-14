import { useState, useMemo } from "react";
import { FULL_PATH } from "../data/curriculumData";
import { FlashcardDeck } from "../components/FlashcardDeck";

/* ── Helper: compute progress for a unit ── */
function getUnitProgress(unit, allVocab, studied, scriptStudied) {
  if (unit.type === "script") {
    const chars = unit.lessons.flatMap(l => l.characters || []);
    const total = chars.length;
    const done = chars.filter(c => scriptStudied.has(c.char)).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }
  let total = 0, done = 0;
  unit.lessons.forEach(l => {
    const words = allVocab.filter(v => (l.vocabIds || []).includes(v.id));
    total += words.length;
    done += words.filter(v => studied.has(v.id)).length;
  });
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

/* ── Main Page ── */
export function MyPathPage({ allVocab, studied, toggleStudied, scriptStudied, streakData, confidence = {}, onOpenUnit, onStartSession }) {
  const [showReview, setShowReview] = useState(false);

  const unitProgress = useMemo(() => {
    const map = {};
    FULL_PATH.forEach(unit => {
      map[unit.id] = getUnitProgress(unit, allVocab, studied, scriptStudied);
    });
    return map;
  }, [allVocab, studied, scriptStudied]);

  const totalItems = Object.values(unitProgress).reduce((s, u) => s + u.total, 0);
  const totalDone = Object.values(unitProgress).reduce((s, u) => s + u.done, 0);
  const totalPct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;

  // Find the "continue" unit: first unit not at 100%, or last unit
  const continueUnit = FULL_PATH.find(u => unitProgress[u.id].pct < 100) || FULL_PATH[FULL_PATH.length - 1];

  // Quick Review: 10 random studied words
  const reviewWords = useMemo(() => {
    if (!showReview) return [];
    const studiedWords = allVocab.filter(v => studied.has(v.id));
    const shuffled = [...studiedWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, [showReview, allVocab, studied]);

  const studiedCount = allVocab.filter(v => studied.has(v.id)).length;
  const streak = streakData?.streak || 0;

  const confCounts = useMemo(() => {
    const counts = [0, 0, 0, 0]; // new, learning, familiar, mastered
    allVocab.forEach(v => { const c = confidence[v.id] || 0; counts[c]++; });
    return counts;
  }, [allVocab, confidence]);

  let vocabUnitNum = 0;

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">My Path</div>
        <div className="ph-s">
          Your personal Thai curriculum &middot; {totalDone}/{totalItems} items &middot; {totalPct}% complete
          {streak > 0 && <span className="streak-badge">{streak} day{streak !== 1 ? "s" : ""} streak</span>}
        </div>
        <div className="path-pbar path-pbar-top"><div className="path-pfill" style={{ width: totalPct + "%" }} /></div>
      </div>

      {/* Confidence Summary */}
      {(confCounts[1] + confCounts[2] + confCounts[3]) > 0 && (
        <div className="conf-summary">
          <span className="conf-dot" style={{ color: "#c29b3f" }}>{"●"} {confCounts[1]} learning</span>
          <span className="conf-dot" style={{ color: "#6b9e5a" }}>{"●"} {confCounts[2]} familiar</span>
          <span className="conf-dot" style={{ color: "#3d8b37" }}>{"●"} {confCounts[3]} mastered</span>
        </div>
      )}

      {/* Quick Review */}
      {showReview ? (
        <div className="quick-review-wrap">
          <div className="quick-review-hdr">
            <span className="quick-review-title">Quick Review ({reviewWords.length} words)</span>
            <button className="quick-review-close" onClick={() => setShowReview(false)}>&times;</button>
          </div>
          {reviewWords.length > 0 ? (
            <FlashcardDeck words={reviewWords} studied={studied} toggleStudied={toggleStudied} confidence={confidence} />
          ) : (
            <div className="empty">No studied words to review yet. Start learning!</div>
          )}
        </div>
      ) : studiedCount >= 3 && (
        <button className="quick-review-btn" onClick={() => setShowReview(true)}>
          Review {Math.min(10, studiedCount)} studied words
        </button>
      )}

      {/* Daily Session */}
      {onStartSession && (
        <button className="ds-launch-btn" onClick={onStartSession}>
          ⏱️ Study for 5 minutes
        </button>
      )}

      {/* Continue Learning Banner */}
      {continueUnit && (
        <div className="continue-card" onClick={() => onOpenUnit(continueUnit.id)}>
          <div className="continue-top">
            <span className="continue-label">Continue Learning</span>
            <span className="continue-pct">{unitProgress[continueUnit.id].pct}%</span>
          </div>
          <div className="continue-title">
            {continueUnit.icon} {continueUnit.title}
          </div>
          <div className="continue-sub">{continueUnit.description}</div>
          <div className="continue-bar">
            <div className="continue-fill" style={{ width: unitProgress[continueUnit.id].pct + "%" }} />
          </div>
        </div>
      )}

      {/* Unit cards — flat list, no accordion, no locks */}
      <div className="path-grid">
        {FULL_PATH.map(unit => {
          const isScript = unit.type === "script";
          if (!isScript) vocabUnitNum++;
          const prog = unitProgress[unit.id];

          return (
            <div
              key={unit.id}
              className={`path-unit-card${isScript ? " script" : ""}${prog.pct === 100 ? " complete" : ""}`}
              onClick={() => onOpenUnit(unit.id)}
            >
              <div className="path-uc-top">
                <span className="path-uc-icon">{unit.icon}</span>
                <span className="path-uc-pct">{prog.pct}%</span>
              </div>
              <div className="path-uc-title">
                {isScript ? unit.title : `Unit ${vocabUnitNum}: ${unit.title}`}
              </div>
              <div className="path-uc-desc">{unit.description}</div>
              <div className="path-uc-meta">
                {prog.done}/{prog.total} {isScript ? "characters" : "words"}
              </div>
              <div className="path-pbar path-pbar-sm" style={{ marginTop: 8 }}>
                <div className="path-pfill" style={{ width: prog.pct + "%" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
