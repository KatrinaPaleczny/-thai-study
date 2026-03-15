// Thai script lessons — interleaved into My Path between vocab units
// Each unit can have multiple sub-lessons for manageable learning chunks

export const SCRIPT_LESSONS = [
  {
    id: "script-u1", title: "Thai Script 1: Common Consonants", icon: "กอ", type: "script",
    description: "The 10 consonants you'll see everywhere",
    lessons: [
      {
        id: "script-1a", type: "script", title: "Consonants 1",
        intro: "Thai has 44 consonants, but these 10 appear in almost every word you know. Each consonant belongs to a class (mid, high, or low) which affects the tone. Don't worry about tone rules yet — just learn the shapes and sounds.",
        characters: [
          { char: "ก", name: "กอ ไก่ (gor gài)", phonetic: "g", class: "mid", mnemonic: "Looks like a little table — ก is in กิน (eat), กับ (with)" },
          { char: "ค", name: "คอ ควาย (kɔɔ kwaai)", phonetic: "kh", class: "low", mnemonic: "Has a hook at the top — ค is in คุณ (you), คิด (think)" },
          { char: "ม", name: "มอ ม้า (mɔɔ máa)", phonetic: "m", class: "low", mnemonic: "Looks like a curly m — ม is in มา (come), แม่ (mom)" },
          { char: "น", name: "นอ หนู (nɔɔ nǔu)", phonetic: "n", class: "low", mnemonic: "A simple loop — น is in นอน (sleep), น้ำ (water)" },
        ]
      },
      {
        id: "script-1b", type: "script", title: "Consonants 2",
        characters: [
          { char: "ล", name: "ลอ ลิง (lɔɔ ling)", phonetic: "l", class: "low", mnemonic: "Has a tail going down — ล is in เลี้ยว (turn), ลด (discount)" },
          { char: "ร", name: "รอ เรือ (rɔɔ rʉa)", phonetic: "r", class: "low", mnemonic: "Looks like ล but with an extra loop — ร is in ร้อน (hot), รู้ (know)" },
          { char: "ส", name: "สอ เสือ (sɔ̌ɔ sʉ̌a)", phonetic: "s", class: "high", mnemonic: "A tall character with a flag — ส is in สวัสดี (hello), สาม (three)" },
        ]
      },
      {
        id: "script-1c", type: "script", title: "Consonants 3",
        characters: [
          { char: "ท", name: "ทอ ทหาร (tɔɔ tá-hǎan)", phonetic: "th", class: "low", mnemonic: "A soldier standing at attention — ท is in เท่าไร (how much)" },
          { char: "พ", name: "พอ พาน (pɔɔ paan)", phonetic: "ph", class: "low", mnemonic: "A wide character — พ is in พูด (speak), แพง (expensive)" },
          { char: "ด", name: "ดอ เด็ก (dɔɔ dèk)", phonetic: "d", class: "mid", mnemonic: "Small and round — ด is in ดี (good), ได้ (can)" },
        ]
      }
    ]
  },
  {
    id: "script-u2", title: "Thai Script 2: Vowels", icon: "สระ", type: "script",
    description: "Short & long vowel pairs — the building blocks of every syllable",
    lessons: [
      {
        id: "script-2a", type: "script", title: "Vowels 1",
        intro: "Thai vowels come in short/long pairs. Long vowels are held longer and affect the tone. Vowels can appear before, after, above, or below the consonant — shown here with ◌ as a placeholder for the consonant.",
        characters: [
          { char: "◌ะ", name: "sara a (short)", phonetic: "a", class: "short", mnemonic: "Short 'a' — written after the consonant. กะ = 'ga'" },
          { char: "◌า", name: "sara aa (long)", phonetic: "aa", class: "long", mnemonic: "Long 'aa' — written after the consonant. กา = 'gaa'. In มา (come), ภาษา (language)" },
          { char: "◌ิ", name: "sara i (short)", phonetic: "i", class: "short", mnemonic: "Short 'i' — written above the consonant. กิน = 'gin' (eat)" },
          { char: "◌ี", name: "sara ii (long)", phonetic: "ii", class: "long", mnemonic: "Long 'ii' — written above with a hook. ดี = 'dii' (good), ที่ = 'tîi' (at)" },
        ]
      },
      {
        id: "script-2b", type: "script", title: "Vowels 2",
        characters: [
          { char: "◌ุ", name: "sara u (short)", phonetic: "u", class: "short", mnemonic: "Short 'u' — written below the consonant. Looks like a tiny dip" },
          { char: "◌ู", name: "sara uu (long)", phonetic: "uu", class: "long", mnemonic: "Long 'uu' — written below with a tail. รู้ = 'rúu' (know), ดู = 'duu' (watch)" },
          { char: "เ◌", name: "sara e (long)", phonetic: "ee", class: "long", mnemonic: "Written BEFORE the consonant! เ + ก = เก. In เป็น (is), เลี้ยว (turn)" },
          { char: "แ◌", name: "sara ae (long)", phonetic: "ae", class: "long", mnemonic: "Double เ — also written before. แ + ก = แก. In แพง (expensive), แม่ (mom)" },
        ]
      }
    ]
  },
  {
    id: "script-u3", title: "Thai Script 3: Tone Rules", icon: "วรรณ", type: "script",
    description: "How consonant class + vowel length + marks = the right tone",
    lessons: [
      {
        id: "script-3a", type: "script", title: "Tone Marks",
        intro: "Thai has 5 tones: mid, low, falling, high, rising. The tone of a syllable depends on: (1) consonant class (mid/high/low), (2) vowel length (short/long), and (3) tone marks. Mid class + no mark = mid tone. This is complex — just learn the marks for now and let patterns sink in over time.",
        characters: [
          { char: " ่", name: "mai ek (1st mark)", phonetic: "่", class: "mark", mnemonic: "Produces low tone on mid-class, or low/falling depending on class. In ก่อน (before), น่า (should)" },
          { char: " ้", name: "mai tho (2nd mark)", phonetic: "้", class: "mark", mnemonic: "Produces falling tone on mid-class. In น้ำ (water), ได้ (can), ร้อน (hot)" },
          { char: " ๊", name: "mai tri (3rd mark)", phonetic: "๊", class: "mark", mnemonic: "Produces high tone. Only used on mid-class consonants. In โน๊ต (note — loanword)" },
          { char: " ๋", name: "mai jat-ta-waa (4th mark)", phonetic: "๋", class: "mark", mnemonic: "Produces rising tone. Very rare! In ก๋วยเตี๋ยว (noodles)" },
        ]
      },
      {
        id: "script-3b", type: "script", title: "Tone Examples",
        intro: "See how each tone mark changes the same syllable กา (gaa). Try saying each one out loud!",
        characters: [
          { char: "กา", name: "mid + long + no mark", phonetic: "gaa", class: "mid tone", mnemonic: "Mid class consonant + long vowel + no mark = mid tone. Flat, neutral voice." },
          { char: "ก่า", name: "mid + long + mai ek", phonetic: "gàa", class: "low tone", mnemonic: "Add ่ to drop the pitch low. Like saying it sadly." },
          { char: "ก้า", name: "mid + long + mai tho", phonetic: "gâa", class: "falling tone", mnemonic: "Add ้ for a falling tone. Start high, drop down." },
          { char: "ก๊า", name: "mid + long + mai tri", phonetic: "gáa", class: "high tone", mnemonic: "Add ๊ to push pitch up high. Like asking a surprised question." },
          { char: "ก๋า", name: "mid + long + mai jat-ta-waa", phonetic: "gǎa", class: "rising tone", mnemonic: "Add ๋ for rising tone. Start low, rise up. Like asking 'really?'" },
        ]
      }
    ]
  },
  {
    id: "script-u4", title: "Thai Script 4: More Consonants", icon: "ขอ", type: "script",
    description: "12 more high-frequency consonants to expand your reading",
    lessons: [
      {
        id: "script-4a", type: "script", title: "Consonants 1",
        intro: "You already know 10 consonants. These 12 more will let you read most everyday Thai. Pay attention to consonant class — it matters for tones later.",
        characters: [
          { char: "บ", name: "บอ ใบไม้ (bɔɔ bai-máai)", phonetic: "b", class: "mid", mnemonic: "Round like a leaf — บ is in บ้าน (house), บาท (baht)" },
          { char: "จ", name: "จอ จาน (jɔɔ jaan)", phonetic: "j", class: "mid", mnemonic: "Looks like a plate — จ is in จาน (plate), จาก (from)" },
          { char: "ข", name: "ขอ ไข่ (khɔ̌ɔ khài)", phonetic: "kh", class: "high", mnemonic: "Like ค but high class — ข is in ข้าว (rice), ขอ (request)" },
          { char: "ช", name: "ชอ ช้าง (chɔɔ cháang)", phonetic: "ch", class: "low", mnemonic: "An elephant shape — ช is in ชื่อ (name), ช้า (slow)" },
        ]
      },
      {
        id: "script-4b", type: "script", title: "Consonants 2",
        characters: [
          { char: "ห", name: "หอ หีบ (hɔ̌ɔ hìip)", phonetic: "h", class: "high", mnemonic: "Tall character — ห is in หิว (hungry), ห้า (five)" },
          { char: "ง", name: "งอ งู (ngɔɔ nguu)", phonetic: "ng", class: "low", mnemonic: "A snake shape — ง is in งาน (work), เงิน (money)" },
          { char: "ป", name: "ปอ ปลา (bpɔɔ bplaa)", phonetic: "bp", class: "mid", mnemonic: "Like a fish — ป is in ปลา (fish), เป็น (is)" },
          { char: "อ", name: "ออ อ่าง (ɔɔ àang)", phonetic: "ɔ (silent)", class: "mid", mnemonic: "Often silent as a vowel carrier — อ is in อาหาร (food), อร่อย (delicious)" },
        ]
      },
      {
        id: "script-4c", type: "script", title: "Consonants 3",
        characters: [
          { char: "ว", name: "วอ แหวน (wɔɔ wǎen)", phonetic: "w", class: "low", mnemonic: "A ring shape — ว is in วัน (day), ว่าง (free)" },
          { char: "ย", name: "ยอ ยักษ์ (yɔɔ yák)", phonetic: "y", class: "low", mnemonic: "A giant — ย is in ยาก (difficult), อยาก (want)" },
          { char: "ต", name: "ตอ เต่า (dtɔɔ dtào)", phonetic: "dt", class: "mid", mnemonic: "A turtle — ต is in ตอน (when/time), ต้อง (must)" },
          { char: "ถ", name: "ถอ ถุง (thɔ̌ɔ thǔng)", phonetic: "th", class: "high", mnemonic: "High class th — ถ is in ถูก (cheap/correct), ถึง (arrive)" },
        ]
      }
    ]
  },
  {
    id: "script-u5", title: "Thai Script 5: Complex Vowels", icon: "เ◌", type: "script",
    description: "Multi-part vowels and special forms",
    lessons: [
      {
        id: "script-5a", type: "script", title: "Complex Vowels 1",
        intro: "These vowels combine multiple parts or have special forms. Some wrap around the consonant! ◌ marks where the consonant goes.",
        characters: [
          { char: "เ◌ีย", name: "sara ia (long)", phonetic: "ia", class: "long", mnemonic: "Wraps around: เ before + ีย after. In เที่ยว (travel), เรียน (study)" },
          { char: "◌ัว", name: "sara ua (long)", phonetic: "ua", class: "long", mnemonic: "Above + after. In ตัว (body/self), สัว (animal — in สัตว์)" },
          { char: "เ◌ือ", name: "sara ʉa (long)", phonetic: "ʉa", class: "long", mnemonic: "เ before + ือ after. In เสื้อ (shirt), เมือง (city)" },
          { char: "ไ◌", name: "sara ai (mai malai)", phonetic: "ai", class: "long", mnemonic: "Written before consonant. In ไป (go), ไม่ (not), ไหม (question)" },
        ]
      },
      {
        id: "script-5b", type: "script", title: "Complex Vowels 2",
        characters: [
          { char: "ใ◌", name: "sara ai (mai muan)", phonetic: "ai", class: "long", mnemonic: "Same sound as ไ but only 20 words use this form! In ใคร (who), ใกล้ (near), ใหม่ (new)" },
          { char: "◌ำ", name: "sara am", phonetic: "am", class: "long", mnemonic: "A combined vowel+consonant. In น้ำ (water), ทำ (do/make), ความ (meaning)" },
          { char: "โ◌", name: "sara o (long)", phonetic: "oo", class: "long", mnemonic: "Written before consonant. In โมง (o'clock), โทร (call), โรง (building)" },
          { char: "◌ือ", name: "sara ʉʉ (long)", phonetic: "ʉʉ", class: "long", mnemonic: "Written above + after. In ชื่อ (name), คือ (is/means), มือ (hand)" },
        ]
      }
    ]
  },
  {
    id: "script-u6", title: "Thai Script 6: Reading Practice", icon: "อ่าน", type: "script",
    description: "Put it all together — decode real words you already know",
    lessons: [
      {
        id: "script-6a", type: "script", title: "Common Words 1",
        intro: "Now let's practice reading! Each card shows a word broken into its parts: consonants, vowels, tone marks, and the resulting pronunciation. Try to sound out the word before flipping the card.",
        characters: [
          { char: "ส-วัส-ดี", name: "สวัสดี (broken down)", phonetic: "sà-wàt-dii", class: "practice", mnemonic: "ส(s) + วัส(wàt) + ดี(dii) → Hello!" },
          { char: "ขอบ-คุณ", name: "ขอบคุณ (broken down)", phonetic: "khàwp-khun", class: "practice", mnemonic: "ข(kh) + อบ(àwp) + ค(kh) + ุณ(un) → Thank you!" },
          { char: "อ-ร่อย", name: "อร่อย (broken down)", phonetic: "à-ròi", class: "practice", mnemonic: "อ(silent/à) + ร่(r + mai ek = ròi) + อย(oi) → Delicious!" },
          { char: "อา-หาร", name: "อาหาร (broken down)", phonetic: "aa-hǎan", class: "practice", mnemonic: "อา(aa) + หา(hǎa) + ร(n) → Food/Meal" },
        ]
      },
      {
        id: "script-6b", type: "script", title: "Common Words 2",
        characters: [
          { char: "สบาย-ดี", name: "สบายดี (broken down)", phonetic: "sà-baai-dii", class: "practice", mnemonic: "ส(sà) + บาย(baai) + ดี(dii) → I'm well / comfortable" },
          { char: "ภา-ษา", name: "ภาษา (broken down)", phonetic: "paa-sǎa", class: "practice", mnemonic: "ภา(paa) + ษา(sǎa) → Language" },
          { char: "เรียน", name: "เรียน (broken down)", phonetic: "rian", class: "practice", mnemonic: "เ-ีย(ia vowel wraps ร) + น(n) → Study/Learn" },
          { char: "เผ็ด", name: "เผ็ด (broken down)", phonetic: "phèt", class: "practice", mnemonic: "เ(e) + ผ(ph) + ็(shortener) + ด(t) → Spicy!" },
        ]
      }
    ]
  }
];
