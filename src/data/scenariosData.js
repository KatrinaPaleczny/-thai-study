export const SCENARIOS_DATA = [
  {
    "title": "Scenario 1: Meeting Someone New 👋",
    "goal": "You are meeting someone for the first time. Greet them, ask their name, and tell them where you are from.",
    "level": "A1",
    "turns": [
      {"role":"Teacher","prompt_en":"Greets you.","thai_hint":"sà-wàt-dii kráp/khá","thai":"สวัสดีครับ"},
      {"role":"You","prompt_en":"Greet them back.","thai_hint":"sà-wàt-dii ค่ะ","thai":"สวัสดีค่ะ"},
      {"role":"Teacher","prompt_en":"Asks how you are.","thai_hint":"sà baai dii mái kráp/khá","thai":"สบายดีไหมครับ"},
      {"role":"You","prompt_en":"Say you are well, and ask them back.","thai_hint":"sà baai dii ค่ะ. khun sà baai dii mái คะ","thai":"สบายดีค่ะ คุณสบายดีไหมคะ"},
      {"role":"Teacher","prompt_en":"Introduces themselves and asks your name.","thai_hint":"phǒm/chǎn chûe [Name]... khun chûe à-rai kráp/khá","thai":"ผมชื่อ... คุณชื่ออะไรครับ"},
      {"role":"You","prompt_en":"Say your name.","thai_hint":"chʉ̂ʉ kɛ̂ɛt ค่ะ","thai":"ชื่อแคทค่ะ"},
      {"role":"Teacher","prompt_en":"Says nice to meet you and asks where you're from.","thai_hint":"yin-dii thîi dâi rúu-jàk. khun maa jàak prà-thêt à-rai kráp/khá","thai":"ยินดีที่ได้รู้จัก คุณมาจากประเทศอะไรครับ"},
      {"role":"You","prompt_en":"Say you're from Canada.","thai_hint":"maa jàak kɛɛ naa daa ค่ะ","thai":"มาจากแคนาดาค่ะ"}
    ]
  },
  {
    "title": "Scenario 2: Asking for Directions 🗺️",
    "goal": "You are a tourist in Bangkok. Politely ask a local how to get to the train station.",
    "level": "A2",
    "turns": [
      {"role":"You","prompt_en":"Get their attention and ask where the train station is.","thai_hint":"khǎw-tôht ค่ะ... sà-tăa-nii rót-fai yùu thîi-nǎi คะ","thai":"ขอโทษค่ะ สถานีรถไฟอยู่ที่ไหนคะ"},
      {"role":"Teacher","prompt_en":"Says the train station is nearby.","thai_hint":"sà-tăa-nii rót-fai yùu glâi-glâi kráp","thai":"สถานีรถไฟอยู่ใกล้ใกล้ครับ"},
      {"role":"Teacher","prompt_en":"Gives directions: go straight then turn left.","thai_hint":"dtrong bpai láew-gâw líao sáai kráp","thai":"ตรงไปแล้วก็เลี้ยวซ้ายครับ"},
      {"role":"You","prompt_en":"Confirm and thank them.","thai_hint":"dtrong bpai... líao sáai... khàwp-khun ค่ะ","thai":"ตรงไป เลี้ยวซ้าย ขอบคุณค่ะ"}
    ]
  },
  {
    "title": "Scenario 3: At a Food Stall 🍤",
    "goal": "Ask the vendor what they have, if it's fresh, and practice asking for clarification.",
    "level": "A1",
    "turns": [
      {"role":"You","prompt_en":"Ask: 'Do you have shrimp?'","thai_hint":"mii gûng mái คะ","thai":"มีกุ้งไหมคะ"},
      {"role":"Teacher","prompt_en":"Says yes.","thai_hint":"mii kráp","thai":"มีครับ"},
      {"role":"You","prompt_en":"Ask: 'Is it fresh?'","thai_hint":"sòt mái คะ","thai":"สดไหมคะ"},
      {"role":"Teacher","prompt_en":"Says it's fresh, then mumbles quickly asking if you want it fried.","thai_hint":"sòt kráp... thawt mái...","thai":"สดครับ ทอดไหม"},
      {"role":"You","prompt_en":"You didn't hear. Ask 'what, come again?'","thai_hint":"à-rai ná คะ","thai":"อะไรนะคะ"},
      {"role":"Teacher","prompt_en":"Repeats: 'Do you want me to fry it?'","thai_hint":"thâwt mái kráp","thai":"ทอดไหมครับ"},
      {"role":"You","prompt_en":"Say yes: 'Can.'","thai_hint":"dâi ค่ะ","thai":"ได้ค่ะ"}
    ]
  },
  {
    "title": "Scenario 4: At a Friend's House 🥢",
    "goal": "Your friend is offering you food. Accept, decline, and answer questions about what you can eat.",
    "level": "A1",
    "turns": [
      {"role":"Teacher","prompt_en":"Offers spring rolls: 'Do you want to eat spring rolls?'","thai_hint":"gin bpɔɔ bpía mái kráp","thai":"กินปอเปี๊ยะไหมครับ"},
      {"role":"You","prompt_en":"Say yes: 'Eat.'","thai_hint":"gin ค่ะ","thai":"กินค่ะ"},
      {"role":"Teacher","prompt_en":"Offers more: 'Do you want to eat more?'","thai_hint":"gin ìik mǎi kráp","thai":"กินอีกไหมครับ"},
      {"role":"You","prompt_en":"Say no: 'Don't eat.'","thai_hint":"mâi gin ค่ะ","thai":"ไม่กินค่ะ"},
      {"role":"Teacher","prompt_en":"Asks: 'Can you eat spicy?'","thai_hint":"khun gin pèt dâi mái kráp","thai":"คุณกินเผ็ดได้ไหมครับ"},
      {"role":"You","prompt_en":"Answer 'can' or 'cannot'.","thai_hint":"dâi ค่ะ / mâi dâi ค่ะ","thai":"ได้ค่ะ"}
    ]
  },
  {
    "title": "Scenario 5: Family & Hobbies 👨‍👩‍👧‍👦",
    "goal": "Your teacher asks about your parents and free time. Use: ของ, บางครั้ง, ดู, ฟัง.",
    "level": "A2",
    "turns": [
      {"role":"Teacher","prompt_en":"Asks: 'Do your parents travel?'","thai_hint":"phâaw-mâae kɔ̌ɔng khun tîao mái kráp","thai":"พ่อแม่ของคุณเที่ยวไหมครับ"},
      {"role":"You","prompt_en":"Answer: 'Sometimes.'","thai_hint":"baang kráng ค่ะ","thai":"บางครั้งค่ะ"},
      {"role":"Teacher","prompt_en":"Asks: 'What are you doing?'","thai_hint":"khun tham à-rai kráp","thai":"คุณทำอะไรครับ"},
      {"role":"You","prompt_en":"Say: 'Watch news.'","thai_hint":"duu kàao ค่ะ","thai":"ดูข่าวค่ะ"},
      {"role":"Teacher","prompt_en":"Asks: 'Do you listen to music?'","thai_hint":"khun fang pleeng mái kráp","thai":"คุณฟังเพลงไหมครับ"},
      {"role":"You","prompt_en":"Say yes.","thai_hint":"fang ค่ะ","thai":"ฟังค่ะ"}
    ]
  },
  {
    "title": "Scenario 6: Checking on a Sick Friend 🤒",
    "goal": "Your friend is sick. Call them, find out how they are, and where the hospital is.",
    "level": "A2",
    "turns": [
      {"role":"You","prompt_en":"Start: 'Hello. I heard you're sick, right?'","thai_hint":"sà-wàt-dii ค่ะ. khun mâi sà baai châi mái คะ","thai":"สวัสดีค่ะ คุณไม่สบายใช่ไหมคะ"},
      {"role":"Teacher","prompt_en":"Confirms and says they couldn't sleep.","thai_hint":"châi kráp. nɔɔn mâi làp","thai":"ใช่ครับ นอนไม่หลับ"},
      {"role":"You","prompt_en":"Ask: 'You're at the hospital, right?'","thai_hint":"yùu rong-phá-yaa-baan châi mái คะ","thai":"อยู่โรงพยาบาลใช่ไหมคะ"},
      {"role":"Teacher","prompt_en":"Says yes, the nurse has already come.","thai_hint":"yùu kráp. pá yaa baan maa láew","thai":"อยู่ครับ พยาบาลมาแล้ว"},
      {"role":"You","prompt_en":"Ask: 'Where is the hospital?'","thai_hint":"rong-phá-yaa-baan yùu thîi-nǎi คะ","thai":"โรงพยาบาลอยู่ที่ไหนคะ"},
      {"role":"Teacher","prompt_en":"Says it's next to the university.","thai_hint":"dtìt-kàp má-hǎa-wít-thá-yaa-lai kráp","thai":"ติดกับมหาวิทยาลัยครับ"},
      {"role":"You","prompt_en":"Say okay. Then later: 'I've arrived.'","thai_hint":"(ok)... tĕung láaew ค่ะ","thai":"ถึงแล้วค่ะ"}
    ]
  },
  {
    "title": "Scenario 7: Birthday Call 🎂",
    "goal": "It's your friend's birthday. Call them and ask if they can see you at the restaurant.",
    "level": "A2",
    "turns": [
      {"role":"You","prompt_en":"Wish them happy birthday.","thai_hint":"sà-wàt-dii ค่ะ. sùk sǎn wan gə̀ət ค่ะ!","thai":"สวัสดีค่ะ สุขสันต์วันเกิดค่ะ"},
      {"role":"Teacher","prompt_en":"Thanks you and asks what you're doing.","thai_hint":"khàwp-khun kráp. khun tham à-rai yùu","thai":"ขอบคุณครับ คุณทำอะไรอยู่"},
      {"role":"You","prompt_en":"Say you're at the restaurant and ask 'Can you see me?'","thai_hint":"yùu ráan aa hǎan ค่ะ. hěn chǎn mái คะ","thai":"อยู่ร้านอาหารค่ะ เห็นฉันไหมคะ"},
      {"role":"Teacher","prompt_en":"Says: 'Yes I see you! I'm coming now.'","thai_hint":"hěn kráp! maa láew","thai":"เห็นครับ มาแล้ว"}
    ]
  },
  {
    "title": "Scenario 8: Ordering at a Café ☕",
    "goal": "Order a Thai iced tea, specify your sweetness preference, and pay.",
    "level": "A2",
    "turns": [
      {"role":"You","prompt_en":"Greet and ask if you can order.","thai_hint":"sà-wàt-dii ค่ะ. khǎaw sàng nòi dâi mái คะ","thai":"สวัสดีค่ะ ขอสั่งหน่อยได้ไหมคะ"},
      {"role":"Teacher","prompt_en":"Says sure, what would you like?","thai_hint":"dâi kráp. ao à-rai kráp","thai":"ได้ครับ เอาอะไรครับ"},
      {"role":"You","prompt_en":"Say you'd like a Thai iced tea.","thai_hint":"ao chaa yen ค่ะ","thai":"เอาชาเย็นค่ะ"},
      {"role":"Teacher","prompt_en":"Asks: sweet or not sweet?","thai_hint":"wǎan mái kráp","thai":"หวานไหมครับ"},
      {"role":"You","prompt_en":"Say not sweet please.","thai_hint":"mâi wǎan ค่ะ","thai":"ไม่หวานค่ะ"},
      {"role":"Teacher","prompt_en":"Says 45 baht please.","thai_hint":"sìi-sìp-hâa bàat kráp","thai":"สี่สิบห้าบาทครับ"},
      {"role":"You","prompt_en":"Hand over money and say 'here you go'.","thai_hint":"nîi ค่ะ","thai":"นี่ค่ะ"}
    ]
  },
  {
    "title": "Scenario 9: Taking a Taxi 🚕",
    "goal": "Tell the driver where you're going, ask how long it will take, and mention you're in a hurry.",
    "level": "A2",
    "turns": [
      {"role":"You","prompt_en":"Tell the driver you're going to Siam.","thai_hint":"pai sǐam ค่ะ","thai":"ไปสยามค่ะ"},
      {"role":"Teacher","prompt_en":"Asks if you're in a hurry.","thai_hint":"khun ròn mái kráp","thai":"คุณร้อนไหมครับ"},
      {"role":"You","prompt_en":"Say a little bit, then ask how long it takes.","thai_hint":"ròn nít-nòi ค่ะ. châi wee-laa naan mái คะ","thai":"ร้อนนิดหน่อยค่ะ ใช้เวลานานไหมคะ"},
      {"role":"Teacher","prompt_en":"Says about 20 minutes.","thai_hint":"bprà-maan yîi-sìp naa-thii kráp","thai":"ประมาณยี่สิบนาทีครับ"},
      {"role":"You","prompt_en":"Say okay and thank them.","thai_hint":"dâi ค่ะ. khàwp-khun ค่ะ","thai":"ได้ค่ะ ขอบคุณค่ะ"}
    ]
  },
  {
    "title": "Scenario 10: Shopping at the Market 🛍️",
    "goal": "Ask the price of a shirt and practise bargaining down from 350 baht.",
    "level": "A2",
    "turns": [
      {"role":"You","prompt_en":"Ask how much this shirt costs.","thai_hint":"sûea tua née thâo-rài คะ","thai":"เสื้อตัวนี้เท่าไหร่คะ"},
      {"role":"Teacher","prompt_en":"Says 350 baht.","thai_hint":"sǎam-rɔ̂i hâa-sìp bàat kráp","thai":"สามร้อยห้าสิบบาทครับ"},
      {"role":"You","prompt_en":"Say it's expensive and ask if they can lower the price.","thai_hint":"phaeng bpai ค่ะ. lót dâi mái คะ","thai":"แพงไปค่ะ ลดได้ไหมคะ"},
      {"role":"Teacher","prompt_en":"Says they can do 300.","thai_hint":"lót hâi sǎam-rɔ̂i dâi kráp","thai":"ลดให้สามร้อยได้ครับ"},
      {"role":"You","prompt_en":"Counter-offer: ask if 280 is ok.","thai_hint":"sɔ̌ɔng-rɔ̂i bpàet-sìp dâi mái คะ","thai":"สองร้อยแปดสิบได้ไหมคะ"},
      {"role":"Teacher","prompt_en":"Says okay, deal.","thai_hint":"dâi kráp","thai":"ได้ครับ"},
      {"role":"You","prompt_en":"Say great, you'll take it.","thai_hint":"dii ค่ะ. ao ค่ะ","thai":"ดีค่ะ เอาค่ะ"}
    ]
  },
  {
    "title": "Scenario 11: Making Weekend Plans 📅",
    "goal": "Find out what your teacher is doing this weekend and make plans to meet at Chatuchak market.",
    "level": "B1",
    "turns": [
      {"role":"Teacher","prompt_en":"Asks what you're doing this weekend.","thai_hint":"sùt-sàp-daa née khun ja tham à-rai kráp","thai":"สุดสัปดาห์นี้คุณจะทำอะไรครับ"},
      {"role":"You","prompt_en":"Say you have no plans, then ask what about them.","thai_hint":"mâi mii plaan ค่ะ. láew khun là คะ","thai":"ไม่มีแพลนค่ะ แล้วคุณล่ะคะ"},
      {"role":"Teacher","prompt_en":"Says they're going to Chatuchak market and asks if you want to come.","thai_hint":"pai dtà-làat jà-tú-jàk kráp. khun yàak bpai mái kráp","thai":"ไปตลาดจตุจักรครับ คุณอยากไปไหมครับ"},
      {"role":"You","prompt_en":"Say yes you want to go. Ask what time.","thai_hint":"yàak bpai ค่ะ. gìi moong คะ","thai":"อยากไปค่ะ กี่โมงคะ"},
      {"role":"Teacher","prompt_en":"Says 10am at the BTS.","thai_hint":"sìp moong thîi bii-tii-es kráp","thai":"สิบโมงที่บีทีเอสครับ"},
      {"role":"You","prompt_en":"Confirm and say 'see you then'.","thai_hint":"dâi ค่ะ. láew phop gan ค่ะ","thai":"ได้ค่ะ แล้วพบกันค่ะ"}
    ]
  },
  {
    "title": "Scenario 12: Talking About Your Day 🌞",
    "goal": "Tell your teacher what you did today — work, lunch with a friend, and what you ate.",
    "level": "B1",
    "turns": [
      {"role":"Teacher","prompt_en":"Asks how today was.","thai_hint":"wan née bpen yang-ngai bâang kráp","thai":"วันนี้เป็นยังไงบ้างครับ"},
      {"role":"You","prompt_en":"Say it was tiring.","thai_hint":"nùeai ค่ะ","thai":"เหนื่อยค่ะ"},
      {"role":"Teacher","prompt_en":"Asks what you did.","thai_hint":"tham à-rai kráp","thai":"ทำอะไรครับ"},
      {"role":"You","prompt_en":"Say you worked, then ate lunch with a friend.","thai_hint":"tham ngaan ค่ะ. láew gâw gin kâao tîang gàp pheûan ค่ะ","thai":"ทำงานค่ะ แล้วก็กินข้าวเที่ยงกับเพื่อนค่ะ"},
      {"role":"Teacher","prompt_en":"Asks what you ate.","thai_hint":"gin à-rai kráp","thai":"กินอะไรครับ"},
      {"role":"You","prompt_en":"Say you ate pad thai.","thai_hint":"gin pàt thai ค่ะ","thai":"กินผัดไทยค่ะ"},
      {"role":"Teacher","prompt_en":"Asks if it was tasty.","thai_hint":"aròi mái kráp","thai":"อร่อยไหมครับ"},
      {"role":"You","prompt_en":"Say very tasty.","thai_hint":"aròi mâak ค่ะ","thai":"อร่อยมากค่ะ"}
    ]
  },
  {
    "title": "Scenario 13: Not Feeling Well 💊",
    "goal": "Tell your teacher you have a headache, say when it started, and receive medicine instructions.",
    "level": "B1",
    "turns": [
      {"role":"You","prompt_en":"Say you're not feeling well.","thai_hint":"mâi sà-baai ค่ะ","thai":"ไม่สบายค่ะ"},
      {"role":"Teacher","prompt_en":"Asks what's wrong.","thai_hint":"bpen à-rai kráp","thai":"เป็นอะไรครับ"},
      {"role":"You","prompt_en":"Say your head hurts.","thai_hint":"bpùat hǔa ค่ะ","thai":"ปวดหัวค่ะ"},
      {"role":"Teacher","prompt_en":"Asks since when.","thai_hint":"bpen maa naan mái kráp","thai":"เป็นมานานไหมครับ"},
      {"role":"You","prompt_en":"Say since this morning.","thai_hint":"dtâng-tàae cháao ค่ะ","thai":"ตั้งแต่เช้าค่ะ"},
      {"role":"Teacher","prompt_en":"Says there is medicine — take 2 pills.","thai_hint":"mii yaa kráp. gin sɔ̌ɔng mét ná kráp","thai":"มียาครับ กินสองเม็ดนะครับ"},
      {"role":"You","prompt_en":"Thank them.","thai_hint":"khàwp-khun ค่ะ","thai":"ขอบคุณค่ะ"}
    ]
  }
];
