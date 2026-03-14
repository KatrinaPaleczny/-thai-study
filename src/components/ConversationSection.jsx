import { useState } from "react";
import { speakThai, speakSequence } from "../utils/speech";

export function ConversationSection({ scenario }) {
  const [step, setStep] = useState(0); // 0=try, 1=listen, 2=shadow
  const [revealed, setRevealed] = useState(new Set());

  if (!scenario) return null;

  const steps = [
    { label: "Try Yourself", desc: "Read the English prompts and try to say the Thai on your own." },
    { label: "Listen", desc: "Reveal the Thai and listen to how each line sounds." },
    { label: "Shadow", desc: "Play each line and repeat along — match the rhythm and tone." },
  ];

  const toggleReveal = idx => {
    setRevealed(prev => {
      const n = new Set(prev);
      n.has(idx) ? n.delete(idx) : n.add(idx);
      return n;
    });
  };

  const speakAll = () => {
    const texts = scenario.turns.map(t => t.thai || t.thai_hint).filter(Boolean);
    speakSequence(texts, { gap: 800 });
  };

  return (
    <div className="conv-sec">
      <div className="conv-sec-goal">{scenario.goal}</div>

      {/* 3-step flow selector */}
      <div className="conv-steps">
        {steps.map((s, i) => (
          <button key={i} className={`conv-step${step === i ? " on" : ""}`} onClick={() => {
            setStep(i);
            if (i === 0) setRevealed(new Set());
            if (i >= 1) setRevealed(new Set(scenario.turns.map((_, j) => j)));
          }}>
            <span className="conv-step-num">{i + 1}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
      <div className="conv-step-desc">{steps[step].desc}</div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {step === 0 && (
          <>
            <button className="btn btn-sec btn-sm" onClick={() => setRevealed(new Set(scenario.turns.map((_, i) => i)))}>
              Reveal all hints
            </button>
            <button className="btn btn-sec btn-sm" onClick={() => setRevealed(new Set())}>
              Hide all
            </button>
          </>
        )}
        {step >= 1 && (
          <button className="btn btn-sec btn-sm" onClick={speakAll}>
            Play entire conversation
          </button>
        )}
      </div>

      {/* Conversation turns */}
      <div className="conv-scene">
        {scenario.turns.map((turn, i) => (
          <div key={i} className="conv-turn">
            <div className={`conv-role${turn.role === "You" ? " you" : ""}`}>{turn.role}</div>
            <div className="conv-bub">
              <div className="conv-pr">{turn.prompt_en}</div>
              {revealed.has(i) ? (
                <div className="conv-hint">
                  {turn.thai_hint}
                  {step >= 1 && (
                    <button className="conv-speak" onClick={() => speakThai(turn.thai || turn.thai_hint)} title="Listen">
                      🔊
                    </button>
                  )}
                </div>
              ) : (
                <button className="conv-rb" onClick={() => toggleReveal(i)}>
                  Show {turn.role === "You" ? "hint" : "Thai"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
