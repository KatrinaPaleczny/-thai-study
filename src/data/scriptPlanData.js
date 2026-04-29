// 30-Day Thai Script Challenge — daily curriculum
// Each day plugs into ScriptLessonView with the same lesson shape used by scriptData.js
// Goal: ~15 min/day, build to real reading by Day 30
//
// Day fields:
//   day, week, title, focus, intro
//   characters[]      — Thai chars to learn this day (same shape as scriptData.js)
//   sections[]        — which sections to render (intro|drill|cards|stroke|matching|quiz|sound-out|tone-rule|reading)
//   toneRuleMode      — for tone-rule days: "dead-live" | "mid-class" | "all-class" | "cumulative"
//   passageIds        — for reading days: refs into PASSAGES (ReadingPractice) or UNIT_READINGS keys
//   reviewChars       — for review days: which chars (out of all studied) to quiz on

// ── Core character pools (kept inline so plan is self-contained) ────────────
const C_MID_1 = [
  { char: "ก", name: "กอ ไก่ (gor gài)", phonetic: "g", class: "mid", mnemonic: "Looks like a little table — ก is in กิน (eat), กับ (with)" },
  { char: "จ", name: "จอ จาน (jɔɔ jaan)", phonetic: "j", class: "mid", mnemonic: "Looks like a plate — จ is in จาน (plate), จาก (from)" },
  { char: "ด", name: "ดอ เด็ก (dɔɔ dèk)", phonetic: "d", class: "mid", mnemonic: "Small and round — ด is in ดี (good), ได้ (can)" },
];

const C_MID_2 = [
  { char: "ต", name: "ตอ เต่า (dtɔɔ dtào)", phonetic: "dt", class: "mid", mnemonic: "A turtle — ต is in ตอน (when/time), ต้อง (must)" },
  { char: "บ", name: "บอ ใบไม้ (bɔɔ bai-máai)", phonetic: "b", class: "mid", mnemonic: "Round like a leaf — บ is in บ้าน (house), บาท (baht)" },
  { char: "ป", name: "ปอ ปลา (bpɔɔ bplaa)", phonetic: "bp", class: "mid", mnemonic: "Like a fish — ป is in ปลา (fish), เป็น (is)" },
];

const C_MID_3 = [
  { char: "อ", name: "ออ อ่าง (ɔɔ àang)", phonetic: "ɔ (silent)", class: "mid", mnemonic: "Often silent as a vowel carrier — อ is in อาหาร (food), อร่อย (delicious)" },
  { char: "ฎ", name: "ฎอ ชฎา (dɔɔ chá-daa)", phonetic: "d", class: "mid", mnemonic: "Rare — same sound as ด. Mostly in royal/Sanskrit words like กฎ (rule)." },
  { char: "ฏ", name: "ฏอ ปฏัก (dtɔɔ bpà-dtàk)", phonetic: "dt", class: "mid", mnemonic: "Rare — same sound as ต. Mostly in Sanskrit loanwords like ปฏิทิน (calendar)." },
];

const ALL_MID_9 = [...C_MID_1, ...C_MID_2, ...C_MID_3];

const V_SIMPLE_1 = [
  { char: "◌ะ", name: "sara a (short)", phonetic: "a", class: "short", mnemonic: "Short 'a' — written after the consonant. กะ = 'ga'" },
  { char: "◌า", name: "sara aa (long)", phonetic: "aa", class: "long", mnemonic: "Long 'aa' — written after. กา = 'gaa' (crow), มา (come), ภาษา (language)" },
  { char: "◌ิ", name: "sara i (short)", phonetic: "i", class: "short", mnemonic: "Short 'i' — written above the consonant. กิน = 'gin' (eat)" },
  { char: "◌ี", name: "sara ii (long)", phonetic: "ii", class: "long", mnemonic: "Long 'ii' — written above with a hook. ดี = 'dii' (good), ที่ = 'tîi' (at)" },
];

const V_SIMPLE_2 = [
  { char: "◌ุ", name: "sara u (short)", phonetic: "u", class: "short", mnemonic: "Short 'u' — written below the consonant. Looks like a tiny dip" },
  { char: "◌ู", name: "sara uu (long)", phonetic: "uu", class: "long", mnemonic: "Long 'uu' — written below with a tail. รู้ = 'rúu' (know), ดู = 'duu' (watch)" },
  { char: "เ◌", name: "sara e (long)", phonetic: "ee", class: "long", mnemonic: "Written BEFORE the consonant! เ + ก = เก. In เป็น (is), เลี้ยว (turn)" },
  { char: "แ◌", name: "sara ae (long)", phonetic: "ae", class: "long", mnemonic: "Double เ — also written before. แ + ก = แก. In แพง (expensive), แม่ (mom)" },
];

const ALL_SIMPLE_VOWELS = [...V_SIMPLE_1, ...V_SIMPLE_2];

// Sound-out cards use the existing `class: "practice"` pattern from scriptData.js
const SOUND_OUT_W1 = [
  { char: "กา", name: "kaa — 'crow'", phonetic: "gaa", class: "practice", mnemonic: "ก(g) + า(aa) → 'gaa', a crow. Mid class + long vowel + no mark = mid tone." },
  { char: "ดี", name: "dii — 'good'", phonetic: "dii", class: "practice", mnemonic: "ด(d) + ี(ii) → 'dii', good/well. Mid class + long vowel = mid tone." },
  { char: "ปู", name: "puu — 'crab'", phonetic: "bpuu", class: "practice", mnemonic: "ป(bp) + ู(uu) → 'bpuu', crab. Mid class + long vowel = mid tone." },
  { char: "ตา", name: "dtaa — 'eye/grandpa'", phonetic: "dtaa", class: "practice", mnemonic: "ต(dt) + า(aa) → 'dtaa', eye or maternal grandfather. Mid tone." },
  { char: "บา", name: "baa — (in baat)", phonetic: "baa", class: "practice", mnemonic: "บ(b) + า(aa) → 'baa', the start of บาท (baht). Mid tone." },
  { char: "จา", name: "jaa — (in จาน)", phonetic: "jaa", class: "practice", mnemonic: "จ(j) + า(aa) → 'jaa', the start of จาน (plate). Mid tone." },
];

// ── Week 2: high & low class consonants ────────────────────────────────────
const C_LOW_1 = [
  { char: "ค", name: "คอ ควาย (kɔɔ kwaai)", phonetic: "kh", class: "low", mnemonic: "Has a hook at the top — ค is in คุณ (you), คิด (think)" },
  { char: "ม", name: "มอ ม้า (mɔɔ máa)", phonetic: "m", class: "low", mnemonic: "Looks like a curly m — ม is in มา (come), แม่ (mom)" },
  { char: "น", name: "นอ หนู (nɔɔ nǔu)", phonetic: "n", class: "low", mnemonic: "A simple loop — น is in นอน (sleep), น้ำ (water)" },
  { char: "ล", name: "ลอ ลิง (lɔɔ ling)", phonetic: "l", class: "low", mnemonic: "Has a tail going down — ล is in เลี้ยว (turn), ลด (discount)" },
];

const C_LOW_2 = [
  { char: "ร", name: "รอ เรือ (rɔɔ rʉa)", phonetic: "r", class: "low", mnemonic: "Looks like ล but with an extra loop — ร is in ร้อน (hot), รู้ (know)" },
  { char: "ท", name: "ทอ ทหาร (tɔɔ tá-hǎan)", phonetic: "th", class: "low", mnemonic: "A soldier standing at attention — ท is in เท่าไร (how much)" },
  { char: "พ", name: "พอ พาน (pɔɔ paan)", phonetic: "ph", class: "low", mnemonic: "A wide character — พ is in พูด (speak), แพง (expensive)" },
  { char: "ช", name: "ชอ ช้าง (chɔɔ cháang)", phonetic: "ch", class: "low", mnemonic: "An elephant shape — ช is in ชื่อ (name), ช้า (slow)" },
];

const C_LOW_3 = [
  { char: "ง", name: "งอ งู (ngɔɔ nguu)", phonetic: "ng", class: "low", mnemonic: "A snake shape — ง is in งาน (work), เงิน (money)" },
  { char: "ว", name: "วอ แหวน (wɔɔ wǎen)", phonetic: "w", class: "low", mnemonic: "A ring shape — ว is in วัน (day), ว่าง (free)" },
  { char: "ย", name: "ยอ ยักษ์ (yɔɔ yák)", phonetic: "y", class: "low", mnemonic: "A giant — ย is in ยาก (difficult), อยาก (want)" },
];

const C_HIGH_1 = [
  { char: "ส", name: "สอ เสือ (sɔ̌ɔ sʉ̌a)", phonetic: "s", class: "high", mnemonic: "A tall character with a flag — ส is in สวัสดี (hello), สาม (three)" },
  { char: "ข", name: "ขอ ไข่ (khɔ̌ɔ khài)", phonetic: "kh", class: "high", mnemonic: "Like ค but high class — ข is in ข้าว (rice), ขอ (request)" },
];

const C_HIGH_2 = [
  { char: "ห", name: "หอ หีบ (hɔ̌ɔ hìip)", phonetic: "h", class: "high", mnemonic: "Tall character — ห is in หิว (hungry), ห้า (five)" },
  { char: "ถ", name: "ถอ ถุง (thɔ̌ɔ thǔng)", phonetic: "th", class: "high", mnemonic: "High class th — ถ is in ถูก (cheap/correct), ถึง (arrive)" },
];

// ── Week 3: complex vowels & tone marks ────────────────────────────────────
const V_COMPLEX_1 = [
  { char: "เ◌ีย", name: "sara ia (long)", phonetic: "ia", class: "long", mnemonic: "Wraps around: เ before + ีย after. In เที่ยว (travel), เรียน (study)" },
  { char: "◌ัว", name: "sara ua (long)", phonetic: "ua", class: "long", mnemonic: "Above + after. In ตัว (body/self), หัว (head)" },
  { char: "เ◌ือ", name: "sara ʉa (long)", phonetic: "ʉa", class: "long", mnemonic: "เ before + ือ after. In เสื้อ (shirt), เมือง (city)" },
  { char: "ไ◌", name: "sara ai (mai malai)", phonetic: "ai", class: "long", mnemonic: "Written before consonant. In ไป (go), ไม่ (not), ไหม (question)" },
];

const V_COMPLEX_2 = [
  { char: "ใ◌", name: "sara ai (mai muan)", phonetic: "ai", class: "long", mnemonic: "Same sound as ไ but only 20 words use this form! In ใคร (who), ใกล้ (near), ใหม่ (new)" },
  { char: "◌ำ", name: "sara am", phonetic: "am", class: "long", mnemonic: "A combined vowel+consonant. In น้ำ (water), ทำ (do/make), ความ (meaning)" },
  { char: "โ◌", name: "sara o (long)", phonetic: "oo", class: "long", mnemonic: "Written before consonant. In โมง (o'clock), โทร (call), โรง (building)" },
  { char: "◌ือ", name: "sara ʉʉ (long)", phonetic: "ʉʉ", class: "long", mnemonic: "Written above + after. In ชื่อ (name), คือ (is/means), มือ (hand)" },
];

const TONE_MARKS = [
  { char: " ่", name: "mai ek (1st mark)", phonetic: "่", class: "mark", mnemonic: "Produces low tone on mid-class, falling on low-class. In ก่อน (before), น่า (should)" },
  { char: " ้", name: "mai tho (2nd mark)", phonetic: "้", class: "mark", mnemonic: "Produces falling tone on mid/high, high tone on low-class. In น้ำ (water), ได้ (can), ร้อน (hot)" },
  { char: " ๊", name: "mai tri (3rd mark)", phonetic: "๊", class: "mark", mnemonic: "Produces high tone. Only used on mid-class consonants. In โน๊ต (note — loanword)" },
  { char: " ๋", name: "mai jat-ta-waa (4th mark)", phonetic: "๋", class: "mark", mnemonic: "Produces rising tone. Very rare! In ก๋วยเตี๋ยว (noodles)" },
];

// ── Week 4: real-word decode cards (using only chars from Weeks 1–3) ───────
const READING_W4_DAY22 = [
  { char: "กิน", name: "gin — 'eat'", phonetic: "gin", class: "practice", mnemonic: "ก(g) + ิ(i) + น(n) → 'gin', to eat. Live syllable, mid class = mid tone." },
  { char: "ดู", name: "duu — 'watch'", phonetic: "duu", class: "practice", mnemonic: "ด(d) + ู(uu) → 'duu', to watch/look at. Mid tone." },
  { char: "มา", name: "maa — 'come'", phonetic: "maa", class: "practice", mnemonic: "ม(m) + า(aa) → 'maa', to come. Low class + live = mid tone." },
  { char: "ไป", name: "bpai — 'go'", phonetic: "bpai", class: "practice", mnemonic: "ไ(ai) + ป(bp) → 'bpai', to go. Mid tone." },
];

const READING_W4_DAY23 = [
  { char: "บ้าน", name: "bâan — 'house'", phonetic: "bâan", class: "practice", mnemonic: "บ(b) + า(aa) + น(n) + ้ (mai tho) → 'bâan', house. Mid + mai tho = falling tone." },
  { char: "ดี", name: "dii — 'good'", phonetic: "dii", class: "practice", mnemonic: "ด(d) + ี(ii) → 'dii', good. Mid tone." },
  { char: "ปู", name: "bpuu — 'crab'", phonetic: "bpuu", class: "practice", mnemonic: "ป(bp) + ู(uu) → 'bpuu', crab. Mid tone." },
  { char: "นาน", name: "naan — 'a long time'", phonetic: "naan", class: "practice", mnemonic: "น(n) + า(aa) + น(n) → 'naan'. Low class + live = mid tone." },
];

const READING_W4_DAY24 = [
  { char: "ชอบ", name: "châwp — 'like'", phonetic: "châwp", class: "practice", mnemonic: "ช(ch) + อ(aw) + บ(p) → 'châwp', to like. Low class + dead long = falling tone." },
  { char: "รัก", name: "rák — 'love'", phonetic: "rák", class: "practice", mnemonic: "ร(r) + ั(a) + ก(k) → 'rák', to love. Low class + dead short = high tone." },
  { char: "คิด", name: "kít — 'think'", phonetic: "kít", class: "practice", mnemonic: "ค(kh) + ิ(i) + ด(t) → 'kít', to think. Low class + dead short = high tone." },
  { char: "พูด", name: "phûut — 'speak'", phonetic: "phûut", class: "practice", mnemonic: "พ(ph) + ู(uu) + ด(t) → 'phûut', to speak. Low class + dead long = falling tone." },
];

const READING_W4_DAY25 = [
  { char: "อา-หาร", name: "aa-hǎan — 'food'", phonetic: "aa-hǎan", class: "practice", mnemonic: "อา(aa) + หา(hǎa) + ร(n-final) → 'aa-hǎan', food. ห makes the next consonant follow high-class rules." },
  { char: "ขอบ-คุณ", name: "khàwp-khun — 'thank you'", phonetic: "khàwp-khun", class: "practice", mnemonic: "ข(kh) + อบ(àwp) + ค(kh) + ุณ(un) → 'khàwp-khun', thank you. High + dead = low tone." },
  { char: "สวัส-ดี", name: "sà-wàt-dii — 'hello'", phonetic: "sà-wàt-dii", class: "practice", mnemonic: "ส(s) + วัส(wàt) + ดี(dii) → the universal Thai hello." },
  { char: "น้ำ", name: "náam — 'water'", phonetic: "náam", class: "practice", mnemonic: "น(n) + ◌ำ(am) + ้ (mai tho) → 'náam', water. Low + mai tho = high tone." },
];

const READING_W4_DAY26 = [
  { char: "อร่อย", name: "à-ròi — 'delicious'", phonetic: "à-ròi", class: "practice", mnemonic: "อ(silent/à) + ร่(r + mai ek = ròi) + อย(oi) → 'à-ròi', delicious!" },
  { char: "เผ็ด", name: "phèt — 'spicy'", phonetic: "phèt", class: "practice", mnemonic: "เ(e) + ผ(ph) + ็(shortener) + ด(t) → 'phèt', spicy! High + dead = low tone." },
  { char: "ถูก", name: "thùuk — 'cheap/correct'", phonetic: "thùuk", class: "practice", mnemonic: "ถ(th) + ู(uu) + ก(k) → 'thùuk'. High class + dead = low tone." },
  { char: "เรียน", name: "rian — 'study'", phonetic: "rian", class: "practice", mnemonic: "เ-ีย(ia vowel wraps ร) + น(n) → 'rian', study/learn." },
];

// All chars studied through Week 3 (used for Week 4 quizzes & review)
const ALL_CHARS_THROUGH_WEEK3 = [
  ...ALL_MID_9,
  ...ALL_SIMPLE_VOWELS,
  ...C_LOW_1, ...C_LOW_2, ...C_LOW_3,
  ...C_HIGH_1, ...C_HIGH_2,
  ...V_COMPLEX_1, ...V_COMPLEX_2,
];

// ── The 30 days ─────────────────────────────────────────────────────────────
export const SCRIPT_PLAN = [
  // ── WEEK 1: Mid-class + simple vowels + first sound-out ────────────────────
  {
    day: 1, week: 1, focus: "mid-class",
    title: "Mid-class consonants 1: ก จ ด",
    intro: "Welcome! Thai has 9 mid-class consonants. They're the simplest because they only need one tone rule: mid class + live + no mark = mid tone. This week you'll meet all 9 mid-class chars + 8 simple vowels + sound out your first words.",
    characters: C_MID_1,
    sections: ["intro", "drill", "cards", "stroke", "quiz"],
  },
  {
    day: 2, week: 1, focus: "mid-class",
    title: "Mid-class consonants 2: ต บ ป",
    intro: "Three more mid-class consonants. ต and ป are easy to confuse — ต has a smaller foot, ป has a flag.",
    characters: C_MID_2,
    sections: ["intro", "drill", "cards", "stroke", "quiz"],
  },
  {
    day: 3, week: 1, focus: "mid-class",
    title: "Mid-class consonants 3: อ ฎ ฏ",
    intro: "อ is special — it's silent and acts as a vowel carrier (every word that starts with a vowel sound uses อ). ฎ and ฏ are rare versions of ด and ต found mostly in royal/Sanskrit words.",
    characters: C_MID_3,
    sections: ["intro", "drill", "cards", "stroke", "quiz"],
  },
  {
    day: 4, week: 1, focus: "mid-class",
    title: "Review: All 9 mid-class consonants",
    intro: "You now know all 9 mid-class consonants. Time to mix them up. Try the matching game and see how fast you can recognize them.",
    characters: ALL_MID_9,
    sections: ["intro", "cards", "matching", "quiz"],
  },
  {
    day: 5, week: 1, focus: "vowels",
    title: "Simple vowels 1: ◌ะ ◌า ◌ิ ◌ี",
    intro: "Thai vowels come in short/long pairs. The placeholder ◌ shows where the consonant goes. Notice that ◌ิ and ◌ี go ABOVE the consonant — that's why they look like little hats.",
    characters: V_SIMPLE_1,
    sections: ["intro", "drill", "cards", "quiz"],
  },
  {
    day: 6, week: 1, focus: "vowels",
    title: "Simple vowels 2: ◌ุ ◌ู เ◌ แ◌",
    intro: "Two below-vowels and two before-vowels. Watch out — เ◌ and แ◌ are written BEFORE the consonant in writing, even though you say the consonant first!",
    characters: V_SIMPLE_2,
    sections: ["intro", "drill", "cards", "quiz"],
  },
  {
    day: 7, week: 1, focus: "reading",
    title: "Sound out: กา ดี ปู ตา บา จา",
    intro: "Now combine what you've learned! Each card shows a real syllable: a mid-class consonant + a long vowel = a mid-tone word. Try to read it before flipping.",
    characters: SOUND_OUT_W1,
    sections: ["intro", "cards", "quiz"],
    reviewChars: [...ALL_MID_9, ...ALL_SIMPLE_VOWELS],
  },

  // ── WEEK 2: high & low class consonants ────────────────────────────────────
  {
    day: 8, week: 2, focus: "low-class",
    title: "Low-class consonants 1: ค ม น ล",
    intro: "Welcome to low class! Low class is the biggest group (24 consonants) and most common. Low class + no mark = mid tone (just like mid class for now).",
    characters: C_LOW_1,
    sections: ["intro", "drill", "cards", "stroke", "quiz"],
  },
  {
    day: 9, week: 2, focus: "low-class",
    title: "Low-class consonants 2: ร ท พ ช",
    intro: "Four more low-class consonants. ท and พ might look similar — ท has a hook on top, พ has a closed loop.",
    characters: C_LOW_2,
    sections: ["intro", "drill", "cards", "stroke", "quiz"],
  },
  {
    day: 10, week: 2, focus: "low-class",
    title: "Low-class consonants 3: ง ว ย",
    intro: "Three more sonorant low-class consonants. ง = 'ng' sound (Thai puts it at the start of words like งาน — work).",
    characters: C_LOW_3,
    sections: ["intro", "drill", "cards", "stroke", "quiz"],
  },
  {
    day: 11, week: 2, focus: "high-class",
    title: "High-class consonants 1: ส ข",
    intro: "High class only has 11 consonants. They behave differently: high class + no mark = RISING tone (not mid). The two most common are ส (sǎ) and ข (khǎ) — note how the names rise.",
    characters: C_HIGH_1,
    sections: ["intro", "drill", "cards", "stroke", "quiz"],
  },
  {
    day: 12, week: 2, focus: "high-class",
    title: "High-class consonants 2: ห ถ",
    intro: "Two more high class. ห is special — when it appears before a low-class consonant, it makes the next consonant follow high-class rules. That's why หิว (hungry) starts with rising tone.",
    characters: C_HIGH_2,
    sections: ["intro", "drill", "cards", "stroke", "quiz"],
  },
  {
    day: 13, week: 2, focus: "low-class",
    title: "Class review & mixed practice",
    intro: "You now know 9 mid + 11 low + 4 high consonants. The class determines the tone, so getting fast at recognizing class is key. Mix and match in today's drills.",
    characters: [...C_LOW_1, ...C_LOW_2, ...C_LOW_3, ...C_HIGH_1, ...C_HIGH_2],
    sections: ["intro", "cards", "matching", "quiz"],
  },
  {
    day: 14, week: 2, focus: "review",
    title: "Week 2 cumulative review",
    intro: "All 24 consonants you've learned so far. Take it slow — these characters are the foundation for everything else.",
    characters: [...ALL_MID_9, ...C_LOW_1, ...C_LOW_2, ...C_LOW_3, ...C_HIGH_1, ...C_HIGH_2],
    sections: ["intro", "matching", "quiz"],
  },

  // ── WEEK 3: complex vowels + tone marks + tone rules ───────────────────────
  {
    day: 15, week: 3, focus: "vowels",
    title: "Complex vowels 1: เ◌ีย ◌ัว เ◌ือ ไ◌",
    intro: "These vowels combine multiple parts — some wrap around the consonant. ไ◌ is the most common 'ai' vowel and you'll see it everywhere.",
    characters: V_COMPLEX_1,
    sections: ["intro", "drill", "cards", "quiz"],
  },
  {
    day: 16, week: 3, focus: "vowels",
    title: "Complex vowels 2: ใ◌ ◌ำ โ◌ ◌ือ",
    intro: "ใ◌ is special — same sound as ไ◌ but only 20 specific words use it. ◌ำ is a combined vowel that always carries an 'm' sound at the end.",
    characters: V_COMPLEX_2,
    sections: ["intro", "drill", "cards", "quiz"],
  },
  {
    day: 17, week: 3, focus: "tones",
    title: "The 4 tone marks",
    intro: "Thai has 4 tone marks. The mark + consonant class together determine the tone. The rules are tricky, but for now just learn what each mark looks like — you'll drill the rules in the next 4 days.",
    characters: TONE_MARKS,
    sections: ["intro", "cards", "quiz"],
  },
  {
    day: 18, week: 3, focus: "rules",
    title: "Dead vs live syllables",
    intro: "Before tone rules can click, you need to know which syllables are 'dead' and which are 'live'. A LIVE syllable ends in a long vowel or a sonorant (ม น ง ย ว ล ร). A DEAD syllable ends in a stop (ก ด บ) or a short vowel with no final. This affects the tone!",
    characters: [],
    sections: ["intro", "tone-rule"],
    toneRuleMode: "dead-live",
  },
  {
    day: 19, week: 3, focus: "rules",
    title: "Tone rules: mid class",
    intro: "Mid class is the simplest. Live + no mark = mid. + mai ek (◌่) = low. + mai tho (◌้) = falling. Dead syllable = low. Drill until it's automatic.",
    characters: [],
    sections: ["intro", "tone-rule"],
    toneRuleMode: "mid-class",
  },
  {
    day: 20, week: 3, focus: "rules",
    title: "Tone rules: high & low class",
    intro: "High class: live + no mark = rising. + mai ek = low. + mai tho = falling. Dead = low.\nLow class: live + no mark = mid. + mai ek = falling. + mai tho = high. Dead short = high. Dead long = falling.",
    characters: [],
    sections: ["intro", "tone-rule"],
    toneRuleMode: "all-class",
  },
  {
    day: 21, week: 3, focus: "rules",
    title: "Cumulative tone drill",
    intro: "Mix all 3 classes and all tone marks. This is the hardest day — score 70%+ to lock it in. After this, you're ready for real reading!",
    characters: [],
    sections: ["intro", "tone-rule"],
    toneRuleMode: "cumulative",
  },

  // ── WEEK 4: real reading ────────────────────────────────────────────────────
  {
    day: 22, week: 4, focus: "reading",
    title: "Decode: 4 essential verbs",
    intro: "Time for real words! These are the 4 most important Thai verbs you already say. Sound each one out using everything you've learned.",
    characters: READING_W4_DAY22,
    sections: ["intro", "cards", "quiz"],
    reviewChars: ALL_CHARS_THROUGH_WEEK3,
  },
  {
    day: 23, week: 4, focus: "reading",
    title: "Decode: live syllables",
    intro: "Four live syllables of varying tone. Try to predict the tone before flipping each card.",
    characters: READING_W4_DAY23,
    sections: ["intro", "cards", "quiz"],
    reviewChars: ALL_CHARS_THROUGH_WEEK3,
  },
  {
    day: 24, week: 4, focus: "reading",
    title: "Decode: dead syllables",
    intro: "Four dead syllables. Notice the pattern — short vowel + low class = high tone, long vowel + low class = falling tone.",
    characters: READING_W4_DAY24,
    sections: ["intro", "cards", "quiz"],
    reviewChars: ALL_CHARS_THROUGH_WEEK3,
  },
  {
    day: 25, week: 4, focus: "reading",
    title: "Decode: 2-syllable words",
    intro: "Multi-syllable words. Try to break each one into chunks before reading the breakdown.",
    characters: READING_W4_DAY25,
    sections: ["intro", "cards", "quiz"],
    reviewChars: ALL_CHARS_THROUGH_WEEK3,
  },
  {
    day: 26, week: 4, focus: "reading",
    title: "Decode: tricky words",
    intro: "These words use tone marks and special vowel combinations. The hardest decode day before passages.",
    characters: READING_W4_DAY26,
    sections: ["intro", "cards", "quiz"],
    reviewChars: ALL_CHARS_THROUGH_WEEK3,
  },
  {
    day: 27, week: 4, focus: "reading",
    title: "Read your first passage",
    intro: "Real Thai text! Tap any word to see its meaning. The full English translation is hidden — try to read first, then check.",
    characters: [],
    sections: ["intro", "reading", "quiz"],
    passageIds: [{ source: "passages", id: "r1" }],
    readingLevel: 1,
    reviewChars: ALL_CHARS_THROUGH_WEEK3,
  },
  {
    day: 28, week: 4, focus: "reading",
    title: "Read a longer passage",
    intro: "A longer passage. Take your time and tap unfamiliar words.",
    characters: [],
    sections: ["intro", "reading", "quiz"],
    passageIds: [{ source: "passages", id: "r2" }, { source: "passages", id: "r3" }],
    readingLevel: 1,
    reviewChars: ALL_CHARS_THROUGH_WEEK3,
  },
  {
    day: 29, week: 4, focus: "reading",
    title: "Read with less help",
    intro: "Time to wean off the phonetics. Level 2 hides full transliteration unless you tap.",
    characters: [],
    sections: ["intro", "reading", "quiz"],
    passageIds: [{ source: "passages", id: "r4" }, { source: "passages", id: "r5" }],
    readingLevel: 2,
    reviewChars: ALL_CHARS_THROUGH_WEEK3,
  },
  {
    day: 30, week: 4, focus: "review",
    title: "Free read challenge",
    intro: "Final day! Read these passages on your own. Then take the cumulative quiz over everything you learned this month. You did it! 🎉",
    characters: [],
    sections: ["intro", "reading", "quiz"],
    passageIds: [{ source: "passages", id: "r6" }],
    readingLevel: 2,
    reviewChars: ALL_CHARS_THROUGH_WEEK3,
  },
];

// Helpful exports
export const TOTAL_DAYS = SCRIPT_PLAN.length;

export const WEEK_INFO = [
  { week: 1, label: "Week 1 — Mid class & vowels", icon: "🟢" },
  { week: 2, label: "Week 2 — High & low class", icon: "🟡" },
  { week: 3, label: "Week 3 — Vowels & tone rules", icon: "🟠" },
  { week: 4, label: "Week 4 — Real reading", icon: "🔴" },
];

export function getDay(dayNum) {
  return SCRIPT_PLAN.find(d => d.day === dayNum) || null;
}

// All characters used in the plan (for cumulative review etc.)
export const ALL_PLAN_CHARS = ALL_CHARS_THROUGH_WEEK3;
