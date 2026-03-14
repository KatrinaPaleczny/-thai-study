import { useState, useRef, useEffect, useCallback } from "react";

// Predefined stroke paths for Thai characters
// Each stroke is an array of [x, y] points (normalized 0-300)
const STROKE_DATA = {
  // ── Basic Consonants ──
  "ก": [
    [[60, 80], [60, 220]],                             // vertical left
    [[60, 80], [200, 80]],                             // horizontal top
    [[200, 80], [200, 160], [240, 200], [220, 240]],  // right curve down
  ],
  "ค": [
    [[100, 60], [80, 80], [80, 200], [100, 230]],     // left curve
    [[80, 140], [200, 140]],                           // horizontal mid
    [[200, 80], [200, 230]],                           // right vertical
    [[140, 60], [170, 40], [200, 60]],                 // top hook
  ],
  "ม": [
    [[40, 220], [40, 100], [80, 60], [120, 100], [120, 140]], // first hump
    [[120, 140], [160, 100], [200, 60], [240, 100], [240, 220]], // second hump
  ],
  "น": [
    [[80, 220], [80, 120], [120, 80], [180, 80], [220, 120], [220, 220]], // single loop
  ],
  "ล": [
    [[80, 220], [80, 120], [120, 80], [180, 80], [220, 120], [220, 180]], // loop top
    [[220, 180], [220, 260]],                          // tail down
  ],
  "ร": [
    [[80, 220], [80, 120], [120, 80], [160, 80], [180, 100]], // loop up
    [[180, 100], [200, 80], [230, 80], [250, 100], [250, 140]], // extra loop
    [[250, 140], [250, 220]],                          // tail
  ],
  "ส": [
    [[120, 240], [120, 80], [140, 40], [180, 40], [200, 60]], // tall body with flag
    [[120, 140], [200, 140]],                          // mid cross
  ],
  "ท": [
    [[60, 140], [100, 100], [140, 80], [200, 80], [240, 100]], // top curve
    [[240, 100], [240, 200], [220, 230]],              // right side
    [[60, 140], [60, 220]],                            // left side
  ],
  "พ": [
    [[40, 220], [40, 120], [80, 80], [130, 80], [150, 120]], // first hump
    [[150, 120], [180, 80], [230, 80], [260, 120], [260, 220]], // second hump
    [[260, 140], [260, 220]],                          // right tail
  ],
  "ด": [
    [[100, 180], [100, 120], [140, 80], [180, 80], [200, 120], [200, 180], [160, 210], [120, 200], [100, 180]], // round loop
  ],
  // ── More Consonants ──
  "จ": [
    [[120, 180], [120, 120], [160, 80], [200, 120], [200, 180]], // small loop
    [[200, 180], [180, 220], [140, 240]],              // curve down
  ],
  "บ": [
    [[120, 220], [120, 140], [140, 100], [180, 100], [200, 140], [200, 200], [160, 230], [120, 220]], // round bottom
    [[200, 140], [200, 60]],                           // tail up
  ],
  "ป": [
    [[120, 220], [120, 140], [140, 100], [180, 100], [200, 140], [200, 200], [160, 230], [120, 220]], // round bottom
    [[200, 100], [220, 60], [240, 80]],                // different curl
  ],
  "ต": [
    [[100, 180], [100, 120], [130, 90], [170, 90], [200, 120], [200, 180], [170, 200], [100, 180]], // loop
  ],
  "ว": [
    [[80, 200], [120, 100], [180, 100], [220, 200]],  // smooth curve
  ],
  "ห": [
    [[100, 240], [100, 100], [130, 60], [180, 60], [200, 80]], // tall curve
    [[200, 80], [200, 200]],                           // right down
  ],
  "อ": [
    [[100, 180], [100, 100], [140, 70], [200, 70], [230, 100], [230, 180], [200, 210], [140, 210], [100, 180]], // round loop
  ],
  "ย": [
    [[40, 180], [40, 120], [70, 90], [110, 90], [130, 120], [130, 160]], // first loop
    [[130, 160], [160, 130], [200, 90], [230, 90], [260, 120], [260, 220]], // second loop
  ],
  "ง": [
    [[100, 200], [140, 100], [200, 100], [220, 160]],  // simple curve
  ],
  "ช": [
    [[80, 180], [80, 120], [110, 90], [150, 90], [170, 120], [170, 160]], // loop left
    [[170, 160], [200, 130], [220, 130], [240, 160], [240, 220]], // right part
  ],
  "ข": [
    [[80, 200], [80, 100], [120, 60], [180, 60], [200, 80]], // top curve
    [[200, 80], [200, 200]],                           // right side
    [[80, 140], [200, 140]],                           // mid cross
  ],
  "ถ": [
    [[100, 180], [100, 100], [140, 70], [200, 70], [230, 100], [230, 180], [200, 210], [140, 210], [100, 180]], // round
    [[230, 180], [230, 250]],                          // tail
  ],
  // ── Vowels ──
  "า": [
    [[120, 60], [120, 240]],                           // long vertical
    [[120, 200], [160, 240], [180, 220]],              // bottom curve
  ],
  "ิ": [
    [[120, 80], [140, 60], [160, 80]],                 // small mark above
  ],
  "ี": [
    [[120, 80], [140, 60], [160, 80], [170, 60]],     // mark with hook
  ],
  "ุ": [
    [[130, 220], [150, 240], [170, 220]],              // small mark below
  ],
  "ู": [
    [[130, 220], [150, 240], [170, 220], [180, 250]],  // mark with tail
  ],
  "เ": [
    [[140, 240], [140, 60]],                           // tall vertical
    [[140, 60], [160, 40], [170, 60]],                 // top curl
  ],
  "แ": [
    [[100, 240], [100, 60], [120, 40], [130, 60]],    // first vertical
    [[180, 240], [180, 60], [200, 40], [210, 60]],    // second vertical
  ],
  "โ": [
    [[140, 240], [140, 80]],                           // vertical
    [[140, 80], [120, 50], [140, 30], [180, 30], [200, 50], [180, 80], [140, 80]], // round top
  ],
  // ── Thai Numerals ──
  "๐": [
    [[100, 150], [100, 100], [150, 70], [200, 100], [200, 200], [150, 230], [100, 200], [100, 150]], // circle
  ],
  "๑": [
    [[120, 200], [160, 80], [200, 140]],               // curved line
  ],
  "๒": [
    [[100, 100], [140, 70], [200, 100], [200, 160], [140, 200], [100, 240]], // curved with hook
  ],
  "๓": [
    [[80, 100], [120, 70], [160, 100]],                // first bump
    [[160, 100], [200, 70], [240, 100]],               // second bump
    [[80, 200], [120, 170], [160, 200]],               // third bump
  ],
  "๔": [
    [[100, 80], [200, 80]],                            // horizontal
    [[200, 80], [200, 220]],                           // vertical right
    [[140, 140], [200, 140]],                          // mid cross
  ],
  "๕": [
    [[100, 150], [100, 90], [150, 60], [200, 90], [200, 150], [150, 180], [100, 150]], // round
    [[200, 150], [220, 200], [200, 240]],              // tail
  ],
  "๖": [
    [[100, 150], [130, 80], [180, 80], [210, 120], [200, 180], [150, 210], [100, 180], [100, 150]], // curved loop
  ],
  "๗": [
    [[80, 80], [140, 120], [180, 80], [220, 120], [180, 200], [140, 240]], // wavy
  ],
  "๘": [
    [[150, 140], [100, 90], [150, 50], [200, 90], [150, 140], [100, 190], [150, 230], [200, 190], [150, 140]], // figure eight
  ],
  "๙": [
    [[100, 100], [100, 80], [140, 60], [200, 60], [230, 100], [230, 160], [200, 190], [140, 190], [100, 160], [100, 100]], // round
    [[230, 160], [230, 240]],                          // down stroke
  ],
};

/**
 * StrokeAnimation — Animated stroke-by-stroke drawing for a Thai character.
 * Shows each stroke being drawn with numbered order indicators.
 */
export function StrokeAnimation({ char, size = 280, onComplete }) {
  const canvasRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(-1);
  const [strokeProgress, setStrokeProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5, 1, 2
  const animRef = useRef(null);

  const strokes = STROKE_DATA[char] || [];
  const hasStrokes = strokes.length > 0;

  // Draw the current state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStrokes) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    // Grid
    ctx.strokeStyle = "#eae7e2";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size);
    ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ghost character
    ctx.font = `${size * 0.6}px 'Noto Sans Thai', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(94, 107, 65, 0.06)";
    ctx.fillText(char, size / 2, size / 2 + 5);

    // Scale factor
    const scale = size / 300;

    // Draw completed strokes
    for (let s = 0; s < strokes.length; s++) {
      if (s > currentStroke) break;
      const pts = strokes[s];
      const isActive = s === currentStroke && playing;
      const prog = s < currentStroke ? 1 : strokeProgress;

      const totalPts = Math.max(2, Math.ceil(pts.length * prog));

      // Stroke path
      ctx.strokeStyle = isActive ? "#C5A347" : "#0A8A7A";
      ctx.lineWidth = isActive ? 5 : 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0][0] * scale, pts[0][1] * scale);
      for (let i = 1; i < totalPts; i++) {
        ctx.lineTo(pts[i][0] * scale, pts[i][1] * scale);
      }
      ctx.stroke();

      // Stroke number at start point
      if (s <= currentStroke) {
        const [nx, ny] = pts[0];
        ctx.fillStyle = s === currentStroke && playing ? "#C5A347" : "#9e9a95";
        ctx.font = `bold ${12 * scale}px 'DM Sans', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.beginPath();
        ctx.arc(nx * scale, ny * scale - 14 * scale, 9 * scale, 0, Math.PI * 2);
        ctx.fillStyle = s === currentStroke && playing ? "#C5A347" : "#c9c5bf";
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText(String(s + 1), nx * scale, ny * scale - 14 * scale);
      }
    }

    // Draw direction arrow on active stroke
    if (currentStroke >= 0 && currentStroke < strokes.length && playing) {
      const pts = strokes[currentStroke];
      const totalPts = Math.max(2, Math.ceil(pts.length * strokeProgress));
      if (totalPts >= 2) {
        const [px, py] = pts[totalPts - 2];
        const [ex, ey] = pts[totalPts - 1];
        const angle = Math.atan2((ey - py), (ex - px));
        const ax = ex * scale, ay = ey * scale;

        // Dot at current position
        ctx.beginPath();
        ctx.arc(ax, ay, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#C5A347";
        ctx.fill();
      }
    }
  }, [char, size, hasStrokes, currentStroke, strokeProgress, strokes, playing]);

  // Animation loop
  const animate = useCallback(() => {
    if (!hasStrokes) return;

    let strokeIdx = 0;
    let progress = 0;
    const baseSpeed = 0.03 * speed;
    const pauseBetween = 300 / speed;

    setPlaying(true);
    setCompleted(false);

    function step() {
      if (strokeIdx >= strokes.length) {
        setPlaying(false);
        setCompleted(true);
        setCurrentStroke(strokes.length - 1);
        setStrokeProgress(1);
        if (onComplete) onComplete();
        return;
      }

      progress += baseSpeed;
      if (progress >= 1) {
        progress = 1;
        setCurrentStroke(strokeIdx);
        setStrokeProgress(1);
        strokeIdx++;
        progress = 0;

        // Pause between strokes
        animRef.current = setTimeout(() => {
          setCurrentStroke(strokeIdx);
          setStrokeProgress(0);
          animRef.current = requestAnimationFrame(step);
        }, pauseBetween);
        return;
      }

      setCurrentStroke(strokeIdx);
      setStrokeProgress(progress);
      animRef.current = requestAnimationFrame(step);
    }

    setCurrentStroke(0);
    setStrokeProgress(0);
    animRef.current = requestAnimationFrame(step);
  }, [hasStrokes, strokes, speed, onComplete]);

  const stopAnimation = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      clearTimeout(animRef.current);
    }
    setPlaying(false);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        clearTimeout(animRef.current);
      }
    };
  }, []);

  const reset = () => {
    stopAnimation();
    setCurrentStroke(-1);
    setStrokeProgress(0);
    setCompleted(false);
  };

  const stepForward = () => {
    if (playing) return;
    if (currentStroke + 1 < strokes.length) {
      setCurrentStroke(currentStroke + 1);
      setStrokeProgress(1);
    }
  };

  const stepBack = () => {
    if (playing) return;
    if (currentStroke > 0) {
      setCurrentStroke(currentStroke - 1);
      setStrokeProgress(1);
    } else {
      reset();
    }
  };

  if (!hasStrokes) {
    return (
      <div className="sa-unavailable">
        <div className="sa-unavailable-text">Stroke animation not available for this character yet</div>
      </div>
    );
  }

  return (
    <div className="sa-container">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="sa-canvas"
      />
      <div className="sa-controls">
        <div className="sa-speed">
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              className={`sa-speed-btn${speed === s ? " on" : ""}`}
              onClick={() => setSpeed(s)}
              disabled={playing}
            >
              {s === 0.5 ? "Slow" : s === 1 ? "Normal" : "Fast"}
            </button>
          ))}
        </div>
        <div className="sa-btns">
          <button className="btn btn-sec btn-sm" onClick={stepBack} disabled={playing || currentStroke < 0}>
            ⏮
          </button>
          {playing ? (
            <button className="btn btn-sec btn-sm" onClick={stopAnimation}>⏸</button>
          ) : (
            <button className="btn btn-pri btn-sm" onClick={animate}>
              {completed || currentStroke >= 0 ? "⟳ Replay" : "▶ Play"}
            </button>
          )}
          <button className="btn btn-sec btn-sm" onClick={stepForward} disabled={playing || currentStroke >= strokes.length - 1}>
            ⏭
          </button>
          <button className="btn btn-sec btn-sm" onClick={reset} disabled={playing && currentStroke < 0}>
            Reset
          </button>
        </div>
      </div>
      <div className="sa-info">
        {strokes.length} stroke{strokes.length !== 1 ? "s" : ""}
        {currentStroke >= 0 && !playing && ` — showing stroke ${Math.min(currentStroke + 1, strokes.length)}`}
      </div>
    </div>
  );
}
