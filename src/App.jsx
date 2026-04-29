import { useRef, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useApp } from "./context/AppContext";
import { FULL_PATH } from "./data/curriculumData";
import { Sidebar } from "./components/Sidebar";
import { isUnitUnlocked, loadUnitTests } from "./utils/unitTests";
import { DailySession } from "./components/DailySession";

// Lazy-loaded pages — only downloaded when visited
const MyPathPage = lazy(() => import("./pages/MyPathPage").then(m => ({ default: m.MyPathPage })));
const UnitPage = lazy(() => import("./pages/UnitPage").then(m => ({ default: m.UnitPage })));
const VocabPage = lazy(() => import("./pages/VocabPage").then(m => ({ default: m.VocabPage })));
const FlashcardPage = lazy(() => import("./pages/FlashcardPage").then(m => ({ default: m.FlashcardPage })));
const GrammarPage = lazy(() => import("./pages/GrammarPage").then(m => ({ default: m.GrammarPage })));
const NumbersPage = lazy(() => import("./pages/NumbersPage").then(m => ({ default: m.NumbersPage })));
const PracticePage = lazy(() => import("./pages/PracticePage").then(m => ({ default: m.PracticePage })));
const RolePlayPage = lazy(() => import("./pages/RolePlayPage").then(m => ({ default: m.RolePlayPage })));
const SRSPage = lazy(() => import("./pages/SRSPage").then(m => ({ default: m.SRSPage })));
const MistakesPage = lazy(() => import("./pages/MistakesPage").then(m => ({ default: m.MistakesPage })));
const WritingPage = lazy(() => import("./pages/WritingPage").then(m => ({ default: m.WritingPage })));
const ScenesPage = lazy(() => import("./pages/ScenesPage").then(m => ({ default: m.ScenesPage })));
const PronunciationPage = lazy(() => import("./pages/PronunciationPage").then(m => ({ default: m.PronunciationPage })));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage").then(m => ({ default: m.AnalyticsPage })));
const SentenceBuilderPage = lazy(() => import("./pages/SentenceBuilderPage").then(m => ({ default: m.SentenceBuilderPage })));
const DailyChallengePage = lazy(() => import("./pages/DailyChallengePage").then(m => ({ default: m.DailyChallengePage })));
const AIConversationPage = lazy(() => import("./pages/AIConversationPage").then(m => ({ default: m.AIConversationPage })));
const HandwritingPage = lazy(() => import("./pages/HandwritingPage").then(m => ({ default: m.HandwritingPage })));
const StoryPage = lazy(() => import("./pages/StoryPage").then(m => ({ default: m.StoryPage })));
const ListeningPage = lazy(() => import("./pages/ListeningPage").then(m => ({ default: m.ListeningPage })));
const MatchPage = lazy(() => import("./pages/MatchPage").then(m => ({ default: m.MatchPage })));
const ImageVocabPage = lazy(() => import("./pages/ImageVocabPage").then(m => ({ default: m.ImageVocabPage })));
const FrequencyPage = lazy(() => import("./pages/FrequencyPage").then(m => ({ default: m.FrequencyPage })));
const GrammarBankPage = lazy(() => import("./pages/GrammarBankPage").then(m => ({ default: m.GrammarBankPage })));
const AudioQuizPage = lazy(() => import("./pages/AudioQuizPage").then(m => ({ default: m.AudioQuizPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then(m => ({ default: m.SettingsPage })));
const AuthPage = lazy(() => import("./pages/AuthPage").then(m => ({ default: m.AuthPage })));
const PlacementTestPage = lazy(() => import("./pages/PlacementTestPage").then(m => ({ default: m.PlacementTestPage })));
const UnitTestPage = lazy(() => import("./pages/UnitTestPage").then(m => ({ default: m.UnitTestPage })));
const ScriptPlanPage = lazy(() => import("./pages/ScriptPlanPage").then(m => ({ default: m.ScriptPlanPage })));
const ScriptPlanDayPage = lazy(() => import("./pages/ScriptPlanPage").then(m => ({ default: m.ScriptPlanDayPage })));

function PageLoader() {
  return <div className="page"><div className="empty">Loading...</div></div>;
}

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
          <Suspense fallback={<PageLoader />}>
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
            <Route path="/script30" element={<ScriptPlanPage />} />
            <Route path="/script30/day/:n" element={<ScriptPlanDayPage />} />
            <Route path="*" element={<div className="page"><div className="empty">Coming soon</div></div>} />
          </Routes>
          </Suspense>
        )}
      </div>
    </div>
  );
}
