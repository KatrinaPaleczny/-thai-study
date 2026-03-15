import { useState, useRef } from "react";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";

function normalizeThaiText(text) {
  return text.replace(/[\s\u200B\u200C\u200D]/g, "").toLowerCase();
}

function thaiSimilarity(a, b) {
  const s1 = normalizeThaiText(a);
  const s2 = normalizeThaiText(b);
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;
  const chars1 = new Set(s1);
  const chars2 = new Set(s2);
  let overlap = 0;
  for (const c of chars1) if (chars2.has(c)) overlap++;
  const union = new Set([...chars1, ...chars2]).size;
  return overlap / union;
}

const hasRecognition = typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export function MiniPronunciation({ words }) {
  const [idx, setIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState(null);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const word = words[idx];
  if (!word) return null;

  if (!hasRecognition) {
    return (
      <div className="mini-pron-unsupported">
        <p>Speech recognition is not supported in this browser.</p>
        <p style={{ fontSize: 12, color: "var(--t3)" }}>Try Chrome on desktop for pronunciation practice.</p>
      </div>
    );
  }

  const startListening = () => {
    if (isListening) return;
    setResult(null);
    setTranscript("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "th-TH";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const results = event.results[0];
      const spoken = results[0].transcript.trim();
      setTranscript(spoken);

      let bestMatch = false;
      for (let i = 0; i < results.length; i++) {
        const alt = results[i].transcript.trim();
        if (normalizeThaiText(alt) === normalizeThaiText(word.thai)) {
          bestMatch = true;
          break;
        }
      }

      const similarity = thaiSimilarity(spoken, word.thai);
      const isGood = bestMatch || similarity >= 0.7;

      setResult({
        match: isGood ? "good" : similarity >= 0.4 ? "close" : "wrong",
        similarity,
      });

      if (isGood) awardXP("pronunciation_attempt");
    };

    recognition.onerror = () => {
      setIsListening(false);
      setResult({ match: "no-speech", similarity: 0 });
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const goTo = (newIdx) => {
    setIdx(newIdx);
    setResult(null);
    setTranscript("");
  };

  return (
    <div className="mini-pron">
      <div className="mini-pron-card">
        <div className="mini-pron-emoji">{word.emoji}</div>
        <div className="mini-pron-phonetics">{word.phonetics}</div>
        <div className="mini-pron-english">{word.english}</div>

        <div className="mini-pron-actions">
          <button className="btn btn-sec btn-sm" onClick={() => speakThai(word.thai)}>
            🔊 Listen
          </button>
          <button className="btn btn-sec btn-sm" onClick={() => speakThai(word.thai, { rate: 0.5 })}>
            🐢 Slow
          </button>
          <button
            className={`btn btn-sm ${isListening ? "btn-pri" : "btn-sec"}`}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? "⏹ Stop" : "🎙️ Speak"}
          </button>
        </div>

        {result && (
          <div className={`mini-pron-result ${result.match}`}>
            {result.match === "good" && "✓ Great pronunciation!"}
            {result.match === "close" && "Almost! Try again."}
            {result.match === "wrong" && "Not quite — listen and try again."}
            {result.match === "no-speech" && "No speech detected. Try again."}
            {transcript && <div className="mini-pron-transcript">Heard: {transcript}</div>}
          </div>
        )}
      </div>

      <div className="mini-pron-nav">
        <button
          className="btn btn-sec btn-sm"
          disabled={idx === 0}
          onClick={() => goTo(idx - 1)}
        >
          ← Prev
        </button>
        <span className="mini-pron-counter">{idx + 1} / {words.length}</span>
        <button
          className="btn btn-sec btn-sm"
          disabled={idx >= words.length - 1}
          onClick={() => goTo(idx + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
