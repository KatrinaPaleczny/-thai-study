import { loadLS, saveLS } from "./storage";

export const K_SRS = "katthai_srs_v1";
const K_SRS_SETTINGS = "katthai_srs_settings_v1";

/**
 * SRS data schema per word:
 * {
 *   interval: number (hours until next review),
 *   ease: number (multiplier, starts at 2.5),
 *   nextReview: ISO string,
 *   lastReview: ISO string,
 *   reviewCount: number,
 *   streak: number (consecutive correct)
 * }
 */

const DEFAULT_ENTRY = {
  interval: 1,      // 1 hour initial
  ease: 2.5,
  nextReview: null,
  lastReview: null,
  reviewCount: 0,
  streak: 0,
};

// In-memory cache to avoid repeated localStorage JSON.parse calls
let _srsCache = null;

export function loadSRS() {
  if (_srsCache === null) _srsCache = loadLS(K_SRS, {});
  return _srsCache;
}

export function saveSRS(data) {
  _srsCache = data;
  saveLS(K_SRS, data);
}

/** Clear the in-memory cache (call after external data changes, e.g. cloud sync) */
export function invalidateSRSCache() { _srsCache = null; }

/** SRS settings (daily new card limit) */
export function loadSRSSettings() {
  return loadLS(K_SRS_SETTINGS, { dailyNewLimit: 10 });
}

export function saveSRSSettings(settings) {
  saveLS(K_SRS_SETTINGS, settings);
}

/**
 * Get SRS entry for a word, returning defaults if none exists
 */
export function getSRSEntry(wordId) {
  const data = loadSRS();
  return data[wordId] || { ...DEFAULT_ENTRY };
}

/**
 * Record a review result and update the SRS schedule.
 * quality: 0 = wrong, 1 = close/hard, 2 = correct, 3 = easy
 */
export function recordReview(wordId, quality) {
  const data = loadSRS();
  const entry = data[wordId] || { ...DEFAULT_ENTRY };
  const now = new Date().toISOString();

  entry.reviewCount++;
  entry.lastReview = now;

  if (quality >= 2) {
    // Correct: increase interval
    entry.streak++;
    if (entry.reviewCount === 1) {
      entry.interval = 4; // 4 hours
    } else if (entry.reviewCount === 2) {
      entry.interval = 24; // 1 day
    } else {
      entry.interval = Math.round(entry.interval * entry.ease);
    }
    // Adjust ease factor
    entry.ease = Math.max(1.3, entry.ease + (quality === 3 ? 0.15 : 0.0));
  } else if (quality === 1) {
    // Close: small interval, slight ease decrease
    entry.streak = 0;
    entry.interval = Math.max(1, Math.round(entry.interval * 0.5));
    entry.ease = Math.max(1.3, entry.ease - 0.1);
  } else {
    // Wrong: reset
    entry.streak = 0;
    entry.interval = 1;
    entry.ease = Math.max(1.3, entry.ease - 0.2);
  }

  // Schedule next review
  const nextTime = new Date(Date.now() + entry.interval * 3600000);
  entry.nextReview = nextTime.toISOString();

  data[wordId] = entry;
  saveSRS(data);
  return entry;
}

/**
 * Get words due for review, respecting daily new-card limit.
 * Returns { reviewIds, newIds, newToday, dailyNewLimit }
 * - reviewIds: words with reviewCount > 0 that are due (always all shown)
 * - newIds: words with reviewCount === 0, limited to daily cap
 */
export function getDueWordsWithLimit(allVocab) {
  const data = loadSRS();
  const settings = loadSRSSettings();
  const now = Date.now();
  const today = new Date().toDateString();

  const reviews = [];
  const newCards = [];

  for (const word of allVocab) {
    const entry = data[word.id];
    if (!entry) continue;
    if (!entry.nextReview) continue;
    if (new Date(entry.nextReview).getTime() > now) continue;

    const overdue = now - new Date(entry.nextReview).getTime();
    if (entry.reviewCount > 0) {
      reviews.push({ wordId: word.id, overdue });
    } else {
      newCards.push({ wordId: word.id, overdue });
    }
  }

  reviews.sort((a, b) => b.overdue - a.overdue);
  newCards.sort((a, b) => b.overdue - a.overdue);

  // Count how many new cards were already reviewed today
  let newReviewedToday = 0;
  for (const word of allVocab) {
    const entry = data[word.id];
    if (!entry || entry.reviewCount === 0) continue;
    if (entry.lastReview && new Date(entry.lastReview).toDateString() === today) {
      // Was this card's first-ever review today? Check reviewCount === 1 and reviewed today
      if (entry.reviewCount === 1) {
        newReviewedToday++;
      }
    }
  }

  const remainingNew = Math.max(0, settings.dailyNewLimit - newReviewedToday);
  const limitedNew = newCards.slice(0, remainingNew);

  return {
    reviewIds: reviews.map(d => d.wordId),
    newIds: limitedNew.map(d => d.wordId),
    newToday: newReviewedToday,
    dailyNewLimit: settings.dailyNewLimit,
    totalNewDue: newCards.length,
  };
}

/**
 * Get words that are due for review (nextReview is in the past).
 * Returns array of wordIds sorted by most overdue first.
 */
export function getDueWords(allVocab) {
  const data = loadSRS();
  const now = Date.now();
  const due = [];

  for (const word of allVocab) {
    const entry = data[word.id];
    if (!entry) continue; // Not yet in SRS
    if (!entry.nextReview) continue;
    if (new Date(entry.nextReview).getTime() <= now) {
      due.push({
        wordId: word.id,
        overdue: now - new Date(entry.nextReview).getTime(),
        entry,
      });
    }
  }

  // Sort by most overdue first
  due.sort((a, b) => b.overdue - a.overdue);
  return due.map(d => d.wordId);
}

/**
 * Add a word to SRS (schedule first review for now).
 */
export function addToSRS(wordId) {
  const data = loadSRS();
  if (!data[wordId]) {
    data[wordId] = {
      ...DEFAULT_ENTRY,
      nextReview: new Date().toISOString(),
    };
    saveSRS(data);
  }
}

/**
 * Get SRS stats: total in SRS, due now, mastered (interval > 30 days)
 */
export function getSRSStats(allVocab) {
  const data = loadSRS();
  const now = Date.now();
  let total = 0, dueNow = 0, mastered = 0, learning = 0;

  for (const word of allVocab) {
    const entry = data[word.id];
    if (!entry) continue;
    total++;
    if (entry.interval >= 720) mastered++; // 30+ days
    else learning++;
    if (entry.nextReview && new Date(entry.nextReview).getTime() <= now) {
      dueNow++;
    }
  }

  return { total, dueNow, mastered, learning };
}

/**
 * Get the SRS level label for a word
 */
export function getSRSLevel(wordId) {
  const data = loadSRS();
  const entry = data[wordId];
  if (!entry) return { label: "New", color: "var(--t3)", level: 0 };
  if (entry.interval >= 720) return { label: "Mastered", color: "#3d8b37", level: 3 };
  if (entry.interval >= 72) return { label: "Familiar", color: "#6b9e5a", level: 2 };
  if (entry.interval >= 4) return { label: "Learning", color: "#c29b3f", level: 1 };
  return { label: "New", color: "var(--t3)", level: 0 };
}
