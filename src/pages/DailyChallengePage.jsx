import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { loadLS, saveLS } from "../utils/storage";
import { awardXP } from "../utils/xp";
import { speakThai } from "../utils/speech";

export const K_DAILY = "katthai_daily_v1";

/**
 * Daily Challenge schema in localStorage:
 * {
 *   date: "2026-03-14",
 *   wordId: 42,
 *   completed: false,
 *   quizCorrect: null,
 *   history: ["2026-03-13", "2026-03-12", ...]  // dates completed
 * }
 */

function today() {
  return new Date().toISOString().slice(0, 10);
}

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickDailyWord(allVocab, date) {
  // Use date as seed for deterministic daily selection
  // Weight toward words not recently seen
  const dateNum = parseInt(date.replace(/-/g, ""), 10);
  const idx = Math.floor(seededRandom(dateNum) * allVocab.length);
  return allVocab[idx];
}

export function DailyChallengePage() {
  const { allVocab } = useApp();
  const [data, setData] = useState(() => loadLS(K_DAILY, { date: null, wordId: null, completed: false, quizCorrect: null, history: [] }));
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [showMeaning, setShowMeaning] = useState(false);

  const todayStr = today();
  const isToday = data.date === todayStr;

  // Get today's word
  const dailyWord = useMemo(() => {
    if (allVocab.length === 0) return null;
    return pickDailyWord(allVocab, todayStr);
  }, [allVocab, todayStr]);

  // Generate quiz options when word changes
  useEffect(() => {
    if (!dailyWord || allVocab.length < 4) return;
    const others = allVocab.filter(v => v.id !== dailyWord.id);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 3).map(v => ({ text: v.english, correct: false }));
    const allOptions = [...wrongOptions, { text: dailyWord.english, correct: true }].sort(() => Math.random() - 0.5);
    setQuizOptions(allOptions);
  }, [dailyWord, allVocab]);

  if (!dailyWord) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Daily Challenge</div>
          <div className="ph-s">Loading...</div>
        </div>
      </div>
    );
  }

  const handleQuizAnswer = (option) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(option);
    const isCorrect = option.correct;

    if (isCorrect) {
      awardXP("practice_correct");
    }

    const newData = {
      ...data,
      date: todayStr,
      wordId: dailyWord.id,
      completed: true,
      quizCorrect: isCorrect,
      history: data.history?.includes(todayStr) ? data.history : [...(data.history || []), todayStr],
    };
    setData(newData);
    saveLS(K_DAILY, newData);
  };

  const completedToday = isToday && data.completed;
  const streak = (() => {
    const hist = data.history || [];
    if (hist.length === 0) return 0;
    let count = 0;
    const d = new Date();
    // If today not completed yet, start from yesterday
    if (!completedToday) d.setDate(d.getDate() - 1);
    while (true) {
      const ds = d.toISOString().slice(0, 10);
      if (hist.includes(ds)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    if (completedToday) count++;
    return count;
  })();

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Daily Challenge</div>
        <div className="ph-s">One word, one quiz, every day</div>
      </div>

      <div className="dc-container">
        {/* Streak */}
        <div className="dc-streak-bar">
          <span className="dc-streak-icon">🔥</span>
          <span className="dc-streak-num">{streak} day{streak !== 1 ? "s" : ""}</span>
          <span className="dc-streak-label">daily challenge streak</span>
        </div>

        {/* Word of the Day */}
        <div className="dc-word-card">
          <div className="dc-word-label">Word of the Day</div>
          <div className="dc-word-date">{new Date(todayStr).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
          <div className="dc-word-emoji">{dailyWord.emoji}</div>
          <div className="dc-word-thai">{dailyWord.thai}</div>
          <div className="dc-word-phon">{dailyWord.phonetics}</div>
          {(showMeaning || completedToday) && (
            <div className="dc-word-english">{dailyWord.english}</div>
          )}
          <div className="dc-word-cat">{dailyWord.category}</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            <button className="btn btn-sec btn-sm" onClick={() => speakThai(dailyWord.thai)}>🔊 Listen</button>
            {!showMeaning && !completedToday && (
              <button className="btn btn-sec btn-sm" onClick={() => setShowMeaning(true)}>Reveal Meaning</button>
            )}
          </div>
          {dailyWord.example_thai && (
            <div className="dc-example">
              <div className="dc-example-label">Example</div>
              <div className="dc-example-thai">{dailyWord.example_thai}</div>
              <div className="dc-example-phon">{dailyWord.example_phonetics}</div>
              <div className="dc-example-eng">{dailyWord.example_english}</div>
            </div>
          )}
        </div>

        {/* Quiz */}
        {!completedToday ? (
          <div className="dc-quiz">
            <div className="dc-quiz-label">Quick Quiz: What does "{dailyWord.thai}" mean?</div>
            <div className="dc-quiz-options">
              {quizOptions.map((opt, i) => (
                <button
                  key={i}
                  className={`dc-quiz-opt${quizAnswer === opt ? (opt.correct ? " correct" : " wrong") : ""}${quizAnswer && opt.correct ? " correct" : ""}`}
                  onClick={() => handleQuizAnswer(opt)}
                  disabled={quizAnswer !== null}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {quizAnswer && (
              <div className={`dc-quiz-result ${quizAnswer.correct ? "correct" : "wrong"}`}>
                {quizAnswer.correct ? "✅ Correct! +5 XP" : `❌ The answer is: ${dailyWord.english}`}
              </div>
            )}
          </div>
        ) : (
          <div className="dc-completed">
            <div className="dc-completed-icon">{data.quizCorrect ? "🎉" : "📚"}</div>
            <div className="dc-completed-msg">
              {data.quizCorrect ? "You nailed today's challenge!" : "Challenge complete — keep learning!"}
            </div>
            <div className="dc-completed-sub">Come back tomorrow for a new word</div>
          </div>
        )}
      </div>
    </div>
  );
}
