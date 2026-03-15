import { useRef, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useApp } from "./context/AppContext";
import { FULL_PATH } from "./data/curriculumData";
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
import { ListeningPage } from "./pages/ListeningPage";
import { MatchPage } from "./pages/MatchPage";
import { ImageVocabPage } from "./pages/ImageVocabPage";
import { FrequencyPage } from "./pages/FrequencyPage";
import { GrammarBankPage } from "./pages/GrammarBankPage";
import { AudioQuizPage } from "./pages/AudioQuizPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AuthPage } from "./pages/AuthPage";
import { PlacementTestPage } from "./pages/PlacementTestPage";
import { UnitTestPage } from "./pages/UnitTestPage";
import { isUnitUnlocked, loadUnitTests } from "./utils/unitTests";
import { DailySession } from "./components/DailySession";

function UnitPageWrapper() {
  const { allVocab, studied, toggleStudied, scriptStudied, toggleScriptStudied, confidence, updateConfidence } = useApp();
  const navigate = useNavigate();
  const { unitId } = useParams();
  const unit = FULL_PATH.find(u => u.id === unitId);

  if (!unit) {
    return <Navigate to="/" replace />;
  }

  // Gate locked vocab units
  if (unit.type !== "script") {
    const testResults = loadUnitTests();
    if (!isUnitUnlocked(unit.id, testResults)) {
      return <Navigate to="/" replace />;
    }
  }

  return (
    <UnitPage
      unit={unit}
      allVocab={allVocab}
      studied={studied}
      toggleStudied={toggleStudied}
      scriptStudied={scriptStudied}
      toggleScriptStudied={toggleScriptStudied}
      confidence={confidence}
      updateConfidence={updateConfidence}
      onBack={() => navigate("/")}
    />
  );
}

export default function App() {
  const { showSession, setShowSession, allVocab, studied, toggleStudied, confidence, updateConfidence } = useApp();
  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="app">
      <Sidebar />
      <div className="main" ref={mainRef}>
        {showSession ? (
          <DailySession
            allVocab={allVocab}
            studied={studied}
            toggleStudied={toggleStudied}
            confidence={confidence}
            updateConfidence={updateConfidence}
            onClose={() => setShowSession(false)}
          />
        ) : (
          <Routes>
            <Route path="/" element={<MyPathPage />} />
            <Route path="/unit/:unitId" element={<UnitPageWrapper />} />
            <Route path="/vocab" element={<VocabPage />} />
            <Route path="/flashcards" element={<FlashcardPage />} />
            <Route path="/grammar" element={<GrammarPage />} />
            <Route path="/numbers" element={<NumbersPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/roleplay" element={<RolePlayPage />} />
            <Route path="/srs" element={<SRSPage />} />
            <Route path="/mistakes" element={<MistakesPage />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/scenes" element={<ScenesPage />} />
            <Route path="/pronunciation" element={<PronunciationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/sentences" element={<SentenceBuilderPage />} />
            <Route path="/daily" element={<DailyChallengePage />} />
            <Route path="/aichat" element={<AIConversationPage />} />
            <Route path="/handwriting" element={<HandwritingPage />} />
            <Route path="/stories" element={<StoryPage />} />
            <Route path="/listening" element={<ListeningPage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/imagevocab" element={<ImageVocabPage />} />
            <Route path="/frequency" element={<FrequencyPage />} />
            <Route path="/grammarbank" element={<GrammarBankPage />} />
            <Route path="/audioquiz" element={<AudioQuizPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/account" element={<AuthPage />} />
            <Route path="/placement" element={<PlacementTestPage />} />
            <Route path="/unit-test/:unitId" element={<UnitTestPage />} />
            <Route path="*" element={<div className="page"><div className="empty">Coming soon</div></div>} />
          </Routes>
        )}
      </div>
    </div>
  );
}
