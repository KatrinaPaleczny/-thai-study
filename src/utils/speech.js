export function speakThai(text, options = {}) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "th-TH";
  u.rate = options.rate ?? 0.85;
  window.speechSynthesis.speak(u);
}

export function speakThaiSlow(text) {
  speakThai(text, { rate: 0.5 });
}

/** Speak a list of texts sequentially, chaining via onend to avoid cancel conflicts. */
export function speakSequence(texts, options = {}) {
  if (!window.speechSynthesis || !texts.length) return;
  window.speechSynthesis.cancel();
  const rate = options.rate ?? 0.85;
  const gap = options.gap ?? 400; // ms pause between items

  let i = 0;
  function next() {
    if (i >= texts.length) return;
    const u = new SpeechSynthesisUtterance(texts[i]);
    u.lang = "th-TH";
    u.rate = rate;
    u.onend = () => { i++; setTimeout(next, gap); };
    u.onerror = () => { i++; setTimeout(next, gap); };
    window.speechSynthesis.speak(u);
  }
  next();
}

export function speakSyllables(syllables, delayMs = 800) {
  speakSequence(syllables, { rate: 0.6, gap: delayMs });
}
