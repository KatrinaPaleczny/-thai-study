import { useState } from "react";
import { speakThai } from "../utils/speech";

const PASSAGES = [
  {
    id: "r1", title: "At the Market", level: 1,
    segments: [
      { thai: "ฉัน", phonetics: "chǎn", english: "I" },
      { thai: "ไป", phonetics: "bpai", english: "go" },
      { thai: "ตลาด", phonetics: "dtà-làat", english: "market" },
      { thai: "ทุก", phonetics: "túk", english: "every" },
      { thai: "วัน", phonetics: "wan", english: "day" },
    ],
    fullEnglish: "I go to the market every day."
  },
  {
    id: "r2", title: "Ordering Food", level: 1,
    segments: [
      { thai: "ขอ", phonetics: "khǎw", english: "request" },
      { thai: "ผัดไทย", phonetics: "pàt-tai", english: "pad thai" },
      { thai: "หนึ่ง", phonetics: "nèung", english: "one" },
      { thai: "จาน", phonetics: "jaan", english: "plate" },
      { thai: "ค่ะ", phonetics: "khâ", english: "(polite)" },
    ],
    fullEnglish: "One plate of pad thai, please."
  },
  {
    id: "r3", title: "My Family", level: 2,
    segments: [
      { thai: "ครอบครัว", phonetics: "krâwp-krua", english: "family" },
      { thai: "ของ", phonetics: "kɔ̌ɔng", english: "of" },
      { thai: "ฉัน", phonetics: "chǎn", english: "I" },
      { thai: "มี", phonetics: "mii", english: "have" },
      { thai: "สี่", phonetics: "sìi", english: "four" },
      { thai: "คน", phonetics: "khon", english: "people" },
    ],
    fullEnglish: "My family has four people."
  },
  {
    id: "r4", title: "Weekend Plans", level: 2,
    segments: [
      { thai: "วันเสาร์", phonetics: "wan-sǎo", english: "Saturday" },
      { thai: "จะ", phonetics: "jà", english: "will" },
      { thai: "ไป", phonetics: "bpai", english: "go" },
      { thai: "เที่ยว", phonetics: "tîao", english: "travel/hang out" },
      { thai: "กับ", phonetics: "gàp", english: "with" },
      { thai: "เพื่อน", phonetics: "pêuan", english: "friend" },
    ],
    fullEnglish: "On Saturday I will go out with friends."
  },
  {
    id: "r5", title: "After Work", level: 3,
    segments: [
      { thai: "หลัง", phonetics: "lǎng", english: "after" },
      { thai: "เลิกงาน", phonetics: "lêrk-ngaan", english: "finish work" },
      { thai: "ฉัน", phonetics: "chǎn", english: "I" },
      { thai: "ชอบ", phonetics: "châwp", english: "like" },
      { thai: "ไป", phonetics: "bpai", english: "go" },
      { thai: "กิน", phonetics: "gin", english: "eat" },
      { thai: "อาหาร", phonetics: "aa-hǎan", english: "food" },
      { thai: "ไทย", phonetics: "tai", english: "Thai" },
    ],
    fullEnglish: "After work, I like to go eat Thai food."
  },
  {
    id: "r6", title: "The Weather", level: 3,
    segments: [
      { thai: "วันนี้", phonetics: "wan-níi", english: "today" },
      { thai: "อากาศ", phonetics: "aa-gàat", english: "weather" },
      { thai: "ร้อน", phonetics: "ráwn", english: "hot" },
      { thai: "มาก", phonetics: "mâak", english: "very" },
      { thai: "อยาก", phonetics: "yàak", english: "want to" },
      { thai: "กิน", phonetics: "gin", english: "eat" },
      { thai: "ไอศกรีม", phonetics: "ai-sà-griim", english: "ice cream" },
    ],
    fullEnglish: "Today the weather is very hot. I want to eat ice cream."
  },
];

const LEVELS = [
  { key: 1, label: "Guided" },
  { key: 2, label: "Assisted" },
  { key: 3, label: "Independent" },
];

function ReadingWord({ seg, level, activeWord, onTap }) {
  const isActive = activeWord === seg.thai;

  const handleClick = () => {
    onTap(isActive ? null : seg.thai);
  };

  return (
    <span
      className={`reading-word${isActive ? " active" : ""}`}
      onClick={handleClick}
    >
      <span className="reading-word-thai">{seg.thai}</span>
      {/* Level 1 (Guided): always show phonetics */}
      {level === 1 && (
        <span className="reading-word-ph">{seg.phonetics}</span>
      )}
      {/* Level 2 (Assisted): always show phonetics */}
      {level === 2 && (
        <span className="reading-word-ph">{seg.phonetics}</span>
      )}
      {/* Level 3 (Independent): no phonetics unless tapped */}
      {isActive && (
        <span className="reading-tip">
          {level === 3 && <span className="reading-tip-ph">{seg.phonetics}</span>}
          <span className="reading-tip-en">{seg.english}</span>
        </span>
      )}
      {/* Level 1 also shows English on tap, handled by the tooltip above */}
    </span>
  );
}

export function PassageCard({ passage, level }) {
  const [activeWord, setActiveWord] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const fullThai = passage.segments.map(s => s.thai).join("");

  return (
    <div className="reading-card">
      <div className="reading-title">
        <span>{passage.title}</span>
        <button
          className="num-speak"
          onClick={() => speakThai(fullThai)}
          title="Hear pronunciation"
        >
          🔊
        </button>
      </div>
      <div className="reading-body">
        {passage.segments.map((seg, i) => (
          <ReadingWord
            key={i}
            seg={seg}
            level={level}
            activeWord={activeWord}
            onTap={setActiveWord}
          />
        ))}
      </div>
      {!showTranslation ? (
        <button
          className="btn btn-sec btn-sm reading-reveal"
          onClick={() => setShowTranslation(true)}
        >
          Show translation
        </button>
      ) : (
        <div className="reading-en">{passage.fullEnglish}</div>
      )}
    </div>
  );
}

export function ReadingPractice() {
  const [level, setLevel] = useState(1);

  const filtered = PASSAGES.filter(p => p.level === level);

  return (
    <div className="reading">
      <div className="reading-levels">
        {LEVELS.map(l => (
          <button
            key={l.key}
            className={`vt-btn${level === l.key ? " on" : ""}`}
            onClick={() => setLevel(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
      {filtered.map(p => (
        <PassageCard key={p.id} passage={p} level={level} />
      ))}
    </div>
  );
}
