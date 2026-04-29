import { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from "react";
import { VOCAB_DATA } from "../data/vocabData";
import { loadLS, saveLS, useLocalSet, K_FAV, K_STU, K_CUSTOM, K_PINNED, K_HIDDEN, K_SCRIPT, K_STREAK, K_CONFIDENCE, K_SCRIPT_PLAN } from "../utils/storage";
import { awardXP } from "../utils/xp";
import { recordCategoryResult } from "../utils/adaptive";
import { migrateExistingProgress } from "../utils/unitTests";
import { addToSRS } from "../utils/srs";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [showSession, setShowSession] = useState(false);
  const [favs, toggleFav] = useLocalSet(K_FAV);
  const [studied, toggleStudied] = useLocalSet(K_STU);
  const [pinned, togglePin] = useLocalSet(K_PINNED);
  const [customWords, setCustomWords] = useState(() => loadLS(K_CUSTOM, []));
  const [hiddenIds, setHiddenIds] = useState(() => new Set(loadLS(K_HIDDEN, [])));
  const [scriptStudied, toggleScriptStudied] = useLocalSet(K_SCRIPT);
  const [streakData, setStreakData] = useState(() => loadLS(K_STREAK, { streak: 0, lastDate: null }));
  const [confidence, setConfidence] = useState(() => loadLS(K_CONFIDENCE, {}));
  const [scriptPlanData, setScriptPlanData] = useState(() => loadLS(K_SCRIPT_PLAN, { startDate: null, completedDays: [], dayScores: {}, history: [] }));

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

  const recordDayScore = useCallback((day, score) => {
    const prev = loadLS(K_SCRIPT_PLAN, { startDate: null, completedDays: [], dayScores: {}, history: [] });
    const prevBest = prev.dayScores?.[day] || 0;
    if (score <= prevBest) return;
    const next = { ...prev, dayScores: { ...(prev.dayScores || {}), [day]: score } };
    saveLS(K_SCRIPT_PLAN, next);
    setScriptPlanData(next);
  }, []);

  const markDayComplete = useCallback((day) => {
    const prev = loadLS(K_SCRIPT_PLAN, { startDate: null, completedDays: [], dayScores: {}, history: [] });
    if ((prev.completedDays || []).includes(day)) return;
    const today = new Date().toISOString().slice(0, 10);
    const next = {
      ...prev,
      startDate: prev.startDate || today,
      completedDays: [...(prev.completedDays || []), day].sort((a, b) => a - b),
      history: [...(prev.history || []), { day, date: today, score: prev.dayScores?.[day] || 0 }],
    };
    saveLS(K_SCRIPT_PLAN, next);
    setScriptPlanData(next);
    awardXP("script_day_complete");
    recordActivity();
  }, [recordActivity]);

  const resetScriptPlan = useCallback(() => {
    const fresh = { startDate: null, completedDays: [], dayScores: {}, history: [] };
    saveLS(K_SCRIPT_PLAN, fresh);
    setScriptPlanData(fresh);
  }, []);

  const handleToggleStudied = id => {
    // If the word is not yet studied, add it to SRS automatically
    if (!studied.has(id)) {
      addToSRS(id);
    }
    toggleStudied(id);
    recordActivity();
  };
  const handleToggleScriptStudied = id => { toggleScriptStudied(id); recordActivity(); };

  const hideWord = id => {
    const n = new Set(hiddenIds); n.add(id);
    saveLS(K_HIDDEN, [...n]); setHiddenIds(n);
  };

  // Migrate existing progress for unit test gating (runs once)
  const migrated = useRef(false);
  useEffect(() => {
    if (!migrated.current && studied.size > 0) {
      migrated.current = true;
      migrateExistingProgress([...VOCAB_DATA, ...customWords], studied);
    }
  }, [studied, customWords]);

  const allVocab = useMemo(() => [...VOCAB_DATA, ...customWords].filter(v => !hiddenIds.has(v.id)), [customWords, hiddenIds]);
  const cats = useMemo(() => [...new Set(allVocab.map(v => v.category))].sort(), [allVocab]);
  const levels = useMemo(() => [...new Set(allVocab.map(v => v.level).filter(Boolean))].sort(), [allVocab]);

  const updateConfidence = useCallback((id, delta) => {
    setConfidence(prev => {
      const cur = prev[id] || 0;
      const next = Math.max(0, Math.min(3, cur + delta));
      const updated = { ...prev, [id]: next };
      saveLS(K_CONFIDENCE, updated);
      const word = allVocab.find(v => v.id === id);
      if (word) recordCategoryResult(word.category, delta > 0);
      return updated;
    });
  }, [allVocab]);

  const value = useMemo(() => ({
    allVocab, cats, levels,
    studied, toggleStudied: handleToggleStudied,
    favs, toggleFav,
    pinned, togglePin,
    customWords, setCustomWords,
    hiddenIds, hideWord,
    scriptStudied, toggleScriptStudied: handleToggleScriptStudied,
    streakData,
    confidence, updateConfidence,
    showSession, setShowSession,
    scriptPlanData, recordDayScore, markDayComplete, resetScriptPlan,
  }), [
    allVocab, cats, levels, studied, favs, pinned, customWords, hiddenIds,
    scriptStudied, streakData, confidence, showSession,
    handleToggleStudied, handleToggleScriptStudied, hideWord,
    toggleFav, togglePin, updateConfidence,
    scriptPlanData, recordDayScore, markDayComplete, resetScriptPlan,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
