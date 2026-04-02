# Plan: Four Improvements

## 1. Hide AI Study Coach (keep code, hide from page)
**File:** `src/pages/MyPathPage.jsx`
- Remove the entire AI Study Coach JSX block (lines 246-295) from the render
- Keep all imports, state, and `handleGenerateAIPlan` function intact so it can be re-enabled later
- Just comment out or conditionally hide the JSX with a `false &&` guard

## 2. Fix Today's Plan to reflect script sub-lesson sizes
**File:** `src/pages/MyPathPage.jsx`
- The checklist code at lines 118-132 already has sub-lesson-aware logic for script units — it finds the next incomplete sub-lesson and counts its unstudied characters
- The label already uses `"characters"` for script units
- **Problem:** The screenshot shows "Learn 10 new words" — likely a deployment issue. Verify the code is correct and push.
- **Enhancement:** Also show the sub-lesson name (e.g., "Learn 4 characters in Consonants 1") by including `nextLesson.title` in the label

## 3. Track practice completion properly
**File:** `src/pages/MyPathPage.jsx`, `src/utils/xp.js`
- Currently the "Practice: flashcards or listening" checklist item uses `xpProgress.todayXP >= 15` as a rough proxy — it doesn't actually know if you did flashcards or listening
- **Fix:** Track practice actions in XP history. In `xp.js`, add action tracking to today's history entry (track which action types were performed today). Then in the checklist, check if any practice-type XP actions were earned today (flashcard_correct, audio_quiz_correct, pronunciation_attempt, etc.)
- Specifically: modify `awardXP` to also store a set of action types performed today. Then check that set in the checklist.

## 4. Better Thai Script learning guidance
**File:** `src/pages/UnitPage.jsx` (ScriptLessonContent)
- Add a "How to study" tip at the top of script unit pages for beginners
- Suggest a learning flow: "Go through flashcards first → try the matching game → take the quick quiz → move to the next tab"
- Show a small progress indicator per sub-lesson in the tab badges (already exists: ✅ or %)
- Auto-advance to the next incomplete sub-lesson tab when the user opens the unit
