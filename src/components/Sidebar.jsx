import { useState, useEffect } from "react";
import { FULL_PATH } from "../data/curriculumData";
import { getTodayProgress, getStreak, getLevel } from "../utils/xp";
import { getSRSStats } from "../utils/srs";
import { getMistakeStats } from "../utils/mistakes";

export function Sidebar({ page, setPage, onOpenUnit, allVocab }) {
  const [pathOpen, setPathOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [xpInfo, setXpInfo] = useState({ todayXP: 0, dailyGoal: 50, progress: 0, totalXP: 0 });
  const [streakInfo, setStreakInfo] = useState({ streak: 0 });
  const [levelInfo, setLevelInfo] = useState({ level: 1, title: "Newcomer" });
  const [srsdue, setSrsdue] = useState(0);
  const [unreviewedMistakes, setUnreviewedMistakes] = useState(0);

  // Refresh stats periodically
  useEffect(() => {
    const refresh = () => {
      const tp = getTodayProgress();
      setXpInfo(tp);
      setStreakInfo(getStreak());
      setLevelInfo(getLevel(tp.totalXP));
      if (allVocab && allVocab.length) setSrsdue(getSRSStats(allVocab).dueNow);
      setUnreviewedMistakes(getMistakeStats().unreviewed);
    };
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [allVocab]);

  const btn = (p, ic, label, badge) => (
    <button className={`sb-btn${page===p?" on":""}`} onClick={()=>{ setPage(p); setMobileOpen(false); }}>
      <span className="sb-ic">{ic}</span><span className="sb-txt">{label}</span>
      {badge > 0 && <span className="sb-badge">{badge}</span>}
    </button>
  );

  let vocabUnitNum = 0;

  // Find current page label for mobile header
  const pageLabels = { mypath:"My Path", vocab:"Vocabulary", flashcards:"Flashcards", srs:"SRS Review", practice:"Practice", sentences:"Sentences", roleplay:"Role-Play", aichat:"AI Chat", writing:"Writing", handwriting:"Handwriting", scenes:"Scenes", stories:"Stories", pronunciation:"Pronunciation", daily:"Daily Word", mistakes:"Mistakes", analytics:"Analytics", grammar:"Grammar", numbers:"Numbers", unit:"My Path" };
  const currentLabel = pageLabels[page] || "My Path";

  return (
    <>
      {/* Mobile top bar */}
      <div className="sb-mobile-bar">
        <button className="sb-hamburger" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? "✕" : "☰"}
        </button>
        <span className="sb-mobile-title">{currentLabel}</span>
        <span className="sb-mobile-xp">{xpInfo.todayXP}/{xpInfo.dailyGoal} XP</span>
      </div>
      {mobileOpen && <div className="sb-overlay" onClick={() => setMobileOpen(false)} />}
    <div className={`sb${mobileOpen ? " sb-open" : ""}`}>
      <div className="sb-logo">
        <div className="sb-th">เรียนไทย</div>
        <div className="sb-sub">คุณแคท · Thai Study</div>
      </div>

      {/* Streak & XP Widget */}
      <div className="sb-xp-widget">
        <div className="sb-xp-row">
          <span className="sb-streak">{streakInfo.streak > 0 ? `🔥 ${streakInfo.streak}` : "🔥 0"}</span>
          <span className="sb-level">Lv.{levelInfo.level} {levelInfo.title}</span>
        </div>
        <div className="sb-xp-bar">
          <div className="sb-xp-fill" style={{ width: `${xpInfo.progress * 100}%` }} />
        </div>
        <div className="sb-xp-label">{xpInfo.todayXP}/{xpInfo.dailyGoal} XP today</div>
      </div>

      <div className="sb-lbl">Learn</div>

      {/* My Path with dropdown */}
      <div>
        <button
          className={`sb-btn${page==="mypath"?" on":""}`}
          onClick={() => { setPage("mypath"); setPathOpen(o => !o); }}
        >
          <span className="sb-ic">🛤️</span>
          <span>My Path</span>
          <span className="sb-chev">{pathOpen ? "▾" : "▸"}</span>
        </button>
        {pathOpen && (
          <div className="sb-sub-list">
            {FULL_PATH.map(unit => {
              const isScript = unit.type === "script";
              if (!isScript) vocabUnitNum++;
              const label = isScript ? unit.title : `Unit ${vocabUnitNum}: ${unit.title}`;
              return (
                <button
                  key={unit.id}
                  className="sb-sub-btn"
                  onClick={() => { onOpenUnit(unit.id); setMobileOpen(false); }}
                >
                  <span className="sb-sub-ic">{unit.icon}</span>
                  <span className="sb-sub-lbl">{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {btn("vocab","📖","Vocabulary")}
      {btn("flashcards","🃏","Flashcards")}
      {btn("srs","🧠","SRS Review", srsdue)}
      {btn("practice","🎯","Practice")}
      {btn("sentences","🧩","Sentences")}
      {btn("roleplay","💬","Role-Play")}
      {btn("aichat","🤖","AI Chat")}
      {btn("writing","✍️","Writing")}
      {btn("handwriting","🖌️","Handwriting")}
      {btn("scenes","🖼️","Scenes")}
      {btn("stories","📚","Stories")}
      {btn("pronunciation","🎙️","Pronunciation")}
      <div className="sb-lbl">Review</div>
      {btn("daily","⭐","Daily Word")}
      {btn("mistakes","📝","Mistakes", unreviewedMistakes)}
      {btn("analytics","📊","Analytics")}
      <div className="sb-lbl">Reference</div>
      {btn("grammar","📐","Grammar")}
      {btn("numbers","🔢","Numbers")}
    </div>
    </>
  );
}
