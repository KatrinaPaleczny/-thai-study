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

export function loadAdaptive() {
  return loadLS(K_ADAPTIVE, {});
}

export function saveAdaptive(data) {
  saveLS(K_ADAPTIVE, data);
}

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
  const mistakes = loadMistakes();
  const weights = {};

  for (const cat of categories) {
    const catData = data[cat] || { correct: 0, wrong: 0, lastSeen: null };
    const total = catData.correct + catData.wrong;
    const accuracy = total > 0 ? catData.correct / total : 0.5; // default 50% for unseen

    // Count active mistakes in this category
    const catMistakes = mistakes.filter(m =>
      m.correctAnswer && !m.reviewed
    ).length;

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

  // Build weighted pool
  const weighted = allVocab.map(word => ({
    word,
    weight: weights[word.category] || 1,
  }));

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  const selected = [];
  const usedIds = new Set();

  while (selected.length < count && selected.length < allVocab.length) {
    let r = Math.random() * totalWeight;
    for (const item of weighted) {
      if (usedIds.has(item.word.id)) continue;
      r -= item.weight;
      if (r <= 0) {
        selected.push(item.word);
        usedIds.add(item.word.id);
        break;
      }
    }
    // Safety: if random didn't pick (rounding), pick first unused
    if (selected.length < count) {
      const unused = weighted.find(w => !usedIds.has(w.word.id));
      if (unused && !usedIds.has(unused.word.id)) {
        selected.push(unused.word);
        usedIds.add(unused.word.id);
      }
    }
  }

  return selected;
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
