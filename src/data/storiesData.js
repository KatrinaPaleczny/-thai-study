// Pre-written graded Thai stories with word-level translations
// Each story has a difficulty level, sentences with word breakdowns, and comprehension questions

export const STORIES = [
  {
    id: "cafe-morning",
    title: "เช้าที่ร้านกาแฟ",
    titleEn: "Morning at the Café",
    level: "beginner",
    emoji: "☕",
    description: "Order your morning coffee in Thai",
    sentences: [
      {
        thai: "สมศรี ไป ร้านกาแฟ ทุกเช้า",
        phonetic: "sǒm-sǐi bpai ráan-gaa-fɛɛ túk-cháao",
        english: "Somsri goes to the café every morning.",
        words: [
          { thai: "สมศรี", phonetic: "sǒm-sǐi", english: "Somsri (name)" },
          { thai: "ไป", phonetic: "bpai", english: "go" },
          { thai: "ร้านกาแฟ", phonetic: "ráan-gaa-fɛɛ", english: "café" },
          { thai: "ทุกเช้า", phonetic: "túk-cháao", english: "every morning" },
        ]
      },
      {
        thai: "เธอ สั่ง กาแฟเย็น หนึ่ง แก้ว",
        phonetic: "tɤɤ sàng gaa-fɛɛ-yen nùeng gɛ̂ɛo",
        english: "She orders one iced coffee.",
        words: [
          { thai: "เธอ", phonetic: "tɤɤ", english: "she" },
          { thai: "สั่ง", phonetic: "sàng", english: "order" },
          { thai: "กาแฟเย็น", phonetic: "gaa-fɛɛ-yen", english: "iced coffee" },
          { thai: "หนึ่ง", phonetic: "nùeng", english: "one" },
          { thai: "แก้ว", phonetic: "gɛ̂ɛo", english: "glass" },
        ]
      },
      {
        thai: "เธอ บอก \"ไม่ ใส่ น้ำตาล ค่ะ\"",
        phonetic: "tɤɤ bɔ̀ɔk \"mâi sài nám-dtaan khâ\"",
        english: "She says \"No sugar, please.\"",
        words: [
          { thai: "บอก", phonetic: "bɔ̀ɔk", english: "say/tell" },
          { thai: "ไม่", phonetic: "mâi", english: "not" },
          { thai: "ใส่", phonetic: "sài", english: "put/add" },
          { thai: "น้ำตาล", phonetic: "nám-dtaan", english: "sugar" },
          { thai: "ค่ะ", phonetic: "khâ", english: "polite particle (female)" },
        ]
      },
      {
        thai: "กาแฟ ราคา หกสิบ บาท",
        phonetic: "gaa-fɛɛ raa-kaa hòk-sìp bàat",
        english: "The coffee costs 60 baht.",
        words: [
          { thai: "กาแฟ", phonetic: "gaa-fɛɛ", english: "coffee" },
          { thai: "ราคา", phonetic: "raa-kaa", english: "price" },
          { thai: "หกสิบ", phonetic: "hòk-sìp", english: "sixty" },
          { thai: "บาท", phonetic: "bàat", english: "baht" },
        ]
      },
      {
        thai: "เธอ จ่าย เงิน แล้ว นั่ง อ่าน หนังสือ",
        phonetic: "tɤɤ jàai ngɤɤn lɛ́ɛo nâng àan nǎng-sʉ̌ʉ",
        english: "She pays and sits down to read a book.",
        words: [
          { thai: "จ่าย", phonetic: "jàai", english: "pay" },
          { thai: "เงิน", phonetic: "ngɤɤn", english: "money" },
          { thai: "แล้ว", phonetic: "lɛ́ɛo", english: "then/already" },
          { thai: "นั่ง", phonetic: "nâng", english: "sit" },
          { thai: "อ่าน", phonetic: "àan", english: "read" },
          { thai: "หนังสือ", phonetic: "nǎng-sʉ̌ʉ", english: "book" },
        ]
      },
    ],
    questions: [
      { question: "สมศรี ไป ไหน ทุกเช้า?", questionEn: "Where does Somsri go every morning?",
        options: ["ร้านกาแฟ", "ร้านอาหาร", "โรงเรียน", "ตลาด"], correct: 0 },
      { question: "เธอ สั่ง อะไร?", questionEn: "What does she order?",
        options: ["ชาร้อน", "กาแฟเย็น", "น้ำส้ม", "นม"], correct: 1 },
      { question: "กาแฟ ราคา เท่าไร?", questionEn: "How much is the coffee?",
        options: ["50 บาท", "60 บาท", "70 บาท", "80 บาท"], correct: 1 },
    ]
  },
  {
    id: "market-trip",
    title: "ไปตลาด",
    titleEn: "Going to the Market",
    level: "beginner",
    emoji: "🛒",
    description: "A trip to the local market",
    sentences: [
      {
        thai: "วันนี้ แม่ ไป ตลาด",
        phonetic: "wan-níi mɛ̂ɛ bpai dtà-làat",
        english: "Today, Mom goes to the market.",
        words: [
          { thai: "วันนี้", phonetic: "wan-níi", english: "today" },
          { thai: "แม่", phonetic: "mɛ̂ɛ", english: "mom" },
          { thai: "ไป", phonetic: "bpai", english: "go" },
          { thai: "ตลาด", phonetic: "dtà-làat", english: "market" },
        ]
      },
      {
        thai: "เธอ ซื้อ ผัก และ ผลไม้",
        phonetic: "tɤɤ sʉ́ʉ phàk lɛ́ phǒn-lá-máai",
        english: "She buys vegetables and fruit.",
        words: [
          { thai: "ซื้อ", phonetic: "sʉ́ʉ", english: "buy" },
          { thai: "ผัก", phonetic: "phàk", english: "vegetables" },
          { thai: "และ", phonetic: "lɛ́", english: "and" },
          { thai: "ผลไม้", phonetic: "phǒn-lá-máai", english: "fruit" },
        ]
      },
      {
        thai: "แม่ ถาม \"มะม่วง กิโล ละ เท่าไร คะ?\"",
        phonetic: "mɛ̂ɛ thǎam \"má-mûang gì-loo lá thâo-rài khá?\"",
        english: "Mom asks \"How much per kilo for mangoes?\"",
        words: [
          { thai: "ถาม", phonetic: "thǎam", english: "ask" },
          { thai: "มะม่วง", phonetic: "má-mûang", english: "mango" },
          { thai: "กิโล", phonetic: "gì-loo", english: "kilo" },
          { thai: "ละ", phonetic: "lá", english: "per/each" },
          { thai: "เท่าไร", phonetic: "thâo-rài", english: "how much" },
        ]
      },
      {
        thai: "คนขาย บอก \"แปดสิบ บาท ค่ะ\"",
        phonetic: "khon-khǎai bɔ̀ɔk \"bpɛ̀ɛt-sìp bàat khâ\"",
        english: "The seller says \"80 baht.\"",
        words: [
          { thai: "คนขาย", phonetic: "khon-khǎai", english: "seller" },
          { thai: "บอก", phonetic: "bɔ̀ɔk", english: "say" },
          { thai: "แปดสิบ", phonetic: "bpɛ̀ɛt-sìp", english: "eighty" },
          { thai: "บาท", phonetic: "bàat", english: "baht" },
        ]
      },
      {
        thai: "แม่ ซื้อ สอง กิโล แล้ว กลับ บ้าน",
        phonetic: "mɛ̂ɛ sʉ́ʉ sɔ̌ɔng gì-loo lɛ́ɛo glàp bâan",
        english: "Mom buys two kilos and goes home.",
        words: [
          { thai: "สอง", phonetic: "sɔ̌ɔng", english: "two" },
          { thai: "กิโล", phonetic: "gì-loo", english: "kilo" },
          { thai: "แล้ว", phonetic: "lɛ́ɛo", english: "then" },
          { thai: "กลับ", phonetic: "glàp", english: "return" },
          { thai: "บ้าน", phonetic: "bâan", english: "home/house" },
        ]
      },
    ],
    questions: [
      { question: "แม่ ไป ไหน?", questionEn: "Where does Mom go?",
        options: ["ร้านกาแฟ", "ตลาด", "โรงเรียน", "ร้านอาหาร"], correct: 1 },
      { question: "มะม่วง กิโล ละ เท่าไร?", questionEn: "How much per kilo for mangoes?",
        options: ["60 บาท", "70 บาท", "80 บาท", "90 บาท"], correct: 2 },
      { question: "แม่ ซื้อ มะม่วง กี่ กิโล?", questionEn: "How many kilos does Mom buy?",
        options: ["1 กิโล", "2 กิโล", "3 กิโล", "4 กิโล"], correct: 1 },
    ]
  },
  {
    id: "taxi-ride",
    title: "นั่งแท็กซี่",
    titleEn: "Taking a Taxi",
    level: "beginner",
    emoji: "🚕",
    description: "Navigate a taxi ride in Bangkok",
    sentences: [
      {
        thai: "สมชาย ยืน หน้า โรงแรม",
        phonetic: "sǒm-chaai yʉʉn nâa roong-rɛɛm",
        english: "Somchai stands in front of the hotel.",
        words: [
          { thai: "สมชาย", phonetic: "sǒm-chaai", english: "Somchai (name)" },
          { thai: "ยืน", phonetic: "yʉʉn", english: "stand" },
          { thai: "หน้า", phonetic: "nâa", english: "in front of" },
          { thai: "โรงแรม", phonetic: "roong-rɛɛm", english: "hotel" },
        ]
      },
      {
        thai: "เขา เรียก แท็กซี่ สี เหลือง",
        phonetic: "khǎo rîiak thɛ́k-sîi sǐi lʉ̌ang",
        english: "He calls a yellow taxi.",
        words: [
          { thai: "เขา", phonetic: "khǎo", english: "he" },
          { thai: "เรียก", phonetic: "rîiak", english: "call" },
          { thai: "แท็กซี่", phonetic: "thɛ́k-sîi", english: "taxi" },
          { thai: "สี", phonetic: "sǐi", english: "color" },
          { thai: "เหลือง", phonetic: "lʉ̌ang", english: "yellow" },
        ]
      },
      {
        thai: "เขา บอก \"ไป สยาม ครับ\"",
        phonetic: "khǎo bɔ̀ɔk \"bpai sà-yǎam khráp\"",
        english: "He says \"Go to Siam, please.\"",
        words: [
          { thai: "บอก", phonetic: "bɔ̀ɔk", english: "say" },
          { thai: "ไป", phonetic: "bpai", english: "go" },
          { thai: "สยาม", phonetic: "sà-yǎam", english: "Siam" },
          { thai: "ครับ", phonetic: "khráp", english: "polite particle (male)" },
        ]
      },
      {
        thai: "รถ ติด มาก วันนี้",
        phonetic: "rót dtìt mâak wan-níi",
        english: "Traffic is very bad today.",
        words: [
          { thai: "รถ", phonetic: "rót", english: "car/vehicle" },
          { thai: "ติด", phonetic: "dtìt", english: "stuck" },
          { thai: "มาก", phonetic: "mâak", english: "very/a lot" },
          { thai: "วันนี้", phonetic: "wan-níi", english: "today" },
        ]
      },
      {
        thai: "ค่า โดยสาร ร้อยห้าสิบ บาท",
        phonetic: "khâa dooi-sǎan rɔ́ɔi-hâa-sìp bàat",
        english: "The fare is 150 baht.",
        words: [
          { thai: "ค่า", phonetic: "khâa", english: "cost/fare" },
          { thai: "โดยสาร", phonetic: "dooi-sǎan", english: "fare/passenger" },
          { thai: "ร้อยห้าสิบ", phonetic: "rɔ́ɔi-hâa-sìp", english: "one hundred fifty" },
          { thai: "บาท", phonetic: "bàat", english: "baht" },
        ]
      },
    ],
    questions: [
      { question: "สมชาย อยู่ ที่ไหน?", questionEn: "Where is Somchai?",
        options: ["หน้าตลาด", "หน้าโรงแรม", "หน้าร้าน", "หน้าบ้าน"], correct: 1 },
      { question: "เขา จะไป ไหน?", questionEn: "Where is he going?",
        options: ["สีลม", "สุขุมวิท", "สยาม", "อนุสาวรีย์"], correct: 2 },
      { question: "ค่าโดยสาร เท่าไร?", questionEn: "How much is the fare?",
        options: ["100 บาท", "120 บาท", "150 บาท", "200 บาท"], correct: 2 },
    ]
  },
  {
    id: "new-friend",
    title: "เพื่อนใหม่",
    titleEn: "A New Friend",
    level: "intermediate",
    emoji: "🤝",
    description: "Meet someone new and make plans",
    sentences: [
      {
        thai: "วันนี้ มี คน ใหม่ มา ทำงาน",
        phonetic: "wan-níi mii khon mài maa tham-ngaan",
        english: "Today there's a new person at work.",
        words: [
          { thai: "มี", phonetic: "mii", english: "have/there is" },
          { thai: "คน", phonetic: "khon", english: "person" },
          { thai: "ใหม่", phonetic: "mài", english: "new" },
          { thai: "มา", phonetic: "maa", english: "come" },
          { thai: "ทำงาน", phonetic: "tham-ngaan", english: "work" },
        ]
      },
      {
        thai: "เธอ ชื่อ นิด มา จาก เชียงใหม่",
        phonetic: "tɤɤ chʉ̂ʉ nít maa jàak chiiang-mài",
        english: "Her name is Nid, she's from Chiang Mai.",
        words: [
          { thai: "ชื่อ", phonetic: "chʉ̂ʉ", english: "name/be named" },
          { thai: "นิด", phonetic: "nít", english: "Nid (name)" },
          { thai: "จาก", phonetic: "jàak", english: "from" },
          { thai: "เชียงใหม่", phonetic: "chiiang-mài", english: "Chiang Mai" },
        ]
      },
      {
        thai: "เรา คุย กัน เรื่อง อาหาร ไทย",
        phonetic: "rao khui gan rʉ̂ang aa-hǎan thai",
        english: "We talk about Thai food.",
        words: [
          { thai: "เรา", phonetic: "rao", english: "we" },
          { thai: "คุย", phonetic: "khui", english: "chat/talk" },
          { thai: "กัน", phonetic: "gan", english: "together/each other" },
          { thai: "เรื่อง", phonetic: "rʉ̂ang", english: "about/topic" },
          { thai: "อาหาร", phonetic: "aa-hǎan", english: "food" },
        ]
      },
      {
        thai: "นิด ชอบ ทำ ส้มตำ มาก",
        phonetic: "nít chɔ̂ɔp tham sôm-dtam mâak",
        english: "Nid likes making som tam a lot.",
        words: [
          { thai: "ชอบ", phonetic: "chɔ̂ɔp", english: "like" },
          { thai: "ทำ", phonetic: "tham", english: "make/do" },
          { thai: "ส้มตำ", phonetic: "sôm-dtam", english: "papaya salad" },
          { thai: "มาก", phonetic: "mâak", english: "very much" },
        ]
      },
      {
        thai: "เรา นัด กิน ข้าว ด้วยกัน วันเสาร์",
        phonetic: "rao nát gin khâao dûai-gan wan-sǎo",
        english: "We make plans to eat together on Saturday.",
        words: [
          { thai: "นัด", phonetic: "nát", english: "make an appointment" },
          { thai: "กิน", phonetic: "gin", english: "eat" },
          { thai: "ข้าว", phonetic: "khâao", english: "rice/food" },
          { thai: "ด้วยกัน", phonetic: "dûai-gan", english: "together" },
          { thai: "วันเสาร์", phonetic: "wan-sǎo", english: "Saturday" },
        ]
      },
    ],
    questions: [
      { question: "นิด มา จาก ไหน?", questionEn: "Where is Nid from?",
        options: ["กรุงเทพ", "เชียงใหม่", "ภูเก็ต", "ขอนแก่น"], correct: 1 },
      { question: "นิด ชอบ ทำ อะไร?", questionEn: "What does Nid like to make?",
        options: ["ผัดไทย", "ต้มยำ", "ส้มตำ", "แกงเขียวหวาน"], correct: 2 },
      { question: "เขา นัด กิน ข้าว วัน ไหน?", questionEn: "What day do they plan to eat?",
        options: ["วันศุกร์", "วันเสาร์", "วันอาทิตย์", "วันจันทร์"], correct: 1 },
    ]
  },
  {
    id: "sick-day",
    title: "ไม่สบาย",
    titleEn: "Feeling Sick",
    level: "intermediate",
    emoji: "🤒",
    description: "Visit the doctor when you're not feeling well",
    sentences: [
      {
        thai: "เช้านี้ ผม ไม่ สบาย",
        phonetic: "cháao-níi phǒm mâi sà-baai",
        english: "This morning, I'm not feeling well.",
        words: [
          { thai: "เช้านี้", phonetic: "cháao-níi", english: "this morning" },
          { thai: "ผม", phonetic: "phǒm", english: "I (male)" },
          { thai: "ไม่", phonetic: "mâi", english: "not" },
          { thai: "สบาย", phonetic: "sà-baai", english: "well/comfortable" },
        ]
      },
      {
        thai: "ปวดหัว และ มี ไข้ นิดหน่อย",
        phonetic: "bpùat-hǔa lɛ́ mii khâi nít-nɔ̀ɔi",
        english: "I have a headache and a slight fever.",
        words: [
          { thai: "ปวดหัว", phonetic: "bpùat-hǔa", english: "headache" },
          { thai: "มี", phonetic: "mii", english: "have" },
          { thai: "ไข้", phonetic: "khâi", english: "fever" },
          { thai: "นิดหน่อย", phonetic: "nít-nɔ̀ɔi", english: "a little" },
        ]
      },
      {
        thai: "ผม ไป โรงพยาบาล ใกล้บ้าน",
        phonetic: "phǒm bpai roong-phá-yaa-baan glâi-bâan",
        english: "I go to the hospital near home.",
        words: [
          { thai: "โรงพยาบาล", phonetic: "roong-phá-yaa-baan", english: "hospital" },
          { thai: "ใกล้บ้าน", phonetic: "glâi-bâan", english: "near home" },
        ]
      },
      {
        thai: "หมอ บอก ว่า เป็น หวัด ธรรมดา",
        phonetic: "mɔ̌ɔ bɔ̀ɔk wâa bpen wàt tham-má-daa",
        english: "The doctor says it's just a common cold.",
        words: [
          { thai: "หมอ", phonetic: "mɔ̌ɔ", english: "doctor" },
          { thai: "ว่า", phonetic: "wâa", english: "that (conjunction)" },
          { thai: "เป็น", phonetic: "bpen", english: "is/have (illness)" },
          { thai: "หวัด", phonetic: "wàt", english: "cold (illness)" },
          { thai: "ธรรมดา", phonetic: "tham-má-daa", english: "common/ordinary" },
        ]
      },
      {
        thai: "ผม ได้ ยา มา กิน สาม วัน",
        phonetic: "phǒm dâai yaa maa gin sǎam wan",
        english: "I got medicine to take for three days.",
        words: [
          { thai: "ได้", phonetic: "dâai", english: "got/received" },
          { thai: "ยา", phonetic: "yaa", english: "medicine" },
          { thai: "กิน", phonetic: "gin", english: "eat/take" },
          { thai: "สาม", phonetic: "sǎam", english: "three" },
          { thai: "วัน", phonetic: "wan", english: "day" },
        ]
      },
    ],
    questions: [
      { question: "ผม เป็น อะไร?", questionEn: "What's wrong with me?",
        options: ["ปวดท้อง", "หวัด", "ปวดฟัน", "เป็นไข้เลือดออก"], correct: 1 },
      { question: "ผม ไป ที่ไหน?", questionEn: "Where did I go?",
        options: ["ร้านขายยา", "โรงพยาบาล", "คลินิก", "บ้านเพื่อน"], correct: 1 },
      { question: "ต้อง กิน ยา กี่ วัน?", questionEn: "How many days of medicine?",
        options: ["2 วัน", "3 วัน", "5 วัน", "7 วัน"], correct: 1 },
    ]
  },
  {
    id: "weekend-temple",
    title: "วันหยุดที่วัด",
    titleEn: "Weekend at the Temple",
    level: "intermediate",
    emoji: "🛕",
    description: "Visit a Buddhist temple and learn about Thai culture",
    sentences: [
      {
        thai: "วันอาทิตย์ ครอบครัว ไป ทำบุญ ที่ วัด",
        phonetic: "wan-aa-thít khrɔ̂ɔp-khrua bpai tham-bun thîi wát",
        english: "On Sunday, the family goes to make merit at the temple.",
        words: [
          { thai: "วันอาทิตย์", phonetic: "wan-aa-thít", english: "Sunday" },
          { thai: "ครอบครัว", phonetic: "khrɔ̂ɔp-khrua", english: "family" },
          { thai: "ทำบุญ", phonetic: "tham-bun", english: "make merit" },
          { thai: "วัด", phonetic: "wát", english: "temple" },
        ]
      },
      {
        thai: "เรา ใส่บาตร ตอน เช้า ตรู่",
        phonetic: "rao sài-bàat dtɔɔn cháao-dtrùu",
        english: "We give alms to monks early in the morning.",
        words: [
          { thai: "ใส่บาตร", phonetic: "sài-bàat", english: "give alms" },
          { thai: "ตอน", phonetic: "dtɔɔn", english: "at/during" },
          { thai: "เช้าตรู่", phonetic: "cháao-dtrùu", english: "early morning" },
        ]
      },
      {
        thai: "แม่ ถวาย อาหาร และ ดอกไม้",
        phonetic: "mɛ̂ɛ thà-wǎai aa-hǎan lɛ́ dɔ̀ɔk-máai",
        english: "Mom offers food and flowers.",
        words: [
          { thai: "ถวาย", phonetic: "thà-wǎai", english: "offer (to monks)" },
          { thai: "อาหาร", phonetic: "aa-hǎan", english: "food" },
          { thai: "ดอกไม้", phonetic: "dɔ̀ɔk-máai", english: "flowers" },
        ]
      },
      {
        thai: "พระ สวด มนต์ ให้ พร",
        phonetic: "phrá sùat mon hâi phɔɔn",
        english: "The monk chants and gives blessings.",
        words: [
          { thai: "พระ", phonetic: "phrá", english: "monk" },
          { thai: "สวดมนต์", phonetic: "sùat-mon", english: "chant" },
          { thai: "ให้พร", phonetic: "hâi-phɔɔn", english: "give blessings" },
        ]
      },
      {
        thai: "หลังจากนั้น เรา กิน ข้าว เที่ยง ที่ ตลาด ใน วัด",
        phonetic: "lǎng-jàak-nán rao gin khâao thîiang thîi dtà-làat nai wát",
        english: "After that, we eat lunch at the market inside the temple.",
        words: [
          { thai: "หลังจากนั้น", phonetic: "lǎng-jàak-nán", english: "after that" },
          { thai: "ข้าวเที่ยง", phonetic: "khâao-thîiang", english: "lunch" },
          { thai: "ตลาด", phonetic: "dtà-làat", english: "market" },
          { thai: "ใน", phonetic: "nai", english: "in/inside" },
        ]
      },
    ],
    questions: [
      { question: "ครอบครัว ไป วัด วัน อะไร?", questionEn: "What day does the family go to the temple?",
        options: ["วันเสาร์", "วันอาทิตย์", "วันศุกร์", "วันพุธ"], correct: 1 },
      { question: "แม่ ถวาย อะไร?", questionEn: "What does Mom offer?",
        options: ["เงิน", "อาหารและดอกไม้", "เสื้อผ้า", "หนังสือ"], correct: 1 },
      { question: "เรา กิน ข้าวเที่ยง ที่ไหน?", questionEn: "Where do they eat lunch?",
        options: ["ที่บ้าน", "ร้านอาหาร", "ตลาดในวัด", "ร้านกาแฟ"], correct: 2 },
    ]
  },
];
