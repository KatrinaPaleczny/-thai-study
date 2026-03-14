import { useState, useMemo, useCallback } from "react";
import { GRAMMAR_DATA } from "../data/grammarData";
import { SCENARIOS_DATA } from "../data/scenariosData";
import { SENTENCE_EXERCISES } from "../data/sentenceExercises";
import { VocabTable } from "../components/VocabTable";
import { ScriptCards } from "../components/ScriptCards";
import { GrammarLearn } from "../components/GrammarLearn";
import { BuildTab } from "../components/BuildTab";
import { ConversationSection } from "../components/ConversationSection";
import { WordBankBuilder } from "../components/WordBankBuilder";
import { FlashcardDeck } from "../components/FlashcardDeck";
import { ScriptFlashcardDeck } from "../components/ScriptFlashcardDeck";
import { CulturalNotes } from "../components/CulturalNotes";
import { CULTURAL_NOTES } from "../data/culturalNotes";

/* ── Section divider (accordion) ── */
function Section({ icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => setOpen(o => !o), []);
  return (
    <div className="unit-section">
      <button
        className="unit-section-hdr"
        onClick={toggle}
        aria-expanded={open}
      >
        <span>{icon}</span>
        <span>{title}</span>
        <span className="unit-section-chev" aria-hidden="true">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="unit-section-body">{children}</div>}
    </div>
  );
}

/* ── Vocab Lesson Content ── */
function VocabLessonContent({ lesson, allVocab, studied, toggleStudied, confidence, updateConfidence }) {
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

      {/* Conversation section */}
      {scenario && (
        <Section icon="💬" title="Conversation">
          <ConversationSection scenario={scenario} />
        </Section>
      )}
    </div>
  );
}

/* ── Script Lesson Content ── */
function ScriptLessonContent({ lesson, scriptStudied, toggleScriptStudied }) {
  const chars = lesson.characters || [];
  const hasUnstudied = chars.some(c => !scriptStudied.has(c.char));

  return (
    <div className="unit-lesson-content">
      {lesson.intro && (
        <Section icon="📖" title="About">
          <div className="path-grammar">
            <div className="path-grammar-body">{lesson.intro}</div>
          </div>
        </Section>
      )}
      {chars.length > 0 && (
        <Section icon="🃏" title="Flashcards" defaultOpen={hasUnstudied}>
          <ScriptFlashcardDeck key={`sfc-${lesson.id}`} characters={chars} studied={scriptStudied} onToggle={toggleScriptStudied} />
        </Section>
      )}
      <Section icon="📝" title="Characters" defaultOpen={!hasUnstudied}>
        <ScriptCards characters={chars} studied={scriptStudied} onToggle={toggleScriptStudied} />
      </Section>
    </div>
  );
}

/* ── Main Unit Page ── */
export function UnitPage({ unit, allVocab, studied, toggleStudied, scriptStudied, toggleScriptStudied, confidence, updateConfidence, onBack }) {
  const [activeTab, setActiveTab] = useState(0);
  const isScript = unit.type === "script";
  const lessons = unit.lessons || [];
  const lesson = lessons[activeTab];

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
        <ScriptLessonContent
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
        />
      )}

      {/* Cultural Notes — per unit, not per lesson */}
      {!isScript && CULTURAL_NOTES[unit.id] && (
        <Section icon="🏛️" title="Culture & Customs">
          <CulturalNotes notes={CULTURAL_NOTES[unit.id]} />
        </Section>
      )}
    </div>
  );
}
