import { loadLS, saveLS } from "./storage";

export const K_XP = "katthai_xp_v1";

/**
 * XP data schema:
 * {
 *   totalXP: number,
 *   dailyGoal: number (default 50),
 *   history: { "2026-03-13": { xp: 45, actions: 12 }, ... }
 * }
 */

const DEFAULT_XP = {
  totalXP: 0,
  dailyGoal: 50,
  history: {},
};

export function loadXP() {
  return loadLS(K_XP, { ...DEFAULT_XP });
}

export function saveXPData(data) {
  saveLS(K_XP, data);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Award XP for an action.
 * Actions and their XP values:
 * - vocab_study: 2
 * - flashcard_correct: 5
 * - flashcard_wrong: 1
 * - roleplay_turn: 3
 * - roleplay_perfect: 8
 * - practice_correct: 5
 * - grammar_exercise: 4
 * - writing_correct: 6
 * - pronunciation_attempt: 3
 * - daily_session: 10
 * - scene_word: 2
 */
const XP_VALUES = {
  vocab_study: 2,
  flashcard_correct: 5,
  flashcard_wrong: 1,
  roleplay_turn: 3,
  roleplay_perfect: 8,
  practice_correct: 5,
  grammar_exercise: 4,
  writing_correct: 6,
  pronunciation_attempt: 3,
  daily_session: 10,
  scene_word: 2,
  mistake_review: 3,
  sentence_correct: 6,
  ai_chat_turn: 3,
  unit_test_pass: 25,
  ai_explain: 2,
  audio_quiz_correct: 5,
  audio_quiz_attempt: 1,
  script_quiz_correct: 5,
  script_quiz_attempt: 1,
  mistake_quiz_correct: 5,
};

export function awardXP(action) {
  const points = XP_VALUES[action] || 1;
  const data = loadXP();
  data.totalXP = (data.totalXP || 0) + points;

  const d = today();
  if (!data.history) data.history = {};
  if (!data.history[d]) data.history[d] = { xp: 0, actions: 0 };
  data.history[d].xp += points;
  data.history[d].actions++;

  saveXPData(data);
  return { points, totalXP: data.totalXP, todayXP: data.history[d].xp };
}

/**
 * Get today's XP progress
 */
export function getTodayProgress() {
  const data = loadXP();
  const d = today();
  const todayData = data.history?.[d] || { xp: 0, actions: 0 };
  return {
    todayXP: todayData.xp,
    dailyGoal: data.dailyGoal || 50,
    progress: Math.min(1, todayData.xp / (data.dailyGoal || 50)),
    goalMet: todayData.xp >= (data.dailyGoal || 50),
    totalXP: data.totalXP || 0,
  };
}

/**
 * Set daily goal
 */
export function setDailyGoal(goal) {
  const data = loadXP();
  data.dailyGoal = Math.max(10, Math.min(200, goal));
  saveXPData(data);
}

/**
 * Get streak info (consecutive days meeting goal)
 */
export function getStreak() {
  const data = loadXP();
  if (!data.history) return { streak: 0, longestStreak: 0 };

  const dates = Object.keys(data.history).sort().reverse();
  const goal = data.dailyGoal || 50;
  let streak = 0;
  let checkDate = new Date();

  // Check if today has activity
  const todayStr = today();
  const todayData = data.history[todayStr];
  if (!todayData || todayData.xp < goal) {
    // Check if yesterday had activity (streak still alive)
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    const dayData = data.history[dateStr];
    if (dayData && dayData.xp >= goal) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak, todayDone: todayData ? todayData.xp >= goal : false };
}

/**
 * Get level based on total XP
 */
export function getLevel(totalXP) {
  const xp = totalXP || 0;
  if (xp >= 5000) return { level: 10, title: "Thai Master", nextAt: null };
  if (xp >= 3500) return { level: 9, title: "Expert", nextAt: 5000 };
  if (xp >= 2500) return { level: 8, title: "Advanced", nextAt: 3500 };
  if (xp >= 1800) return { level: 7, title: "Proficient", nextAt: 2500 };
  if (xp >= 1200) return { level: 6, title: "Intermediate", nextAt: 1800 };
  if (xp >= 800) return { level: 5, title: "Conversational", nextAt: 1200 };
  if (xp >= 500) return { level: 4, title: "Explorer", nextAt: 800 };
  if (xp >= 250) return { level: 3, title: "Student", nextAt: 500 };
  if (xp >= 100) return { level: 2, title: "Beginner", nextAt: 250 };
  return { level: 1, title: "Newcomer", nextAt: 100 };
}

/**
 * Get XP history for last N days
 */
export function getXPHistory(days = 30) {
  const data = loadXP();
  const result = [];
  const d = new Date();
  for (let i = 0; i < days; i++) {
    const dateStr = d.toISOString().slice(0, 10);
    const dayData = data.history?.[dateStr] || { xp: 0, actions: 0 };
    result.unshift({ date: dateStr, ...dayData });
    d.setDate(d.getDate() - 1);
  }
  return result;
}
