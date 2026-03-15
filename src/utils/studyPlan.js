import { loadLS, saveLS } from "./storage";
import { callClaude, MODELS } from "./ai";
import { getSRSStats } from "./srs";
import { getMistakeStats } from "./mistakes";
import { getTodayProgress, getStreak, getXPHistory, getLevel } from "./xp";
import { getAdaptiveSummary } from "./adaptive";

const K_AI_PLAN = "katthai_ai_plan_v1";

/**
 * Gather all relevant study data into a summary for the AI prompt.
 */
export function gatherStudyContext(allVocab, studied, continueUnit, unitProgress) {
  const xp = getTodayProgress();
  const streak = getStreak();
  const history = getXPHistory(7);
  const srs = getSRSStats(allVocab);
  const mistakes = getMistakeStats();
  const level = getLevel(xp.totalXP);

  const cats = [...new Set(allVocab.map(v => v.category))].sort();
  const adaptive = getAdaptiveSummary(cats);
  const weak = adaptive.filter(c => c.total > 0 && c.accuracy !== null && c.accuracy < 70);
  const strong = adaptive.filter(c => c.total > 0 && c.accuracy !== null && c.accuracy > 85);

  const daysActive = history.filter(d => d.xp > 0).length;
  const avgXP = daysActive > 0 ? Math.round(history.reduce((s, d) => s + d.xp, 0) / daysActive) : 0;

  const ctx = {
    level: level.title,
    totalWordsStudied: studied.size,
    totalXP: xp.totalXP,
    dailyGoal: xp.dailyGoal,
    todayXP: xp.todayXP,
    streak: streak.streak,
    srs: { total: srs.total, dueNow: srs.dueNow, mastered: srs.mastered, learning: srs.learning },
    mistakes: { total: mistakes.total, unreviewed: mistakes.unreviewed, bySource: mistakes.bySource },
    weakCategories: weak.slice(0, 5).map(c => ({ category: c.category, accuracy: c.accuracy })),
    strongCategories: strong.slice(0, 3).map(c => ({ category: c.category, accuracy: c.accuracy })),
    recentActivity: { daysActive, avgXPPerDay: avgXP },
  };

  if (continueUnit) {
    const progress = unitProgress?.[continueUnit.id];
    ctx.currentUnit = continueUnit.title;
    ctx.wordsLeftInUnit = progress ? progress.total - progress.done : 0;
  }

  return ctx;
}

const SYSTEM_PROMPT = `You are a Thai language learning coach. Given the student's learning data, create a personalized ~15 minute daily study plan. Return ONLY valid JSON (no markdown, no backticks, no explanation): {"tasks":[{"activity":"string","page":"string","minutes":number,"reason":"string"}],"focusTip":"string"}. The page field must be one of: srs, mistakes, flashcards, vocab, roleplay, writing, pronunciation, stories, handwriting, sentences, aichat, daily. Order tasks by priority (most important first). Include 3-5 tasks. Keep reasons to 1 short sentence. The focusTip should be encouraging and specific to their weak areas or current progress.`;

/**
 * Call Claude to generate a personalized study plan.
 */
export async function generateAIPlan(context) {
  const text = await callClaude({
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(context) }],
    model: MODELS.HAIKU,
    maxTokens: 400,
  });

  // Parse JSON from response (handle possible markdown wrapping)
  const cleaned = text.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
  const plan = JSON.parse(cleaned);

  if (!plan.tasks || !Array.isArray(plan.tasks)) {
    throw new Error("Invalid plan format from AI");
  }

  return plan;
}

/**
 * Get cached plan if it was generated today.
 */
export function getCachedPlan() {
  const cached = loadLS(K_AI_PLAN, null);
  if (!cached) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (cached.date === today) return cached.plan;
  return null;
}

/**
 * Cache the generated plan for today.
 */
export function cachePlan(plan) {
  const today = new Date().toISOString().slice(0, 10);
  saveLS(K_AI_PLAN, { date: today, plan });
}
