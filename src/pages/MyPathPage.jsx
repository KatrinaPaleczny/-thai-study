import { useState, useMemo } from "react";
import { FULL_PATH } from "../data/curriculumData";
import { FlashcardDeck } from "../components/FlashcardDeck";
import { getTodayProgress, getStreak, getLevel } from "../utils/xp";
import { getSRSStats } from "../utils/srs";
import { getMistakeStats } from "../utils/mistakes";
import { getAdaptiveSummary } from "../utils/adaptive";

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

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ── Main Page ── */
export function MyPathPage({ allVocab, studied, toggleStudied, scriptStudied, streakData, confidence = {}, onOpenUnit, onStartSession, setPage }) {
  const [showReview, setShowReview] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(false);

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

  const continueUnit = FULL_PATH.find(u => unitProgress[u.id].pct < 100) || FULL_PATH[FULL_PATH.length - 1];

  const reviewWords = useMemo(() => {
    if (!showReview) return [];
    const studiedWords = allVocab.filter(v => studied.has(v.id));
    return [...studiedWords].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [showReview, allVocab, studied]);

  const studiedCount = allVocab.filter(v => studied.has(v.id)).length;
  const xpProgress = getTodayProgress();
  const streakInfo = getStreak();
  const levelInfo = getLevel(xpProgress.totalXP);
  const srsStats = getSRSStats(allVocab);
  const mistakeStats = getMistakeStats();
  const cats = useMemo(() => [...new Set(allVocab.map(v => v.category))].sort(), [allVocab]);
  const weakAreas = useMemo(() => getAdaptiveSummary(cats).filter(c => c.total > 0 && c.accuracy !== null && c.accuracy < 70).slice(0, 3), [cats]);

  // Build smart "Jump In" cards
  const jumpCards = useMemo(() => {
    const cards = [];
    if (srsStats.dueNow > 0) cards.push({ key: "srs", emoji: "🔄", label: "SRS Review", sub: `${srsStats.dueNow} cards due`, page: "srs", priority: 1 });
    if (mistakeStats.unreviewed > 0) cards.push({ key: "mistakes", emoji: "🔍", label: "Review Mistakes", sub: `${mistakeStats.unreviewed} unreviewed`, page: "mistakes", priority: 2 });
    cards.push({ key: "daily", emoji: "⭐", label: "Daily Word", sub: "Today's challenge", page: "daily", priority: 3 });
    if (studiedCount >= 3) cards.push({ key: "flash", emoji: "🃏", label: "Flashcards", sub: `${studiedCount} words ready`, page: "flashcards", priority: 4 });
    cards.push({ key: "stories", emoji: "📚", label: "Stories", sub: "Graded readers", page: "stories", priority: 5 });
    cards.push({ key: "roleplay", emoji: "💬", label: "Role-Play", sub: "Practice conversations", page: "roleplay", priority: 6 });
    return cards.sort((a, b) => a.priority - b.priority).slice(0, 4);
  }, [srsStats, mistakeStats, studiedCount]);

  // Learning paths
  const paths = [
    { emoji: "🗣️", title: "Speaking", desc: "Pronunciation, conversations, role-play", pages: ["pronunciation", "roleplay", "aichat"] },
    { emoji: "📖", title: "Reading", desc: "Stories, vocabulary, sentences", pages: ["stories", "vocab", "sentences"] },
    { emoji: "✍️", title: "Writing", desc: "Handwriting, sentence builder", pages: ["handwriting", "writing"] },
    { emoji: "🧠", title: "Review", desc: "SRS, flashcards, mistakes, analytics", pages: ["srs", "flashcards", "mistakes", "analytics"] },
  ];

  let vocabUnitNum = 0;

  return (
    <div className="page">
      {/* ── Hero Dashboard ── */}
      <div className="mp-hero">
        <div className="mp-hero-left">
          <div className="mp-greeting">{greeting()}</div>
          <div className="mp-level">Level {levelInfo.level}: {levelInfo.title}</div>
        </div>
        <div className="mp-stats">
          <div className="mp-stat">
            <div className="mp-stat-val">{streakInfo.streak}</div>
            <div className="mp-stat-lbl">day streak</div>
          </div>
          <div className="mp-stat">
            <div className="mp-stat-val">{studiedCount}</div>
            <div className="mp-stat-lbl">words</div>
          </div>
          <div className="mp-stat">
            <div className="mp-stat-val">{xpProgress.totalXP}</div>
            <div className="mp-stat-lbl">total XP</div>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="mp-xp-bar">
        <div className="mp-xp-label">
          <span>Today: {xpProgress.todayXP}/{xpProgress.dailyGoal} XP</span>
          {xpProgress.goalMet && <span className="mp-xp-done">Goal met!</span>}
        </div>
        <div className="rp-prog"><div className="rp-prog-fill" style={{ width: `${xpProgress.progress * 100}%` }} /></div>
        {levelInfo.nextAt && (
          <div className="mp-xp-next">Next level at {levelInfo.nextAt} XP ({levelInfo.nextAt - xpProgress.totalXP} to go)</div>
        )}
      </div>

      {/* ── Jump In ── */}
      <div className="mp-section">
        <div className="mp-section-title">Jump In</div>
        <div className="mp-quick-grid">
          {jumpCards.map(c => (
            <button key={c.key} className="mp-quick-card" onClick={() => setPage?.(c.page)}>
              <span className="mp-quick-emoji">{c.emoji}</span>
              <span className="mp-quick-label">{c.label}</span>
              <span className="mp-quick-sub">{c.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Focus Areas ── */}
      {weakAreas.length > 0 && (
        <div className="mp-section">
          <div className="mp-section-title">Focus Areas</div>
          <div className="mp-section-sub">Categories where you need more practice</div>
          <div className="mp-weak-list">
            {weakAreas.map(w => (
              <div key={w.category} className="mp-weak-item">
                <div className="mp-weak-cat">{w.category}</div>
                <div className="mp-weak-bar-wrap">
                  <div className="mp-weak-bar">
                    <div className="mp-weak-fill" style={{ width: `${w.accuracy}%`, background: w.accuracy < 40 ? '#c9967a' : w.accuracy < 60 ? '#c29b3f' : '#aeba9a' }} />
                  </div>
                  <span className="mp-weak-pct">{w.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Learning Paths ── */}
      <div className="mp-section">
        <div className="mp-section-title">Learning Paths</div>
        <div className="mp-paths-grid">
          {paths.map(p => (
            <button key={p.title} className="mp-path-card" onClick={() => setPage?.(p.pages[0])}>
              <span className="mp-path-emoji">{p.emoji}</span>
              <span className="mp-path-title">{p.title}</span>
              <span className="mp-path-desc">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Continue Curriculum ── */}
      {continueUnit && (
        <div className="continue-card" onClick={() => onOpenUnit(continueUnit.id)}>
          <div className="continue-top">
            <span className="continue-label">Continue Learning</span>
            <span className="continue-pct">{unitProgress[continueUnit.id].pct}%</span>
          </div>
          <div className="continue-title">{continueUnit.icon} {continueUnit.title}</div>
          <div className="continue-sub">{continueUnit.description}</div>
          <div className="continue-bar"><div className="continue-fill" style={{ width: unitProgress[continueUnit.id].pct + "%" }} /></div>
        </div>
      )}

      {/* ── Quick Review ── */}
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

      {/* ── Daily Session ── */}
      {onStartSession && (
        <button className="ds-launch-btn" onClick={onStartSession}>
          ⏱️ Study for 5 minutes
        </button>
      )}

      {/* ── Full Curriculum (collapsible) ── */}
      <div className="mp-section">
        <button className="mp-curriculum-toggle" onClick={() => setShowCurriculum(!showCurriculum)}>
          <span>Full Curriculum</span>
          <span className="mp-curriculum-meta">{totalDone}/{totalItems} items · {totalPct}%</span>
          <span className="mp-curriculum-chev">{showCurriculum ? "▲" : "▼"}</span>
        </button>
        {showCurriculum && (
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
        )}
      </div>
    </div>
  );
}
