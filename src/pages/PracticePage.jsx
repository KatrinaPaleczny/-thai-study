import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ToneDrills } from "../components/ToneDrills";
import { MatchingGame } from "../components/MatchingGame";
import { ReadingPractice } from "../components/ReadingPractice";
import { ClassifierTable } from "../components/ClassifierTable";

export function PracticePage() {
  const { allVocab, studied } = useApp();
  const [tab, setTab] = useState("tones");

  const tabs = [
    ["tones", "🎵 Tone Drills"],
    ["matching", "🧩 Matching Game"],
    ["reading", "📖 Reading Practice"],
    ["classifiers", "📊 Classifiers"],
  ];

  // Get studied words for matching game
  const studiedWords = allVocab.filter(v => studied.has(v.id));
  const matchWords = studiedWords.length >= 4 ? studiedWords : allVocab.slice(0, 20);

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Practice</div>
        <div className="ph-s">Interactive exercises to sharpen your Thai</div>
      </div>

      <div className="tabs">
        {tabs.map(([k, l]) => (
          <button key={k} className={`tab${tab === k ? " on" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "tones" && <ToneDrills />}
      {tab === "matching" && <MatchingGame words={matchWords} />}
      {tab === "reading" && <ReadingPractice />}
      {tab === "classifiers" && <ClassifierTable />}
    </div>
  );
}
