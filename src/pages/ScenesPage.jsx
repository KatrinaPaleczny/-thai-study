import { useState } from "react";
import { SCENES_DATA } from "../data/scenesData";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";

export function ScenesPage() {
  const [sceneIdx, setSceneIdx] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [learnedItems, setLearnedItems] = useState(new Set());
  const [showPhrases, setShowPhrases] = useState(false);

  if (sceneIdx === null) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Contextual Scenes</div>
          <div className="ph-s">Tap objects in real-world scenes to learn vocabulary in context</div>
        </div>
        <div className="sc-grid">
          {SCENES_DATA.map((scene, i) => (
            <button key={scene.id} className="sc-scene-card" onClick={() => { setSceneIdx(i); setLearnedItems(new Set()); setActiveItem(null); setShowPhrases(false); }}>
              <div className="sc-scene-emoji">{scene.emoji}</div>
              <div className="sc-scene-title">{scene.title}</div>
              <div className="sc-scene-desc">{scene.description}</div>
              <div className="sc-scene-count">{scene.items.length} words · {scene.phrases.length} phrases</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const scene = SCENES_DATA[sceneIdx];

  const handleItemClick = (item, idx) => {
    setActiveItem(idx);
    speakThai(item.thai);
    if (!learnedItems.has(idx)) {
      setLearnedItems(prev => new Set([...prev, idx]));
      awardXP("scene_word");
    }
  };

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">{scene.emoji} {scene.title}</div>
        <div className="ph-s">{scene.description} — Tap items to learn!</div>
      </div>

      {/* Progress */}
      <div className="sc-progress">
        {learnedItems.size}/{scene.items.length} words discovered
        <div className="rp-prog" style={{ marginTop: 6 }}>
          <div className="rp-prog-fill" style={{ width: `${(learnedItems.size / scene.items.length) * 100}%` }} />
        </div>
      </div>

      {/* Scene Area */}
      <div className="sc-area" style={{ background: scene.bgColor }}>
        {scene.items.map((item, i) => (
          <button
            key={i}
            className={`sc-item${activeItem === i ? " active" : ""}${learnedItems.has(i) ? " learned" : ""}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => handleItemClick(item, i)}
            title={learnedItems.has(i) ? item.english : "Tap to discover!"}
          >
            <span className="sc-item-emoji">{item.emoji}</span>
            {learnedItems.has(i) && <span className="sc-item-check">✓</span>}
          </button>
        ))}
      </div>

      {/* Active Item Detail */}
      {activeItem !== null && (
        <div className="sc-detail">
          <div className="sc-detail-emoji">{scene.items[activeItem].emoji}</div>
          <div className="sc-detail-thai">{scene.items[activeItem].thai}</div>
          <div className="sc-detail-phon">{scene.items[activeItem].phonetics}</div>
          <div className="sc-detail-eng">{scene.items[activeItem].english}</div>
          <button className="conv-speak" onClick={() => speakThai(scene.items[activeItem].thai)} title="Listen again">🔊</button>
        </div>
      )}

      {/* Phrases Toggle */}
      <div className="sc-phrases-section">
        <button className="btn btn-sec" onClick={() => setShowPhrases(p => !p)}>
          {showPhrases ? "Hide" : "Show"} Useful Phrases ({scene.phrases.length})
        </button>

        {showPhrases && (
          <div className="sc-phrases">
            {scene.phrases.map((p, i) => (
              <div key={i} className="sc-phrase">
                <div className="sc-phrase-thai">
                  {p.thai}
                  <button className="conv-speak" onClick={() => speakThai(p.thai)} title="Listen">🔊</button>
                </div>
                <div className="sc-phrase-phon">{p.phonetics}</div>
                <div className="sc-phrase-eng">{p.english}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn btn-sec" onClick={() => setSceneIdx(null)} style={{ marginTop: 20 }}>
        ← Back to Scenes
      </button>
    </div>
  );
}
