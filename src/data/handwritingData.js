// Thai handwriting practice data — characters with stroke guides
// Each character has stroke-order hints for guided practice

export const HANDWRITING_SETS = [
  {
    id: "consonants-basic",
    title: "Basic Consonants",
    description: "The 10 most common Thai consonants",
    characters: [
      { char: "ก", name: "gor gài", phonetic: "g", hint: "Start top-left, draw across, then down-right hook" },
      { char: "ค", name: "kɔɔ kwaai", phonetic: "kh", hint: "Start top, curve right, hook at top" },
      { char: "ม", name: "mɔɔ máa", phonetic: "m", hint: "Two bumps going right, like a curly m" },
      { char: "น", name: "nɔɔ nǔu", phonetic: "n", hint: "A single loop curving right" },
      { char: "ล", name: "lɔɔ ling", phonetic: "l", hint: "Like น but with a tail going down" },
      { char: "ร", name: "rɔɔ rʉa", phonetic: "r", hint: "Like ล but with an extra loop" },
      { char: "ส", name: "sɔ̌ɔ sʉ̌a", phonetic: "s", hint: "Tall character with a flag on top" },
      { char: "ท", name: "tɔɔ tá-hǎan", phonetic: "th", hint: "Start left, draw across with a curl" },
      { char: "พ", name: "pɔɔ paan", phonetic: "ph", hint: "Wide character with two bumps" },
      { char: "ด", name: "dɔɔ dèk", phonetic: "d", hint: "Small round loop" },
    ]
  },
  {
    id: "consonants-more",
    title: "More Consonants",
    description: "12 more high-frequency consonants",
    characters: [
      { char: "จ", name: "jɔɔ jaan", phonetic: "j", hint: "Starts with a small loop, then curves down" },
      { char: "บ", name: "bɔɔ bai-máai", phonetic: "b", hint: "Round bottom with a tail up" },
      { char: "ป", name: "bpɔɔ bplaa", phonetic: "bp", hint: "Like บ but the top curls differently" },
      { char: "ต", name: "dtɔɔ dtào", phonetic: "dt", hint: "Small character with a loop" },
      { char: "ว", name: "wɔɔ wɛ̌ɛn", phonetic: "w", hint: "Single smooth curve" },
      { char: "ห", name: "hɔ̌ɔ hìip", phonetic: "h", hint: "Tall character with a top curve" },
      { char: "อ", name: "ɔɔ àang", phonetic: "ɔ", hint: "Round loop character" },
      { char: "ย", name: "yɔɔ yák", phonetic: "y", hint: "Two loops side by side" },
      { char: "ง", name: "ngɔɔ nguu", phonetic: "ng", hint: "Simple curved shape" },
      { char: "ช", name: "chɔɔ cháang", phonetic: "ch", hint: "Like จ but with an extra element" },
      { char: "ข", name: "khɔ̌ɔ khài", phonetic: "kh", hint: "Like ค but high class" },
      { char: "ถ", name: "thɔ̌ɔ thǔng", phonetic: "th", hint: "Round shape with a tail" },
    ]
  },
  {
    id: "vowels",
    title: "Common Vowels",
    description: "Essential Thai vowel forms",
    characters: [
      { char: "า", name: "sara aa", phonetic: "aa", hint: "Long stroke going down with a curve" },
      { char: "ิ", name: "sara i", phonetic: "i", hint: "Small mark above the consonant line" },
      { char: "ี", name: "sara ii", phonetic: "ii", hint: "Like ิ but with a hook" },
      { char: "ุ", name: "sara u", phonetic: "u", hint: "Small mark below the consonant line" },
      { char: "ู", name: "sara uu", phonetic: "uu", hint: "Like ุ but with a tail" },
      { char: "เ", name: "sara e", phonetic: "ee", hint: "Written before the consonant, tall vertical" },
      { char: "แ", name: "sara ae", phonetic: "ae", hint: "Double เ — two tall verticals" },
      { char: "โ", name: "sara o", phonetic: "oh", hint: "Written before consonant, round top" },
    ]
  },
  {
    id: "numbers",
    title: "Thai Numerals",
    description: "Thai number characters ๐-๙",
    characters: [
      { char: "๐", name: "soon", phonetic: "0", hint: "Round circle" },
      { char: "๑", name: "nùeng", phonetic: "1", hint: "Simple curved line" },
      { char: "๒", name: "sɔ̌ɔng", phonetic: "2", hint: "Curved with a hook" },
      { char: "๓", name: "sǎam", phonetic: "3", hint: "Three bumps" },
      { char: "๔", name: "sìi", phonetic: "4", hint: "Angular shape" },
      { char: "๕", name: "hâa", phonetic: "5", hint: "Round with a tail" },
      { char: "๖", name: "hòk", phonetic: "6", hint: "Curved loop shape" },
      { char: "๗", name: "jèt", phonetic: "7", hint: "Wavy line" },
      { char: "๘", name: "bpɛ̀ɛt", phonetic: "8", hint: "Figure-eight shape" },
      { char: "๙", name: "gâao", phonetic: "9", hint: "Round with a down stroke" },
    ]
  }
];
