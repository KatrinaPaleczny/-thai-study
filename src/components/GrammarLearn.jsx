export function GrammarLearn({ grammarItems }) {
  if (!grammarItems?.length) return null;

  return (
    <div className="glearn">
      {grammarItems.map(g => (
        <div key={g.id} className="glearn-card">
          <div className="glearn-hdr">
            <span className="glearn-ic">{g.icon}</span>
            <span className="glearn-title">{g.title}</span>
          </div>
          {g.formula && (
            <div className="glearn-formula">{g.formula}</div>
          )}
          <div className="glearn-summary">{g.summary}</div>
          <div className="glearn-examples">
            {g.examples.map((ex, i) => (
              <div key={i} className="glearn-ex">
                <div className="glearn-ex-th">{ex.thai}</div>
                <div className="glearn-ex-ph">{ex.phonetics}</div>
                <div className="glearn-ex-en">{ex.english}</div>
              </div>
            ))}
          </div>
          {g.notes && <div className="glearn-note">{g.notes}</div>}
          {g.why && (
            <div className="glearn-why">
              <div className="glearn-why-t">Why this works</div>
              <div className="glearn-why-body">{g.why}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
