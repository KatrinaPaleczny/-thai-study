// Strip tone marks, diacritics, ɔ→o, spaces, hyphens for forgiving phonetic matching.
// Lets users type "mai" for "mâi", "koong" for "kɔ̌ɔng", "laew" for "láew", etc.
export function normPhon(s) {
  return s.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ɔ/g, "o").replace(/ŋ/g, "ng")
    .replace(/[-\s]/g, "");
}
