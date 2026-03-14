import { useState, useEffect, useRef, useMemo } from "react";
import { FULL_PATH } from "../data/curriculumData";
import { GRAMMAR_DATA } from "../data/grammarData";
import { FlashcardDeck } from "./FlashcardDeck";
import { BuildTab } from "./BuildTab";
import { ConfettiBurst } from "./Celebrations";
import { Mascot } from "./Mascot";

export function DailySession({ allVocab, studied, toggleStudied, confidence, updateConfidence, onClose }) {
  const [phase, setPhase] = useState("ready"); // ready | studying | done
  const [step, setStep] = useState(0); // 0=new words, 1=review, 2=grammar
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  const DURATION = 5 * 60; // 5 minutes

  // Pick words for session
  const { newWords, reviewWords, exercises } = useMemo(() => {
    const unstudied = allVocab.filter(v => !studied.has(v.id));
    const studiedWords = allVocab.filter(v => studied.has(v.id));

    const shuffleAndPick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

    const newW = shuffleAndPick(unstudied, 5);
    const revW = shuffleAndPick(studiedWords, 5);

    // Pick some grammar exercises
    const allExercises = GRAMMAR_DATA.flatMap(g => g.exercises || []);
    const exs = shuffleAndPick(allExercises, 3);

    return { newWords: newW, reviewWords: revW, exercises: exs };
  }, [allVocab, studied]);

  // Timer
  useEffect(() => {
    if (phase !== "studying") return;
    timerRef.current = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= DURATION) {
          clearInterval(timerRef.current);
          setPhase("done");
          return DURATION;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = s => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const remaining = DURATION - elapsed;

  const steps = [
    { label: "New Words", icon: "🆕", count: newWords.length },
    { label: "Review", icon: "🔄", count: reviewWords.length },
    { label: "Grammar", icon: "📐", count: exercises.length },
  ];

  if (phase === "ready") {
    return (
      <div className="ds-wrap">
        <div className="ds-ready">
          <div className="ds-ready-icon"><Mascot mood="encouraging" size="lg" /></div>
          <div className="ds-ready-title">5-Minute Study Session</div>
          <div className="ds-ready-desc">
            A focused session with {newWords.length} new words, {reviewWords.length} review words, and {exercises.length} grammar exercises.
          </div>
          <div className="ds-ready-steps">
            {steps.map((s, i) => (
              <div key={i} className="ds-ready-step">
                <span>{s.icon}</span>
                <span>{s.label} ({s.count})</span>
              </div>
            ))}
          </div>
          <button className="btn btn-pri" onClick={() => setPhase("studying")}>Start Session</button>
          <button className="btn btn-sec" style={{ marginLeft: 10 }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="ds-wrap">
        <div className="ds-done">
          <ConfettiBurst trigger={true} />
          <div className="ds-done-icon"><Mascot mood="celebrating" size="lg" /></div>
          <div className="ds-done-title">Session Complete!</div>
          <div className="ds-done-desc">
            Great work! You studied for {formatTime(elapsed)}.
          </div>
          <button className="btn btn-pri" onClick={onClose}>Back to My Path</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-wrap">
      {/* Timer bar */}
      <div className="ds-timer-bar">
        <div className="ds-timer-fill" style={{ width: ((elapsed / DURATION) * 100) + "%" }} />
      </div>
      <div className="ds-hdr">
        <div className="ds-time">{formatTime(remaining)} remaining</div>
        <button className="btn btn-sec btn-sm" onClick={() => { clearInterval(timerRef.current); setPhase("done"); }}>End Early</button>
      </div>

      {/* Step tabs */}
      <div className="ds-steps">
        {steps.map((s, i) => (
          <button key={i} className={`ds-step${step === i ? " on" : ""}${step > i ? " done" : ""}`} onClick={() => setStep(i)}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="ds-content">
        {step === 0 && (
          newWords.length > 0 ? (
            <>
              <div className="ds-step-label">Learn these new words</div>
              <FlashcardDeck words={newWords} studied={studied} toggleStudied={toggleStudied} confidence={confidence} updateConfidence={updateConfidence} />
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button className="btn btn-pri" onClick={() => setStep(1)}>Next: Review →</button>
              </div>
            </>
          ) : (
            <div className="ds-step-label">No new words — you've studied everything! Moving to review.</div>
          )
        )}

        {step === 1 && (
          reviewWords.length > 0 ? (
            <>
              <div className="ds-step-label">Review these studied words</div>
              <FlashcardDeck words={reviewWords} studied={studied} toggleStudied={toggleStudied} confidence={confidence} updateConfidence={updateConfidence} />
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button className="btn btn-pri" onClick={() => setStep(2)}>Next: Grammar →</button>
              </div>
            </>
          ) : (
            <div className="ds-step-label">No words to review yet — keep studying!</div>
          )
        )}

        {step === 2 && (
          exercises.length > 0 ? (
            <>
              <div className="ds-step-label">Quick grammar practice</div>
              <BuildTab exercises={exercises} />
            </>
          ) : (
            <div className="ds-step-label">No grammar exercises available.</div>
          )
        )}
      </div>
    </div>
  );
}
