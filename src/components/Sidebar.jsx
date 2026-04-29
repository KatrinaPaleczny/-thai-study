import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { FULL_PATH } from "../data/curriculumData";
import { getTodayProgress, getStreak, getLevel } from "../utils/xp";
import { getSRSStats } from "../utils/srs";
import { getMistakeStats } from "../utils/mistakes";
import { getLastExportDate } from "../utils/storage";
import { FlameIcon, FlashcardIcon, TargetIcon, StarIcon, BrainIcon } from "./AppIcons";

const ROUTE_MAP = {
  "/": "mypath", "/placement": "placement", "/vocab": "vocab", "/flashcards": "flashcards", "/srs": "srs",
  "/practice": "practice", "/sentences": "sentences", "/roleplay": "roleplay",
  "/aichat": "aichat", "/writing": "writing", "/handwriting": "handwriting",
  "/scenes": "scenes", "/stories": "stories", "/pronunciation": "pronunciation",
  "/listening": "listening", "/match": "match", "/imagevocab": "imagevocab",
  "/daily": "daily", "/mistakes": "mistakes", "/analytics": "analytics",
  "/grammar": "grammar", "/grammarbank": "grammarbank", "/numbers": "numbers",
  "/frequency": "frequency", "/audioquiz": "audioquiz", "/settings": "settings", "/account": "account",
  "/script30": "script30",
};

const PAGE_LABELS = { mypath:"My Path", placement:"Placement Test", vocab:"Vocabulary", flashcards:"Flashcards", srs:"SRS Review", practice:"Practice", sentences:"Sentences", roleplay:"Role-Play", aichat:"AI Chat", writing:"Writing", handwriting:"Handwriting", scenes:"Scenes", stories:"Stories", pronunciation:"Pronunciation", listening:"Listening", match:"Match Pairs", imagevocab:"Image Vocab", daily:"Daily Word", mistakes:"Mistakes", analytics:"Analytics", grammar:"Grammar", grammarbank:"Grammar Bank", numbers:"Numbers & Time", frequency:"Core Words", audioquiz:"Audio Quiz", settings:"Settings", script30:"30-Day Script" };

export function Sidebar() {
  const { allVocab, studied, scriptPlanData } = useApp();
  const scriptDaysRemaining = Math.max(0, 30 - ((scriptPlanData?.completedDays || []).length));
  const { isAuthenticated, user, syncing } = useAuth();
  const studiedCount = allVocab ? allVocab.filter(v => studied.has(v.id)).length : 0;
  const location = useLocation();
  const navigate = useNavigate();
  const [pathOpen, setPathOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarData, setSidebarData] = useState(() => ({
    xpInfo: { todayXP: 0, dailyGoal: 50, progress: 0, totalXP: 0 },
    streakInfo: { streak: 0 },
    levelInfo: { level: 1, title: "Newcomer" },
    srsdue: 0,
    unreviewedMistakes: 0,
  }));

  const page = location.pathname.startsWith("/unit/") ? "mypath" : (ROUTE_MAP[location.pathname] || "mypath");

  const refresh = useCallback(() => {
    const tp = getTodayProgress();
    const si = getStreak();
    const li = getLevel(tp.totalXP);
    const srs = (allVocab && allVocab.length) ? getSRSStats(allVocab).dueNow : 0;
    const um = getMistakeStats().unreviewed;
    setSidebarData({ xpInfo: tp, streakInfo: si, levelInfo: li, srsdue: srs, unreviewedMistakes: um });
  }, [allVocab]);

  // Refresh on mount and on route changes (instead of every 10 seconds)
  useEffect(() => { refresh(); }, [location.pathname, refresh]);

  // Also refresh when the window regains focus (user comes back to tab)
  useEffect(() => {
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  const { xpInfo, streakInfo, levelInfo, srsdue, unreviewedMistakes } = sidebarData;

  const go = (path) => { navigate(path); setMobileOpen(false); };

  const btn = (path, pageKey, ic, label, badge) => (
    <button className={`sb-btn${page===pageKey?" on":""}`} onClick={() => go(path)}>
      <span className="sb-ic">{ic}</span><span className="sb-txt">{label}</span>
      {badge > 0 && <span className="sb-badge">{badge}</span>}
    </button>
  );

  let vocabUnitNum = 0;

  const currentLabel = PAGE_LABELS[page] || "My Path";

  return (
    <>
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

      <div className="sb-xp-widget">
        <div className="sb-xp-row">
          <span className="sb-streak"><span className="sb-streak-flame"><FlameIcon size={16} active={streakInfo.streak > 0} /></span> {streakInfo.streak > 0 ? streakInfo.streak : 0}</span>
          <span className="sb-level">Lv.{levelInfo.level} {levelInfo.title}</span>
        </div>
        <div className="sb-xp-bar">
          <div className="sb-xp-fill" style={{ width: `${xpInfo.progress * 100}%` }} />
        </div>
        <div className="sb-xp-label">{xpInfo.todayXP}/{xpInfo.dailyGoal} XP today</div>
      </div>

      <div className="sb-lbl">Learn</div>

      <div>
        <button
          className={`sb-btn${page==="mypath"?" on":""}`}
          onClick={() => { go("/"); setPathOpen(o => !o); }}
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
                  className={`sb-sub-btn${isScript ? " sb-sub-script" : ""}`}
                  onClick={() => { navigate(`/unit/${unit.id}`); setMobileOpen(false); }}
                >
                  <span className={`sb-sub-ic${isScript ? " sb-script-ic" : ""}`}>{unit.icon}</span>
                  <span className="sb-sub-lbl">{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Always visible */}
      {btn("/script30","script30","อ","30-Day Script", scriptDaysRemaining)}
      {btn("/vocab","vocab","📖","Vocabulary")}
      {btn("/frequency","frequency","📊","Core Words")}
      {btn("/flashcards","flashcards",<FlashcardIcon />,"Flashcards")}
      {btn("/srs","srs",<BrainIcon />,"SRS Review", srsdue)}
      {btn("/daily","daily",<StarIcon filled />,"Daily Word")}

      {/* After 10 words */}
      {studiedCount >= 10 && <>
        {btn("/pronunciation","pronunciation","🎙️","Pronunciation")}
        {btn("/listening","listening","👂","Listening")}
        {btn("/audioquiz","audioquiz","🎧","Audio Quiz")}
        {btn("/practice","practice",<TargetIcon />,"Practice")}
        {btn("/mistakes","mistakes","📝","Mistakes", unreviewedMistakes)}
      </>}

      {/* After 30 words */}
      {studiedCount >= 30 && <>
        {btn("/sentences","sentences","🧩","Sentences")}
        {btn("/match","match","🔗","Match Pairs")}
        {btn("/stories","stories","📚","Stories")}
        {btn("/analytics","analytics","📊","Analytics")}
        <div className="sb-lbl">Reference</div>
        {btn("/grammar","grammar","📐","Grammar")}
        {btn("/grammarbank","grammarbank","📋","Grammar Bank")}
        {btn("/numbers","numbers","🔢","Numbers & Time")}
      </>}

      {/* After 60 words */}
      {studiedCount >= 60 && <>
        {btn("/writing","writing","✍️","Writing")}
        {btn("/handwriting","handwriting","🖌️","Handwriting")}
        {btn("/scenes","scenes","🖼️","Scenes")}
        {btn("/roleplay","roleplay","💬","Role-Play")}
        {btn("/aichat","aichat","🤖","AI Chat")}
        {btn("/imagevocab","imagevocab","🖼️","Image Vocab")}
        {btn("/placement","placement","📋","Placement Test")}
      </>}

      <div className="sb-lbl">Settings</div>
      {btn("/settings","settings","⚙️","Settings")}
      {(() => {
        const last = getLastExportDate();
        const needsBackup = !last || (Date.now() - new Date(last).getTime()) > 7 * 86400000;
        return needsBackup ? (
          <button className="sb-backup-nudge" onClick={() => go("/settings")}>
            {last ? "Last backup: " + new Date(last).toLocaleDateString() : "No backups yet"} — back up now?
          </button>
        ) : null;
      })()}

      <div className="sb-account">
        {isAuthenticated ? (
          <button className="sb-account-btn" onClick={() => go("/settings")}>
            <span className="sb-account-avatar">👤</span>
            <span className="sb-account-info">
              <span className="sb-account-email">{user?.email}</span>
              <span className="sb-account-status">{syncing ? "Syncing..." : "☁️ Synced"}</span>
            </span>
          </button>
        ) : (
          <button className="sb-account-btn sb-account-login" onClick={() => go("/account")}>
            <span className="sb-account-avatar">☁️</span>
            <span className="sb-account-info">
              <span className="sb-account-email">Sign in</span>
              <span className="sb-account-status">Sync across devices</span>
            </span>
          </button>
        )}
      </div>
    </div>
    </>
  );
}
