import { useState, useRef, useEffect } from "react";
import { VOCAB_DATA } from "../data/vocabData";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";

export function PronunciationPage({ allVocab }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null); // null | { match, confidence }
  const [wordIdx, setWordIdx] = useState(0);
  const [cat, setCat] = useState("All");
  const [sessionScore, setSessionScore] = useState({ attempts: 0, good: 0 });
  const recognitionRef = useRef(null);

  const cats = ["All", ...new Set(allVocab.map(w => w.category))];
  const words = cat === "All" ? allVocab : allVocab.filter(w => w.category === cat);
  const word = words[wordIdx] || words[0];

  const hasRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const startListening = () => {
    if (!hasRecognition) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "th-TH";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const results = event.results[0];
      const spoken = results[0].transcript.trim();
      const confidence = results[0].confidence;
      setTranscript(spoken);

      // Check all alternatives against the target
      let bestMatch = false;
      for (let i = 0; i < results.length; i++) {
        const alt = results[i].transcript.trim();
        if (alt === word.thai || normalizeThaiText(alt) === normalizeThaiText(word.thai)) {
          bestMatch = true;
          break;
        }
      }

      // Also check partial match
      const similarity = thaiSimilarity(spoken, word.thai);
      const isGood = bestMatch || similarity >= 0.7;

      setResult({
        match: isGood ? "good" : similarity >= 0.4 ? "close" : "wrong",
        confidence,
        similarity,
      });

      setSessionScore(prev => ({
        attempts: prev.attempts + 1,
        good: prev.good + (isGood ? 1 : 0),
      }));

      if (isGood) awardXP("pronunciation_attempt");
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "no-speech") {
        setResult({ match: "no-speech", confidence: 0, similarity: 0 });
      }
    };

    recognitionRef.current = recognition;
    setResult(null);
    setTranscript("");
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const nextWord = () => {
    setWordIdx(i => (i + 1) % words.length);
    setResult(null);
    setTranscript("");
  };

  const prevWord = () => {
    setWordIdx(i => (i - 1 + words.length) % words.length);
    setResult(null);
    setTranscript("");
  };

  if (!hasRecognition) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Pronunciation Practice</div>
          <div className="ph-s">Speech recognition not supported in this browser</div>
        </div>
        <div className="pron-no-support">
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎙️</div>
          <h3>Speech Recognition Unavailable</h3>
          <p>Your browser does not support the Web Speech Recognition API. Please try Chrome or Edge for the best experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Pronunciation Practice</div>
        <div className="ph-s">Speak Thai and get instant feedback on your pronunciation</div>
      </div>

      {/* Category Filter */}
      <div className="pron-cats">
        <select className="pron-cat-select" value={cat} onChange={e => { setCat(e.target.value); setWordIdx(0); setResult(null); }}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="pron-cat-count">{words.length} words</span>
        {sessionScore.attempts > 0 && (
          <span className="pron-session-score">
            Score: {sessionScore.good}/{sessionScore.attempts}
          </span>
        )}
      </div>

      {/* Word Card */}
      <div className="pron-card">
        <div className="pron-card-emoji">{word.emoji}</div>
        <div className="pron-card-thai">{word.thai}</div>
        <div className="pron-card-phon">{word.phonetics}</div>
        <div className="pron-card-eng">{word.english}</div>

        <div className="pron-listen-row">
          <button className="btn btn-sec btn-sm" onClick={() => speakThai(word.thai)}>
            🔊 Listen
          </button>
          <button className="btn btn-sec btn-sm" onClick={() => speakThai(word.thai, { rate: 0.5 })}>
            🐢 Slow
          </button>
        </div>
      </div>

      {/* Mic Button */}
      <div className="pron-mic-area">
        <button
          className={`pron-mic${isListening ? " listening" : ""}`}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? "⏹️" : "🎙️"}
        </button>
        <div className="pron-mic-label">
          {isListening ? "Listening... speak now!" : "Tap to speak"}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`pron-result ${result.match}`}>
          {result.match === "good" && (
            <>
              <div className="pron-result-icon">✅ Great pronunciation!</div>
              <div className="pron-result-heard">You said: <strong>{transcript}</strong></div>
            </>
          )}
          {result.match === "close" && (
            <>
              <div className="pron-result-icon">🟡 Almost there!</div>
              <div className="pron-result-heard">You said: <strong>{transcript}</strong></div>
              <div className="pron-result-expected">Target: <strong>{word.thai}</strong> ({word.phonetics})</div>
            </>
          )}
          {result.match === "wrong" && (
            <>
              <div className="pron-result-icon">❌ Try again</div>
              <div className="pron-result-heard">You said: <strong>{transcript}</strong></div>
              <div className="pron-result-expected">Target: <strong>{word.thai}</strong> ({word.phonetics})</div>
            </>
          )}
          {result.match === "no-speech" && (
            <div className="pron-result-icon">🤔 No speech detected — try again</div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="pron-nav">
        <button className="btn btn-sec" onClick={prevWord}>← Previous</button>
        <span className="pron-nav-count">{wordIdx + 1} / {words.length}</span>
        <button className="btn btn-pri" onClick={nextWord}>Next →</button>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────
function normalizeThaiText(text) {
  return text.replace(/[\s\u200B\u200C\u200D]/g, "").toLowerCase();
}

function thaiSimilarity(a, b) {
  const s1 = normalizeThaiText(a);
  const s2 = normalizeThaiText(b);
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;

  // Character overlap
  const chars1 = new Set(s1);
  const chars2 = new Set(s2);
  let overlap = 0;
  for (const c of chars1) if (chars2.has(c)) overlap++;
  const union = new Set([...chars1, ...chars2]).size;
  return overlap / union;
}
