import { useState, useRef, useEffect, useCallback } from "react";
import { HANDWRITING_SETS } from "../data/handwritingData";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";

export function HandwritingPage() {
  const [setIdx, setSetIdx] = useState(null);
  const [charIdx, setCharIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [score, setScore] = useState(null); // null | "good" | "try-again"
  const [practiced, setPracticed] = useState(new Set());
  const canvasRef = useRef(null);
  const guideCanvasRef = useRef(null);

  const CANVAS_SIZE = 300;

  // Draw guide character
  useEffect(() => {
    if (setIdx === null) return;
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    if (showGuide) {
      const set = HANDWRITING_SETS[setIdx];
      const char = set.characters[charIdx];
      ctx.font = "180px 'Noto Sans Thai', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(94, 107, 65, 0.12)";
      ctx.fillText(char.char, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 10);
    }
  }, [setIdx, charIdx, showGuide]);

  // Redraw strokes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // Draw grid lines
    ctx.strokeStyle = "#e8e5df";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_SIZE / 2, 0); ctx.lineTo(CANVAS_SIZE / 2, CANVAS_SIZE);
    ctx.moveTo(0, CANVAS_SIZE / 2); ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    // Draw completed strokes
    ctx.strokeStyle = "#362d27";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const stroke of strokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y);
      ctx.stroke();
    }
    // Draw current stroke
    if (currentStroke.length > 1) {
      ctx.strokeStyle = "#5e6b41";
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      ctx.stroke();
    }
  }, [strokes, currentStroke]);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    if (e.touches) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  const startDraw = useCallback((e) => {
    e.preventDefault();
    setDrawing(true);
    setScore(null);
    const pos = getPos(e);
    setCurrentStroke([pos]);
  }, [getPos]);

  const moveDraw = useCallback((e) => {
    e.preventDefault();
    if (!drawing) return;
    const pos = getPos(e);
    setCurrentStroke(prev => [...prev, pos]);
  }, [drawing, getPos]);

  const endDraw = useCallback((e) => {
    e.preventDefault();
    if (!drawing) return;
    setDrawing(false);
    if (currentStroke.length > 1) {
      setStrokes(prev => [...prev, currentStroke]);
    }
    setCurrentStroke([]);
  }, [drawing, currentStroke]);

  const clearCanvas = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setScore(null);
  };

  const undoStroke = () => {
    setStrokes(prev => prev.slice(0, -1));
    setScore(null);
  };

  const checkDrawing = () => {
    // Calculate coverage: how much of the canvas was drawn on
    // vs. expected area based on the guide character
    const totalPoints = strokes.reduce((sum, s) => sum + s.length, 0);
    const set = HANDWRITING_SETS[setIdx];
    const char = set.characters[charIdx];

    if (totalPoints < 10) {
      setScore("try-again");
      return;
    }

    // Check if strokes cover roughly the right area
    const bounds = { minX: CANVAS_SIZE, maxX: 0, minY: CANVAS_SIZE, maxY: 0 };
    for (const stroke of strokes) {
      for (const pt of stroke) {
        bounds.minX = Math.min(bounds.minX, pt.x);
        bounds.maxX = Math.max(bounds.maxX, pt.x);
        bounds.minY = Math.min(bounds.minY, pt.y);
        bounds.maxY = Math.max(bounds.maxY, pt.y);
      }
    }
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const area = width * height;

    // Reasonable character should use at least 15% of canvas and be somewhat centered
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const centered = Math.abs(centerX - CANVAS_SIZE / 2) < CANVAS_SIZE * 0.3 &&
                     Math.abs(centerY - CANVAS_SIZE / 2) < CANVAS_SIZE * 0.3;

    if (area > CANVAS_SIZE * CANVAS_SIZE * 0.08 && centered && totalPoints > 20) {
      setScore("good");
      if (!practiced.has(`${setIdx}-${charIdx}`)) {
        setPracticed(prev => new Set([...prev, `${setIdx}-${charIdx}`]));
        awardXP("writing_correct");
      }
    } else {
      setScore("try-again");
    }
  };

  const handleNext = () => {
    const set = HANDWRITING_SETS[setIdx];
    if (charIdx + 1 < set.characters.length) {
      setCharIdx(charIdx + 1);
    } else {
      setCharIdx(0);
    }
    clearCanvas();
  };

  const handlePrev = () => {
    if (charIdx > 0) {
      setCharIdx(charIdx - 1);
      clearCanvas();
    }
  };

  // ─── Set picker ───
  if (setIdx === null) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">Thai Handwriting</div>
          <div className="ph-s">Practice drawing Thai characters on a canvas with stroke guides</div>
        </div>
        <div className="hw-grid">
          {HANDWRITING_SETS.map((set, i) => (
            <button key={set.id} className="hw-set-card" onClick={() => { setSetIdx(i); setCharIdx(0); clearCanvas(); }}>
              <div className="hw-set-chars">{set.characters.slice(0, 5).map(c => c.char).join(" ")}</div>
              <div className="hw-set-title">{set.title}</div>
              <div className="hw-set-desc">{set.description}</div>
              <div className="hw-set-count">{set.characters.length} characters</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const set = HANDWRITING_SETS[setIdx];
  const char = set.characters[charIdx];
  const progress = ((charIdx + 1) / set.characters.length) * 100;

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Thai Handwriting</div>
        <div className="ph-s">{set.title}</div>
      </div>

      <div className="hw-container">
        {/* Progress */}
        <div className="rp-prog-label">{charIdx + 1} of {set.characters.length}</div>
        <div className="rp-prog">
          <div className="rp-prog-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Character info */}
        <div className="hw-char-info">
          <div className="hw-target-char">{char.char}</div>
          <div className="hw-char-name">{char.name}</div>
          <div className="hw-char-phonetic">/{char.phonetic}/</div>
          <button className="conv-speak" onClick={() => speakThai(char.char)} title="Listen">🔊</button>
        </div>

        {/* Hint */}
        <div className="hw-hint">✏️ {char.hint}</div>

        {/* Canvas area */}
        <div className="hw-canvas-wrapper">
          <canvas
            ref={guideCanvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="hw-guide-canvas"
          />
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="hw-draw-canvas"
            onMouseDown={startDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={moveDraw}
            onTouchEnd={endDraw}
          />
        </div>

        {/* Controls */}
        <div className="hw-controls">
          <label className="hw-toggle">
            <input type="checkbox" checked={showGuide} onChange={(e) => setShowGuide(e.target.checked)} />
            <span>Show guide</span>
          </label>
          <button className="btn btn-sec btn-sm" onClick={undoStroke} disabled={strokes.length === 0}>Undo</button>
          <button className="btn btn-sec btn-sm" onClick={clearCanvas} disabled={strokes.length === 0}>Clear</button>
          <button className="btn btn-pri btn-sm" onClick={checkDrawing} disabled={strokes.length === 0}>Check</button>
        </div>

        {/* Score feedback */}
        {score && (
          <div className={`hw-feedback ${score}`}>
            {score === "good" ? (
              <>
                <span className="hw-fb-icon">✅</span>
                <span>Nice work! Your {char.char} looks good.</span>
              </>
            ) : (
              <>
                <span className="hw-fb-icon">🔄</span>
                <span>Try again — draw bigger and more centered. Follow the guide!</span>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="hw-nav">
          <button className="btn btn-sec" onClick={handlePrev} disabled={charIdx === 0}>← Previous</button>
          <button className="btn btn-pri" onClick={handleNext}>
            {charIdx + 1 >= set.characters.length ? "Start Over" : "Next →"}
          </button>
        </div>

        <button className="btn btn-sec btn-sm" onClick={() => { setSetIdx(null); clearCanvas(); }} style={{ marginTop: 16 }}>
          ← Back to sets
        </button>
      </div>
    </div>
  );
}
