import { loadLS, saveLS } from "./storage";
import { loadMistakes } from "./mistakes";

export const K_ADAPTIVE = "katthai_adaptive_v1";

/**
 * Adaptive difficulty system.
 * Tracks per-category accuracy and weights word selection
 * toward categories the user struggles with.
 *
 * Schema: { [category]: { correct: n, wrong: n, lastSeen: ISO } }
 */

// In-memory cache to avoid repeated localStorage JSON.parse calls
let _adaptiveCache = null;

export function loadAdaptive() {
  if (_adaptiveCache === null) _adaptiveCache = loadLS(K_ADAPTIVE, {});
  return _adaptiveCache;
}

export function saveAdaptive(data) {
  _adaptiveCache = data;
  saveLS(K_ADAPTIVE, data);
}

/** Clear the in-memory cache (call after external data changes, e.g. cloud sync) */
export function invalidateAdaptiveCache() { _adaptiveCache = null; }

export function recordCategoryResult(category, isCorrect) {
  const data = loadAdaptive();
  if (!data[category]) data[category] = { correct: 0, wrong: 0, lastSeen: null };
  if (isCorrect) data[category].correct++;
  else data[category].wrong++;
  data[category].lastSeen = new Date().toISOString();
  saveAdaptive(data);
}

/**
 * Get category weights — higher weight = user struggles more.
 * Categories with more wrong answers and less recent practice get boosted.
 */
export function getCategoryWeights(categories) {
  const data = loadAdaptive();
  const weights = {};

  for (const cat of categories) {
    const catData = data[cat] || { correct: 0, wrong: 0, lastSeen: null };
    const total = catData.correct + catData.wrong;
    const accuracy = total > 0 ? catData.correct / total : 0.5; // default 50% for unseen

    // Lower accuracy = higher weight (struggles)
    // Never-seen categories get a moderate boost
    let weight = 1;
    if (total === 0) {
      weight = 1.5; // unseen categories get a moderate boost
    } else if (accuracy < 0.4) {
      weight = 3; // struggling
    } else if (accuracy < 0.6) {
      weight = 2; // needs work
    } else if (accuracy < 0.8) {
      weight = 1.2; // decent
    } else {
      weight = 0.5; // mastered, show less
    }

    // Recency decay: if not seen in 3+ days, boost slightly
    if (catData.lastSeen) {
      const daysSince = (Date.now() - new Date(catData.lastSeen).getTime()) / 86400000;
      if (daysSince > 3) weight *= 1.3;
      if (daysSince > 7) weight *= 1.5;
    }

    weights[cat] = weight;
  }

  return weights;
}

/**
 * Select N words from vocab using adaptive weighting.
 * Words from weak categories appear more often.
 */
export function selectAdaptiveWords(allVocab, count = 10) {
  if (allVocab.length <= count) return [...allVocab];

  const categories = [...new Set(allVocab.map(v => v.category))];
  const weights = getCategoryWeights(categories);

  // Weighted Fisher-Yates: shuffle with bias toward weak categories
  const pool = allVocab.map(word => ({
    word,
    sortKey: Math.random() ** (1 / (weights[word.category] || 1)),
  }));

  // Higher weight → higher sortKey on average → picked first
  pool.sort((a, b) => b.sortKey - a.sortKey);

  return pool.slice(0, count).map(p => p.word);
}

/**
 * Get a summary of category performance for display
 */
export function getAdaptiveSummary(categories) {
  const data = loadAdaptive();
  return categories.map(cat => {
    const catData = data[cat] || { correct: 0, wrong: 0, lastSeen: null };
    const total = catData.correct + catData.wrong;
    const accuracy = total > 0 ? Math.round((catData.correct / total) * 100) : null;
    return { category: cat, ...catData, total, accuracy };
  }).sort((a, b) => (a.accuracy ?? 50) - (b.accuracy ?? 50)); // weakest first
}
