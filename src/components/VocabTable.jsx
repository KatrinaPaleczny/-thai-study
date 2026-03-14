import { speakThai } from "../utils/speech";
import { SpeakerIcon } from "./Icons";

const CONF_COLORS = ["var(--t3)", "#c29b3f", "#6b9e5a", "#3d8b37"];

export function VocabTable({ words, studied, onToggle, confidence = {} }) {
  if (!words?.length) {
    return <div style={{ fontSize: 13, color: "var(--t3)", padding: "8px 0" }}>No vocabulary for this lesson.</div>;
  }

  return (
    <div className="vtable">
      <div className="vtable-hdr">
        <span className="vtable-col vtable-col-ej"></span>
        <span className="vtable-col vtable-col-th">Thai</span>
        <span className="vtable-col vtable-col-ph">Phonetics</span>
        <span className="vtable-col vtable-col-en">English</span>
        <span className="vtable-col vtable-col-act"></span>
      </div>
      {words.map(v => {
        const isDone = studied.has(v.id);
        const conf = confidence[v.id] || 0;
        return (
          <div key={v.id} className={`vtable-row${isDone ? " done" : ""}`}>
            <span className="vtable-col vtable-col-ej">
              {v.emoji || ""}
              {conf > 0 && <span className="vtable-conf" style={{ color: CONF_COLORS[conf] }}>{"●".repeat(conf)}</span>}
            </span>
            <span className="vtable-col vtable-col-th">
              <span className="vtable-thai">{v.thai}</span>
              <button className="vtable-speak" onClick={() => speakThai(v.thai)}>
                <SpeakerIcon />
              </button>
            </span>
            <span className="vtable-col vtable-col-ph">{v.phonetics}</span>
            <span className="vtable-col vtable-col-en">{v.english}</span>
            <span className="vtable-col vtable-col-act">
              <button
                className={`vtable-mark${isDone ? " on" : ""}`}
                onClick={() => onToggle(v.id)}
              >
                {isDone ? "\u2713" : ""}
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
