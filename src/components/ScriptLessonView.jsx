import { useState, useCallback } from "react";
import { ScriptCards } from "./ScriptCards";
import { ScriptMatchingGame } from "./ScriptMatchingGame";
import { ScriptMiniQuiz } from "./ScriptMiniQuiz";
import { ScriptIntroDrill } from "./ScriptIntroDrill";
import { StrokeAnimation, STROKE_DATA } from "./StrokeAnimation";

/* ── Section divider (accordion) ── */
export function Section({ icon, title, children, defaultOpen = false }) {
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

/* ── Stroke Animation Picker ── */
export function StrokeAnimationPicker({ characters }) {
  const charsWithStrokes = characters.filter(c => {
    const cleaned = c.char.replace(/◌/g, "");
    return cleaned.length === 1 && STROKE_DATA[cleaned];
  });
  const [selectedChar, setSelectedChar] = useState(charsWithStrokes[0]?.char.replace(/◌/g, "") || null);

  if (charsWithStrokes.length === 0) return null;

  return (
    <div>
      <div className="sa-char-picker">
        {characters.map(c => {
          const cleaned = c.char.replace(/◌/g, "");
          const hasStroke = cleaned.length === 1 && STROKE_DATA[cleaned];
          return (
            <button
              key={c.char}
              className={`sa-char-btn${selectedChar === cleaned ? " on" : ""}${!hasStroke ? " dim" : ""}`}
              onClick={() => hasStroke && setSelectedChar(cleaned)}
              disabled={!hasStroke}
              title={hasStroke ? c.phonetic : "No stroke data yet"}
            >
              {c.char}
            </button>
          );
        })}
      </div>
      {selectedChar && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <StrokeAnimation key={selectedChar} char={selectedChar} />
        </div>
      )}
    </div>
  );
}

/* ── Script Lesson View — reusable layout for script lessons ── */
export function ScriptLessonView({ lesson, scriptStudied, toggleScriptStudied, onQuizComplete, quizLabel = "Quick Quiz" }) {
  const chars = lesson.characters || [];
  const hasUnstudied = chars.some(c => !scriptStudied.has(c.char));
  const charsWithStrokes = chars.filter(c => {
    const cleaned = c.char.replace(/◌/g, "");
    return cleaned.length === 1 && STROKE_DATA[cleaned];
  });

  return (
    <div className="unit-lesson-content">
      {lesson.intro && (
        <Section icon="📖" title="About">
          <div className="path-grammar">
            <div className="path-grammar-body">{lesson.intro}</div>
          </div>
        </Section>
      )}
      {chars.length >= 3 && (
        <Section icon="🎯" title="Intro Drill" defaultOpen={hasUnstudied}>
          <ScriptIntroDrill key={`sid-${lesson.id}`} characters={chars}
            onComplete={(cs) => cs.forEach(c => { if (!scriptStudied.has(c.char)) toggleScriptStudied(c.char); })}
          />
        </Section>
      )}
      <Section icon="📝" title="Characters" defaultOpen={!hasUnstudied}>
        <ScriptCards characters={chars} studied={scriptStudied} onToggle={toggleScriptStudied} />
      </Section>
      {charsWithStrokes.length > 0 && (
        <Section icon="✍️" title="Stroke Order">
          <StrokeAnimationPicker key={`sa-${lesson.id}`} characters={chars} />
        </Section>
      )}
      {chars.length >= 3 && (
        <Section icon="🔗" title="Matching Game">
          <ScriptMatchingGame key={`smg-${lesson.id}`} characters={chars} />
        </Section>
      )}
      {chars.length >= 3 && (
        <Section icon="🧠" title={quizLabel}>
          <ScriptMiniQuiz key={`sq-${lesson.id}`} characters={chars} onComplete={onQuizComplete} />
        </Section>
      )}
    </div>
  );
}
