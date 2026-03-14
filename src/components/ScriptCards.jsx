import { useState } from "react";
import { speakThai } from "../utils/speech";
import { SpeakerIcon } from "./Icons";

export function ScriptCards({ characters, studied, onToggle }) {
  const [expanded, setExpanded] = useState(null);

  if (!characters?.length) {
    return <div style={{ fontSize: 13, color: "var(--t3)", padding: "8px 0" }}>No characters for this lesson.</div>;
  }

  return (
    <div className="scards">
      {characters.map(c => {
        const isDone = studied.has(c.char);
        const isOpen = expanded === c.char;
        return (
          <div key={c.char} className={`scard${isDone ? " done" : ""}${isOpen ? " open" : ""}`}>
            <div className="scard-main" onClick={() => setExpanded(isOpen ? null : c.char)}>
              <div className="scard-left">
                <div className="scard-sound">{c.phonetic}</div>
                <div className="scard-name">{c.name}</div>
                <span className={`script-class ${c.class}`}>{c.class}</span>
              </div>
              <div className="scard-right">
                <span className="scard-thai">{c.char}</span>
                <button className="scard-speak" onClick={e => { e.stopPropagation(); speakThai(c.char.replace("\u25CC", "")); }}>
                  <SpeakerIcon />
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="scard-expand">
                <div className="scard-mnemonic">{c.mnemonic}</div>
              </div>
            )}
            <button
              className={`vtable-mark scard-mark${isDone ? " on" : ""}`}
              onClick={() => onToggle(c.char)}
            >
              {isDone ? "\u2713 Studied" : "Mark studied"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
