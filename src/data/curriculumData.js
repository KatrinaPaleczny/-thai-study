import { SCRIPT_LESSONS } from "./scriptData";

export const CURRICULUM = [
  {
    id: "u1", title: "Sound & Survival", icon: "🆘", level: "A1",
    description: "The essentials you need from day 1",
    lessons: [
      {
        id: "u1-l1", title: "Greetings & Politeness",
        grammar: "Add ครับ (male) or ค่ะ (female) at the end of any sentence to be polite. นะ softens a statement.",
        vocabIds: [144, 143, 141, 142, 13, 140, 26],
        grammarIds: ["g7","g2","g3"], scenarioIdx: 0, sentenceIds: ["s1","s5","s7"]
      },
      {
        id: "u1-l2", title: "Who Are You?",
        grammar: "Thai uses Subject + Verb + Object order, same as English. ชื่อ = name, มาจาก = come from.",
        vocabIds: [14, 15, 16, 17, 18, 22, 24, 25, 23],
        grammarIds: ["g1","g6"], sentenceIds: ["s3","s6"]
      },
      {
        id: "u1-l3", title: "Survival Phrases",
        grammar: "ไม่ goes before any verb or adjective to negate it. ไม่รู้ = don't know, ไม่ได้ = can't.",
        vocabIds: [127, 128, 129, 51, 130, 44, 11],
        grammarIds: ["g5","g4"], sentenceIds: ["s2","s4","s8"]
      }
    ]
  },
  {
    id: "u2", title: "Building Blocks", icon: "🧱", level: "A1",
    description: "Core grammar patterns that unlock hundreds of sentences",
    lessons: [
      {
        id: "u2-l1", title: "Negation & Ability",
        grammar: "ไม่ + verb = negation. ได้ = can, ไม่ได้ = can't. ได้ไหม at the end = 'can you...?'",
        vocabIds: [27, 28, 46, 47, 45, 150, 12],
        grammarIds: ["g5","g4"], sentenceIds: ["s2","s4"]
      },
      {
        id: "u2-l2", title: "Asking Questions",
        grammar: "Add ไหม at the end for yes/no questions. Use อะไร (what), ที่ไหน (where), ใคร (who), เมื่อไร (when), ยังไง (how) for open questions.",
        vocabIds: [17, 73, 137, 138, 77, 45, 346],
        grammarIds: ["g2","g6"], sentenceIds: ["s1","s6"]
      },
      {
        id: "u2-l3", title: "Connecting Ideas",
        grammar: "กับ = and/with, หรือ = or, แล้วก็ = and then, แต่ = but. These go between clauses just like English.",
        vocabIds: [124, 83, 135, 8, 9, 136, 122, 123, 347],
        grammarIds: ["g9","g16"]
      }
    ]
  },
  {
    id: "u3", title: "Numbers & Time", icon: "🔢", level: "A2",
    description: "Count, tell time, and handle money",
    lessons: [
      {
        id: "u3-l1", title: "Numbers 1–100",
        grammar: "Thai numbers use the same place system: สิบ = 10, ยี่สิบ = 20, ร้อย = 100. Exception: 11 uses เอ็ด not หนึ่ง.",
        vocabIds: [53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 68, 69]
      },
      {
        id: "u3-l2", title: "Telling Time ⭐ From your tutor!",
        grammar: "โมง = o'clock. กี่โมง = what time? ครึ่ง = half past. Use ถึง for ranges (9 โมง ถึง 5 โมง). เพิ่ง = just now, เดี๋ยว = in a moment.",
        vocabIds: [7, 131, 132, 133, 48, 134, 339, 340, 341, 342, 343, 344, 345, 348, 349, 350, 351]
      },
      {
        id: "u3-l3", title: "Money & Shopping",
        grammar: "เท่าไร = how much? ลดได้ไหม = can you discount? แพง = expensive. Numbers + บาท = price in baht.",
        vocabIds: [107, 108, 109, 110, 106, 103],
        scenarioIdx: 9
      }
    ]
  },
  {
    id: "u4", title: "Food & Daily Life", icon: "🍜", level: "A2",
    description: "Eat, order, and talk about your day",
    lessons: [
      {
        id: "u4-l1", title: "Food Essentials",
        grammar: "Adjectives come AFTER the noun in Thai. อาหารอร่อย = food delicious. เผ็ดมาก = very spicy.",
        vocabIds: [146, 96, 97, 98, 148, 149, 10, 147],
        scenarioIdx: 2
      },
      {
        id: "u4-l2", title: "Ordering Food",
        grammar: "ขอ + item = 'can I have...' สั่ง = to order. ใส่ = add, ไม่ใส่ = without. จาน is the classifier for plates/dishes.",
        vocabIds: [100, 99, 101, 102, 93, 92, 84, 85],
        scenarioIdx: 7
      },
      {
        id: "u4-l3", title: "Daily Routines",
        grammar: "Thai verbs never conjugate — no past/present/future forms. Add แล้ว for 'already did', กำลัง for 'doing now', จะ for 'will do'.",
        vocabIds: [158, 154, 159, 153, 155, 160, 161, 162, 163, 164],
        grammarIds: ["g8","g11","g12"], scenarioIdx: 11, sentenceIds: ["s9","s10"]
      }
    ]
  },
  {
    id: "u5", title: "People & Feelings", icon: "💕", level: "A2",
    description: "Talk about family, friends, and emotions",
    lessons: [
      {
        id: "u5-l1", title: "Family & Friends",
        grammar: "พี่ = older sibling/person, น้อง = younger. These are also used for non-relatives to show age respect.",
        vocabIds: [166, 167, 168, 169, 111, 112, 113, 114],
        grammarIds: ["g9"], scenarioIdx: 4, sentenceIds: ["s11"]
      },
      {
        id: "u5-l2", title: "Emotions & Feelings",
        grammar: "Add ไหม to any emotion word to ask 'are you...?' เหนื่อยไหม = tired? สนุกไหม = having fun? ดีใจ = happy, เบื่อ = bored.",
        vocabIds: [283, 284, 282, 279, 280, 281, 6],
        grammarIds: ["g13"], scenarioIdx: 5
      },
      {
        id: "u5-l3", title: "Smalltalk & Checking In",
        grammar: "หรือยัง = 'or yet?' is a super common Thai pattern. กินข้าวหรือยัง = have you eaten yet? ตื่นแล้วหรือยัง = are you up yet?",
        vocabIds: [275, 276, 277, 306, 307, 308, 309, 310, 311, 312],
        grammarIds: ["g15"], scenarioIdx: 6
      }
    ]
  },
  {
    id: "u6", title: "Out & About", icon: "🗺️", level: "B1",
    description: "Navigate, describe, and explore",
    lessons: [
      {
        id: "u6-l1", title: "Directions",
        grammar: "เลี้ยว = turn, ตรงไป = go straight. ไกล = far, ใกล้ = near. These two sound almost identical — tones matter!",
        vocabIds: [70, 71, 72, 73, 74, 75, 76, 82],
        grammarIds: ["g6"], scenarioIdx: 1
      },
      {
        id: "u6-l2", title: "Getting Around",
        grammar: "ถึงแล้ว = already arrived. แล้ว after a verb means 'already completed'. รถไฟ = train, ขับรถ = drive.",
        vocabIds: [145, 80, 79, 82, 81, 78, 77],
        grammarIds: ["g8","g10"], scenarioIdx: 8, sentenceIds: ["s12"]
      },
      {
        id: "u6-l3", title: "Colours & Describing",
        grammar: "สี + colour name. Adjectives always follow the noun: เสื้อสีแดง = red shirt. Add มาก = very, นิดหน่อย = a little.",
        vocabIds: [104, 105, 125, 126, 103]
      }
    ]
  },
  {
    id: "u7", title: "Social Thai", icon: "🗣️", level: "B1",
    description: "Relationship talk, slang, and real-life Thai",
    lessons: [
      {
        id: "u7-l1", title: "Relationship Vocab",
        grammar: "อ้อน = to act cute/clingy — very common in Thai couples. ใจร้าย is playful teasing, not genuinely mean.",
        vocabIds: [282, 287, 317, 318, 319, 321, 322, 323, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366],
        grammarIds: ["g14"], sentenceIds: ["s17"]
      },
      {
        id: "u7-l2", title: "Gen Z & Texting Slang",
        grammar: "Thai borrows English words constantly: เรดแฟล็ก, เช็คไวบ์, กรีนแฟล็ก. โดนเท is pure Thai slang for being ghosted.",
        vocabIds: [329, 330, 331, 332, 333, 334, 335, 336, 337, 338]
      },
      {
        id: "u7-l3", title: "Entertainment & Hobbies",
        grammar: "เล่น is versatile: เล่นเกม = play games, เล่นเวท = lift weights, เล่นโซเชียล = use social media.",
        vocabIds: [115, 116, 117, 118, 119, 120, 121, 151],
        scenarioIdx: 10
      }
    ]
  },
  {
    id: "u8", title: "Your Thai", icon: "✨",
    description: "Words from your tutor sessions and custom vocab — always growing",
    lessons: [
      {
        id: "u8-l1", title: "Tutor Session — Mar 10: Time",
        grammar: "Today's focus: telling time, schedules, and time-related words. โมง = o'clock, ครึ่ง = half, ถึง = until/to.",
        vocabIds: [339, 340, 341, 342, 343, 344, 348, 349, 350, 351]
      }
    ]
  }
];

// Interleave script lessons between vocab units for the full learning path
// Script 1 after U1, Script 2 after U2, ... Script 6 after U6, then U7, U8
export const FULL_PATH = CURRICULUM.flatMap((unit, i) =>
  i < SCRIPT_LESSONS.length ? [unit, SCRIPT_LESSONS[i]] : [unit]
);
