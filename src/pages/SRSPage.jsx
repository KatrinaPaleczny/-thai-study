import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { getDueWordsWithLimit, recordReview, getSRSStats, loadSRSSettings, saveSRSSettings } from "../utils/srs";
import { awardXP } from "../utils/xp";
import { recordMistake } from "../utils/mistakes";
import { speakThai } from "../utils/speech";

const LIMIT_OPTIONS = [5, 10, 15, 20];

export function SRSPage() {
  const { allVocab } = useApp();
  const [dueIds, setDueIds] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ total: 0, dueNow: 0, mastered: 0, learning: 0 });
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);
  const [dueInfo, setDueInfo] = useState({ reviewIds: [], newIds: [], newToday: 0, dailyNewLimit: 10, totalNewDue: 0 });
  const [dailyLimit, setDailyLimit] = useState(() => loadSRSSettings().dailyNewLimit);

  const refresh = useCallback(() => {
    const info = getDueWordsWithLimit(allVocab);
    setDueInfo(info);
    // Show reviews first, then new cards
    setDueIds([...info.reviewIds, ...info.newIds]);
    setStats(getSRSStats(allVocab));
  }, [allVocab]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleLimitChange = (newLimit) => {
    setDailyLimit(newLimit);
    saveSRSSettings({ dailyNewLimit: newLimit });
    refresh();
  };

  const word = dueIds.length > 0 ? allVocab.find(w => w.id === dueIds[idx]) : null;

  const handleGrade = (quality) => {
    if (!word) return;
    recordReview(word.id, quality);

    if (quality >= 2) {
      awardXP("flashcard_correct");
    } else {
      awardXP("flashcard_wrong");
      recordMistake({
        source: "flashcard",
        wordId: word.id,
        prompt: word.english,
        userAnswer: "(SRS review)",
        correctAnswer: `${word.thai} (${word.phonetics})`,
        score: quality === 1 ? 0.5 : 0,
      });
    }

    setSessionResults(prev => [...prev, { word, quality }]);

    if (idx + 1 >= dueIds.length) {
      setSessionDone(true);
    } else {
      setIdx(i => i + 1);
      setFlipped(false);
    }
  };

  // ─── Empty / Setup ───
  if (stats.total === 0) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Spaced Repetition</div>
          <div className="ph-s">Smart flashcard reviews — words you struggle with come back sooner</div>
        </div>
        <div className="srs-empty">
          <div className="srs-empty-icon">🧠</div>
          <h3>Get Started with SRS</h3>
          <p>Words are automatically added to SRS as you study them in each unit. Go study some vocabulary and your first cards will appear here!</p>
          <div className="srs-limit-setting" style={{ marginTop: 16 }}>
            <span className="srs-limit-label">Daily new cards:</span>
            <div className="srs-limit-btns">
              {LIMIT_OPTIONS.map(n => (
                <button
                  key={n}
                  className={`srs-limit-btn${dailyLimit === n ? " on" : ""}`}
                  onClick={() => handleLimitChange(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Session Complete ───
  if (sessionDone || dueIds.length === 0) {
    const correct = sessionResults.filter(r => r.quality >= 2).length;
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Spaced Repetition</div>
          <div className="ph-s">Smart flashcard reviews — words you struggle with come back sooner</div>
        </div>

        <div className="srs-stats-bar">
          <div className="srs-stat">
            <div className="srs-stat-num">{stats.total}</div>
            <div className="srs-stat-lbl">In SRS</div>
          </div>
          <div className="srs-stat">
            <div className="srs-stat-num">{stats.dueNow}</div>
            <div className="srs-stat-lbl">Due Now</div>
          </div>
          <div className="srs-stat">
            <div className="srs-stat-num">{stats.learning}</div>
            <div className="srs-stat-lbl">Learning</div>
          </div>
          <div className="srs-stat">
            <div className="srs-stat-num">{stats.mastered}</div>
            <div className="srs-stat-lbl">Mastered</div>
          </div>
        </div>

        <div className="srs-done">
          <div className="srs-done-icon">✅</div>
          <h3>{sessionResults.length > 0 ? "Session Complete!" : "All caught up!"}</h3>
          {sessionResults.length > 0 && (
            <p>{correct}/{sessionResults.length} correct — come back later for more reviews</p>
          )}
          {sessionResults.length === 0 && dueInfo.totalNewDue > 0 && (
            <p>You've hit your daily limit of {dailyLimit} new cards. {dueInfo.totalNewDue} new cards waiting for tomorrow.</p>
          )}
          {sessionResults.length === 0 && dueInfo.totalNewDue === 0 && (
            <p>No words are due for review right now. Check back soon!</p>
          )}
          <button className="btn btn-sec" onClick={() => {
            setSessionDone(false);
            setSessionResults([]);
            setIdx(0);
            setFlipped(false);
            refresh();
          }} style={{ marginTop: 16 }}>
            Refresh
          </button>
        </div>

        <div className="srs-limit-setting" style={{ marginTop: 20 }}>
          <span className="srs-limit-label">Daily new cards:</span>
          <div className="srs-limit-btns">
            {LIMIT_OPTIONS.map(n => (
              <button
                key={n}
                className={`srs-limit-btn${dailyLimit === n ? " on" : ""}`}
                onClick={() => handleLimitChange(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Review Card ───
  const isNewCard = dueInfo.newIds.includes(dueIds[idx]);

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Spaced Repetition</div>
        <div className="ph-s">
          {dueIds.length - idx} cards remaining
          {dueInfo.newIds.length > 0 && (
            <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>
              ({dueInfo.reviewIds.length} reviews + {dueInfo.newIds.length} new)
            </span>
          )}
        </div>
      </div>

      <div className="srs-stats-bar">
        <div className="srs-stat">
          <div className="srs-stat-num">{stats.total}</div>
          <div className="srs-stat-lbl">In SRS</div>
        </div>
        <div className="srs-stat">
          <div className="srs-stat-num">{dueIds.length}</div>
          <div className="srs-stat-lbl">Due</div>
        </div>
        <div className="srs-stat">
          <div className="srs-stat-num">{idx}</div>
          <div className="srs-stat-lbl">Reviewed</div>
        </div>
        <div className="srs-stat">
          <div className="srs-stat-num">{dueInfo.newToday + dueInfo.newIds.length}/{dailyLimit}</div>
          <div className="srs-stat-lbl">New Today</div>
        </div>
      </div>

      <div className="srs-card-area">
        {isNewCard && <div className="srs-new-badge">NEW</div>}
        <div className={`srs-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(true)}>
          {!flipped ? (
            <div className="srs-front">
              <div className="srs-emoji">{word.emoji}</div>
              <div className="srs-english">{word.english}</div>
              <div className="srs-cat">{word.category}</div>
              <div className="srs-tap-hint">Tap to reveal</div>
            </div>
          ) : (
            <div className="srs-back">
              <div className="srs-thai-big">{word.thai}</div>
              <div className="srs-phon">{word.phonetics}</div>
              <div className="srs-english-sm">{word.english}</div>
              <button className="conv-speak" onClick={(e) => { e.stopPropagation(); speakThai(word.thai); }} title="Listen">🔊</button>
            </div>
          )}
        </div>

        {flipped && (
          <div className="srs-grades">
            <button className="srs-grade wrong" onClick={() => handleGrade(0)}>
              <span>❌</span> Again
            </button>
            <button className="srs-grade hard" onClick={() => handleGrade(1)}>
              <span>🟡</span> Hard
            </button>
            <button className="srs-grade good" onClick={() => handleGrade(2)}>
              <span>✅</span> Good
            </button>
            <button className="srs-grade easy" onClick={() => handleGrade(3)}>
              <span>⭐</span> Easy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
