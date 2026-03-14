/* Custom SVG icons for Thai Study App */

export function FlameIcon({ size = 18, active = false }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={active ? { animation: "pulse-glow 2s ease-in-out infinite" } : undefined}>
      <defs>
        <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FF6D00" />
          <stop offset="50%" stopColor="#FF9800" />
          <stop offset="100%" stopColor="#FFD54F" />
        </linearGradient>
      </defs>
      <path d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-5-5-11-5-11z" fill="url(#flame-grad)" />
      <path d="M12 9c0 0-2.5 3-2.5 5.5a2.5 2.5 0 0 0 5 0C14.5 12 12 9 12 9z" fill="#FFD54F" opacity="0.8" />
    </svg>
  );
}

export function FlashcardIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Back card */}
      <rect x="5" y="3" width="14" height="10" rx="2" opacity="0.4" />
      {/* Front card */}
      <rect x="3" y="7" width="14" height="10" rx="2" fill="none" />
      {/* Star on front card */}
      <path d="M10 10.5l.9 1.8 2 .3-1.5 1.4.4 2-1.8-.9-1.8.9.4-2-1.5-1.4 2-.3z" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  );
}

export function TargetIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StarIcon({ size = 18, filled = false }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"
        fill={filled ? "#FFD54F" : "none"}
        stroke={filled ? "#FF9800" : "currentColor"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrainIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Left hemisphere */}
      <path d="M12 4C9.5 4 7 5.5 7 8c-2 0-3 1.5-3 3s1 2.5 2 3c-.5 1 0 3 2 3.5 1 1 2.5 1.5 4 1.5" />
      {/* Right hemisphere */}
      <path d="M12 4c2.5 0 5 1.5 5 4 2 0 3 1.5 3 3s-1 2.5-2 3c.5 1 0 3-2 3.5-1 1-2.5 1.5-4 1.5" />
      {/* Center line */}
      <line x1="12" y1="4" x2="12" y2="19" opacity="0.4" />
    </svg>
  );
}

/* ── Achievement Badges ── */

const BADGE_TIERS = {
  bronze: { fill: "#CD7F32", accent: "#A0522D" },
  silver: { fill: "#C0C0C0", accent: "#808080" },
  gold: { fill: "#FFD700", accent: "#DAA520" },
};

function getBadgeTier(count) {
  if (count >= 100) return "gold";
  if (count >= 50) return "silver";
  return "bronze";
}

export function WordBadge({ count = 10, size = 36 }) {
  const tier = getBadgeTier(count);
  const { fill, accent } = BADGE_TIERS[tier];
  return (
    <svg viewBox="0 0 40 48" width={size} height={size * 1.2}>
      {/* Ribbon */}
      <path d="M14 36l6 10 6-10" fill={accent} opacity="0.8" />
      <path d="M26 36l-6 10-6-10" fill={accent} opacity="0.6" />
      {/* Medal circle */}
      <circle cx="20" cy="20" r="16" fill={fill} stroke={accent} strokeWidth="2" />
      <circle cx="20" cy="20" r="12" fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
      {/* Count */}
      <text x="20" y="24" textAnchor="middle" fontSize={count >= 100 ? "10" : "12"} fontWeight="800" fill="#fff" fontFamily="var(--disp)">{count}</text>
    </svg>
  );
}

export function StreakBadge({ days = 7, size = 36 }) {
  const tier = days >= 100 ? "gold" : days >= 30 ? "silver" : "bronze";
  const { fill, accent } = BADGE_TIERS[tier];
  return (
    <svg viewBox="0 0 40 48" width={size} height={size * 1.2}>
      {/* Shield shape */}
      <path d="M4 6h32v22c0 8-16 16-16 16S4 36 4 28z" fill={fill} stroke={accent} strokeWidth="2" />
      {/* Flame inside */}
      <path d="M20 14c0 0-4 4-4 8a4 4 0 0 0 8 0c0-4-4-8-4-8z" fill="#FF6D00" />
      <path d="M20 18c0 0-2 2-2 4a2 2 0 0 0 4 0c0-2-2-4-2-4z" fill="#FFD54F" />
      {/* Day count */}
      <text x="20" y="40" textAnchor="middle" fontSize="9" fontWeight="800" fill={accent} fontFamily="var(--disp)">{days}d</text>
    </svg>
  );
}
