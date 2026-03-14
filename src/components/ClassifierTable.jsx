import { speakThai } from "../utils/speech";

const CLASSIFIERS = [
  { thai: "คน", phonetics: "khon", use: "People", examples: "คน 3 คน = 3 people", emoji: "👤" },
  { thai: "ตัว", phonetics: "dtua", use: "Animals, shirts, chairs, letters", examples: "แมว 2 ตัว = 2 cats", emoji: "🐱" },
  { thai: "อัน", phonetics: "an", use: "Small objects (general)", examples: "ช้อน 3 อัน = 3 spoons", emoji: "🥄" },
  { thai: "ใบ", phonetics: "bai", use: "Flat things: leaves, paper, plates, bags, tickets", examples: "ใบไม้ 5 ใบ = 5 leaves", emoji: "🍃" },
  { thai: "เล่ม", phonetics: "lêm", use: "Books, candles, knives", examples: "หนังสือ 2 เล่ม = 2 books", emoji: "📕" },
  { thai: "คัน", phonetics: "khan", use: "Vehicles (cars, bikes, umbrellas)", examples: "รถ 1 คัน = 1 car", emoji: "🚗" },
  { thai: "ลูก", phonetics: "lûuk", use: "Round things: fruit, balls, children", examples: "ส้ม 3 ลูก = 3 oranges", emoji: "🍊" },
  { thai: "แก้ว", phonetics: "gâew", use: "Glasses/cups of drink", examples: "น้ำ 2 แก้ว = 2 glasses of water", emoji: "🥛" },
  { thai: "ขวด", phonetics: "khùat", use: "Bottles", examples: "เบียร์ 3 ขวด = 3 bottles of beer", emoji: "🍾" },
  { thai: "จาน", phonetics: "jaan", use: "Plates/dishes of food", examples: "ข้าวผัด 1 จาน = 1 plate of fried rice", emoji: "🍽️" },
  { thai: "ห้อง", phonetics: "hâwng", use: "Rooms", examples: "ห้องนอน 2 ห้อง = 2 bedrooms", emoji: "🚪" },
  { thai: "ที่", phonetics: "thîi", use: "Places, seats", examples: "ที่นั่ง 4 ที่ = 4 seats", emoji: "💺" },
  { thai: "ชิ้น", phonetics: "chín", use: "Pieces/slices", examples: "เค้ก 1 ชิ้น = 1 piece of cake", emoji: "🍰" },
  { thai: "คู่", phonetics: "khûu", use: "Pairs (shoes, chopsticks)", examples: "รองเท้า 2 คู่ = 2 pairs of shoes", emoji: "👟" },
];

export function ClassifierTable() {
  return (
    <div className="clf-table">
      <div className="clf-intro">
        Thai uses classifiers (ลักษณนาม) when counting things. The pattern is: <strong>noun + number + classifier</strong>. For example, แมว 2 ตัว (cat 2 [animal-classifier] = 2 cats).
      </div>
      <div className="clf-grid">
        {CLASSIFIERS.map(c => (
          <div key={c.thai} className="clf-card">
            <div className="clf-top">
              <span className="clf-emoji">{c.emoji}</span>
              <div className="clf-main">
                <span className="clf-thai">{c.thai}</span>
                <span className="clf-ph">{c.phonetics}</span>
              </div>
              <button className="num-speak" onClick={() => speakThai(c.thai)} title="Hear pronunciation">🔊</button>
            </div>
            <div className="clf-use">{c.use}</div>
            <div className="clf-ex">{c.examples}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
