import { useState } from "react";
import { STORIES } from "../data/storiesData";
import { speakThai, speakThaiSlow } from "../utils/speech";
import { awardXP } from "../utils/xp";

export function StoryPage() {
  const [storyIdx, setStoryIdx] = useState(null);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [expandedWord, setExpandedWord] = useState(null);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [phase, setPhase] = useState("reading"); // "reading" | "quiz"
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // ─── Story picker ───
  if (storyIdx === null) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Story Mode</div>
          <div className="ph-s">Read Thai stories with tap-to-translate words and comprehension quizzes</div>
        </div>
        <div className="st-grid">
          {STORIES.map((story, i) => (
            <button key={story.id} className="st-story-card" onClick={() => {
              setStoryIdx(i); setSentenceIdx(0); setPhase("reading");
              setQuizIdx(0); setSelectedAnswer(null); setQuizScore(0); setQuizDone(false);
              setExpandedWord(null); setShowPhonetic(false); setShowEnglish(false);
            }}>
              <div className="st-story-emoji">{story.emoji}</div>
              <div className="st-story-title">{story.title}</div>
              <div className="st-story-title-en">{story.titleEn}</div>
              <div className="st-story-desc">{story.description}</div>
              <div className="st-story-meta">
                <span className={`st-level ${story.level}`}>{story.level}</span>
                <span>{story.sentences.length} sentences</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const story = STORIES[storyIdx];

  // ─── Quiz phase ───
  if (phase === "quiz") {
    if (quizDone) {
      const pct = Math.round((quizScore / story.questions.length) * 100);
      return (
        <div className="page">
          <div className="ph">
            <div className="ph-t">{story.emoji} {story.title}</div>
            <div className="ph-s">Comprehension Quiz — Complete!</div>
          </div>
          <div className="st-quiz-done">
            <div className="st-quiz-done-icon">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
            <div className="st-quiz-done-score">{quizScore}/{story.questions.length} correct ({pct}%)</div>
            <div className="st-quiz-done-msg">
              {pct >= 80 ? "Excellent comprehension!" : pct >= 50 ? "Good effort! Try re-reading." : "Read the story again and try once more!"}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
              <button className="btn btn-sec" onClick={() => { setPhase("reading"); setSentenceIdx(0); }}>Re-read Story</button>
              <button className="btn btn-pri" onClick={() => setStoryIdx(null)}>More Stories</button>
            </div>
          </div>
        </div>
      );
    }

    const q = story.questions[quizIdx];

    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">{story.emoji} {story.title}</div>
          <div className="ph-s">Comprehension Quiz</div>
        </div>
        <div className="st-quiz-container">
          <div className="rp-prog-label">Question {quizIdx + 1} of {story.questions.length}</div>
          <div className="rp-prog">
            <div className="rp-prog-fill" style={{ width: `${((quizIdx + 1) / story.questions.length) * 100}%` }} />
          </div>

          <div className="st-quiz-question">
            <div className="st-quiz-q-thai">{q.question}</div>
            <div className="st-quiz-q-en">{q.questionEn}</div>
            <button className="conv-speak" onClick={() => speakThai(q.question)} title="Listen">🔊</button>
          </div>

          <div className="st-quiz-options">
            {q.options.map((opt, i) => {
              let cls = "st-quiz-opt";
              if (selectedAnswer !== null) {
                if (i === q.correct) cls += " correct";
                else if (i === selectedAnswer && i !== q.correct) cls += " wrong";
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => {
                    if (selectedAnswer !== null) return;
                    setSelectedAnswer(i);
                    if (i === q.correct) {
                      setQuizScore(s => s + 1);
                      awardXP("quiz_correct");
                    }
                  }}
                  disabled={selectedAnswer !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <button className="btn btn-pri" onClick={() => {
              if (quizIdx + 1 >= story.questions.length) {
                setQuizDone(true);
              } else {
                setQuizIdx(quizIdx + 1);
                setSelectedAnswer(null);
              }
            }} style={{ marginTop: 16 }}>
              {quizIdx + 1 >= story.questions.length ? "See Results" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── Reading phase ───
  const sentence = story.sentences[sentenceIdx];
  const progress = ((sentenceIdx + 1) / story.sentences.length) * 100;

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">{story.emoji} {story.title}</div>
        <div className="ph-s">{story.titleEn}</div>
      </div>

      <div className="st-reader">
        {/* Progress */}
        <div className="rp-prog-label">Sentence {sentenceIdx + 1} of {story.sentences.length}</div>
        <div className="rp-prog">
          <div className="rp-prog-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Main sentence card */}
        <div className="st-sentence-card">
          {/* Thai text with tappable words */}
          <div className="st-thai-line">
            {sentence.words.map((word, i) => (
              <button
                key={i}
                className={`st-word${expandedWord === i ? " active" : ""}`}
                onClick={() => {
                  setExpandedWord(expandedWord === i ? null : i);
                  speakThai(word.thai);
                }}
              >
                {word.thai}
              </button>
            ))}
          </div>

          {/* Expanded word detail */}
          {expandedWord !== null && (
            <div className="st-word-detail">
              <div className="st-word-thai">{sentence.words[expandedWord].thai}</div>
              <div className="st-word-phon">{sentence.words[expandedWord].phonetic}</div>
              <div className="st-word-eng">{sentence.words[expandedWord].english}</div>
              <div className="st-word-actions">
                <button className="conv-speak" onClick={() => speakThai(sentence.words[expandedWord].thai)} title="Listen">🔊</button>
                <button className="conv-speak" onClick={() => speakThaiSlow(sentence.words[expandedWord].thai)} title="Slow">🐢</button>
              </div>
            </div>
          )}

          {/* Audio controls for full sentence */}
          <div className="st-sentence-audio">
            <button className="btn btn-sec btn-sm" onClick={() => speakThai(sentence.thai)}>🔊 Listen</button>
            <button className="btn btn-sec btn-sm" onClick={() => speakThaiSlow(sentence.thai)}>🐢 Slow</button>
          </div>

          {/* Toggle phonetics/english */}
          <div className="st-toggles">
            <button
              className={`st-toggle-btn${showPhonetic ? " on" : ""}`}
              onClick={() => setShowPhonetic(!showPhonetic)}
            >
              Show phonetics
            </button>
            <button
              className={`st-toggle-btn${showEnglish ? " on" : ""}`}
              onClick={() => setShowEnglish(!showEnglish)}
            >
              Show translation
            </button>
          </div>

          {showPhonetic && (
            <div className="st-phonetic">{sentence.phonetic}</div>
          )}
          {showEnglish && (
            <div className="st-english">{sentence.english}</div>
          )}
        </div>

        {/* Navigation */}
        <div className="st-nav">
          <button className="btn btn-sec" onClick={() => {
            if (sentenceIdx > 0) { setSentenceIdx(sentenceIdx - 1); setExpandedWord(null); }
          }} disabled={sentenceIdx === 0}>
            ← Previous
          </button>

          {sentenceIdx + 1 >= story.sentences.length ? (
            <button className="btn btn-pri" onClick={() => {
              setPhase("quiz");
              setQuizIdx(0);
              setSelectedAnswer(null);
              setQuizScore(0);
              setQuizDone(false);
              awardXP("story_complete");
            }}>
              Take Quiz →
            </button>
          ) : (
            <button className="btn btn-pri" onClick={() => {
              setSentenceIdx(sentenceIdx + 1);
              setExpandedWord(null);
            }}>
              Next →
            </button>
          )}
        </div>

        {/* Full story overview (mini sentences) */}
        <div className="st-overview">
          {story.sentences.map((s, i) => (
            <button
              key={i}
              className={`st-overview-dot${i === sentenceIdx ? " current" : ""}${i < sentenceIdx ? " read" : ""}`}
              onClick={() => { setSentenceIdx(i); setExpandedWord(null); }}
              title={`Sentence ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button className="btn btn-sec btn-sm" onClick={() => setStoryIdx(null)} style={{ marginTop: 16 }}>
          ← Back to stories
        </button>
      </div>
    </div>
  );
}
