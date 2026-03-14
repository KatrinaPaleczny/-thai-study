import { useState } from "react";
import { normPhon } from "../utils/phonetics";

// Render one option: {phonetics, thai?} | {text} | string (fallback)
function OptLabel({ opt }) {
  if (typeof opt === "string") return <span>{opt}</span>;
  if (opt.text) return <span>{opt.text}</span>;
  return (
    <div>
      <div style={{ fontWeight: 500, fontSize: 13 }}>{opt.phonetics}</div>
      {opt.thai && (
        <div style={{ fontSize: 11, fontFamily: "var(--thai)", marginTop: 2, opacity: 0.6 }}>
          {opt.thai}
        </div>
      )}
    </div>
  );
}

export function BuildTab({ exercises }) {
  const [idx,      setIdx]      = useState(0);
  const [input,    setInput]    = useState("");
  const [selected, setSelected] = useState(null);
  const [checked,  setChecked]  = useState(false);

  if (!exercises?.length) {
    return <div style={{ fontSize: 13, color: "var(--t3)", padding: "8px 0" }}>No exercises yet.</div>;
  }

  const ex    = exercises[idx];
  const total = exercises.length;

  const canCheck  = ex.type === "fill" ? input.trim().length > 0 : selected !== null;
  const isCorrect = checked && (
    ex.type === "fill" ? normPhon(input) === normPhon(ex.answer) : selected === ex.answer
  );

  const check = () => setChecked(true);
  const next  = () => { setIdx(i => i + 1); setInput(""); setSelected(null); setChecked(false); };
  const retry = () => { setInput(""); setSelected(null); setChecked(false); };

  return (
    <div>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
        {exercises.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", transition: "background .2s",
            background: i === idx ? "var(--olive)" : i < idx ? "var(--olive-mid)" : "var(--bdr)",
          }}/>
        ))}
      </div>

      {/* Exercise label */}
      <div style={{ fontSize: 10, color: "var(--t3)", fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 10 }}>
        Exercise {idx + 1} of {total}
      </div>

      {/* Prompt */}
      <div style={{ fontSize: 14, color: "var(--t1)", marginBottom: 16, lineHeight: 1.65, whiteSpace: "pre-line" }}>
        {ex.prompt}
      </div>

      {/* Fill input */}
      {ex.type === "fill" && !checked && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            autoFocus
            style={{
              flex: 1, padding: "8px 12px", borderRadius: 8,
              border: "1px solid var(--bdr)", background: "var(--sur2)",
              fontSize: 14, fontFamily: "var(--body)",
              color: "var(--t1)", outline: "none",
            }}
            placeholder={ex.hint || "Type phonetics\u2026"}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && canCheck && check()}
          />
          <button className="btn btn-pri btn-sm" onClick={check} disabled={!canCheck}>Check</button>
        </div>
      )}

      {/* Fill answer display after check */}
      {ex.type === "fill" && checked && (
        <div style={{
          padding: "8px 12px", borderRadius: 8, marginBottom: 12, fontSize: 14,
          background: isCorrect ? "#e8f5e9" : "var(--sur2)",
          border: `1px solid ${isCorrect ? "#a5d6a7" : "var(--bdr)"}`,
          color: isCorrect ? "#2e7d32" : "var(--t1)",
        }}>
          {input || "\u2014"}
        </div>
      )}

      {/* Choose options */}
      {ex.type === "choose" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
          {ex.options.map((opt, i) => {
            let bg = "var(--sur)", border = "1px solid var(--bdr)", color = "var(--t1)";
            if (checked) {
              if (i === ex.answer)                         { bg = "#e8f5e9"; border = "1px solid #a5d6a7"; color = "#2e7d32"; }
              else if (i === selected && i !== ex.answer) { bg = "#fde8e8"; border = "1px solid #ef9a9a"; color = "#c62828"; }
            } else if (i === selected) {
              border = "1px solid var(--olive)"; bg = "var(--olive-soft)";
            }
            return (
              <button key={i} disabled={checked} onClick={() => setSelected(i)} style={{
                padding: "9px 14px", borderRadius: 8, border, background: bg, color,
                cursor: checked ? "default" : "pointer",
                textAlign: "left", fontFamily: "var(--body)", transition: "all .15s",
              }}>
                <OptLabel opt={opt}/>
              </button>
            );
          })}
        </div>
      )}

      {/* Check button for choose */}
      {ex.type === "choose" && !checked && (
        <button className="btn btn-pri btn-sm" onClick={check} disabled={!canCheck} style={{ marginBottom: 12 }}>
          Check
        </button>
      )}

      {/* Feedback */}
      {checked && (
        <div style={{
          padding: "9px 13px", borderRadius: 8, marginBottom: 14, fontSize: 12,
          background: isCorrect ? "#e8f5e9" : "#fde8e8",
          border: `1px solid ${isCorrect ? "#a5d6a7" : "#ef9a9a"}`,
          color: isCorrect ? "#2e7d32" : "#c62828",
        }}>
          {isCorrect ? (
            <>{"\u2713"} Correct!{ex.explanation && <span>  {ex.explanation}</span>}</>
          ) : (
            <>
              {"\u2717"} Answer: <strong>{ex.answer}</strong>
              {ex.answerThai && (
                <span style={{ fontFamily: "var(--thai)", marginLeft: 6, opacity: 0.8 }}>
                  ({ex.answerThai})
                </span>
              )}
              {ex.explanation && <span>  \u00b7  {ex.explanation}</span>}
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      {checked && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!isCorrect && (
            <button className="btn btn-sec btn-sm" onClick={retry}>Try again</button>
          )}
          {idx < total - 1 ? (
            <button className="btn btn-pri btn-sm" onClick={next}>Next {"\u2192"}</button>
          ) : (
            <div style={{ fontSize: 12, color: "var(--olive)", fontWeight: 600 }}>
              All exercises done {"\u2713"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
