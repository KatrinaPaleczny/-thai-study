// Tone types: "mid", "low", "falling", "high", "rising"
// Each syllable: { thai, phonetic, tone }

export const TONE_INFO = {
  mid:     { symbol: "\u02C9", label: "Mid",     color: "#5e6062" },
  low:     { symbol: "\u02CB", label: "Low",     color: "#5e6b41" },
  falling: { symbol: "\u02C6", label: "Falling", color: "#8b5c38" },
  high:    { symbol: "\u02CA", label: "High",    color: "#c29b3f" },
  rising:  { symbol: "\u02C7", label: "Rising",  color: "#3d8b37" },
};

export const PRONUNCIATION_DATA = {
  // ── Unit 1: Sound & Survival ──
  144: { // สวัสดี — Hello / Goodbye
    syllables: [
      { thai: "สวัส", phonetic: "sa", tone: "low" },
      { thai: "ดี", phonetic: "wat-dii", tone: "mid" },
    ],
  },
  143: { // ขอบคุณ — Thank you
    syllables: [
      { thai: "ขอบ", phonetic: "khawp", tone: "low" },
      { thai: "คุณ", phonetic: "khun", tone: "mid" },
    ],
  },
  141: { // ขอโทษ — Excuse me / Sorry
    syllables: [
      { thai: "ขอ", phonetic: "khaw", tone: "rising" },
      { thai: "โทษ", phonetic: "toht", tone: "falling" },
    ],
  },
  142: { // ไม่เป็นไร — No problem
    syllables: [
      { thai: "ไม่", phonetic: "mai", tone: "falling" },
      { thai: "เป็น", phonetic: "pen", tone: "mid" },
      { thai: "ไร", phonetic: "rai", tone: "mid" },
    ],
  },
  140: { // สวัสดีตอนเช้า — Good morning
    syllables: [
      { thai: "สวัส", phonetic: "sa", tone: "low" },
      { thai: "ดี", phonetic: "wat-dii", tone: "mid" },
      { thai: "ตอน", phonetic: "dton", tone: "mid" },
      { thai: "เช้า", phonetic: "chaao", tone: "high" },
    ],
  },
  26: { // สบายดี — Comfortable / Good
    syllables: [
      { thai: "สบาย", phonetic: "sa-baai", tone: "mid" },
      { thai: "ดี", phonetic: "dii", tone: "mid" },
    ],
  },
  14: { // ฉัน — I (neutral)
    syllables: [
      { thai: "ฉัน", phonetic: "chan", tone: "rising" },
    ],
  },
  15: { // ชื่อ — Name
    syllables: [
      { thai: "ชื่อ", phonetic: "chue", tone: "falling" },
    ],
  },
  16: { // คุณ — You / Mx.
    syllables: [
      { thai: "คุณ", phonetic: "khun", tone: "mid" },
    ],
  },
  17: { // อะไร — What
    syllables: [
      { thai: "อะ", phonetic: "a", tone: "low" },
      { thai: "ไร", phonetic: "rai", tone: "mid" },
    ],
  },
  18: { // ผม — I (masc)
    syllables: [
      { thai: "ผม", phonetic: "phom", tone: "rising" },
    ],
  },
  19: { // มา — Come
    syllables: [
      { thai: "มา", phonetic: "maa", tone: "mid" },
    ],
  },
  20: { // จาก — From
    syllables: [
      { thai: "จาก", phonetic: "jaak", tone: "low" },
    ],
  },
  21: { // ประเทศ — Country
    syllables: [
      { thai: "ประ", phonetic: "pra", tone: "low" },
      { thai: "เทศ", phonetic: "thet", tone: "falling" },
    ],
  },

  // ── Unit 2: Building Blocks ──
  38: { // พูด — Speak
    syllables: [
      { thai: "พูด", phonetic: "phuut", tone: "falling" },
    ],
  },
  39: { // เขียน — Write
    syllables: [
      { thai: "เขียน", phonetic: "khian", tone: "rising" },
    ],
  },
  40: { // อ่าน — Read
    syllables: [
      { thai: "อ่าน", phonetic: "aan", tone: "low" },
    ],
  },
  41: { // ฟัง — Listen
    syllables: [
      { thai: "ฟัง", phonetic: "fang", tone: "mid" },
    ],
  },
  44: { // ภาษา — Language
    syllables: [
      { thai: "ภา", phonetic: "phaa", tone: "mid" },
      { thai: "ษา", phonetic: "saa", tone: "rising" },
    ],
  },
  46: { // ได้ — Can / Yes
    syllables: [
      { thai: "ได้", phonetic: "dai", tone: "falling" },
    ],
  },
  47: { // ไม่ได้ — Cannot
    syllables: [
      { thai: "ไม่", phonetic: "mai", tone: "falling" },
      { thai: "ได้", phonetic: "dai", tone: "falling" },
    ],
  },

  // ── Unit 3: Numbers & Time ──
  53: { // หนึ่ง — 1
    syllables: [
      { thai: "หนึ่ง", phonetic: "nueng", tone: "low" },
    ],
  },
  54: { // สอง — 2
    syllables: [
      { thai: "สอง", phonetic: "sawng", tone: "rising" },
    ],
  },
  55: { // สาม — 3
    syllables: [
      { thai: "สาม", phonetic: "saam", tone: "rising" },
    ],
  },
  56: { // สี่ — 4
    syllables: [
      { thai: "สี่", phonetic: "sii", tone: "low" },
    ],
  },
  57: { // ห้า — 5
    syllables: [
      { thai: "ห้า", phonetic: "haa", tone: "falling" },
    ],
  },
  68: { // ร้อย — hundred
    syllables: [
      { thai: "ร้อย", phonetic: "roy", tone: "high" },
    ],
  },

  // ── Unit 4: Food & Daily Life ──
  96: { // อร่อย — Delicious
    syllables: [
      { thai: "อร่", phonetic: "a", tone: "low" },
      { thai: "อย", phonetic: "roi", tone: "low" },
    ],
  },
  97: { // เผ็ด — Spicy
    syllables: [
      { thai: "เผ็ด", phonetic: "phet", tone: "low" },
    ],
  },
  98: { // เค็ม — Salty
    syllables: [
      { thai: "เค็ม", phonetic: "kem", tone: "mid" },
    ],
  },
  4: { // ร้อน — hot
    syllables: [
      { thai: "ร้อน", phonetic: "rawn", tone: "high" },
    ],
  },
  5: { // เย็น — cool / cold
    syllables: [
      { thai: "เย็น", phonetic: "yen", tone: "mid" },
    ],
  },

  // ── Unit 6: Out & About ──
  70: { // เลี้ยวซ้าย — Turn left
    syllables: [
      { thai: "เลี้ยว", phonetic: "liao", tone: "high" },
      { thai: "ซ้าย", phonetic: "saai", tone: "high" },
    ],
  },
  71: { // เลี้ยวขวา — Turn right
    syllables: [
      { thai: "เลี้ยว", phonetic: "liao", tone: "high" },
      { thai: "ขวา", phonetic: "kwaa", tone: "rising" },
    ],
  },
  72: { // ตรงไป — Go straight
    syllables: [
      { thai: "ตรง", phonetic: "dtrong", tone: "mid" },
      { thai: "ไป", phonetic: "bpai", tone: "mid" },
    ],
  },
  73: { // ที่ไหน — Where?
    syllables: [
      { thai: "ที่", phonetic: "thii", tone: "falling" },
      { thai: "ไหน", phonetic: "nai", tone: "rising" },
    ],
  },
  75: { // ไกล — Far
    syllables: [
      { thai: "ไกล", phonetic: "glai", tone: "mid" },
    ],
  },
  76: { // ใกล้ — Near
    syllables: [
      { thai: "ใกล้", phonetic: "glai", tone: "falling" },
    ],
  },
  78: { // โรงพยาบาล — Hospital
    syllables: [
      { thai: "โรง", phonetic: "rong", tone: "mid" },
      { thai: "พยา", phonetic: "pha-yaa", tone: "mid" },
      { thai: "บาล", phonetic: "baan", tone: "mid" },
    ],
  },
};
