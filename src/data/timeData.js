// Thai time-telling system
// Thai divides the day into 4 periods with different words:
// ตี (dtii) = 1am-5am, โมงเช้า (mohng-cháao) = 6am-11am,
// บ่ายโมง (bàai mohng) = 1pm-3pm, โมงเย็น (mohng yen) = 4pm-6pm
// ทุ่ม (thûm) = 7pm-11pm, เที่ยง (thîang) = noon, เที่ยงคืน (thîang-kheun) = midnight

export const TIME_SYSTEM_NOTES = [
  { period: "1am – 5am", word: "ตี", phonetics: "dtii", note: "ตี 1 = 1am, ตี 2 = 2am… ตี 5 = 5am" },
  { period: "6am – 11am", word: "โมงเช้า", phonetics: "mohng cháao", note: "6 โมงเช้า = 6am, 7 โมงเช้า = 7am…" },
  { period: "Noon", word: "เที่ยง", phonetics: "thîang", note: "เที่ยง = 12pm (noon)" },
  { period: "1pm – 3pm", word: "บ่ายโมง", phonetics: "bàai mohng", note: "บ่ายโมง = 1pm, บ่าย 2 โมง = 2pm, บ่าย 3 โมง = 3pm" },
  { period: "4pm – 6pm", word: "โมงเย็น", phonetics: "mohng yen", note: "4 โมงเย็น = 4pm, 5 โมงเย็น = 5pm, 6 โมงเย็น = 6pm" },
  { period: "7pm – 11pm", word: "ทุ่ม", phonetics: "thûm", note: "1 ทุ่ม = 7pm, 2 ทุ่ม = 8pm… 5 ทุ่ม = 11pm" },
  { period: "Midnight", word: "เที่ยงคืน", phonetics: "thîang kheun", note: "เที่ยงคืน = 12am (midnight)" },
];

export const TIME_DRILLS = [
  // AM times
  { display: "1:00 AM", thai: "ตี 1", phonetics: "dtii nʉ̀ng", hour: 1 },
  { display: "2:00 AM", thai: "ตี 2", phonetics: "dtii sɔ̌ɔng", hour: 2 },
  { display: "3:00 AM", thai: "ตี 3", phonetics: "dtii sǎam", hour: 3 },
  { display: "4:00 AM", thai: "ตี 4", phonetics: "dtii sìi", hour: 4 },
  { display: "5:00 AM", thai: "ตี 5", phonetics: "dtii hâa", hour: 5 },
  { display: "6:00 AM", thai: "6 โมงเช้า", phonetics: "hòk mohng cháao", hour: 6 },
  { display: "7:00 AM", thai: "7 โมงเช้า", phonetics: "jèt mohng cháao", hour: 7 },
  { display: "8:00 AM", thai: "8 โมงเช้า", phonetics: "bpɛ̀ɛt mohng cháao", hour: 8 },
  { display: "9:00 AM", thai: "9 โมงเช้า", phonetics: "gâao mohng cháao", hour: 9 },
  { display: "10:00 AM", thai: "10 โมงเช้า", phonetics: "sìp mohng cháao", hour: 10 },
  { display: "11:00 AM", thai: "11 โมงเช้า", phonetics: "sìp-èt mohng cháao", hour: 11 },
  // Noon / PM
  { display: "12:00 PM", thai: "เที่ยง", phonetics: "thîang", hour: 12 },
  { display: "1:00 PM", thai: "บ่ายโมง", phonetics: "bàai mohng", hour: 13 },
  { display: "2:00 PM", thai: "บ่าย 2 โมง", phonetics: "bàai sɔ̌ɔng mohng", hour: 14 },
  { display: "3:00 PM", thai: "บ่าย 3 โมง", phonetics: "bàai sǎam mohng", hour: 15 },
  { display: "4:00 PM", thai: "4 โมงเย็น", phonetics: "sìi mohng yen", hour: 16 },
  { display: "5:00 PM", thai: "5 โมงเย็น", phonetics: "hâa mohng yen", hour: 17 },
  { display: "6:00 PM", thai: "6 โมงเย็น", phonetics: "hòk mohng yen", hour: 18 },
  { display: "7:00 PM", thai: "1 ทุ่ม", phonetics: "nʉ̀ng thûm", hour: 19 },
  { display: "8:00 PM", thai: "2 ทุ่ม", phonetics: "sɔ̌ɔng thûm", hour: 20 },
  { display: "9:00 PM", thai: "3 ทุ่ม", phonetics: "sǎam thûm", hour: 21 },
  { display: "10:00 PM", thai: "4 ทุ่ม", phonetics: "sìi thûm", hour: 22 },
  { display: "11:00 PM", thai: "5 ทุ่ม", phonetics: "hâa thûm", hour: 23 },
  { display: "12:00 AM", thai: "เที่ยงคืน", phonetics: "thîang kheun", hour: 0 },
];
