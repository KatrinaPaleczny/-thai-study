/**
 * Core Thai word frequency lists.
 * IDs reference vocabData.js entries, ordered by real-world usage frequency.
 * Tiers are cumulative: top200 includes top100, top500 includes top200.
 */

// Top 100 most common Thai words
const TOP_100 = [
  // Pronouns & basics
  14,   // ฉัน - I (neutral)
  18,   // ผม - I (masc)
  16,   // คุณ - You / Mx.
  // Greetings & polite
  144,  // สวัสดี - Hello / Goodbye
  143,  // ขอบคุณ - Thank you
  141,  // ขอโทษ - Excuse me / Sorry
  142,  // ไม่เป็นไร - No problem
  26,   // สบายดี - Good / Comfortable
  // Core verbs
  710,  // ไป - to go
  19,   // มา - Come
  711,  // กิน - to eat
  712,  // ดื่ม - to drink
  713,  // นอน - to sleep
  714,  // รู้ - to know
  716,  // เข้าใจ - to understand
  718,  // ให้ - to give
  719,  // อยาก - to want
  720,  // ต้อง - must / have to
  735,  // ใช้ - to use
  736,  // ช่วย - to help
  150,  // มี - Have / There is
  722,  // เปิด - to open
  723,  // ปิด - to close
  726,  // นั่ง - to sit
  727,  // ยืน - to stand
  743,  // รอ - to wait
  109,  // ซื้อ - Buy
  82,   // เดิน - Walk
  // Question words
  17,   // อะไร - What
  73,   // ที่ไหน - Where?
  77,   // ยังไง - How?
  777,  // ไหม - question particle
  107,  // เท่าไร - How much?
  778,  // ใช่ไหม - right? isn't it?
  // Common nouns
  214,  // ข้าว - rice
  94,   // น้ำ - water
  146,  // อาหาร - food
  580,  // รถ - car / vehicle
  596,  // บ้าน - house / home
  663,  // โทรศัพท์ - phone
  664,  // มือถือ - mobile phone
  15,   // ชื่อ - Name
  121,  // งาน - work / job
  922,  // เงิน - money
  995,  // คน - classifier for people
  112,  // เพื่อน - friend
  // Food essentials
  231,  // กาแฟ - coffee
  86,   // ปลา - fish
  221,  // ไก่ - chicken
  222,  // หมู - pork
  220,  // ไข่ - egg
  96,   // อร่อย - delicious
  148,  // หิว - hungry
  149,  // อิ่ม - full (after eating)
  // Common adjectives
  346,  // ดี - good
  4,    // ร้อน - hot
  5,    // เย็น - cool / cold
  749,  // ใหม่ - new
  750,  // เก่า - old (things)
  751,  // ง่าย - easy
  752,  // เร็ว - fast
  265,  // ใหญ่ - big
  264,  // เล็ก - small
  755,  // สูง - tall / high
  110,  // แพง - expensive
  269,  // ถูก - cheap
  268,  // สวย - beautiful
  876,  // เก่ง - skilled
  // Time
  7,    // ตอนนี้ - now
  133,  // เช้า - morning
  807,  // ปี - year
  808,  // สัปดาห์ - week
  134,  // เดือน - month
  132,  // ชั่วโมง - hour
  131,  // นาที - minute
  // Connectives & particles
  20,   // จาก - from
  125,  // นิดหน่อย - a little bit
  126,  // เยอะ - a lot
  13,   // คะ - feminine particle
  // Directions
  76,   // ใกล้ - near
  75,   // ไกล - far
  // Numbers (essential)
  53,   // หนึ่ง - 1
  54,   // สอง - 2
  55,   // สาม - 3
  56,   // สี่ - 4
  57,   // ห้า - 5
  62,   // สิบ - 10
  68,   // ร้อย - hundred
  // Polite
  782,  // ยินดี - glad / you're welcome
  783,  // ได้เลย - go ahead / sure
  787,  // โชคดี - good luck
  // Body & health basics
  486,  // หมอ - doctor
  489,  // ป่วย - sick
  488,  // ยา - medicine
  // Family basics
  166,  // แม่ - mother
  167,  // พ่อ - father
  174,  // ลูก - child
];

// Top 200: includes top 100 + 100 more
const TOP_200_EXTRA = [
  // More verbs
  115,  // เล่น - play
  116,  // วิ่ง - run
  118,  // เที่ยว - travel
  153,  // ทำงาน - work
  154,  // อาบน้ำ - shower
  155,  // ออกกำลังกาย - exercise
  158,  // ตื่นนอน - wake up
  160,  // พัก - rest
  162,  // โทรหา - call
  829,  // ดูหนัง - watch a movie
  145,  // ขับรถ - drive
  100,  // ขอ - request / can I have
  99,   // สั่ง - order (food)
  106,  // ลอง - try on
  84,   // ทำอาหาร - cook
  164,  // ส่งข้อความ - send a message
  151,  // อ่านหนังสือ - read
  // More adjectives
  97,   // เผ็ด - spicy
  98,   // เค็ม - salty
  763,  // หวาน - sweet
  764,  // เปรี้ยว - sour
  756,  // เตี้ย - short (height)
  266,  // ยาว - long
  267,  // สั้น - short
  // More nouns - food
  215,  // ผัดไทย - Pad Thai
  216,  // ต้มยำ - Tom Yum
  217,  // ข้าวผัด - fried rice
  218,  // ก๋วยเตี๋ยว - noodle soup
  472,  // ผัก - vegetable
  473,  // ผลไม้ - fruit
  93,   // ร้านอาหาร - restaurant
  249,  // เมนู - menu
  250,  // บิล - bill / check
  247,  // ขนม - snack / dessert
  // Drinks
  232,  // ชา - tea
  233,  // นม - milk
  95,   // น้ำเปล่า - plain water
  // Places
  833,  // ตลาด - market
  845,  // วัด - temple
  78,   // โรงพยาบาล - hospital
  79,   // สถานีรถไฟ - train station
  969,  // ร้านกาแฟ - café
  696,  // โรงเรียน - school
  // Travel
  578,  // แท็กซี่ - taxi
  80,   // รถไฟ - train
  70,   // เลี้ยวซ้าย - turn left
  71,   // เลี้ยวขวา - turn right
  72,   // ตรงไป - go straight
  81,   // ถึงแล้ว - arrived
  // Home
  597,  // ห้องนอน - bedroom
  598,  // ห้องน้ำ - bathroom
  599,  // ห้องครัว - kitchen
  601,  // ประตู - door
  604,  // โต๊ะ - table
  605,  // เก้าอี้ - chair
  606,  // เตียง - bed
  610,  // ไฟ - light / fire
  603,  // กุญแจ - key
  // Family
  168,  // พี่ชาย - older brother
  169,  // น้องชาย - younger brother
  170,  // พี่สาว - older sister
  171,  // น้องสาว - younger sister
  111,  // พ่อแม่ - parents
  // Numbers
  58,   // หก - 6
  59,   // เจ็ด - 7
  60,   // แปด - 8
  61,   // เก้า - 9
  64,   // ยี่สิบ - 20
  69,   // หนึ่งพัน - 1,000
  // Emotions
  536,  // เสียใจ - sad / sorry
  283,  // ดีใจ - happy / glad
  284,  // เบื่อ - bored
  539,  // สนุก - fun
  282,  // คิดถึง - miss someone
  552,  // ยิ้ม - smile
  // Weather
  522,  // ฝน - rain
  523,  // แดด - sunshine
  6,    // หนาว - cold (weather)
  // SmallTalk essentials
  275,  // เป็นยังไงบ้าง - How's it going?
  277,  // ทำอะไรอยู่ - What are you doing?
  308,  // ว่างไหม - Are you free?
  306,  // กินข้าวหรือยัง - Have you eaten?
  377,  // สู้ๆ - you got this!
  309,  // ฝันดีนะ - sweet dreams
  // Technology
  667,  // ไวไฟ - WiFi
  // Clothing basics
  103,  // เสื้อ - shirt
  272,  // กางเกง - pants
  273,  // รองเท้า - shoes
  274,  // กระเป๋า - bag
  // Countries
  813,  // ประเทศไทย - Thailand
  21,   // ประเทศ - country
  // Colours basics
  104,  // สีแดง - red
  254,  // สีดำ - black
  255,  // สีขาว - white
  // Animals
  623,  // หมา - dog
  624,  // แมว - cat
  626,  // ช้าง - elephant
  // Education
  697,  // ครู - teacher
  699,  // นักเรียน - student
];

// Top 500: includes top 200 + 300 more
const TOP_500_EXTRA = [
  // More greetings & phrases
  11,   // ยินดีที่ได้รู้จัก - Nice to meet you
  22,   // ชื่ออะไร - What's your name?
  140,  // สวัสดีตอนเช้า - Good morning
  367,  // ง่วงนอน - sleepy
  368,  // เพิ่งตื่น - just woke up
  369,  // อรุณสวัสดิ์ - good morning (formal)
  414,  // นอนก่อนนะ - heading to bed
  784,  // ช่วยด้วย - help me please
  786,  // ขอบใจ - thanks (informal)
  // More time
  339,  // เพิ่ง - just now
  341,  // เดี๋ยว - later / soon
  342,  // 9 โมง - 9 o'clock
  343,  // กี่โมง - what time?
  48,   // บางครั้ง - sometimes
  809,  // กลางคืน - nighttime
  810,  // กลางวัน - daytime
  396,  // เช้าตรู่ - crack of dawn
  370,  // เช้านี้ - this morning
  // More numbers
  63,   // สิบเอ็ด - 11
  65,   // สามสิบ - 30
  66,   // สี่สิบ - 40
  67,   // ห้าสิบ - 50
  422,  // ตัวเลข - numbers
  804,  // ที่หนึ่ง - first
  805,  // ที่สอง - second
  456,  // สามสิบเอ็ด - thirty-one
  // More food
  87,   // กุ้ง - shrimp
  88,   // พริก - chili
  89,   // ส้มตำ - papaya salad
  90,   // หมูกระทะ - Thai BBQ
  91,   // ปอเปี๊ยะ - spring rolls
  92,   // ข้าวเช้า - breakfast
  219,  // กะเพรา - holy basil
  223,  // เนื้อ - beef
  224,  // น้ำปลา - fish sauce
  225,  // น้ำตาล - sugar
  226,  // เกลือ - salt
  227,  // มะนาว - lime
  228,  // กระเทียม - garlic
  229,  // หัวหอม - onion
  230,  // ซอสพริก - chili sauce
  243,  // แตงกวา - cucumber
  244,  // มะเขือเทศ - tomato
  245,  // แครอท - carrot
  248,  // ขนมหวาน - sweet dessert
  251,  // ไม่เผ็ด - not spicy
  252,  // เผ็ดน้อย - a little spicy
  253,  // เส้น - noodles
  400,  // ขนมปัง - bread
  797,  // ไอศกรีม - ice cream
  932,  // ช้อน - spoon
  933,  // ส้อม - fork
  934,  // แก้ว - glass / cup
  974,  // น้ำแข็ง - ice
  983,  // ชาเย็น - Thai iced tea
  401,  // กาแฟเย็น - iced coffee
  // More drinks & fruit
  234,  // น้ำผลไม้ - juice
  235,  // กล้วย - banana
  236,  // มะม่วง - mango
  237,  // มะละกอ - papaya
  238,  // มะพร้าว - coconut
  239,  // สับปะรด - pineapple
  240,  // แตงโม - watermelon
  241,  // มังคุด - mangosteen
  242,  // ทุเรียน - durian
  // More colours
  105,  // สีน้ำเงิน - dark blue
  256,  // สีเขียว - green
  257,  // สีเหลือง - yellow
  258,  // สีชมพู - pink
  259,  // สีน้ำตาล - brown
  260,  // สีม่วง - purple
  261,  // สีส้ม - orange
  262,  // สีอ่อน - light
  263,  // สีเข้ม - dark
  // More family
  172,  // ลูกชาย - son
  173,  // ลูกสาว - daughter
  175,  // ป้า - aunt (older)
  176,  // น้า - aunt (maternal)
  177,  // ลุง - uncle (older)
  178,  // อา - uncle (paternal)
  179,  // ลูกพี่ลูกน้อง - cousin
  180,  // หลานสาว - niece
  181,  // หลานชาย - nephew
  182,  // ยาย - grandmother (maternal)
  183,  // ตา - grandfather (maternal)
  184,  // ย่า - grandmother (paternal)
  185,  // ปู่ - grandfather (paternal)
  451,  // หลาน - grandchild
  113,  // วันเกิด - birthday
  114,  // อายุเท่าไร - How old are you?
  // More body & health
  490,  // ปวดหัว - headache
  491,  // ปวดท้อง - stomachache
  497,  // หัว - head
  498,  // หู - ear
  499,  // จมูก - nose
  500,  // ปาก - mouth
  501,  // ฟัน - tooth
  502,  // มือ - hand
  503,  // เท้า - foot
  524,  // หนาวมาก - very cold
  // More emotions
  378,  // เก่งมาก - well done
  379,  // ทำได้ - you can do it
  380,  // พยายาม - try / persevere
  381,  // ยอดเยี่ยม - excellent
  382,  // เจ๋ง - cool / awesome
  383,  // ภูมิใจ - proud
  384,  // ใจสู้ - fighting spirit
  // More weather
  385,  // ร้อนมาก - very hot
  389,  // ฝนตก - it's raining
  390,  // ฝนตกหนัก - heavy rain
  391,  // ร่ม - umbrella
  392,  // เปียก - wet
  393,  // พายุ - storm
  394,  // ฟ้าร้อง - thunder
  386,  // อบอ้าว - humid
  388,  // แดดจัด - blazing sun
  // More small talk
  276,  // ไปไหนมา - Where did you go?
  279,  // เหนื่อยไหม - Are you tired?
  280,  // สนุกไหม - Having fun?
  281,  // โชคดีนะ - Good luck!
  285,  // เป็นไง - How are you? (casual)
  286,  // ไม่ได้เจอกันนาน - Long time no see
  287,  // คิดถึงเลย - Was thinking of you
  310,  // ดูแลตัวเองด้วยนะ - Take care
  311,  // ระวังด้วยนะ - Be careful
  312,  // โทรหาได้ไหม - Can I call you?
  371,  // นอนดึก - stayed up late
  376,  // ตื่นสาย - slept in
  373,  // หิวข้าว - hungry
  375,  // ฝัน - dream
  397,  // ตาบวม - puffy eyes
  405,  // หาว - yawn
  51,   // อะไรนะ - What, come again?
  52,   // สุขสันต์วันเกิด - Happy Birthday
  // More activities
  340,  // ตื่น - wake up
  395,  // แปรงฟัน - brush teeth
  399,  // ลุกขึ้น - get up
  402,  // ยืด - stretch
  403,  // เดินเช้า - morning walk
  152,  // ทำความสะอาด - clean
  156,  // เดินเล่น - stroll
  157,  // เดินป่า - hike
  159,  // แต่งตัว - get dressed
  161,  // ผ่อนคลาย - relax
  163,  // วิดีโอคอล - video call
  165,  // ไปช็อปปิ้ง - go shopping
  // More shopping
  108,  // ลด - discount
  270,  // ขนาด - size
  271,  // แบบ - style
  // More home
  602,  // N/A - skip if not found
  // More directions
  74,   // ติดกับ - next to
  // Countries
  814,  // อเมริกา - America
  815,  // อังกฤษ - England
  816,  // ออสเตรเลีย - Australia
  32,   // ญี่ปุ่น - Japan
  34,   // จีน - China
  37,   // เกาหลี - Korea
  35,   // เยอรมัน - Germany
  36,   // ฝรั่งเศส - France
  33,   // ฟิลิปปินส์ - Philippines
  // More animals
  622,  // สุนัข - dog (formal)
  625,  // นก - bird
  // Nature
  643,  // ต้นไม้ - tree
  644,  // ดอกไม้ - flower
  645,  // ทะเล - sea
  656,  // ดาว - star
  // Clothing
  691,  // เสื้อยืด - T-shirt
  // Education
  701,  // ปากกา - pen
  702,  // ดินสอ - pencil
  703,  // สมุด - notebook
  // Work
  571,  // เสร็จแล้ว - finished / done
  // More connectives
  8,    // เหมือนกัน - likewise / same
  9,    // กว่า - more than
  12,   // อยู่ - to be / to stay
  // More classifiers
  996,  // ตัว - classifier for animals
  997,  // อัน - classifier for small objects
  101,  // จาน - plate
  // Food items
  147,  // แกง - curry
  85,   // ทอด - deep fry
  102,  // ใส่ - add / put in
  246,  // กะหล่ำปลี - cabbage
  1,    // สด - fresh
  10,   // แซ่บ - delicious (slang)
  // Phrases
  29,   // นอนหลับไหม - Did you sleep well?
  30,   // นอนหลับ - Could sleep well
  50,   // กินไหม - Do you want some?
  49,   // นอนไหม - Do you want to sleep?
  307,  // ตื่นแล้วหรือยัง - Are you up yet?
  398,  // นอนพอไหม - Did you get enough sleep?
  288,  // ยังอยู่ไหม - Are you still there?
  // More phrases
  835,  // เซเว่น - 7-Eleven
  // SmallTalk extra
  278,  // อากาศดีนะ - Nice weather
  // Relationship vocab
  329,  // สถานะไม่ชัด - situationship
  330,  // เราเป็นอะไรกัน - What are we?
  334,  // มีเสน่ห์ - have charm / rizz
  337,  // ไม่โกหกเลย - no cap
  // More encouragement
  387,  // ร้อนตาย - dying of heat
  // Polite expressions
  27,   // ไม่สบาย - I'm sick
  28,   // ไม่ดี - emotionally unwell
  // Time extras
  344,  // 7 โมง 15 - 7:15
  348,  // กี่โมงแล้ว - What time is it now?
  351,  // 9 โมง ถึง 5 โมง - 9 AM to 5 PM
  // Activity extras
  117,  // เล่นเวท - lift weights
  // Quest phrases
  23,   // มาจากประเทศอะไร - What country from?
];

// Build cumulative arrays
export const FREQ_TIERS = {
  100: TOP_100,
  200: [...TOP_100, ...TOP_200_EXTRA],
  500: [...TOP_100, ...TOP_200_EXTRA, ...TOP_500_EXTRA],
};

// Build rank lookup: vocabId → rank (1-based)
export const FREQ_RANK = {};
FREQ_TIERS[500].forEach((id, i) => {
  FREQ_RANK[id] = i + 1;
});
