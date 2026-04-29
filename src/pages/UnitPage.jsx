import { useState, useMemo } from "react";
import { GRAMMAR_DATA } from "../data/grammarData";
import { SCENARIOS_DATA } from "../data/scenariosData";
import { SENTENCE_EXERCISES } from "../data/sentenceExercises";
import { VocabTable } from "../components/VocabTable";
import { GrammarLearn } from "../components/GrammarLearn";
import { BuildTab } from "../components/BuildTab";
import { ConversationSection } from "../components/ConversationSection";
import { WordBankBuilder } from "../components/WordBankBuilder";
import { FlashcardDeck } from "../components/FlashcardDeck";
import { SCRIPT_LESSONS } from "../data/scriptData";
import { CulturalNotes } from "../components/CulturalNotes";
import { CULTURAL_NOTES } from "../data/culturalNotes";
import { PassageCard } from "../components/ReadingPractice";
import { UNIT_READINGS } from "../data/unitReadingData";
import { loadUnitTests } from "../utils/unitTests";
import { MiniAudioQuiz } from "../components/MiniAudioQuiz";
import { MiniPronunciation } from "../components/MiniPronunciation";
import { MatchingGame } from "../components/MatchingGame";
import { ScriptMiniQuiz } from "../components/ScriptMiniQuiz";
import { Section, ScriptLessonView } from "../components/ScriptLessonView";

/* ── Vocab Lesson Content ── */
function VocabLessonContent({ lesson, allVocab, studied, toggleStudied, confidence, updateConfidence, scriptStudied }) {
  const words = useMemo(
    () => allVocab.filter(v => (lesson.vocabIds || []).includes(v.id)),
    [lesson.vocabIds, allVocab]
  );

  const grammarItems = useMemo(
    () => (lesson.grammarIds || []).map(id => GRAMMAR_DATA.find(g => g.id === id)).filter(Boolean),
    [lesson.grammarIds]
  );

  const grammarExercises = useMemo(
    () => grammarItems.flatMap(g => g.exercises || []),
    [grammarItems]
  );

  const sentences = useMemo(
    () => (lesson.sentenceIds || []).map(id => SENTENCE_EXERCISES.find(s => s.id === id)).filter(Boolean),
    [lesson.sentenceIds]
  );

  const scenario = lesson.scenarioIdx != null ? SCENARIOS_DATA[lesson.scenarioIdx] : null;

  // Auto-open first incomplete section
  const hasUnstudied = words.some(w => !studied.has(w.id));

  return (
    <div className="unit-lesson-content">
      {/* Learn section */}
      {(lesson.grammar || grammarItems.length > 0) && (
        <Section icon="📖" title="Learn" defaultOpen={!hasUnstudied && words.length === 0}>
          {lesson.grammar && (
            <div className="path-grammar" style={{ marginBottom: grammarItems.length ? 16 : 0 }}>
              <div className="path-grammar-body">{lesson.grammar}</div>
            </div>
          )}
          <GrammarLearn grammarItems={grammarItems} />
        </Section>
      )}

      {/* Flashcards section — study first */}
      {words.length > 0 && (
        <Section icon="🃏" title="Flashcards" defaultOpen={hasUnstudied}>
          <FlashcardDeck key={`fc-${lesson.id}`} words={words} studied={studied} toggleStudied={toggleStudied} confidence={confidence} updateConfidence={updateConfidence} />
        </Section>
      )}

      {/* Vocabulary section — reference list */}
      <Section icon="📝" title="Vocabulary Reference" defaultOpen={!hasUnstudied && words.length > 0}>
        <VocabTable words={words} studied={studied} onToggle={toggleStudied} confidence={confidence} />
      </Section>

      {/* Practice section */}
      {(grammarExercises.length > 0 || sentences.length > 0) && (
        <Section icon="✍️" title="Practice">
          {grammarExercises.length > 0 && (
            <div className="unit-practice-block">
              <div className="unit-practice-label">Grammar exercises</div>
              <BuildTab key={`bt-${lesson.id}`} exercises={grammarExercises} />
            </div>
          )}
          {sentences.length > 0 && (
            <div className="unit-practice-block">
              <div className="unit-practice-label">Sentence builder</div>
              <WordBankBuilder key={`wb-${lesson.id}`} exercises={sentences} />
            </div>
          )}
        </Section>
      )}

      {/* Inline practice activities — scoped to this lesson's words */}
      {words.length >= 4 && (
        <Section icon="🎧" title="Audio Practice">
          <MiniAudioQuiz key={`aq-${lesson.id}`} words={words} />
        </Section>
      )}

      {words.length >= 4 && (
        <Section icon="🔗" title="Matching Game">
          <MatchingGame key={`mg-${lesson.id}`} words={words} />
        </Section>
      )}

      {words.length > 0 && (
        <Section icon="🎙️" title="Pronunciation Practice">
          <MiniPronunciation key={`pron-${lesson.id}`} words={words} />
        </Section>
      )}

      {/* Conversation section */}
      {scenario && (
        <Section icon="💬" title="Conversation">
          <ConversationSection scenario={scenario} />
        </Section>
      )}

      {/* Reading section — only after user has started Thai script lessons */}
      {UNIT_READINGS[lesson.id] && scriptStudied && scriptStudied.size > 0 && (
        <Section icon="📖" title="Reading Practice">
          <div className="unit-reading-intro">Read the Thai text below. Tap any word to see its meaning.</div>
          {UNIT_READINGS[lesson.id].map(passage => (
            <PassageCard key={passage.id} passage={passage} level={1} />
          ))}
        </Section>
      )}
    </div>
  );
}

/* ── Main Unit Page ── */
export function UnitPage({ unit, allVocab, studied, toggleStudied, scriptStudied, toggleScriptStudied, confidence, updateConfidence, onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const isScript = unit.type === "script";
  const testResults = loadUnitTests()[unit.id];
  const lessons = unit.lessons || [];
  const lesson = lessons[activeTab];

  // All characters in this script unit (for unit review)
  const allScriptChars = useMemo(
    () => isScript ? lessons.flatMap(l => l.characters || []) : [],
    [isScript, lessons]
  );

  // Previous script unit's characters (for review section)
  const prevScriptUnit = useMemo(() => {
    if (!isScript) return null;
    const idx = SCRIPT_LESSONS.findIndex(s => s.id === unit.id);
    return idx > 0 ? SCRIPT_LESSONS[idx - 1] : null;
  }, [isScript, unit.id]);
  const prevScriptChars = useMemo(
    () => prevScriptUnit ? (prevScriptUnit.lessons || []).flatMap(l => l.characters || []) : [],
    [prevScriptUnit]
  );

  // Compute overall progress for this unit
  const progress = useMemo(() => {
    if (isScript) {
      const chars = lessons.flatMap(l => l.characters || []);
      const total = chars.length;
      const done = chars.filter(c => scriptStudied.has(c.char)).length;
      return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    }
    let total = 0, done = 0;
    lessons.forEach(l => {
      const words = allVocab.filter(v => (l.vocabIds || []).includes(v.id));
      total += words.length;
      done += words.filter(v => studied.has(v.id)).length;
    });
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [isScript, lessons, allVocab, studied, scriptStudied]);

  // Per-lesson progress for tab badges
  const lessonProgress = useMemo(() => {
    return lessons.map(l => {
      if (isScript || l.type === "script") {
        const chars = l.characters || [];
        const total = chars.length;
        const done = chars.filter(c => scriptStudied.has(c.char)).length;
        return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
      }
      const words = allVocab.filter(v => (l.vocabIds || []).includes(v.id));
      const done = words.filter(v => studied.has(v.id)).length;
      return { total: words.length, done, pct: words.length ? Math.round((done / words.length) * 100) : 0 };
    });
  }, [isScript, lessons, allVocab, studied, scriptStudied]);

  if (!lesson) {
    return <div className="page"><button className="path-back" onClick={onBack}>{"\u2190"} Back to path</button><div className="empty">No lessons in this unit.</div></div>;
  }

  return (
    <div className="page">
      {/* Header */}
      <button className="path-back" onClick={onBack}>{"\u2190"} Back to path</button>
      <div className="unit-header">
        <div className="unit-header-top">
          <span className="unit-header-icon">{unit.icon}</span>
          <div>
            <div className="unit-header-title">{unit.title}</div>
            <div className="unit-header-desc">{unit.description}</div>
          </div>
        </div>
        <div className="unit-header-prog">
          <span>{progress.done}/{progress.total} {isScript ? "characters" : "words"} studied</span>
          <span className="unit-header-pct">{progress.pct}%</span>
        </div>
        <div className="path-pbar"><div className="path-pfill" style={{ width: progress.pct + "%" }} /></div>
      </div>

      {/* Previous script unit review */}
      {isScript && prevScriptChars.length >= 3 && (
        <Section icon="🔙" title={`Review: ${prevScriptUnit.title}`} defaultOpen={false}>
          <ScriptMiniQuiz key={`prev-review-${unit.id}`} characters={prevScriptChars} />
        </Section>
      )}

      {/* Lesson tabs */}
      {lessons.length > 1 && (
        <div className="unit-tabs">
          {lessons.map((l, i) => (
            <button
              key={l.id}
              className={`unit-tab${i === activeTab ? " on" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              <span>{l.title}</span>
              {lessonProgress[i] && (
                <span className="unit-tab-badge">
                  {lessonProgress[i].pct === 100 ? "\u2705" : `${lessonProgress[i].pct}%`}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lesson content */}
      {(isScript || lesson.type === "script") ? (
        <ScriptLessonView
          key={lesson.id}
          lesson={lesson}
          scriptStudied={scriptStudied}
          toggleScriptStudied={toggleScriptStudied}
        />
      ) : (
        <VocabLessonContent
          key={lesson.id}
          lesson={lesson}
          allVocab={allVocab}
          studied={studied}
          toggleStudied={toggleStudied}
          confidence={confidence}
          updateConfidence={updateConfidence}
          scriptStudied={scriptStudied}
        />
      )}

      {/* Cultural Notes — per unit, not per lesson */}
      {!isScript && CULTURAL_NOTES[unit.id] && (
        <Section icon="🏛️" title="Culture & Customs">
          <CulturalNotes notes={CULTURAL_NOTES[unit.id]} />
        </Section>
      )}

      {/* Unit Review — only show when user has studied chars from 2+ sub-lessons */}
      {isScript && lessons.length > 1 && allScriptChars.length >= 3 && (() => {
        const lessonsWithStudied = lessons.filter(l =>
          (l.characters || []).some(c => scriptStudied.has(c.char))
        ).length;
        return lessonsWithStudied >= 2;
      })() && (
        <Section icon="🔄" title="Unit Review Quiz" defaultOpen={false}>
          <ScriptMiniQuiz key={`ur-quiz-${unit.id}`} characters={allScriptChars} />
        </Section>
      )}

      {/* Unit Test Section */}
      <div className="ut-section">
        {testResults?.passed ? (
          <div className="ut-passed-row">
            <span className="ut-passed-badge">✅ Passed ({testResults.bestPct}%)</span>
            <a className="btn btn-sec btn-sm" href={`/unit-test/${unit.id}`}>Retake</a>
          </div>
        ) : progress.pct === 100 || testResults ? (
          <a className="btn btn-pri ut-test-btn" href={`/unit-test/${unit.id}`}>
            📝 Take {isScript ? "Script" : "Unit"} Test
          </a>
        ) : (
          <div className="ut-locked-msg">Study all {isScript ? "characters" : "words"} to unlock the test</div>
        )}
      </div>
    </div>
  );
}
