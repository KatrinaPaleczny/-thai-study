import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { CSS } from "./appStyles";
import { VOCAB_DATA } from "./data/vocabData";
import { FULL_PATH } from "./data/curriculumData";
import { loadLS, saveLS, useLocalSet, K_FAV, K_STU, K_CUSTOM, K_PINNED, K_HIDDEN, K_SCRIPT, K_STREAK, K_CONFIDENCE } from "./utils/storage";
import { recordCategoryResult } from "./utils/adaptive";
import { Sidebar } from "./components/Sidebar";
import { VocabPage } from "./pages/VocabPage";
import { GrammarPage } from "./pages/GrammarPage";
import { NumbersPage } from "./pages/NumbersPage";
import { MyPathPage } from "./pages/MyPathPage";
import { UnitPage } from "./pages/UnitPage";
import { FlashcardPage } from "./pages/FlashcardPage";
import { PracticePage } from "./pages/PracticePage";
import { RolePlayPage } from "./pages/RolePlayPage";
import { SRSPage } from "./pages/SRSPage";
import { MistakesPage } from "./pages/MistakesPage";
import { WritingPage } from "./pages/WritingPage";
import { ScenesPage } from "./pages/ScenesPage";
import { PronunciationPage } from "./pages/PronunciationPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SentenceBuilderPage } from "./pages/SentenceBuilderPage";
import { DailyChallengePage } from "./pages/DailyChallengePage";
import { AIConversationPage } from "./pages/AIConversationPage";
import { HandwritingPage } from "./pages/HandwritingPage";
import { StoryPage } from "./pages/StoryPage";
import { DailySession } from "./components/DailySession";

export default function App() {
  const [page, setPage] = useState("mypath");
  const [unitId, setUnitId] = useState(null);
  const [showSession, setShowSession] = useState(false);
  const [favs, toggleFav] = useLocalSet(K_FAV);
  const [studied, toggleStudied] = useLocalSet(K_STU);
  const [pinned, togglePin] = useLocalSet(K_PINNED);
  const [customWords, setCustomWords] = useState(()=>loadLS(K_CUSTOM,[]));
  const [hiddenIds, setHiddenIds] = useState(()=>new Set(loadLS(K_HIDDEN,[])));
  const [scriptStudied, toggleScriptStudied] = useLocalSet(K_SCRIPT);
  const [streakData, setStreakData] = useState(() => loadLS(K_STREAK, { streak: 0, lastDate: null }));
  const [confidence, setConfidence] = useState(() => loadLS(K_CONFIDENCE, {}));
  const mainRef = useRef(null);

  // Scroll to top whenever page or unit changes
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [page, unitId]);

  // Record study activity for streak tracking
  const recordActivity = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const data = loadLS(K_STREAK, { streak: 0, lastDate: null });
    if (data.lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newStreak = data.lastDate === yesterday ? data.streak + 1 : 1;
    const newData = { streak: newStreak, lastDate: today };
    saveLS(K_STREAK, newData);
    setStreakData(newData);
  }, []);

  const handleToggleStudied = id => { toggleStudied(id); recordActivity(); };
  const handleToggleScriptStudied = id => { toggleScriptStudied(id); recordActivity(); };

  const hideWord = id => {
    const n = new Set(hiddenIds); n.add(id);
    saveLS(K_HIDDEN, [...n]); setHiddenIds(n);
  };

  const allVocab = useMemo(()=>[...VOCAB_DATA,...customWords].filter(v=>!hiddenIds.has(v.id)),[customWords, hiddenIds]);
  const cats = useMemo(()=>[...new Set(allVocab.map(v=>v.category))].sort(),[allVocab]);

  const updateConfidence = useCallback((id, delta) => {
    setConfidence(prev => {
      const cur = prev[id] || 0;
      const next = Math.max(0, Math.min(3, cur + delta));
      const updated = { ...prev, [id]: next };
      saveLS(K_CONFIDENCE, updated);
      // Track adaptive difficulty per category
      const word = allVocab.find(v => v.id === id);
      if (word) recordCategoryResult(word.category, delta > 0);
      return updated;
    });
  }, [allVocab]);

  const openUnit = id => { setUnitId(id); setPage("unit"); };
  const closeUnit = () => { setUnitId(null); setPage("mypath"); };

  const handleSetPage = p => {
    if (p !== "unit") setUnitId(null);
    setShowSession(false);
    setPage(p);
  };

  const renderPage = () => {
    if (showSession) {
      return <DailySession allVocab={allVocab} studied={studied} toggleStudied={handleToggleStudied} confidence={confidence} updateConfidence={updateConfidence} onClose={() => setShowSession(false)} />;
    }
    switch(page) {
      case "mypath": return <MyPathPage allVocab={allVocab} studied={studied} toggleStudied={handleToggleStudied} scriptStudied={scriptStudied} streakData={streakData} confidence={confidence} onOpenUnit={openUnit} onStartSession={() => setShowSession(true)} setPage={handleSetPage}/>;
      case "unit": {
        const unit = FULL_PATH.find(u => u.id === unitId);
        if (!unit) return <MyPathPage allVocab={allVocab} studied={studied} toggleStudied={handleToggleStudied} scriptStudied={scriptStudied} streakData={streakData} onOpenUnit={openUnit} onStartSession={() => setShowSession(true)}/>;
        return <UnitPage unit={unit} allVocab={allVocab} studied={studied} toggleStudied={handleToggleStudied} scriptStudied={scriptStudied} toggleScriptStudied={handleToggleScriptStudied} confidence={confidence} updateConfidence={updateConfidence} onBack={closeUnit}/>;
      }
      case "vocab": return <VocabPage allVocab={allVocab} customWords={customWords} setCustomWords={setCustomWords} hideWord={hideWord} cats={cats} favs={favs} toggleFav={toggleFav} studied={studied} toggleStudied={handleToggleStudied} pinned={pinned} togglePin={togglePin}/>;
      case "flashcards": return <FlashcardPage allVocab={allVocab} favs={favs} studied={studied} toggleStudied={handleToggleStudied} pinned={pinned} cats={cats} confidence={confidence} updateConfidence={updateConfidence}/>;
      case "grammar": return <GrammarPage/>;
      case "numbers": return <NumbersPage/>;
      case "practice": return <PracticePage allVocab={allVocab} studied={studied}/>;
      case "roleplay": return <RolePlayPage/>;
      case "srs": return <SRSPage allVocab={allVocab}/>;
      case "mistakes": return <MistakesPage/>;
      case "writing": return <WritingPage/>;
      case "scenes": return <ScenesPage/>;
      case "pronunciation": return <PronunciationPage allVocab={allVocab}/>;
      case "analytics": return <AnalyticsPage allVocab={allVocab} studied={studied} confidence={confidence}/>;
      case "sentences": return <SentenceBuilderPage/>;
      case "daily": return <DailyChallengePage allVocab={allVocab}/>;
      case "aichat": return <AIConversationPage/>;
      case "handwriting": return <HandwritingPage/>;
      case "stories": return <StoryPage/>;
      default: return <div className="page"><div className="empty">Coming soon</div></div>;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Sidebar page={page === "unit" ? "mypath" : page} setPage={handleSetPage} onOpenUnit={openUnit} allVocab={allVocab}/>
        <div className="main" ref={mainRef}>{renderPage()}</div>
      </div>
    </>
  );
}
