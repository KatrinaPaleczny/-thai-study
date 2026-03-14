import { useRef, useEffect } from "react";
import { TONE_INFO } from "../data/pronunciationData";

// Pitch contour shapes for each tone (normalized 0-1 x/y)
const TONE_CONTOURS = {
  mid:     [[0, 0.5], [0.25, 0.5], [0.5, 0.5], [0.75, 0.5], [1, 0.5]],
  low:     [[0, 0.35], [0.25, 0.3], [0.5, 0.28], [0.75, 0.27], [1, 0.25]],
  falling: [[0, 0.8], [0.2, 0.75], [0.4, 0.65], [0.6, 0.5], [0.8, 0.35], [1, 0.2]],
  high:    [[0, 0.65], [0.25, 0.7], [0.5, 0.75], [0.75, 0.78], [1, 0.8]],
  rising:  [[0, 0.25], [0.2, 0.22], [0.4, 0.25], [0.6, 0.4], [0.8, 0.6], [1, 0.8]],
};

function drawContour(ctx, points, w, h, color, lineWidth = 3, animated = false, progress = 1) {
  const padX = 20, padY = 14;
  const drawW = w - padX * 2;
  const drawH = h - padY * 2;

  // Convert normalized points to canvas coords (y inverted: 0=bottom, 1=top)
  const mapped = points.map(([x, y]) => [padX + x * drawW, padY + (1 - y) * drawH]);

  // Draw the curve using bezier
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  const totalPoints = Math.ceil(mapped.length * progress);
  if (totalPoints < 2) return;

  ctx.moveTo(mapped[0][0], mapped[0][1]);
  for (let i = 1; i < totalPoints; i++) {
    const [x0, y0] = mapped[i - 1];
    const [x1, y1] = mapped[i];
    const cpx = (x0 + x1) / 2;
    ctx.quadraticCurveTo(x0, y0, cpx, (y0 + y1) / 2);
  }
  const last = mapped[totalPoints - 1];
  ctx.lineTo(last[0], last[1]);
  ctx.stroke();

  // Draw arrowhead at end
  if (progress >= 1 && mapped.length >= 2) {
    const [px, py] = mapped[mapped.length - 2];
    const [ex, ey] = mapped[mapped.length - 1];
    const angle = Math.atan2(ey - py, ex - px);
    const arrowLen = 8;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - arrowLen * Math.cos(angle - 0.4), ey - arrowLen * Math.sin(angle - 0.4));
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - arrowLen * Math.cos(angle + 0.4), ey - arrowLen * Math.sin(angle + 0.4));
    ctx.stroke();
  }
}

/** Single tone contour card */
export function ToneContour({ tone, size = 80, label = true, active = false }) {
  const canvasRef = useRef(null);
  const info = TONE_INFO[tone];
  if (!info) return null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size * 0.6);

    // Background reference line
    ctx.strokeStyle = "#e8e5df";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(10, size * 0.3);
    ctx.lineTo(size - 10, size * 0.3);
    ctx.stroke();
    ctx.setLineDash([]);

    drawContour(ctx, TONE_CONTOURS[tone], size, size * 0.6, info.color, active ? 4 : 3);
  }, [tone, size, active]);

  return (
    <div className={`tv-contour${active ? " active" : ""}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size * 0.6}
        className="tv-canvas"
      />
      {label && (
        <div className="tv-contour-label" style={{ color: info.color }}>
          {info.symbol} {info.label}
        </div>
      )}
    </div>
  );
}

/** Full tone chart showing all 5 Thai tones side by side */
export function ToneChart() {
  const canvasRef = useRef(null);
  const W = 320, H = 160;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "#e8e5df";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let y = 0.25; y <= 0.75; y += 0.25) {
      const py = 12 + (1 - y) * (H - 24);
      ctx.beginPath();
      ctx.moveTo(10, py);
      ctx.lineTo(W - 10, py);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Y-axis labels
    ctx.font = "10px 'DM Sans', sans-serif";
    ctx.fillStyle = "#9e9a95";
    ctx.textAlign = "left";
    ctx.fillText("High", 2, 24);
    ctx.fillText("Low", 2, H - 14);

    // Draw each tone in its own lane
    const tones = ["mid", "low", "falling", "high", "rising"];
    const laneW = (W - 20) / tones.length;

    tones.forEach((tone, i) => {
      const info = TONE_INFO[tone];
      const points = TONE_CONTOURS[tone];
      const offsetX = 10 + i * laneW;

      // Map points into this lane
      const mapped = points.map(([x, y]) => [
        offsetX + x * (laneW - 4),
        12 + (1 - y) * (H - 36),
      ]);

      ctx.strokeStyle = info.color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(mapped[0][0], mapped[0][1]);
      for (let j = 1; j < mapped.length; j++) {
        const [x0, y0] = mapped[j - 1];
        const [x1, y1] = mapped[j];
        ctx.quadraticCurveTo(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      }
      ctx.lineTo(mapped[mapped.length - 1][0], mapped[mapped.length - 1][1]);
      ctx.stroke();

      // Label
      ctx.fillStyle = info.color;
      ctx.font = "bold 11px 'DM Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(info.label, offsetX + laneW / 2, H - 2);
    });
  }, []);

  return (
    <div className="tv-chart">
      <canvas ref={canvasRef} width={W} height={H} className="tv-chart-canvas" />
    </div>
  );
}

/** Syllable breakdown with tone contours for a word */
export function WordToneBreakdown({ syllables }) {
  if (!syllables || !syllables.length) return null;

  return (
    <div className="tv-word-breakdown">
      {syllables.map((syl, i) => {
        const info = TONE_INFO[syl.tone];
        return (
          <div key={i} className="tv-syllable">
            <ToneContour tone={syl.tone} size={64} label={false} />
            <div className="tv-syl-thai" style={{ color: info?.color }}>{syl.thai}</div>
            <div className="tv-syl-phon">{syl.phonetic}</div>
            <div className="tv-syl-tone" style={{ color: info?.color }}>
              {info?.symbol} {info?.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
