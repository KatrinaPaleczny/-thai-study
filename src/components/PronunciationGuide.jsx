import { useState } from "react";
import { speakThai, speakThaiSlow, speakSyllables } from "../utils/speech";
import { PRONUNCIATION_DATA, TONE_INFO } from "../data/pronunciationData";

export function PronunciationGuide({ wordId, thai }) {
  const data = PRONUNCIATION_DATA[wordId];
  const [activeSyl, setActiveSyl] = useState(null);

  if (!data) return null;

  const handleSyllablePlay = (syl, idx) => {
    setActiveSyl(idx);
    speakThai(syl.thai || syl.phonetic, { rate: 0.6 });
    setTimeout(() => setActiveSyl(null), 1000);
  };

  const handlePlayAll = () => {
    const thaiSyllables = data.syllables.map(s => s.thai || s.phonetic);
    speakSyllables(thaiSyllables, 900);
  };

  return (
    <div className="pron-guide">
      <div className="pron-label">Pronunciation Guide</div>

      <div className="pron-syllables">
        {data.syllables.map((syl, i) => {
          const tone = TONE_INFO[syl.tone];
          return (
            <button
              key={i}
              className={`pron-syl${activeSyl === i ? " active" : ""}`}
              onClick={() => handleSyllablePlay(syl, i)}
            >
              {syl.thai && <span className="pron-syl-thai">{syl.thai}</span>}
              <span className="pron-syl-ph">{syl.phonetic}</span>
              <span className="pron-syl-tone" style={{ color: tone.color }}>
                {tone.symbol} {tone.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pron-controls">
        <button className="pron-btn" onClick={() => speakThai(thai)}>
          Normal
        </button>
        <button className="pron-btn" onClick={() => speakThaiSlow(thai)}>
          Slow
        </button>
        <button className="pron-btn" onClick={handlePlayAll}>
          Syllable by syllable
        </button>
      </div>
    </div>
  );
}
