import { loadLS, saveLS } from "./storage";

export const K_MISTAKES = "katthai_mistakes_v1";

/**
 * Mistake entry schema:
 * {
 *   id: string (unique),
 *   source: "flashcard" | "roleplay" | "practice" | "writing",
 *   wordId: number | null,
 *   prompt: string (what was asked),
 *   userAnswer: string,
 *   correctAnswer: string,
 *   score: number (0-1),
 *   date: ISO string,
 *   reviewed: boolean,
 *   reviewCount: number
 * }
 */

export function loadMistakes() {
  return loadLS(K_MISTAKES, []);
}

export function saveMistakes(data) {
  saveLS(K_MISTAKES, data);
}

/**
 * Record a mistake. Deduplicates by prompt+correctAnswer (updates existing entry).
 */
export function recordMistake({ source, wordId, prompt, userAnswer, correctAnswer, score }) {
  // Require at minimum a prompt and correctAnswer to avoid incomplete entries
  if (!prompt && !correctAnswer) return;

  const mistakes = loadMistakes();
  const existing = mistakes.find(
    m => m.prompt === prompt && m.correctAnswer === correctAnswer
  );

  if (existing) {
    // Update existing: keep the most recent attempt
    existing.userAnswer = userAnswer;
    existing.score = score;
    existing.date = new Date().toISOString();
    existing.reviewCount = (existing.reviewCount || 0);
    existing.reviewed = false; // Mark as unreviewed again
  } else {
    mistakes.unshift({
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      source,
      wordId: wordId || null,
      prompt,
      userAnswer,
      correctAnswer,
      score: score || 0,
      date: new Date().toISOString(),
      reviewed: false,
      reviewCount: 0,
    });
  }

  // Keep at most 200 mistakes
  if (mistakes.length > 200) mistakes.length = 200;
  saveMistakes(mistakes);
}

/**
 * Mark a mistake as reviewed
 */
export function markReviewed(mistakeId) {
  const mistakes = loadMistakes();
  const m = mistakes.find(x => x.id === mistakeId);
  if (m) {
    m.reviewed = true;
    m.reviewCount = (m.reviewCount || 0) + 1;
    saveMistakes(mistakes);
  }
}

/**
 * Remove a specific mistake
 */
export function removeMistake(mistakeId) {
  const mistakes = loadMistakes().filter(m => m.id !== mistakeId);
  saveMistakes(mistakes);
}

/**
 * Clear all reviewed mistakes
 */
export function clearReviewed() {
  const mistakes = loadMistakes().filter(m => !m.reviewed);
  saveMistakes(mistakes);
}

/**
 * Get mistake stats
 */
export function getMistakeStats() {
  const mistakes = loadMistakes();
  const total = mistakes.length;
  const unreviewed = mistakes.filter(m => !m.reviewed).length;
  const bySource = {};
  for (const m of mistakes) {
    const src = m.source || "other";
    bySource[src] = (bySource[src] || 0) + 1;
  }
  return { total, unreviewed, bySource };
}
