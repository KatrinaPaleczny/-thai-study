import { useState, useEffect } from "react";

const CONFETTI_COLORS = ["#FFD54F", "#FF6D00", "#58CC02", "#1CB0F6", "#FF4B4B", "#7C6BC4", "#FF9800", "#E040FB"];

export function ConfettiBurst({ trigger }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const newPieces = Array.from({ length: 40 }, (_, i) => {
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = 120 + Math.random() * 200;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 100; // bias upward
      const rot = Math.random() * 720 - 360;
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const size = 6 + Math.random() * 8;
      const shape = Math.random() > 0.5 ? "50%" : "2px";
      const delay = Math.random() * 0.3;
      return { id: i, tx, ty, rot, color, size, shape, delay };
    });
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), 2500);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (!pieces.length) return null;

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: p.shape,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${1.2 + Math.random() * 0.8}s`,
            // custom endpoint via CSS custom properties
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
            "--rot": `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}

export function SparkleEffect({ show }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (!show) return;
    const newStars = Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 80,
      delay: Math.random() * 0.3,
      char: ["✦", "✧", "★", "⭐"][Math.floor(Math.random() * 4)],
    }));
    setStars(newStars);
    const timer = setTimeout(() => setStars([]), 1000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!stars.length) return null;

  return (
    <div className="sparkle-container">
      {stars.map(s => (
        <span
          key={s.id}
          className="sparkle-star"
          style={{
            left: s.x,
            top: s.y,
            animationDelay: `${s.delay}s`,
            fontSize: 12 + Math.random() * 12,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}

export function XPPopup({ points, show }) {
  if (!show) return null;
  return <div className="xp-popup">+{points} XP</div>;
}
