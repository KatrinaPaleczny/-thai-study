#!/usr/bin/env python3
"""
Expand Thai vocabulary to 1000+ words with CEFR levels.
Reads existing vocabData.js, adds level field, appends new entries.
"""
import json, re, sys, os

# Read existing data
with open(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'vocabData.js')) as f:
    content = f.read()
existing = json.loads(content.replace('export const VOCAB_DATA = ', '').rstrip().rstrip(';'))

# Assign CEFR levels to existing categories
CATEGORY_LEVELS = {
    "Greetings": "A1",
    "Numbers": "A1",
    "Colours": "A1",
    "Family": "A1",
    "Food": "A2",
    "Drinks & Fruit": "A2",
    "Time": "A2",
    "Directions": "A2",
    "Shopping": "A2",
    "Activities": "A2",
    "SmallTalk": "A2",
    "Country": "A2",
    "Language": "B1",
    "Connectives": "B1",
    "Entertainment": "B1",
    "Relationship": "B1",
}

# Add level to existing entries
for item in existing:
    item["level"] = CATEGORY_LEVELS.get(item["category"], "A2")

# Some existing words should be A1 regardless of category
A1_BASICS = {
    "ร้อน", "เย็น", "น้ำ", "ข้าว", "ไข่", "หมู", "ไก่", "ปลา", "ผัก", "ผลไม้",
    "กิน", "ดื่ม", "ไป", "มา", "ดี", "ไม่ดี", "ใช่", "ไม่ใช่", "มี", "ไม่มี",
    "อร่อย", "สวย", "ใหญ่", "เล็ก", "เยอะ", "นิดหน่อย",
    "พ่อ", "แม่", "พี่", "น้อง",
    "วันนี้", "พรุ่งนี้", "เมื่อวาน",
    "ขอบคุณ", "สวัสดี", "ลาก่อน",
}
for item in existing:
    if item["thai"] in A1_BASICS:
        item["level"] = "A1"

# Some complex connectives/relationship words should be B2
B2_WORDS = {
    "ทั้งๆที่", "กระนั้น", "อย่างไรก็ตาม", "ถึงแม้ว่า", "เนื่องจาก",
}
for item in existing:
    if item["thai"] in B2_WORDS:
        item["level"] = "B2"

next_id = max(item["id"] for item in existing) + 1

# ===== NEW VOCABULARY =====
NEW_WORDS = []

def add(thai, phonetics, english, category, emoji, level, ex_th=None, ex_ph=None, ex_en=None):
    global next_id
    NEW_WORDS.append({
        "id": next_id,
        "thai": thai,
        "phonetics": phonetics,
        "english": english,
        "category": category,
        "emoji": emoji,
        "level": level,
        "example_thai": ex_th,
        "example_phonetics": ex_ph,
        "example_english": ex_en,
    })
    next_id += 1

# ==================== HEALTH & BODY ====================
add("หมอ", "mɔ̌ɔ", "doctor", "Health & Body", "👨‍⚕️", "A1")
add("โรงพยาบาล", "roong-pá-yaa-baan", "hospital", "Health & Body", "🏥", "A1")
add("ร้านขายยา", "ráan kǎai yaa", "pharmacy", "Health & Body", "💊", "A2")
add("ยา", "yaa", "medicine", "Health & Body", "💊", "A1")
add("ป่วย", "bpùay", "sick; ill", "Health & Body", "🤒", "A1")
add("ปวดหัว", "bpùat hǔa", "headache", "Health & Body", "🤕", "A1")
add("ปวดท้อง", "bpùat tɔ́ɔng", "stomachache", "Health & Body", "🤢", "A1")
add("ไข้", "kâi", "fever", "Health & Body", "🤒", "A2")
add("หวัด", "wàt", "cold (illness)", "Health & Body", "🤧", "A2")
add("ไอ", "ai", "cough", "Health & Body", "😷", "A2")
add("เจ็บ", "jèp", "hurt; pain", "Health & Body", "😣", "A2")
add("แพ้", "páe", "allergic to", "Health & Body", "🤧", "A2")
add("หัว", "hǔa", "head", "Health & Body", "🧠", "A1")
add("ตา", "dtaa", "eye", "Health & Body", "👁️", "A1")
add("หู", "hǔu", "ear", "Health & Body", "👂", "A1")
add("จมูก", "jà-mùuk", "nose", "Health & Body", "👃", "A1")
add("ปาก", "bpàak", "mouth", "Health & Body", "👄", "A1")
add("ฟัน", "fan", "tooth; teeth", "Health & Body", "🦷", "A1")
add("มือ", "mʉʉ", "hand", "Health & Body", "✋", "A1")
add("เท้า", "táo", "foot", "Health & Body", "🦶", "A1")
add("แขน", "kǎen", "arm", "Health & Body", "💪", "A2")
add("ขา", "kǎa", "leg", "Health & Body", "🦵", "A2")
add("ท้อง", "tɔ́ɔng", "stomach; belly", "Health & Body", "🤰", "A2")
add("หลัง", "lǎng", "back (body)", "Health & Body", "🔙", "A2")
add("คอ", "kɔɔ", "neck; throat", "Health & Body", "🧣", "A2")
add("นิ้ว", "níu", "finger; toe", "Health & Body", "☝️", "A2")
add("ผม", "pǒm", "hair (head)", "Health & Body", "💇", "A2")
add("ผิว", "pǐu", "skin", "Health & Body", "🤲", "B1")
add("กระดูก", "grà-dùuk", "bone", "Health & Body", "🦴", "B1")
add("หัวใจ", "hǔa-jai", "heart", "Health & Body", "❤️", "B1")
add("เลือด", "lʉ̂at", "blood", "Health & Body", "🩸", "B1")
add("แข็งแรง", "kǎeng-raeng", "strong; healthy", "Health & Body", "💪", "A2")
add("อ่อนเพลีย", "ɔ̀ɔn-plia", "exhausted; weak", "Health & Body", "😫", "B1")
add("พักผ่อน", "pák-pɔ̀n", "rest; relax", "Health & Body", "😌", "A2")
add("ออกกำลังกาย", "ɔ̀ɔk-gam-lang-gaai", "exercise", "Health & Body", "🏃", "A2")
add("น้ำหนัก", "nám-nàk", "weight", "Health & Body", "⚖️", "B1")
add("สุขภาพ", "sùk-kà-pâap", "health", "Health & Body", "🏥", "B1")
add("ฉีดยา", "chìit yaa", "injection; vaccine", "Health & Body", "💉", "B1")
add("ตรวจ", "dtrùat", "examine; check up", "Health & Body", "🔍", "B1")
add("หายดี", "hǎai dii", "recovered; all better", "Health & Body", "😊", "A2")

# ==================== WEATHER ====================
add("อากาศ", "aa-gàat", "weather", "Weather", "🌤️", "A2")
add("ฝน", "fǒn", "rain", "Weather", "🌧️", "A1")
add("ฝนตก", "fǒn dtòk", "it's raining", "Weather", "🌧️", "A1")
add("แดด", "dàet", "sunshine; sun", "Weather", "☀️", "A1")
add("ร้อนมาก", "rɔ́ɔn mâak", "very hot", "Weather", "🥵", "A1")
add("หนาวมาก", "nǎao mâak", "very cold", "Weather", "🥶", "A1")
add("ลม", "lom", "wind", "Weather", "💨", "A2")
add("เมฆ", "mêek", "cloud", "Weather", "☁️", "A2")
add("หมอก", "mɔ̀ɔk", "fog; mist", "Weather", "🌫️", "B1")
add("พายุ", "paa-yú", "storm", "Weather", "⛈️", "B1")
add("ฟ้าร้อง", "fáa rɔ́ɔng", "thunder", "Weather", "⚡", "B1")
add("ฟ้าผ่า", "fáa pàa", "lightning", "Weather", "⚡", "B1")
add("น้ำท่วม", "nám tûam", "flood", "Weather", "🌊", "B1")
add("ร่ม", "rôm", "umbrella", "Weather", "☂️", "A2")
add("ฤดูร้อน", "rʉ́-duu rɔ́ɔn", "summer; hot season", "Weather", "☀️", "A2")
add("ฤดูฝน", "rʉ́-duu fǒn", "rainy season", "Weather", "🌧️", "A2")
add("ฤดูหนาว", "rʉ́-duu nǎao", "winter; cold season", "Weather", "❄️", "A2")
add("อุณหภูมิ", "un-hà-puum", "temperature", "Weather", "🌡️", "B1")
add("ชื้น", "chʉ́ʉn", "humid", "Weather", "💧", "B1")
add("แห้ง", "hâeng", "dry", "Weather", "🏜️", "B1")

# ==================== EMOTIONS ====================
add("ดีใจ", "dii-jai", "glad; happy", "Emotions", "😄", "A1")
add("เสียใจ", "sǐa-jai", "sad; sorry", "Emotions", "😢", "A1")
add("โกรธ", "gròot", "angry", "Emotions", "😡", "A2")
add("กลัว", "glua", "afraid; scared", "Emotions", "😨", "A2")
add("ตกใจ", "dtòk-jai", "shocked; startled", "Emotions", "😲", "A2")
add("เบื่อ", "bʉ̀a", "bored", "Emotions", "😑", "A2")
add("เหนื่อย", "nʉ̀ay", "tired", "Emotions", "😩", "A1")
add("สนุก", "sà-nùk", "fun; enjoyable", "Emotions", "🎉", "A1")
add("ตื่นเต้น", "dtʉ̀ʉn-dtên", "excited", "Emotions", "🤩", "A2")
add("กังวล", "gang-won", "worried; anxious", "Emotions", "😟", "B1")
add("ผิดหวัง", "pìt-wǎng", "disappointed", "Emotions", "😞", "B1")
add("อาย", "aai", "shy; embarrassed", "Emotions", "😳", "A2")
add("หึง", "hʉ̌ng", "jealous (romantic)", "Emotions", "😤", "B1")
add("อิจฉา", "ìt-chǎa", "jealous; envious", "Emotions", "😒", "B1")
add("เหงา", "ngǎo", "lonely", "Emotions", "😔", "A2")
add("สบายใจ", "sà-baai-jai", "at ease; relieved", "Emotions", "😌", "A2")
add("มั่นใจ", "mân-jai", "confident", "Emotions", "💪", "B1")
add("ภูมิใจ", "puum-jai", "proud", "Emotions", "🏆", "B1")
add("สงสาร", "sǒng-sǎan", "to pity; feel sorry for", "Emotions", "🥺", "B1")
add("ประทับใจ", "bprà-táp-jai", "impressed", "Emotions", "✨", "B1")
add("หงุดหงิด", "ngùt-ngìt", "irritated; annoyed", "Emotions", "😤", "B1")
add("ร้องไห้", "rɔ́ɔng-hâi", "cry", "Emotions", "😭", "A2")
add("หัวเราะ", "hǔa-rɔ́", "laugh", "Emotions", "😂", "A2")
add("ยิ้ม", "yím", "smile", "Emotions", "😊", "A1")
add("รัก", "rák", "love", "Emotions", "❤️", "A1")
add("คิดถึง", "kít-tʉ̌ng", "miss (someone)", "Emotions", "💭", "A2")
add("เกลียด", "glìat", "hate", "Emotions", "😠", "B1")
add("ตื่น", "dtʉ̀ʉn", "awake; to wake up", "Emotions", "⏰", "A2")
add("ง่วง", "ngûang", "sleepy; drowsy", "Emotions", "😴", "A2")
add("หิว", "hǐu", "hungry", "Emotions", "🍽️", "A1")

# ==================== WORK & OFFICE ====================
add("งาน", "ngaan", "work; job", "Work & Office", "💼", "A1")
add("ทำงาน", "tam-ngaan", "to work", "Work & Office", "👨‍💻", "A1")
add("ออฟฟิศ", "ɔ́ɔf-fít", "office", "Work & Office", "🏢", "A2")
add("เงินเดือน", "ngən-dʉan", "salary", "Work & Office", "💰", "B1")
add("เจ้านาย", "jâo-naai", "boss", "Work & Office", "👔", "A2")
add("ลูกค้า", "lûuk-káa", "customer; client", "Work & Office", "🤝", "B1")
add("ประชุม", "bprà-chum", "meeting", "Work & Office", "📋", "B1")
add("สัญญา", "sǎn-yaa", "contract; promise", "Work & Office", "📝", "B2")
add("บริษัท", "bɔɔ-rí-sàt", "company", "Work & Office", "🏢", "A2")
add("พนักงาน", "pá-nák-ngaan", "employee; staff", "Work & Office", "👨‍💼", "B1")
add("สัมภาษณ์", "sǎm-pâat", "interview", "Work & Office", "🎤", "B1")
add("ลาพัก", "laa pák", "take leave; vacation", "Work & Office", "🏖️", "B1")
add("เลิกงาน", "lɔ̂ɔk ngaan", "finish work", "Work & Office", "🏠", "A2")
add("วันหยุด", "wan yùt", "day off; holiday", "Work & Office", "📅", "A2")
add("ธุระ", "tú-rá", "errand; business", "Work & Office", "📌", "B1")
add("ส่งอีเมล", "sòng ii-meo", "send email", "Work & Office", "📧", "A2")
add("นัดหมาย", "nát-mǎai", "appointment", "Work & Office", "📅", "B1")
add("โปรเจกต์", "bproo-jèk", "project", "Work & Office", "📊", "B1")
add("เสร็จแล้ว", "sèt láeo", "finished; done", "Work & Office", "✅", "A1")
add("ยุ่ง", "yûng", "busy", "Work & Office", "🏃", "A2")
add("ว่าง", "wâang", "free; available", "Work & Office", "😊", "A2")

# ==================== TRAVEL & TRANSPORT ====================
add("สนามบิน", "sà-nǎam-bin", "airport", "Travel & Transport", "✈️", "A2")
add("เครื่องบิน", "krʉ̂ang-bin", "airplane", "Travel & Transport", "✈️", "A2")
add("รถไฟ", "rót-fai", "train", "Travel & Transport", "🚆", "A2")
add("รถไฟฟ้า", "rót-fai-fáa", "BTS/MRT; electric train", "Travel & Transport", "🚇", "A2")
add("รถเมล์", "rót-mee", "bus", "Travel & Transport", "🚌", "A2")
add("แท็กซี่", "tɛ́k-sîi", "taxi", "Travel & Transport", "🚕", "A1")
add("มอเตอร์ไซค์", "mɔɔ-dtəə-sai", "motorcycle", "Travel & Transport", "🏍️", "A2")
add("รถ", "rót", "car; vehicle", "Travel & Transport", "🚗", "A1")
add("เรือ", "rʉa", "boat; ship", "Travel & Transport", "🚢", "A2")
add("จักรยาน", "jàk-grà-yaan", "bicycle", "Travel & Transport", "🚲", "A2")
add("ตั๋ว", "dtǔa", "ticket", "Travel & Transport", "🎫", "A2")
add("กระเป๋า", "grà-bpǎo", "bag; luggage", "Travel & Transport", "🧳", "A2")
add("หนังสือเดินทาง", "nǎng-sʉ̌ʉ dəən-taang", "passport", "Travel & Transport", "🛂", "A2")
add("โรงแรม", "roong-raem", "hotel", "Travel & Transport", "🏨", "A2")
add("ที่พัก", "tîi-pák", "accommodation", "Travel & Transport", "🛏️", "A2")
add("จอง", "jɔɔng", "to book; reserve", "Travel & Transport", "📱", "A2")
add("ออกเดินทาง", "ɔ̀ɔk dəən-taang", "depart; set off", "Travel & Transport", "🛫", "B1")
add("ถึง", "tʉ̌ng", "arrive; reach", "Travel & Transport", "🛬", "A2")
add("ล่าช้า", "lâa-cháa", "delayed", "Travel & Transport", "⏰", "B1")
add("ท่องเที่ยว", "tɔ̂ɔng-tîao", "to travel; tour", "Travel & Transport", "🌍", "A2")
add("แผนที่", "pǎen-tîi", "map", "Travel & Transport", "🗺️", "A2")
add("ทางด่วน", "taang-dùan", "expressway", "Travel & Transport", "🛣️", "B1")
add("รถติด", "rót dtìt", "traffic jam", "Travel & Transport", "🚗", "A2")
add("ที่จอดรถ", "tîi jɔ̀ɔt rót", "parking lot", "Travel & Transport", "🅿️", "B1")
add("สถานี", "sà-tǎa-nii", "station", "Travel & Transport", "🚉", "A2")

# ==================== HOME & HOUSEHOLD ====================
add("บ้าน", "bâan", "house; home", "Home & Household", "🏠", "A1")
add("ห้องนอน", "hɔ̂ɔng-nɔɔn", "bedroom", "Home & Household", "🛏️", "A1")
add("ห้องน้ำ", "hɔ̂ɔng-náam", "bathroom", "Home & Household", "🚿", "A1")
add("ห้องครัว", "hɔ̂ɔng-krua", "kitchen", "Home & Household", "🍳", "A1")
add("ห้องนั่งเล่น", "hɔ̂ɔng nâng lên", "living room", "Home & Household", "🛋️", "A2")
add("ประตู", "bprà-dtuu", "door", "Home & Household", "🚪", "A1")
add("หน้าต่าง", "nâa-dtàang", "window", "Home & Household", "🪟", "A2")
add("กุญแจ", "gun-jae", "key", "Home & Household", "🔑", "A1")
add("โต๊ะ", "dtó", "table; desk", "Home & Household", "🪑", "A1")
add("เก้าอี้", "gâo-îi", "chair", "Home & Household", "🪑", "A1")
add("เตียง", "dtiang", "bed", "Home & Household", "🛏️", "A1")
add("ตู้เย็น", "dtûu-yen", "refrigerator", "Home & Household", "🧊", "A2")
add("พัดลม", "pát-lom", "fan", "Home & Household", "💨", "A2")
add("แอร์", "ae", "air conditioning", "Home & Household", "❄️", "A2")
add("ทีวี", "tii-wii", "television", "Home & Household", "📺", "A1")
add("ไฟ", "fai", "light; fire; electricity", "Home & Household", "💡", "A1")
add("น้ำประปา", "náam bprà-bpaa", "tap water", "Home & Household", "🚰", "A2")
add("ซักผ้า", "sák pâa", "do laundry", "Home & Household", "🧺", "A2")
add("ทำความสะอาด", "tam kwaam sà-àat", "to clean", "Home & Household", "🧹", "A2")
add("ขยะ", "kà-yà", "trash; garbage", "Home & Household", "🗑️", "A2")
add("สวน", "sǔan", "garden", "Home & Household", "🌿", "A2")
add("หลังคา", "lǎng-kaa", "roof", "Home & Household", "🏠", "B1")
add("พื้น", "pʉ́ʉn", "floor; ground", "Home & Household", "🏠", "A2")
add("ผนัง", "pà-nǎng", "wall", "Home & Household", "🧱", "B1")
add("บันได", "ban-dai", "stairs; ladder", "Home & Household", "🪜", "A2")
add("คอนโด", "kɔɔn-doo", "condo; apartment", "Home & Household", "🏢", "A2")
add("ค่าเช่า", "kâa châo", "rent", "Home & Household", "💰", "B1")
add("เพื่อนบ้าน", "pʉ̂an-bâan", "neighbor", "Home & Household", "👋", "A2")

# ==================== ANIMALS ====================
add("สุนัข", "sù-nák", "dog (formal)", "Animals", "🐕", "A1")
add("หมา", "mǎa", "dog", "Animals", "🐕", "A1")
add("แมว", "maeo", "cat", "Animals", "🐈", "A1")
add("ปลา", "bplaa", "fish", "Animals", "🐟", "A1")
add("นก", "nók", "bird", "Animals", "🐦", "A1")
add("ช้าง", "cháang", "elephant", "Animals", "🐘", "A1")
add("ลิง", "ling", "monkey", "Animals", "🐒", "A2")
add("งู", "nguu", "snake", "Animals", "🐍", "A2")
add("กุ้ง", "gûng", "shrimp; prawn", "Animals", "🦐", "A2")
add("ปู", "bpuu", "crab", "Animals", "🦀", "A2")
add("หมึก", "mʉ̀k", "squid; octopus", "Animals", "🦑", "A2")
add("วัว", "wua", "cow", "Animals", "🐄", "A2")
add("หมู", "mǔu", "pig", "Animals", "🐖", "A2")
add("ม้า", "máa", "horse", "Animals", "🐎", "A2")
add("กระต่าย", "grà-dtàai", "rabbit", "Animals", "🐰", "A2")
add("เป็ด", "bpèt", "duck", "Animals", "🦆", "A2")
add("ยุง", "yung", "mosquito", "Animals", "🦟", "A2")
add("แมลง", "má-laeng", "insect; bug", "Animals", "🐛", "B1")
add("เสือ", "sʉ̌a", "tiger", "Animals", "🐅", "B1")
add("จิ้งจก", "jîng-jòk", "gecko; lizard", "Animals", "🦎", "A2")
add("สัตว์", "sàt", "animal", "Animals", "🐾", "A2")
add("สัตว์เลี้ยง", "sàt líang", "pet", "Animals", "🐾", "A2")
add("ผีเสื้อ", "pǐi-sʉ̂a", "butterfly", "Animals", "🦋", "B1")
add("ตุ๊กแก", "dtúk-gae", "tokay gecko", "Animals", "🦎", "B1")

# ==================== NATURE ====================
add("ต้นไม้", "dtôn-máai", "tree", "Nature", "🌳", "A1")
add("ดอกไม้", "dɔ̀ɔk-máai", "flower", "Nature", "🌸", "A1")
add("ทะเล", "tá-lee", "sea; ocean", "Nature", "🌊", "A1")
add("ภูเขา", "puu-kǎo", "mountain", "Nature", "⛰️", "A2")
add("แม่น้ำ", "mâe-náam", "river", "Nature", "🏞️", "A2")
add("ป่า", "bpàa", "forest; jungle", "Nature", "🌲", "A2")
add("น้ำตก", "nám-dtòk", "waterfall", "Nature", "💦", "A2")
add("เกาะ", "gɔ̀", "island", "Nature", "🏝️", "A2")
add("หาด", "hàat", "beach", "Nature", "🏖️", "A2")
add("ทราย", "saai", "sand", "Nature", "🏖️", "A2")
add("ดิน", "din", "soil; earth", "Nature", "🌍", "A2")
add("หิน", "hǐn", "stone; rock", "Nature", "🪨", "A2")
add("ทุ่งนา", "tûng-naa", "rice field", "Nature", "🌾", "A2")
add("ดาว", "daao", "star", "Nature", "⭐", "A1")
add("พระจันทร์", "prá-jan", "moon", "Nature", "🌙", "A2")
add("พระอาทิตย์", "prá-aa-tít", "sun", "Nature", "☀️", "A2")
add("ท้องฟ้า", "tɔ́ɔng-fáa", "sky", "Nature", "🌈", "A2")
add("ถ้ำ", "tâm", "cave", "Nature", "🕳️", "B1")
add("ทะเลสาบ", "tá-lee sàap", "lake", "Nature", "🏞️", "B1")
add("สิ่งแวดล้อม", "sìng-wâet-lɔ́ɔm", "environment", "Nature", "🌍", "B2")

# ==================== TECHNOLOGY ====================
add("โทรศัพท์", "too-rá-sàp", "telephone; phone", "Technology", "📱", "A1")
add("มือถือ", "mʉʉ-tʉ̌ʉ", "mobile phone", "Technology", "📱", "A1")
add("คอมพิวเตอร์", "kɔɔm-píu-dtəə", "computer", "Technology", "💻", "A2")
add("อินเทอร์เน็ต", "in-təə-nét", "internet", "Technology", "🌐", "A2")
add("ไวไฟ", "wai-fai", "WiFi", "Technology", "📶", "A1")
add("รหัส", "rá-hàt", "password; code", "Technology", "🔐", "A2")
add("ชาร์จ", "cháat", "to charge (battery)", "Technology", "🔋", "A2")
add("ถ่ายรูป", "tàai rûup", "take a photo", "Technology", "📷", "A1")
add("กล้อง", "glɔ̂ɔng", "camera", "Technology", "📷", "A2")
add("ส่งข้อความ", "sòng kɔ̂ɔ-kwaam", "send a message", "Technology", "💬", "A2")
add("โพสต์", "pôot", "to post (social media)", "Technology", "📲", "A2")
add("ไลค์", "lái", "to like (social media)", "Technology", "👍", "A2")
add("แอป", "àep", "app; application", "Technology", "📱", "A2")
add("เว็บไซต์", "wép-sái", "website", "Technology", "🌐", "B1")
add("ดาวน์โหลด", "daao-lòot", "download", "Technology", "⬇️", "B1")
add("อัปโหลด", "àp-lòot", "upload", "Technology", "⬆️", "B1")
add("แบตเตอรี่", "bàet-dtəə-rîi", "battery", "Technology", "🔋", "A2")
add("จอ", "jɔɔ", "screen; monitor", "Technology", "🖥️", "A2")
add("พิมพ์", "pim", "type; print", "Technology", "⌨️", "A2")
add("ลบ", "lóp", "delete; erase", "Technology", "🗑️", "A2")

# ==================== CLOTHING ====================
add("เสื้อ", "sʉ̂a", "shirt; top", "Clothing", "👕", "A1")
add("กางเกง", "gaang-geeng", "pants; trousers", "Clothing", "👖", "A1")
add("กระโปรง", "grà-bproong", "skirt", "Clothing", "👗", "A2")
add("ชุด", "chút", "outfit; set; dress", "Clothing", "👗", "A2")
add("รองเท้า", "rɔɔng-táo", "shoes", "Clothing", "👟", "A1")
add("ถุงเท้า", "tǔng-táo", "socks", "Clothing", "🧦", "A2")
add("หมวก", "mùak", "hat; cap", "Clothing", "🧢", "A2")
add("แว่นตา", "wâen-dtaa", "glasses", "Clothing", "👓", "A2")
add("นาฬิกา", "naa-lí-gaa", "watch; clock", "Clothing", "⌚", "A2")
add("แหวน", "wǎen", "ring (jewelry)", "Clothing", "💍", "A2")
add("สร้อยคอ", "sɔ̂ɔi-kɔɔ", "necklace", "Clothing", "📿", "A2")
add("กระเป๋าสตางค์", "grà-bpǎo sà-dtaang", "wallet", "Clothing", "👛", "A2")
add("ร่ม", "rôm", "umbrella", "Clothing", "☂️", "A2")
add("เสื้อกันหนาว", "sʉ̂a gan nǎao", "sweater; jacket", "Clothing", "🧥", "A2")
add("เสื้อยืด", "sʉ̂a yʉ̂ʉt", "T-shirt", "Clothing", "👕", "A1")
add("ชุดนอน", "chút nɔɔn", "pajamas", "Clothing", "🩳", "A2")
add("ใส่", "sài", "to wear; put on", "Clothing", "👔", "A1")
add("ถอด", "tɔ̀ɔt", "to take off (clothes)", "Clothing", "👕", "A2")
add("ซัก", "sák", "to wash (clothes)", "Clothing", "🧺", "A2")
add("รีด", "rîit", "to iron (clothes)", "Clothing", "🔥", "B1")

# ==================== EDUCATION ====================
add("โรงเรียน", "roong-rian", "school", "Education", "🏫", "A1")
add("มหาวิทยาลัย", "má-hǎa-wít-tá-yaa-lai", "university", "Education", "🎓", "A2")
add("ครู", "kruu", "teacher", "Education", "👨‍🏫", "A1")
add("อาจารย์", "aa-jaan", "professor; teacher (formal)", "Education", "👩‍🏫", "A2")
add("นักเรียน", "nák-rian", "student (school)", "Education", "👨‍🎓", "A1")
add("นักศึกษา", "nák-sʉ̀k-sǎa", "student (university)", "Education", "🎓", "A2")
add("หนังสือ", "nǎng-sʉ̌ʉ", "book", "Education", "📚", "A1")
add("ปากกา", "bpàak-gaa", "pen", "Education", "🖊️", "A1")
add("ดินสอ", "din-sɔ̌ɔ", "pencil", "Education", "✏️", "A1")
add("สมุด", "sà-mùt", "notebook", "Education", "📓", "A1")
add("สอบ", "sɔ̀ɔp", "exam; test", "Education", "📝", "A2")
add("การบ้าน", "gaan-bâan", "homework", "Education", "📋", "A2")
add("เรียน", "rian", "to study; learn", "Education", "📖", "A1")
add("สอน", "sɔ̌ɔn", "to teach", "Education", "👩‍🏫", "A2")
add("อ่าน", "àan", "to read", "Education", "📖", "A1")
add("เขียน", "kǐan", "to write", "Education", "✍️", "A1")
add("วิชา", "wí-chaa", "subject (academic)", "Education", "📚", "A2")
add("ห้องเรียน", "hɔ̂ɔng-rian", "classroom", "Education", "🏫", "A2")
add("สอบผ่าน", "sɔ̀ɔp pàan", "pass an exam", "Education", "✅", "A2")
add("สอบตก", "sɔ̀ɔp dtòk", "fail an exam", "Education", "❌", "A2")

# ==================== COMMON VERBS ====================
add("ไป", "bpai", "to go", "Verbs", "🚶", "A1")
add("มา", "maa", "to come", "Verbs", "🏃", "A1")
add("กิน", "gin", "to eat", "Verbs", "🍽️", "A1")
add("ดื่ม", "dʉ̀ʉm", "to drink", "Verbs", "🥤", "A1")
add("นอน", "nɔɔn", "to sleep; lie down", "Verbs", "😴", "A1")
add("พูด", "pûut", "to speak; talk", "Verbs", "💬", "A1")
add("ฟัง", "fang", "to listen", "Verbs", "👂", "A1")
add("ดู", "duu", "to look; watch", "Verbs", "👀", "A1")
add("เห็น", "hěn", "to see", "Verbs", "👁️", "A1")
add("รู้", "rúu", "to know (a fact)", "Verbs", "🧠", "A1")
add("รู้จัก", "rúu-jàk", "to know (a person); to be familiar with", "Verbs", "🤝", "A2")
add("เข้าใจ", "kâo-jai", "to understand", "Verbs", "💡", "A1")
add("ซื้อ", "sʉ́ʉ", "to buy", "Verbs", "🛒", "A1")
add("ขาย", "kǎai", "to sell", "Verbs", "💲", "A2")
add("ให้", "hâi", "to give", "Verbs", "🎁", "A1")
add("ได้", "dâi", "to get; can; able to", "Verbs", "✅", "A1")
add("อยาก", "yàak", "to want", "Verbs", "🙏", "A1")
add("ต้อง", "dtɔ̂ng", "must; have to", "Verbs", "❗", "A1")
add("ชอบ", "chɔ̂ɔp", "to like", "Verbs", "👍", "A1")
add("คิด", "kít", "to think", "Verbs", "🤔", "A2")
add("ทำ", "tam", "to do; make", "Verbs", "🛠️", "A1")
add("เปิด", "bpəət", "to open; turn on", "Verbs", "🔓", "A1")
add("ปิด", "bpìt", "to close; turn off", "Verbs", "🔒", "A1")
add("เริ่ม", "rə̂əm", "to begin; start", "Verbs", "▶️", "A2")
add("หยุด", "yùt", "to stop", "Verbs", "⏹️", "A2")
add("เดิน", "dəən", "to walk", "Verbs", "🚶", "A1")
add("วิ่ง", "wîng", "to run", "Verbs", "🏃", "A1")
add("นั่ง", "nâng", "to sit", "Verbs", "💺", "A1")
add("ยืน", "yʉʉn", "to stand", "Verbs", "🧍", "A1")
add("ขับ", "kàp", "to drive", "Verbs", "🚗", "A2")
add("บิน", "bin", "to fly", "Verbs", "✈️", "A2")
add("ว่ายน้ำ", "wâai-náam", "to swim", "Verbs", "🏊", "A2")
add("ส่ง", "sòng", "to send", "Verbs", "📨", "A2")
add("รับ", "ráp", "to receive; accept", "Verbs", "📩", "A2")
add("หา", "hǎa", "to find; look for", "Verbs", "🔍", "A2")
add("เลือก", "lʉ̂ak", "to choose; select", "Verbs", "👆", "A2")
add("ใช้", "chái", "to use", "Verbs", "🔧", "A1")
add("ช่วย", "chûay", "to help", "Verbs", "🤲", "A1")
add("บอก", "bɔ̀ɔk", "to tell", "Verbs", "🗣️", "A2")
add("ถาม", "tǎam", "to ask", "Verbs", "❓", "A2")
add("ตอบ", "dtɔ̀ɔp", "to answer; reply", "Verbs", "💬", "A2")
add("จำ", "jam", "to remember", "Verbs", "🧠", "A2")
add("ลืม", "lʉʉm", "to forget", "Verbs", "🤷", "A2")
add("เปลี่ยน", "bplìan", "to change", "Verbs", "🔄", "A2")
add("รอ", "rɔɔ", "to wait", "Verbs", "⏳", "A1")
add("โทร", "too", "to call (phone)", "Verbs", "📞", "A2")
add("จ่าย", "jàai", "to pay", "Verbs", "💳", "A2")
add("เล่น", "lên", "to play", "Verbs", "🎮", "A1")
add("ร้อง", "rɔ́ɔng", "to sing; cry out", "Verbs", "🎤", "A2")
add("เต้น", "dtên", "to dance", "Verbs", "💃", "A2")
add("ตัด", "dtàt", "to cut", "Verbs", "✂️", "A2")
add("ล้าง", "láang", "to wash; clean", "Verbs", "🧼", "A2")
add("ทำอาหาร", "tam aa-hǎan", "to cook", "Verbs", "👨‍🍳", "A2")
add("ตื่น", "dtʉ̀ʉn", "to wake up", "Verbs", "⏰", "A1")
add("อาบน้ำ", "àap-náam", "to shower; bathe", "Verbs", "🚿", "A1")
add("แต่งตัว", "dtàeng-dtua", "to get dressed", "Verbs", "👔", "A2")

# ==================== ADJECTIVES ====================
add("ใหม่", "mài", "new", "Adjectives", "✨", "A1")
add("เก่า", "gào", "old (things)", "Adjectives", "📦", "A1")
add("แพง", "paeng", "expensive", "Adjectives", "💰", "A1")
add("ถูก", "tùuk", "cheap; correct", "Adjectives", "💵", "A1")
add("ง่าย", "ngâai", "easy", "Adjectives", "😎", "A1")
add("ยาก", "yâak", "difficult; hard", "Adjectives", "😰", "A1")
add("เร็ว", "reo", "fast; quick", "Adjectives", "⚡", "A1")
add("ช้า", "cháa", "slow", "Adjectives", "🐢", "A1")
add("สวย", "sǔay", "beautiful; pretty", "Adjectives", "✨", "A1")
add("หล่อ", "lɔ̀ɔ", "handsome", "Adjectives", "😎", "A1")
add("น่ารัก", "nâa-rák", "cute; lovely", "Adjectives", "🥰", "A1")
add("อ้วน", "ûan", "fat", "Adjectives", "🐻", "A2")
add("ผอม", "pɔ̌ɔm", "thin; skinny", "Adjectives", "🦴", "A2")
add("สูง", "sǔung", "tall; high", "Adjectives", "📏", "A1")
add("เตี้ย", "dtîa", "short (height)", "Adjectives", "📏", "A1")
add("ยาว", "yaao", "long", "Adjectives", "📐", "A1")
add("สั้น", "sân", "short (length)", "Adjectives", "📐", "A1")
add("หนัก", "nàk", "heavy", "Adjectives", "🏋️", "A2")
add("เบา", "bao", "light (weight)", "Adjectives", "🪶", "A2")
add("สะอาด", "sà-àat", "clean", "Adjectives", "✨", "A2")
add("สกปรก", "sòk-gà-bpròk", "dirty", "Adjectives", "🤮", "A2")
add("แข็ง", "kǎeng", "hard; solid", "Adjectives", "🪨", "B1")
add("นิ่ม", "nîm", "soft", "Adjectives", "🧸", "B1")
add("เผ็ด", "pèt", "spicy", "Adjectives", "🌶️", "A1")
add("หวาน", "wǎan", "sweet", "Adjectives", "🍬", "A1")
add("เปรี้ยว", "bprîao", "sour", "Adjectives", "🍋", "A1")
add("เค็ม", "kem", "salty", "Adjectives", "🧂", "A1")
add("ขม", "kǒm", "bitter", "Adjectives", "😖", "A2")
add("มัน", "man", "oily; fatty", "Adjectives", "🍟", "A2")
add("จืด", "jʉ̀ʉt", "bland; tasteless", "Adjectives", "😐", "A2")
add("สด", "sòt", "fresh", "Adjectives", "🥬", "A2")
add("เน่า", "nâo", "rotten; spoiled", "Adjectives", "🤢", "B1")
add("ว่าง", "wâang", "empty; free; available", "Adjectives", "📭", "A2")
add("เต็ม", "dtem", "full", "Adjectives", "📦", "A2")
add("ถูกต้อง", "tùuk-dtɔ̂ɔng", "correct; right", "Adjectives", "✅", "A2")
add("ผิด", "pìt", "wrong; incorrect", "Adjectives", "❌", "A2")
add("สำคัญ", "sǎm-kan", "important", "Adjectives", "⭐", "B1")
add("อันตราย", "an-dtà-raai", "dangerous", "Adjectives", "⚠️", "B1")
add("ปลอดภัย", "bplɔ̀ɔt-pai", "safe", "Adjectives", "🛡️", "B1")
add("พิเศษ", "pí-sèet", "special", "Adjectives", "🌟", "A2")

# ==================== QUESTION WORDS ====================
add("อะไร", "à-rai", "what", "Question Words", "❓", "A1")
add("ใคร", "krai", "who", "Question Words", "👤", "A1")
add("ที่ไหน", "tîi-nǎi", "where", "Question Words", "📍", "A1")
add("เมื่อไร", "mʉ̂a-rai", "when", "Question Words", "📅", "A1")
add("ทำไม", "tam-mai", "why", "Question Words", "🤷", "A1")
add("อย่างไร", "yàang-rai", "how (formal)", "Question Words", "🔧", "A2")
add("ยังไง", "yang-ngai", "how (informal)", "Question Words", "🔧", "A1")
add("เท่าไร", "tâo-rai", "how much; how many", "Question Words", "🔢", "A1")
add("กี่", "gìi", "how many", "Question Words", "🔢", "A1")
add("ไหม", "mǎi", "question particle (yes/no)", "Question Words", "❓", "A1")
add("หรือ", "rʉ̌ʉ", "or; question particle", "Question Words", "🔀", "A1")
add("ใช่ไหม", "châi mǎi", "right?; isn't it?", "Question Words", "✅", "A1")
add("แบบไหน", "bàep nǎi", "which kind; what type", "Question Words", "🤔", "A2")
add("ตัวไหน", "dtua nǎi", "which one", "Question Words", "👆", "A2")
add("เรื่องอะไร", "rʉ̂ang à-rai", "about what; what's up", "Question Words", "💭", "A2")

# ==================== POLITE EXPRESSIONS ====================
add("ขอโทษ", "kɔ̌ɔ-tôot", "sorry; excuse me", "Polite Expressions", "🙏", "A1")
add("ไม่เป็นไร", "mâi bpen rai", "it's okay; never mind", "Polite Expressions", "😊", "A1")
add("ยินดี", "yin-dii", "glad; pleased; you're welcome", "Polite Expressions", "😊", "A1")
add("ขอ", "kɔ̌ɔ", "may I; please (request)", "Polite Expressions", "🙏", "A1")
add("ได้เลย", "dâi ləəi", "go ahead; sure", "Polite Expressions", "👍", "A1")
add("ช่วยด้วย", "chûay dûay", "help me please", "Polite Expressions", "🆘", "A1")
add("เชิญ", "chəən", "please (inviting); go ahead", "Polite Expressions", "🤲", "A2")
add("ขอบใจ", "kɔ̀ɔp-jai", "thanks (informal)", "Polite Expressions", "🙏", "A1")
add("สู้ๆ", "sûu sûu", "keep going; fighting!", "Polite Expressions", "💪", "A1")
add("โชคดี", "chôok-dii", "good luck", "Polite Expressions", "🍀", "A1")
add("ไม่เป็นไร", "mâi bpen rai", "it's fine; no problem", "Polite Expressions", "👌", "A1")
add("แสดงความยินดี", "sà-daeng kwaam yin-dii", "congratulations", "Polite Expressions", "🎉", "B1")
add("ขออภัย", "kɔ̌ɔ-à-pai", "I apologize (formal)", "Polite Expressions", "🙇", "B1")
add("ด้วยความยินดี", "dûay kwaam yin-dii", "with pleasure; gladly", "Polite Expressions", "😊", "B1")
add("ขอให้มีความสุข", "kɔ̌ɔ hâi mii kwaam-sùk", "wishing you happiness", "Polite Expressions", "🎊", "B1")

# ==================== EXPAND EXISTING: MORE FOOD ====================
add("ข้าวผัด", "kâao pàt", "fried rice", "Food", "🍚", "A1")
add("ข้าวต้ม", "kâao dtôm", "rice porridge", "Food", "🍜", "A2")
add("ผัดไทย", "pàt tai", "pad Thai", "Food", "🍝", "A1")
add("ต้มยำกุ้ง", "dtôm yam gûng", "tom yum goong", "Food", "🍲", "A2")
add("ส้มตำ", "sôm-dtam", "papaya salad", "Food", "🥗", "A2")
add("แกงเขียวหวาน", "gaeng kǐao wǎan", "green curry", "Food", "🍛", "A2")
add("มะม่วง", "má-mûang", "mango", "Food", "🥭", "A1")
add("ทุเรียน", "tú-rian", "durian", "Food", "🍈", "A2")
add("เส้น", "sên", "noodle; line", "Food", "🍜", "A2")
add("กะเพรา", "gà-prao", "holy basil", "Food", "🌿", "A2")
add("ข้าวเหนียว", "kâao nǐao", "sticky rice", "Food", "🍚", "A2")
add("หมูกรอบ", "mǔu grɔ̀ɔp", "crispy pork", "Food", "🥓", "A2")
add("น้ำพริก", "nám prík", "chili paste; dip", "Food", "🌶️", "A2")
add("ขนม", "kà-nǒm", "snack; dessert", "Food", "🍰", "A2")
add("ไอศกรีม", "ai-sà-griim", "ice cream", "Food", "🍦", "A1")

# ==================== EXPAND: MORE NUMBERS ====================
add("ร้อย", "rɔ́ɔi", "hundred", "Numbers", "💯", "A1")
add("พัน", "pan", "thousand", "Numbers", "🔢", "A2")
add("หมื่น", "mʉ̀ʉn", "ten thousand", "Numbers", "🔢", "A2")
add("แสน", "sǎen", "hundred thousand", "Numbers", "🔢", "B1")
add("ล้าน", "láan", "million", "Numbers", "🔢", "B1")
add("ครึ่ง", "krʉ̂ng", "half", "Numbers", "½", "A1")
add("คู่", "kûu", "pair; even", "Numbers", "👫", "A2")
add("คี่", "kîi", "odd (number)", "Numbers", "🔢", "A2")
add("ที่หนึ่ง", "tîi nʉ̀ng", "first (ordinal)", "Numbers", "🥇", "A1")
add("ที่สอง", "tîi sɔ̌ɔng", "second (ordinal)", "Numbers", "🥈", "A1")

# ==================== EXPAND: MORE TIME ====================
add("ชั่วโมง", "chûa-moong", "hour", "Time", "🕐", "A1")
add("นาที", "naa-tii", "minute", "Time", "⏱️", "A1")
add("วินาที", "wí-naa-tii", "second (time)", "Time", "⏱️", "A2")
add("เดือน", "dʉan", "month", "Time", "📅", "A1")
add("ปี", "bpii", "year", "Time", "📅", "A1")
add("สัปดาห์", "sàp-daa", "week", "Time", "📅", "A1")
add("เช้า", "cháo", "morning", "Time", "🌅", "A1")
add("บ่าย", "bàai", "afternoon", "Time", "🌤️", "A1")
add("กลางคืน", "glaang-kʉʉn", "nighttime", "Time", "🌙", "A1")
add("กลางวัน", "glaang-wan", "daytime", "Time", "☀️", "A1")
add("มะรืน", "má-rʉʉn", "day after tomorrow", "Time", "📅", "A2")
add("เมื่อวานซืน", "mʉ̂a-waan-sʉʉn", "day before yesterday", "Time", "📅", "A2")

# ==================== EXPAND: MORE COUNTRIES ====================
add("ประเทศไทย", "bprà-têet tai", "Thailand", "Country", "🇹🇭", "A1")
add("ญี่ปุ่น", "yîi-bpùn", "Japan", "Country", "🇯🇵", "A1")
add("จีน", "jiin", "China", "Country", "🇨🇳", "A1")
add("เกาหลี", "gao-lǐi", "Korea", "Country", "🇰🇷", "A1")
add("อเมริกา", "à-mee-rí-gaa", "America; USA", "Country", "🇺🇸", "A1")
add("อังกฤษ", "ang-grìt", "England; English", "Country", "🇬🇧", "A1")
add("ฝรั่งเศส", "fà-ràng-sèet", "France", "Country", "🇫🇷", "A2")
add("เยอรมัน", "yəə-rá-man", "Germany", "Country", "🇩🇪", "A2")
add("ออสเตรเลีย", "ɔ̀ɔt-dtree-lia", "Australia", "Country", "🇦🇺", "A1")
add("อินเดีย", "in-dia", "India", "Country", "🇮🇳", "A2")
add("เวียดนาม", "wiat-naam", "Vietnam", "Country", "🇻🇳", "A2")
add("ลาว", "laao", "Laos", "Country", "🇱🇦", "A2")
add("พม่า", "pá-mâa", "Myanmar", "Country", "🇲🇲", "A2")
add("กัมพูชา", "gam-puu-chaa", "Cambodia", "Country", "🇰🇭", "A2")
add("มาเลเซีย", "maa-lee-sia", "Malaysia", "Country", "🇲🇾", "A2")

# ==================== EXPAND: MORE ACTIVITIES ====================
add("วาดรูป", "wâat rûup", "to draw; paint", "Activities", "🎨", "A2")
add("ถ่ายรูป", "tàai rûup", "to take a photo", "Activities", "📷", "A2")
add("ปีนเขา", "bpiin kǎo", "to climb a mountain", "Activities", "🧗", "B1")
add("ตกปลา", "dtòk bplaa", "to fish", "Activities", "🎣", "A2")
add("ทำสวน", "tam sǔan", "to garden", "Activities", "🌱", "A2")
add("เล่นดนตรี", "lên don-dtrii", "to play music", "Activities", "🎵", "A2")
add("ร้องเพลง", "rɔ́ɔng pleeng", "to sing", "Activities", "🎤", "A2")
add("อ่านหนังสือ", "àan nǎng-sʉ̌ʉ", "to read a book", "Activities", "📚", "A1")
add("ดูหนัง", "duu nǎng", "to watch a movie", "Activities", "🎬", "A1")
add("เล่นกีฬา", "lên gii-laa", "to play sports", "Activities", "⚽", "A2")
add("ว่ายน้ำ", "wâai náam", "to swim", "Activities", "🏊", "A2")
add("วิ่ง", "wîng", "to run; jog", "Activities", "🏃", "A1")
add("โยคะ", "yoo-ká", "yoga", "Activities", "🧘", "A2")
add("นวด", "nûat", "massage", "Activities", "💆", "A2")

# ==================== EXPAND: MORE SHOPPING ====================
add("ตลาด", "dtà-làat", "market", "Shopping", "🏪", "A1")
add("ห้างสรรพสินค้า", "hâang sàp-pá-sǐn-káa", "department store", "Shopping", "🏬", "A2")
add("เซเว่น", "see-wen", "7-Eleven", "Shopping", "🏪", "A1")
add("ใบเสร็จ", "bai-sèt", "receipt", "Shopping", "🧾", "A2")
add("ส่วนลด", "sùan-lót", "discount", "Shopping", "🏷️", "A2")
add("โปรโมชั่น", "bproo-moo-chân", "promotion; sale", "Shopping", "🎉", "A2")
add("ลองดู", "lɔɔng duu", "try it; give it a try", "Shopping", "👀", "A2")
add("ถุง", "tǔng", "bag; sack", "Shopping", "🛍️", "A2")
add("ขนาด", "kà-nàat", "size", "Shopping", "📏", "A2")
add("สี", "sǐi", "color", "Shopping", "🎨", "A1")

# ==================== EXPAND: MORE ENTERTAINMENT ====================
add("เพลง", "pleeng", "song; music", "Entertainment", "🎵", "A1")
add("หนัง", "nǎng", "movie; film", "Entertainment", "🎬", "A1")
add("ละคร", "lá-kɔɔn", "drama; TV series", "Entertainment", "📺", "A2")
add("เกม", "geem", "game", "Entertainment", "🎮", "A1")
add("คอนเสิร์ต", "kɔɔn-sɔ̀ət", "concert", "Entertainment", "🎤", "A2")
add("พิพิธภัณฑ์", "pí-pít-tá-pan", "museum", "Entertainment", "🏛️", "B1")
add("สวนสัตว์", "sǔan-sàt", "zoo", "Entertainment", "🦁", "A2")
add("สวนสนุก", "sǔan sà-nùk", "amusement park", "Entertainment", "🎢", "A2")
add("วัด", "wát", "temple", "Entertainment", "🛕", "A1")
add("กีฬา", "gii-laa", "sport", "Entertainment", "⚽", "A2")
add("ฟุตบอล", "fút-bɔɔn", "football; soccer", "Entertainment", "⚽", "A2")
add("มวยไทย", "muay tai", "Muay Thai; Thai boxing", "Entertainment", "🥊", "A2")

# ==================== PREPOSITIONS & LOCATION ====================
add("ข้างบน", "kâang bon", "above; upstairs", "Directions", "⬆️", "A2")
add("ข้างล่าง", "kâang lâang", "below; downstairs", "Directions", "⬇️", "A2")
add("ข้างใน", "kâang nai", "inside", "Directions", "🔽", "A2")
add("ข้างนอก", "kâang nɔ̂ɔk", "outside", "Directions", "🔼", "A2")
add("ข้างๆ", "kâang kâang", "beside; next to", "Directions", "↔️", "A2")
add("ระหว่าง", "rá-wàang", "between", "Directions", "↔️", "B1")
add("ตรงข้าม", "dtrong kâam", "opposite; across from", "Directions", "🔄", "A2")
add("ใกล้", "glâi", "near; close", "Directions", "📍", "A1")
add("ไกล", "glai", "far", "Directions", "🏔️", "A1")

# ==================== MORE VERBS (B1/B2 level) ====================
add("อธิบาย", "à-tí-baai", "to explain", "Verbs", "📢", "B1")
add("แนะนำ", "náe-nam", "to recommend; introduce", "Verbs", "👋", "A2")
add("ตัดสินใจ", "dtàt-sǐn-jai", "to decide", "Verbs", "🤔", "B1")
add("เตรียม", "dtriiam", "to prepare", "Verbs", "📋", "B1")
add("สมัคร", "sà-màk", "to apply; register", "Verbs", "📝", "B1")
add("ยืม", "yʉʉm", "to borrow", "Verbs", "🤲", "A2")
add("คืน", "kʉʉn", "to return (something)", "Verbs", "↩️", "A2")
add("แบ่ง", "bàeng", "to share; divide", "Verbs", "🔄", "A2")
add("เก็บ", "gèp", "to keep; collect; tidy up", "Verbs", "📦", "A2")
add("แก้", "gâe", "to fix; solve", "Verbs", "🔧", "B1")
add("สร้าง", "sâang", "to build; create", "Verbs", "🏗️", "B1")
add("ทำลาย", "tam-laai", "to destroy", "Verbs", "💥", "B2")
add("ป้องกัน", "bpɔ̂ng-gan", "to prevent; protect", "Verbs", "🛡️", "B2")
add("พัฒนา", "pát-tá-naa", "to develop; improve", "Verbs", "📈", "B2")
add("จัดการ", "jàt-gaan", "to manage; handle", "Verbs", "📊", "B1")
add("เปรียบเทียบ", "bprìap-tîap", "to compare", "Verbs", "⚖️", "B2")
add("สนับสนุน", "sà-nàp-sà-nǔn", "to support", "Verbs", "🤝", "B2")
add("ยกเลิก", "yók-lɔ̂ɔk", "to cancel", "Verbs", "❌", "B1")
add("ขโมย", "kà-mooi", "to steal", "Verbs", "🥷", "B1")
add("หนี", "nǐi", "to escape; run away", "Verbs", "🏃", "B1")

# ==================== MORE ADJECTIVES ====================
add("เก่ง", "gèng", "skilled; talented", "Adjectives", "🌟", "A1")
add("ขี้เกียจ", "kîi-gìat", "lazy", "Adjectives", "😴", "A2")
add("ขยัน", "kà-yǎn", "diligent; hardworking", "Adjectives", "💪", "A2")
add("เงียบ", "ngîap", "quiet; silent", "Adjectives", "🤫", "A2")
add("ดัง", "dang", "loud; famous", "Adjectives", "📢", "A2")
add("มืด", "mʉ̂ʉt", "dark", "Adjectives", "🌑", "A2")
add("สว่าง", "sà-wàang", "bright; light", "Adjectives", "💡", "A2")
add("หนา", "nǎa", "thick", "Adjectives", "📏", "B1")
add("บาง", "baang", "thin (objects)", "Adjectives", "📄", "B1")
add("กว้าง", "gwâang", "wide; spacious", "Adjectives", "↔️", "A2")
add("แคบ", "kâep", "narrow", "Adjectives", "↕️", "B1")
add("ลึก", "lʉ́k", "deep", "Adjectives", "🌊", "B1")
add("ตื้น", "dtʉ̂ʉn", "shallow", "Adjectives", "💧", "B1")
add("เปียก", "bpìak", "wet", "Adjectives", "💧", "A2")
add("แห้ง", "hâeng", "dry", "Adjectives", "☀️", "A2")
add("ร้อนแรง", "rɔ́ɔn-raeng", "intense; fierce", "Adjectives", "🔥", "B2")
add("นุ่ม", "nûm", "soft; tender", "Adjectives", "🧸", "A2")
add("กรอบ", "grɔ̀ɔp", "crispy; crunchy", "Adjectives", "🥓", "A2")
add("สุก", "sùk", "ripe; cooked", "Adjectives", "🍎", "A2")
add("ดิบ", "dìp", "raw; uncooked", "Adjectives", "🥩", "A2")

# ==================== MORE EMOTIONS ====================
add("สงบ", "sà-ngòp", "calm; peaceful", "Emotions", "🧘", "B1")
add("โมโห", "moo-hǒo", "furious; very angry", "Emotions", "🤬", "B1")
add("ตื่นเต้น", "dtʉ̀ʉn-dtên", "excited; thrilled", "Emotions", "🎢", "A2")
add("สับสน", "sàp-sǒn", "confused", "Emotions", "😵", "B1")
add("มึน", "mʉn", "dizzy; dazed", "Emotions", "😵‍💫", "B1")
add("พอใจ", "pɔɔ-jai", "satisfied; content", "Emotions", "😊", "B1")
add("เจ็บใจ", "jèp-jai", "heartbroken; hurt (emotionally)", "Emotions", "💔", "B1")
add("ท้อ", "tɔ́ɔ", "discouraged", "Emotions", "😞", "B1")
add("ดุ", "dù", "fierce; stern", "Emotions", "😠", "A2")
add("ใจดี", "jai-dii", "kind; generous", "Emotions", "😇", "A1")
add("ใจร้าย", "jai-ráai", "mean; cruel", "Emotions", "😈", "B1")

# ==================== MORE HEALTH ====================
add("ท้องเสีย", "tɔ́ɔng-sǐa", "diarrhea", "Health & Body", "🚽", "A2")
add("คลื่นไส้", "klʉ̂ʉn-sâi", "nauseous", "Health & Body", "🤢", "B1")
add("วิงเวียน", "wing-wian", "dizzy", "Health & Body", "😵‍💫", "B1")
add("ผ่าตัด", "pàa-dtàt", "surgery; operation", "Health & Body", "🏥", "B2")
add("ฟันผุ", "fan pù", "cavity; tooth decay", "Health & Body", "🦷", "A2")

# ==================== MORE TRAVEL ====================
add("วีซ่า", "wii-sâa", "visa", "Travel & Transport", "📋", "B1")
add("ประกันภัย", "bprà-gan-pai", "insurance", "Travel & Transport", "📋", "B2")
add("แลกเงิน", "lâek ngən", "exchange money", "Travel & Transport", "💱", "A2")
add("ทัวร์", "tua", "tour", "Travel & Transport", "🗺️", "A2")
add("มัคคุเทศก์", "mák-kú-têet", "tour guide", "Travel & Transport", "🧑‍🏫", "B1")
add("เช็คอิน", "chék-in", "check in", "Travel & Transport", "✅", "A2")
add("เช็คเอาท์", "chék-ao", "check out", "Travel & Transport", "🚪", "A2")
add("ผ่านแดน", "pàan daen", "cross the border", "Travel & Transport", "🛃", "B1")
add("ต่อเครื่อง", "dtɔ̀ɔ krʉ̂ang", "transit; connecting flight", "Travel & Transport", "✈️", "B1")

# ==================== MORE HOME ====================
add("เครื่องซักผ้า", "krʉ̂ang sák pâa", "washing machine", "Home & Household", "🧺", "A2")
add("ไมโครเวฟ", "mai-kroo-wéep", "microwave", "Home & Household", "📦", "A2")
add("เตา", "dtao", "stove; oven", "Home & Household", "🍳", "A2")
add("กระจก", "grà-jòk", "mirror; glass", "Home & Household", "🪞", "A2")
add("ผ้าเช็ดตัว", "pâa chét dtua", "towel", "Home & Household", "🧴", "A2")
add("หมอน", "mɔ̌ɔn", "pillow", "Home & Household", "🛏️", "A2")
add("ผ้าห่ม", "pâa hòm", "blanket", "Home & Household", "🛌", "A2")

# ==================== MORE WORK ====================
add("เงิน", "ngən", "money", "Work & Office", "💰", "A1")
add("ธนาคาร", "tá-naa-kaan", "bank", "Work & Office", "🏦", "A2")
add("ภาษี", "paa-sǐi", "tax", "Work & Office", "📋", "B2")
add("ลงทุน", "long-tun", "invest", "Work & Office", "📈", "B2")
add("กำไร", "gam-rai", "profit", "Work & Office", "💰", "B2")
add("ขาดทุน", "kàat-tun", "loss (business)", "Work & Office", "📉", "B2")
add("ลูกจ้าง", "lûuk-jâang", "employee; worker", "Work & Office", "👷", "B1")
add("นายจ้าง", "naai-jâang", "employer", "Work & Office", "👨‍💼", "B1")
add("ตกงาน", "dtòk-ngaan", "unemployed", "Work & Office", "😟", "B1")
add("เกษียณ", "gà-sǐan", "retire", "Work & Office", "🏖️", "B2")

# ==================== FOOD: COOKING & RESTAURANT ====================
add("ช้อน", "chɔ́ɔn", "spoon", "Food", "🥄", "A1")
add("ส้อม", "sɔ̂ɔm", "fork", "Food", "🍴", "A1")
add("จาน", "jaan", "plate; dish", "Food", "🍽️", "A1")
add("แก้ว", "gâeo", "glass; cup", "Food", "🥛", "A1")
add("ตะเกียบ", "dtà-gìap", "chopsticks", "Food", "🥢", "A2")
add("เมนู", "mee-nuu", "menu", "Food", "📋", "A1")
add("สั่ง", "sàng", "to order", "Food", "📝", "A1")
add("เช็คบิล", "chék bin", "check bill", "Food", "💳", "A2")
add("ทิป", "típ", "tip (gratuity)", "Food", "💵", "A2")
add("อิ่ม", "ìm", "full (stomach)", "Food", "😋", "A1")
add("หิวข้าว", "hǐu kâao", "hungry for rice/food", "Food", "🍚", "A1")
add("ร้านอาหาร", "ráan aa-hǎan", "restaurant", "Food", "🍽️", "A1")
add("สตรีทฟู้ด", "sà-dtriit fúut", "street food", "Food", "🍢", "A2")
add("บุฟเฟ่ต์", "bùf-fêe", "buffet", "Food", "🍱", "A2")

# ==================== MORE EDUCATION ====================
add("ภาษา", "paa-sǎa", "language", "Education", "🗣️", "A1")
add("คณิตศาสตร์", "ká-nít-dtà-sàat", "mathematics", "Education", "🔢", "B1")
add("วิทยาศาสตร์", "wít-tá-yaa-sàat", "science", "Education", "🔬", "B1")
add("ประวัติศาสตร์", "bprà-wàt-dtì-sàat", "history", "Education", "📜", "B1")
add("ศิลปะ", "sǐn-lá-bpà", "art", "Education", "🎨", "A2")
add("จบการศึกษา", "jòp gaan-sʉ̀k-sǎa", "graduate", "Education", "🎓", "B1")
add("ปริญญา", "bpà-rin-yaa", "degree (academic)", "Education", "🎓", "B1")
add("ทุนการศึกษา", "tun gaan-sʉ̀k-sǎa", "scholarship", "Education", "🏆", "B2")
add("เรียนพิเศษ", "rian pí-sèet", "take tutoring", "Education", "📚", "A2")
add("ฝึกงาน", "fʉ̀k-ngaan", "internship; training", "Education", "💼", "B1")

# ==================== MORE NATURE ====================
add("รุ้งกินน้ำ", "rúng gin náam", "rainbow", "Nature", "🌈", "A2")
add("ดวงอาทิตย์ตก", "duang aa-tít dtòk", "sunset", "Nature", "🌅", "A2")
add("ดวงอาทิตย์ขึ้น", "duang aa-tít kʉ̂n", "sunrise", "Nature", "🌄", "A2")
add("คลื่น", "klʉ̂ʉn", "wave (ocean)", "Nature", "🌊", "B1")
add("หญ้า", "yâa", "grass", "Nature", "🌿", "A2")
add("ใบไม้", "bai-máai", "leaf", "Nature", "🍃", "A2")

# ==================== MORE TECHNOLOGY ====================
add("สมาร์ทโฟน", "sà-mâat-foon", "smartphone", "Technology", "📱", "A2")
add("หูฟัง", "hǔu-fang", "headphones; earphones", "Technology", "🎧", "A2")
add("บลูทูธ", "bluu-túut", "Bluetooth", "Technology", "📶", "B1")
add("โน้ตบุ๊ค", "nóot-búk", "notebook; laptop", "Technology", "💻", "A2")
add("ปริ้นเตอร์", "bprín-dtəə", "printer", "Technology", "🖨️", "B1")

# ==================== PLACES ====================
add("ธนาคาร", "tá-naa-kaan", "bank", "Places", "🏦", "A2")
add("ไปรษณีย์", "bprai-sà-nii", "post office", "Places", "📮", "A2")
add("สถานีตำรวจ", "sà-tǎa-nii dtam-rùat", "police station", "Places", "🚔", "B1")
add("สถานทูต", "sà-tǎan-tûut", "embassy", "Places", "🏛️", "B2")
add("สนามกีฬา", "sà-nǎam gii-laa", "stadium; sports field", "Places", "🏟️", "A2")
add("สระว่ายน้ำ", "sà-wâai-náam", "swimming pool", "Places", "🏊", "A2")
add("ห้องสมุด", "hɔ̂ɔng-sà-mùt", "library", "Places", "📚", "A2")
add("โบสถ์", "bòot", "church; temple hall", "Places", "⛪", "B1")
add("มัสยิด", "mát-sà-yít", "mosque", "Places", "🕌", "B1")
add("สวนสาธารณะ", "sǔan sǎa-taa-rá-ná", "public park", "Places", "🌳", "A2")
add("ร้านกาแฟ", "ráan gaa-fae", "coffee shop; café", "Places", "☕", "A1")
add("ซุปเปอร์มาร์เก็ต", "súp-bpəə-mâa-gèt", "supermarket", "Places", "🛒", "A2")
add("ปั๊มน้ำมัน", "bpám nám-man", "gas station", "Places", "⛽", "A2")
add("ร้านซ่อม", "ráan sɔ̂ɔm", "repair shop", "Places", "🔧", "B1")

# ==================== EXTRA TO HIT 1000+ ====================
add("ลูกชิ้น", "lûuk-chín", "meatball", "Food", "🧆", "A2")
add("น้ำแข็ง", "nám-kǎeng", "ice", "Drinks & Fruit", "🧊", "A1")
add("แคร่", "krâe", "platform; bench", "Home & Household", "🪑", "B1")
add("เศรษฐกิจ", "sèet-tà-gìt", "economy", "Work & Office", "📊", "B2")
add("ไดโนเสาร์", "dai-noo-sǎo", "dinosaur", "Animals", "🦕", "B1")

# ==================== SOCIAL & RELATIONSHIPS ====================
add("เพื่อนร่วมงาน", "pʉ̂an rûam ngaan", "colleague; coworker", "Relationship", "👨‍💼", "B1")
add("คนรู้จัก", "kon rúu-jàk", "acquaintance", "Relationship", "🤝", "A2")
add("คู่หมั้น", "kûu mân", "fiancé/fiancée", "Relationship", "💍", "B1")
add("เพื่อนสนิท", "pʉ̂an sà-nìt", "close friend; best friend", "Relationship", "👫", "A2")
add("คนแปลกหน้า", "kon bplàek nâa", "stranger", "Relationship", "👤", "B1")

# ==================== MORE DRINKS ====================
add("ชาเย็น", "chaa yen", "Thai iced tea", "Drinks & Fruit", "🧋", "A1")
add("น้ำมะนาว", "náam má-naao", "lemonade; lime juice", "Drinks & Fruit", "🍋", "A2")
add("นมสด", "nom sòt", "fresh milk", "Drinks & Fruit", "🥛", "A2")
add("น้ำอัดลม", "náam àt lom", "soda; soft drink", "Drinks & Fruit", "🥤", "A2")
add("สมูทตี้", "sà-múut-dtîi", "smoothie", "Drinks & Fruit", "🥤", "A2")
add("มะพร้าว", "má-práao", "coconut", "Drinks & Fruit", "🥥", "A1")
add("ส้ม", "sôm", "orange", "Drinks & Fruit", "🍊", "A1")
add("กล้วย", "glûay", "banana", "Drinks & Fruit", "🍌", "A1")
add("แตงโม", "dtaeng-moo", "watermelon", "Drinks & Fruit", "🍉", "A1")
add("องุ่น", "à-ngùn", "grapes", "Drinks & Fruit", "🍇", "A2")
add("สับปะรด", "sàp-bpà-rót", "pineapple", "Drinks & Fruit", "🍍", "A2")
add("มังคุด", "mang-kút", "mangosteen", "Drinks & Fruit", "🍈", "A2")
add("ลำไย", "lam-yai", "longan", "Drinks & Fruit", "🫐", "A2")
add("เงาะ", "ngɔ́", "rambutan", "Drinks & Fruit", "🍒", "A2")
add("ลิ้นจี่", "lín-jìi", "lychee", "Drinks & Fruit", "🍒", "A2")

# ==================== MORE COLORS ====================
add("เทา", "tao", "gray", "Colours", "⬜", "A2")
add("ม่วง", "mûang", "purple", "Colours", "🟣", "A2")
add("น้ำตาล", "nám-dtaan", "brown", "Colours", "🟤", "A2")
add("ทอง", "tɔɔng", "gold; golden", "Colours", "🥇", "A2")
add("เงิน", "ngən", "silver", "Colours", "🥈", "A2")

# ==================== CLASSIFIERS (important Thai concept) ====================
add("คน", "kon", "classifier for people", "Classifiers", "👤", "A1")
add("ตัว", "dtua", "classifier for animals/objects", "Classifiers", "🐾", "A1")
add("อัน", "an", "classifier for small objects", "Classifiers", "📦", "A1")
add("ใบ", "bai", "classifier for flat/paper things", "Classifiers", "📄", "A2")
add("เล่ม", "lêm", "classifier for books/sharp things", "Classifiers", "📚", "A2")
add("คัน", "kan", "classifier for vehicles", "Classifiers", "🚗", "A2")
add("หลัง", "lǎng", "classifier for houses", "Classifiers", "🏠", "A2")
add("ห้อง", "hɔ̂ɔng", "classifier for rooms", "Classifiers", "🚪", "A2")
add("ชิ้น", "chín", "classifier for pieces/slices", "Classifiers", "🍰", "A2")
add("แก้ว", "gâeo", "classifier for glasses/cups", "Classifiers", "🥛", "A2")
add("จาน", "jaan", "classifier for plates/dishes", "Classifiers", "🍽️", "A2")
add("ขวด", "kùat", "classifier for bottles", "Classifiers", "🍾", "A2")
add("ถุง", "tǔng", "classifier for bags", "Classifiers", "🛍️", "A2")
add("คู่", "kûu", "classifier for pairs", "Classifiers", "👟", "A2")
add("ที่", "tîi", "classifier for places/ordinals", "Classifiers", "📍", "A2")

# Deduplicate - remove any new words that match existing Thai strings
existing_thai = set(item["thai"] for item in existing)
NEW_WORDS = [w for w in NEW_WORDS if w["thai"] not in existing_thai]

# Also deduplicate within new words
seen = set()
deduped = []
for w in NEW_WORDS:
    if w["thai"] not in seen:
        seen.add(w["thai"])
        deduped.append(w)
NEW_WORDS = deduped

# Re-assign IDs for new words
for i, w in enumerate(NEW_WORDS):
    w["id"] = max(item["id"] for item in existing) + 1 + i

# Combine
all_vocab = existing + NEW_WORDS

print(f"Existing words: {len(existing)}")
print(f"New words added: {len(NEW_WORDS)}")
print(f"Total words: {len(all_vocab)}")
print(f"Categories: {sorted(set(v['category'] for v in all_vocab))}")
print(f"Levels: {sorted(set(v['level'] for v in all_vocab))}")

# Level distribution
from collections import Counter
level_counts = Counter(v['level'] for v in all_vocab)
cat_counts = Counter(v['category'] for v in all_vocab)
print(f"\nLevel distribution: {dict(sorted(level_counts.items()))}")
print(f"\nCategory distribution:")
for cat, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
    print(f"  {cat}: {count}")

# Write output
output = "export const VOCAB_DATA = " + json.dumps(all_vocab, ensure_ascii=False, separators=(',', ': ')) + ";\n"
outpath = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'vocabData.js')
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(output)
print(f"\nWritten to {outpath}")
