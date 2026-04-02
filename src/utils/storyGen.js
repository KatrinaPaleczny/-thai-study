import { loadLS, saveLS } from "./storage";
import { callClaude, MODELS } from "./ai";
import { STORIES } from "../data/storiesData";

const K_AI_STORIES = "katthai_ai_stories_v1";

const SYSTEM_PROMPT = `You are a Thai language teacher creating graded reading material. Given the student's CEFR level and known vocabulary, create a short Thai story. Return ONLY valid JSON (no markdown, no backticks, no explanation) matching this exact structure:
{"id":"kebab-case-id","title":"Thai title","titleEn":"English title","level":"A1","emoji":"single emoji","description":"1-sentence English description","sentences":[{"thai":"full sentence in Thai","phonetic":"romanized pronunciation","english":"English translation","words":[{"thai":"word","phonetic":"romanized","english":"meaning"}]}],"questions":[{"question":"question in Thai","questionEn":"English translation","options":["option1","option2","option3","option4"],"correct":0}]}

Rules:
- Exactly 5 sentences with 3-6 words each in the words breakdown
- Exactly 3 comprehension questions with 4 Thai options each
- "correct" is the 0-based index of the right answer
- Incorporate the student's known vocabulary when possible
- Keep grammar appropriate for the CEFR level
- Make it coherent, interesting, and culturally relevant to Thailand
- Use common romanization (not IPA) for phonetic fields`;

/**
 * Build context for story generation from user's vocab data.
 */
export function gatherStoryContext(allVocab, studied, level) {
  const studiedWords = allVocab
    .filter(v => studied.has(v.id))
    .map(v => ({ thai: v.thai, phonetic: v.phonetics, english: v.english }));

  // Sample up to 25 studied words to keep prompt small
  const sample = studiedWords.length > 25
    ? studiedWords.sort(() => Math.random() - 0.5).slice(0, 25)
    : studiedWords;

  const existingIds = [
    ...STORIES.map(s => s.id),
    ...getGeneratedStories().map(s => s.id),
  ];

  return { level, knownVocabulary: sample, existingStoryIds: existingIds };
}

/**
 * Call Claude to generate a new story.
 */
export async function generateAIStory(context) {
  const text = await callClaude({
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(context) }],
    model: MODELS.HAIKU,
    maxTokens: 2048,
  });

  const cleaned = text.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
  const story = JSON.parse(cleaned);

  // Validate required fields
  if (!story.id || !story.sentences || !Array.isArray(story.sentences) || !story.questions) {
    throw new Error("Invalid story format from AI");
  }

  // Tag as AI-generated
  story.aiGenerated = true;

  return story;
}

/**
 * Get all generated stories from localStorage.
 */
export function getGeneratedStories() {
  return loadLS(K_AI_STORIES, []);
}

/**
 * Save a new generated story to localStorage.
 */
export function saveGeneratedStory(story) {
  const stories = getGeneratedStories();
  stories.push(story);
  saveLS(K_AI_STORIES, stories);
}

/**
 * Delete a generated story by id.
 */
export function deleteGeneratedStory(id) {
  const stories = getGeneratedStories().filter(s => s.id !== id);
  saveLS(K_AI_STORIES, stories);
}
