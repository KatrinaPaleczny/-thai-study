import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { getXPHistory, getTodayProgress, getStreak, getLevel, loadXP } from "../utils/xp";
import { getSRSStats, loadSRS } from "../utils/srs";
import { getMistakeStats } from "../utils/mistakes";

export function AnalyticsPage() {
  const { allVocab, studied, confidence } = useApp();
  const [range, setRange] = useState(14); // 7 | 14 | 30

  const xpHistory = useMemo(() => getXPHistory(range), [range]);
  const todayProgress = getTodayProgress();
  const streak = getStreak();
  const level = getLevel(todayProgress.totalXP);
  const srsStats = getSRSStats(allVocab);
  const mistakeStats = getMistakeStats();

  // Calculate category breakdown
  const catBreakdown = useMemo(() => {
    const cats = {};
    for (const word of allVocab) {
      if (!cats[word.category]) cats[word.category] = { total: 0, studied: 0, mastered: 0 };
      cats[word.category].total++;
      if (studied.has(word.id)) cats[word.category].studied++;
      if ((confidence[word.id] || 0) >= 3) cats[word.category].mastered++;
    }
    return Object.entries(cats).sort((a, b) => b[1].total - a[1].total);
  }, [allVocab, studied, confidence]);

  // Confidence distribution
  const confDist = useMemo(() => {
    const dist = [0, 0, 0, 0]; // New, Learning, Familiar, Mastered
    for (const word of allVocab) {
      const c = confidence[word.id] || 0;
      dist[c]++;
    }
    return dist;
  }, [allVocab, confidence]);

  const maxXP = Math.max(1, ...xpHistory.map(d => d.xp));

  // Accuracy trend (from XP history — rough estimate)
  const totalStudied = studied.size;
  const totalWords = allVocab.length;
  const studiedPct = Math.round((totalStudied / totalWords) * 100);

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Progress Analytics</div>
        <div className="ph-s">Track your Thai learning journey</div>
      </div>

      {/* Overview Cards */}
      <div className="an-overview">
        <div className="an-card">
          <div className="an-card-icon">🔥</div>
          <div className="an-card-val">{streak.streak}</div>
          <div className="an-card-lbl">Day Streak</div>
        </div>
        <div className="an-card">
          <div className="an-card-icon">⭐</div>
          <div className="an-card-val">{todayProgress.totalXP}</div>
          <div className="an-card-lbl">Total XP</div>
        </div>
        <div className="an-card">
          <div className="an-card-icon">📈</div>
          <div className="an-card-val">Lv.{level.level}</div>
          <div className="an-card-lbl">{level.title}</div>
        </div>
        <div className="an-card">
          <div className="an-card-icon">📖</div>
          <div className="an-card-val">{totalStudied}/{totalWords}</div>
          <div className="an-card-lbl">Words Studied</div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="an-section">
        <h3 className="an-section-title">Today's Progress</h3>
        <div className="an-today">
          <div className="an-today-bar">
            <div className="an-today-fill" style={{ width: `${todayProgress.progress * 100}%` }} />
          </div>
          <div className="an-today-label">
            {todayProgress.todayXP} / {todayProgress.dailyGoal} XP
            {todayProgress.goalMet && " ✅"}
          </div>
        </div>
      </div>

      {/* XP Chart */}
      <div className="an-section">
        <div className="an-section-head">
          <h3 className="an-section-title">XP Over Time</h3>
          <div className="an-range-btns">
            {[7, 14, 30].map(r => (
              <button key={r} className={`an-range-btn${range === r ? " on" : ""}`} onClick={() => setRange(r)}>
                {r}d
              </button>
            ))}
          </div>
        </div>
        <div className="an-chart">
          {xpHistory.map((day, i) => (
            <div key={i} className="an-bar-col">
              <div className="an-bar-wrap">
                <div
                  className={`an-bar${day.xp >= todayProgress.dailyGoal ? " goal-met" : ""}`}
                  style={{ height: `${(day.xp / maxXP) * 100}%` }}
                  title={`${day.date}: ${day.xp} XP`}
                />
              </div>
              {(i === 0 || i === xpHistory.length - 1 || i === Math.floor(xpHistory.length / 2)) && (
                <div className="an-bar-date">{day.date.slice(5)}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SRS Stats */}
      <div className="an-section">
        <h3 className="an-section-title">Spaced Repetition</h3>
        <div className="an-srs-row">
          <div className="an-srs-item">
            <span className="an-srs-num">{srsStats.total}</span>
            <span className="an-srs-lbl">In System</span>
          </div>
          <div className="an-srs-item">
            <span className="an-srs-num">{srsStats.dueNow}</span>
            <span className="an-srs-lbl">Due Now</span>
          </div>
          <div className="an-srs-item">
            <span className="an-srs-num">{srsStats.learning}</span>
            <span className="an-srs-lbl">Learning</span>
          </div>
          <div className="an-srs-item">
            <span className="an-srs-num">{srsStats.mastered}</span>
            <span className="an-srs-lbl">Mastered</span>
          </div>
        </div>
      </div>

      {/* Confidence Distribution */}
      <div className="an-section">
        <h3 className="an-section-title">Confidence Distribution</h3>
        <div className="an-conf-dist">
          {["New", "Learning", "Familiar", "Mastered"].map((label, i) => {
            const pct = totalWords > 0 ? Math.round((confDist[i] / totalWords) * 100) : 0;
            const colors = ["var(--t3)", "#D4BA6E", "#0A8A7A", "#087068"];
            return (
              <div key={label} className="an-conf-item">
                <div className="an-conf-lbl">{label}</div>
                <div className="an-conf-bar-wrap">
                  <div className="an-conf-bar" style={{ width: `${pct}%`, background: colors[i] }} />
                </div>
                <div className="an-conf-count">{confDist[i]} ({pct}%)</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="an-section">
        <h3 className="an-section-title">Category Breakdown</h3>
        <div className="an-cats">
          {catBreakdown.map(([cat, data]) => {
            const pct = Math.round((data.studied / data.total) * 100);
            return (
              <div key={cat} className="an-cat-row">
                <div className="an-cat-name">{cat}</div>
                <div className="an-cat-bar-wrap">
                  <div className="an-cat-bar" style={{ width: `${pct}%` }} />
                </div>
                <div className="an-cat-nums">{data.studied}/{data.total}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mistakes Summary */}
      {mistakeStats.total > 0 && (
        <div className="an-section">
          <h3 className="an-section-title">Mistake Summary</h3>
          <div className="an-mistakes-summary">
            <span>{mistakeStats.total} total mistakes recorded</span>
            <span> · </span>
            <span>{mistakeStats.unreviewed} unreviewed</span>
          </div>
        </div>
      )}
    </div>
  );
}
