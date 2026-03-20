// Reading passages tied to specific lessons, using vocab from that unit
// Each passage has segments (word-by-word) for interactive reading

export const UNIT_READINGS = {
  "u1-l3": [
    {
      id: "ur1", title: "Arriving in Bangkok", level: 1,
      segments: [
        { thai: "สวัสดี", phonetics: "sà-wàt-dii", english: "hello" },
        { thai: "ค่ะ", phonetics: "khâ", english: "(polite)" },
        { thai: "ฉัน", phonetics: "chǎn", english: "I" },
        { thai: "ไม่", phonetics: "mâi", english: "not" },
        { thai: "รู้", phonetics: "rúu", english: "know" },
        { thai: "ภาษาไทย", phonetics: "paa-sǎa tai", english: "Thai language" },
        { thai: "ช่วย", phonetics: "chûay", english: "help" },
        { thai: "ได้ไหม", phonetics: "dâi mǎi", english: "can you?" },
      ],
      fullEnglish: "Hello! I don't know Thai. Can you help me?"
    },
  ],
  "u2-l3": [
    {
      id: "ur2", title: "A Simple Chat", level: 1,
      segments: [
        { thai: "คุณ", phonetics: "khun", english: "you" },
        { thai: "ชอบ", phonetics: "châwp", english: "like" },
        { thai: "อาหารไทย", phonetics: "aa-hǎan tai", english: "Thai food" },
        { thai: "ไหม", phonetics: "mǎi", english: "?" },
        { thai: "ชอบ", phonetics: "châwp", english: "like" },
        { thai: "แต่", phonetics: "dtàe", english: "but" },
        { thai: "ไม่", phonetics: "mâi", english: "not" },
        { thai: "ชอบ", phonetics: "châwp", english: "like" },
        { thai: "เผ็ด", phonetics: "phèt", english: "spicy" },
      ],
      fullEnglish: "Do you like Thai food? I like it, but I don't like spicy."
    },
  ],
  "u3-l3": [
    {
      id: "ur3", title: "At the Night Market", level: 1,
      segments: [
        { thai: "อัน", phonetics: "an", english: "this" },
        { thai: "นี้", phonetics: "níi", english: "this" },
        { thai: "เท่าไร", phonetics: "tâo-rài", english: "how much" },
        { thai: "ค่ะ", phonetics: "khâ", english: "(polite)" },
        { thai: "สอง", phonetics: "sɔ̌ɔng", english: "two" },
        { thai: "ร้อย", phonetics: "rɔ́ɔi", english: "hundred" },
        { thai: "บาท", phonetics: "bàat", english: "baht" },
        { thai: "แพง", phonetics: "phaeng", english: "expensive" },
        { thai: "ลด", phonetics: "lót", english: "discount" },
        { thai: "ได้ไหม", phonetics: "dâi mǎi", english: "can you?" },
      ],
      fullEnglish: "How much is this? 200 baht. That's expensive — can you give a discount?"
    },
  ],
  "u4-l2": [
    {
      id: "ur4", title: "Ordering Lunch", level: 2,
      segments: [
        { thai: "ขอ", phonetics: "khǎw", english: "request" },
        { thai: "ข้าวผัด", phonetics: "khâao phàt", english: "fried rice" },
        { thai: "หนึ่ง", phonetics: "nèung", english: "one" },
        { thai: "จาน", phonetics: "jaan", english: "plate" },
        { thai: "ไม่", phonetics: "mâi", english: "not" },
        { thai: "ใส่", phonetics: "sài", english: "add" },
        { thai: "เผ็ด", phonetics: "phèt", english: "spicy" },
        { thai: "ค่ะ", phonetics: "khâ", english: "(polite)" },
        { thai: "อร่อย", phonetics: "a-ròi", english: "delicious" },
        { thai: "มาก", phonetics: "mâak", english: "very" },
      ],
      fullEnglish: "One fried rice, not spicy please. Very delicious!"
    },
  ],
  "u5-l3": [
    {
      id: "ur5", title: "Catching Up with a Friend", level: 2,
      segments: [
        { thai: "กินข้าว", phonetics: "gin khâao", english: "eaten" },
        { thai: "หรือยัง", phonetics: "rʉ̌ʉ yang", english: "or yet?" },
        { thai: "ยัง", phonetics: "yang", english: "not yet" },
        { thai: "ค่ะ", phonetics: "khâ", english: "(polite)" },
        { thai: "หิว", phonetics: "hǐu", english: "hungry" },
        { thai: "มาก", phonetics: "mâak", english: "very" },
        { thai: "ไป", phonetics: "bpai", english: "go" },
        { thai: "กิน", phonetics: "gin", english: "eat" },
        { thai: "ด้วยกัน", phonetics: "dûay-gan", english: "together" },
        { thai: "ไหม", phonetics: "mǎi", english: "?" },
      ],
      fullEnglish: "Have you eaten yet? Not yet — I'm very hungry. Shall we go eat together?"
    },
  ],
  "u6-l2": [
    {
      id: "ur6", title: "Getting to the Market", level: 2,
      segments: [
        { thai: "ตลาด", phonetics: "dtà-làat", english: "market" },
        { thai: "อยู่", phonetics: "yùu", english: "is at" },
        { thai: "ที่ไหน", phonetics: "tîi-nǎi", english: "where" },
        { thai: "ค่ะ", phonetics: "khâ", english: "(polite)" },
        { thai: "ตรงไป", phonetics: "dtrong bpai", english: "go straight" },
        { thai: "แล้ว", phonetics: "láew", english: "then" },
        { thai: "เลี้ยวซ้าย", phonetics: "líao sáai", english: "turn left" },
        { thai: "ไม่", phonetics: "mâi", english: "not" },
        { thai: "ไกล", phonetics: "glai", english: "far" },
      ],
      fullEnglish: "Where is the market? Go straight, then turn left. It's not far."
    },
  ],
  "u7-l5": [
    {
      id: "ur7", title: "Weekend Text", level: 3,
      segments: [
        { thai: "วันเสาร์", phonetics: "wan-sǎo", english: "Saturday" },
        { thai: "ว่าง", phonetics: "wâang", english: "free" },
        { thai: "ไหม", phonetics: "mǎi", english: "?" },
        { thai: "อยาก", phonetics: "yàak", english: "want to" },
        { thai: "ไป", phonetics: "bpai", english: "go" },
        { thai: "ดู", phonetics: "duu", english: "watch" },
        { thai: "หนัง", phonetics: "nǎng", english: "movie" },
        { thai: "กับ", phonetics: "gàp", english: "with" },
        { thai: "เพื่อน", phonetics: "pêuan", english: "friend" },
      ],
      fullEnglish: "Are you free Saturday? I want to go see a movie with friends."
    },
  ],
};
