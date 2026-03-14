import { useState } from "react";
import { FULL_PATH } from "../data/curriculumData";

export function Sidebar({ page, setPage, onOpenUnit }) {
  const [pathOpen, setPathOpen] = useState(false);

  const btn = (p, ic, label) => (
    <button className={`sb-btn${page===p?" on":""}`} onClick={()=>setPage(p)}>
      <span className="sb-ic">{ic}</span><span>{label}</span>
    </button>
  );

  let vocabUnitNum = 0;

  return (
    <div className="sb">
      <div className="sb-logo">
        <div className="sb-th">เรียนไทย</div>
        <div className="sb-sub">คุณแคท · Thai Study</div>
      </div>
      <div className="sb-lbl">Learn</div>

      {/* My Path with dropdown */}
      <div>
        <button
          className={`sb-btn${page==="mypath"?" on":""}`}
          onClick={() => { setPage("mypath"); setPathOpen(o => !o); }}
        >
          <span className="sb-ic">🛤️</span>
          <span>My Path</span>
          <span className="sb-chev">{pathOpen ? "▾" : "▸"}</span>
        </button>
        {pathOpen && (
          <div className="sb-sub-list">
            {FULL_PATH.map(unit => {
              const isScript = unit.type === "script";
              if (!isScript) vocabUnitNum++;
              const label = isScript ? unit.title : `Unit ${vocabUnitNum}: ${unit.title}`;
              return (
                <button
                  key={unit.id}
                  className="sb-sub-btn"
                  onClick={() => onOpenUnit(unit.id)}
                >
                  <span className="sb-sub-ic">{unit.icon}</span>
                  <span className="sb-sub-lbl">{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {btn("vocab","📖","Vocabulary")}
      {btn("flashcards","🃏","Flashcards")}
      {btn("practice","🎯","Practice")}
      {btn("roleplay","💬","Role-Play")}
      <div className="sb-lbl">Reference</div>
      {btn("grammar","📐","Grammar")}
      {btn("numbers","🔢","Numbers")}
    </div>
  );
}
