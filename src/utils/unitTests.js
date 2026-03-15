import { loadLS, saveLS, K_UNIT_TESTS } from "./storage";
import { CURRICULUM } from "../data/curriculumData";
import { GRAMMAR_DATA } from "../data/grammarData";
import { SCRIPT_LESSONS } from "../data/scriptData";

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

  // Collect grammar "choose" exercises from this unit
  const unitGrammarIds = new Set(unit.lessons.flatMap(l => l.grammarIds || []));
  const grammarQuestions = [];
  for (const g of GRAMMAR_DATA) {
    if (!unitGrammarIds.has(g.id)) continue;
    for (const ex of g.exercises || []) {
      if (ex.type !== "choose") continue;
      const opts = shuffle(ex.options.map((o, i) => ({
        text: o.phonetics || o.text || o,
        correct: i === ex.answer,
      })));
      grammarQuestions.push({
        type: "grammar",
        prompt: ex.prompt,
        options: opts.map(o => o.text),
        answerIdx: opts.findIndex(o => o.correct),
        explanation: ex.explanation || "",
      });
    }
  }

  // Mix: up to 4 grammar + remaining vocab = ~12 total
  const grammarPick = shuffle(grammarQuestions).slice(0, 4);
  const vocabCap = Math.max(8, 12 - grammarPick.length);
  const testWords = shuffle(unitWords).slice(0, vocabCap);

  const vocabQuestions = [];

  testWords.forEach((word, i) => {
    const type = i % 3;
    const distractors = shuffle(otherWords)
      .filter(w => w.english !== word.english && w.thai !== word.thai)
      .slice(0, 3);
    if (distractors.length < 3) return;

    if (type === 0) {
      const options = shuffle([
        { text: word.english, correct: true },
        ...distractors.map(d => ({ text: d.english, correct: false })),
      ]);
      vocabQuestions.push({
        type: "translate",
        prompt: `What does "${word.phonetics}" mean?`,
        wordId: word.id,
        thai: word.thai,
        options: options.map(o => o.text),
        answerIdx: options.findIndex(o => o.correct),
      });
    } else if (type === 1) {
      const options = shuffle([
        { text: word.phonetics, correct: true },
        ...distractors.map(d => ({ text: d.phonetics, correct: false })),
      ]);
      vocabQuestions.push({
        type: "reverse",
        prompt: `Which is the Thai word for "${word.english}"?`,
        wordId: word.id,
        options: options.map(o => o.text),
        answerIdx: options.findIndex(o => o.correct),
      });
    } else {
      const options = shuffle([
        { text: word.english, correct: true },
        ...distractors.map(d => ({ text: d.english, correct: false })),
      ]);
      vocabQuestions.push({
        type: "audio",
        prompt: "Listen and choose the correct meaning:",
        wordId: word.id,
        thai: word.thai,
        options: options.map(o => o.text),
        answerIdx: options.findIndex(o => o.correct),
      });
    }
  });

  return shuffle([...vocabQuestions, ...grammarPick]);
}

/**
 * Generate a test for a Thai Script unit.
 * Question types: char→sound, sound→char, char→class
 */
export function generateScriptTest(unitId) {
  const unit = SCRIPT_LESSONS.find(u => u.id === unitId);
  if (!unit) return [];

  const chars = unit.lessons.flatMap(l => l.characters || []);
  // Filter out compound/practice entries that aren't single characters
  const testable = chars.filter(c => c.char && c.phonetic && c.class !== "practice");
  if (testable.length < 4) return [];

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  // All script characters for distractors
  const allChars = SCRIPT_LESSONS.flatMap(u => u.lessons.flatMap(l => l.characters || []))
    .filter(c => c.char && c.phonetic && c.class !== "practice");

  const picked = shuffle(testable).slice(0, 10);
  const questions = [];

  picked.forEach((ch, i) => {
    const type = i % 3;
    // Get distractors from the same category when possible
    const pool = shuffle(allChars.filter(c => c.char !== ch.char));

    if (type === 0) {
      // char → sound
      const distractors = pool.filter(c => c.phonetic !== ch.phonetic).slice(0, 3);
      if (distractors.length < 3) return;
      const opts = shuffle([
        { text: ch.phonetic, correct: true },
        ...distractors.map(d => ({ text: d.phonetic, correct: false })),
      ]);
      questions.push({
        type: "char-to-sound",
        prompt: `What sound does "${ch.char}" make?`,
        options: opts.map(o => o.text),
        answerIdx: opts.findIndex(o => o.correct),
      });
    } else if (type === 1) {
      // sound → char
      const distractors = pool.filter(c => c.char !== ch.char).slice(0, 3);
      if (distractors.length < 3) return;
      const opts = shuffle([
        { text: ch.char, correct: true },
        ...distractors.map(d => ({ text: d.char, correct: false })),
      ]);
      questions.push({
        type: "sound-to-char",
        prompt: `Which character makes the "${ch.phonetic}" sound?`,
        options: opts.map(o => o.text),
        answerIdx: opts.findIndex(o => o.correct),
      });
    } else {
      // char → class
      const classType = ["mid", "high", "low"].includes(ch.class) ? "consonant"
        : ["short", "long"].includes(ch.class) ? "vowel" : "other";
      if (classType === "other") return; // skip marks/tones for class questions

      const classOptions = classType === "consonant"
        ? ["mid", "high", "low", "rising"]
        : ["short", "long", "mid", "high"];
      const opts = shuffle(classOptions.map(c => ({
        text: c, correct: c === ch.class,
      })));
      questions.push({
        type: "char-to-class",
        prompt: classType === "consonant"
          ? `What class is the consonant "${ch.char}"?`
          : `Is the vowel "${ch.char}" short or long?`,
        options: opts.map(o => o.text),
        answerIdx: opts.findIndex(o => o.correct),
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
