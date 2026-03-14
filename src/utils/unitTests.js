import { loadLS, saveLS, K_UNIT_TESTS } from "./storage";
import { CURRICULUM } from "../data/curriculumData";

/**
 * Unit test results schema (stored per unit):
 * { passed: boolean, bestPct: number, attempts: number, lastDate: string }
 */

export function loadUnitTests() {
  return loadLS(K_UNIT_TESTS, {});
}

export function saveUnitTestResult(unitId, score, total) {
  const data = loadUnitTests();
  const pct = Math.round((score / total) * 100);
  const prev = data[unitId] || { passed: false, bestPct: 0, attempts: 0 };
  data[unitId] = {
    passed: prev.passed || pct >= 75,
    bestPct: Math.max(prev.bestPct, pct),
    attempts: prev.attempts + 1,
    lastDate: new Date().toISOString(),
  };
  saveLS(K_UNIT_TESTS, data);
  return data[unitId];
}

/**
 * Check if a vocab unit is unlocked.
 * u1 is always unlocked. u(N) requires u(N-1) test passed.
 * Script units are always unlocked.
 */
export function isUnitUnlocked(unitId, testResults) {
  const vocabUnits = CURRICULUM.map(u => u.id); // u1..u8
  const idx = vocabUnits.indexOf(unitId);
  if (idx <= 0) return true; // u1 or not found (script) — always unlocked
  const prevId = vocabUnits[idx - 1];
  return !!(testResults[prevId] && testResults[prevId].passed);
}

/**
 * Generate a multiple-choice test for a unit.
 * Returns array of { type, prompt, thai, options, answerIdx }
 */
export function generateUnitTest(unitId, allVocab) {
  const unit = CURRICULUM.find(u => u.id === unitId);
  if (!unit) return [];

  // Collect all vocab IDs from this unit's lessons
  const unitVocabIds = new Set(unit.lessons.flatMap(l => l.vocabIds || []));
  const unitWords = allVocab.filter(v => unitVocabIds.has(v.id));

  if (unitWords.length === 0) return [];

  // Get distractor words (from other units, then general pool)
  const otherWords = allVocab.filter(v => !unitVocabIds.has(v.id));

  // Shuffle helper
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  // Pick up to 12 words for questions (or all if fewer)
  const testWords = shuffle(unitWords).slice(0, 12);

  const questions = [];

  testWords.forEach((word, i) => {
    // Alternate question types
    const type = i % 3; // 0=thai→eng, 1=eng→thai, 2=audio

    // Get 3 distractors
    const distractors = shuffle(otherWords)
      .filter(w => w.english !== word.english && w.thai !== word.thai)
      .slice(0, 3);

    if (distractors.length < 3) return; // skip if not enough distractors

    if (type === 0) {
      // Thai → English
      const options = shuffle([
        { text: word.english, correct: true },
        ...distractors.map(d => ({ text: d.english, correct: false })),
      ]);
      questions.push({
        type: "translate",
        prompt: `What does "${word.thai}" mean?`,
        wordId: word.id,
        thai: word.thai,
        options: options.map(o => o.text),
        answerIdx: options.findIndex(o => o.correct),
      });
    } else if (type === 1) {
      // English → Thai
      const options = shuffle([
        { text: word.thai, correct: true },
        ...distractors.map(d => ({ text: d.thai, correct: false })),
      ]);
      questions.push({
        type: "reverse",
        prompt: `Which is the Thai word for "${word.english}"?`,
        wordId: word.id,
        options: options.map(o => o.text),
        answerIdx: options.findIndex(o => o.correct),
      });
    } else {
      // Audio — listen and pick meaning
      const options = shuffle([
        { text: word.english, correct: true },
        ...distractors.map(d => ({ text: d.english, correct: false })),
      ]);
      questions.push({
        type: "audio",
        prompt: "Listen and choose the correct meaning:",
        wordId: word.id,
        thai: word.thai,
        options: options.map(o => o.text),
        answerIdx: options.findIndex(o => o.correct),
      });
    }
  });

  return questions;
}

/**
 * Migration for existing users: auto-pass tests for units where
 * all words have been studied, so they don't get locked out.
 */
export function migrateExistingProgress(allVocab, studied) {
  const data = loadUnitTests();
  let changed = false;

  for (const unit of CURRICULUM) {
    if (data[unit.id]?.passed) continue; // already passed

    const unitVocabIds = unit.lessons.flatMap(l => l.vocabIds || []);
    if (unitVocabIds.length === 0) continue;

    const allStudied = unitVocabIds.every(id => studied.has(id));
    if (allStudied) {
      data[unit.id] = {
        passed: true,
        bestPct: 100,
        attempts: 0,
        lastDate: new Date().toISOString(),
      };
      changed = true;
    }
  }

  if (changed) saveLS(K_UNIT_TESTS, data);
  return data;
}
