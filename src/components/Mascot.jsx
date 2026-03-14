/* Chang the Elephant - Thai Study App Mascot */

const SIZES = { sm: 48, md: 80, lg: 120 };

export function Mascot({ mood = "happy", size = "md" }) {
  const px = SIZES[size] || SIZES.md;

  return (
    <div className={`mascot-wrap${mood === "celebrating" ? " celebrating" : ""}`} style={{ position: "relative", width: px, height: px }}>
      <svg viewBox="0 0 100 100" width={px} height={px} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="50" cy="58" rx="28" ry="30" fill="#7C6BC4" />

        {/* Belly */}
        <ellipse cx="50" cy="64" rx="18" ry="18" fill="#9B8ED8" />

        {/* Left ear */}
        <ellipse cx="22" cy="40" rx="16" ry="20" fill="#7C6BC4"
          transform={mood === "sad" ? "translate(0,3)" : ""} />
        <ellipse cx="22" cy="40" rx="10" ry="14" fill="#B8A9E8"
          transform={mood === "sad" ? "translate(0,3)" : ""} />

        {/* Right ear */}
        <ellipse cx="78" cy="40" rx="16" ry="20" fill="#7C6BC4"
          transform={mood === "sad" ? "translate(0,3)" : ""} />
        <ellipse cx="78" cy="40" rx="10" ry="14" fill="#B8A9E8"
          transform={mood === "sad" ? "translate(0,3)" : ""} />

        {/* Head */}
        <circle cx="50" cy="38" r="22" fill="#7C6BC4" />

        {/* Eyes */}
        {mood === "happy" || mood === "celebrating" || mood === "encouraging" ? (
          <>
            {/* Happy eyes - curved */}
            <path d="M40 34 Q42 30 44 34" stroke="#2D1F6B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M56 34 Q58 30 60 34" stroke="#2D1F6B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : mood === "sad" ? (
          <>
            {/* Sad eyes */}
            <circle cx="42" cy="33" r="3" fill="#2D1F6B" />
            <circle cx="58" cy="33" r="3" fill="#2D1F6B" />
            <circle cx="43" cy="32" r="1" fill="#fff" />
            <circle cx="59" cy="32" r="1" fill="#fff" />
            {/* Tear */}
            <ellipse cx="45" cy="38" rx="1.5" ry="2" fill="#87CEEB" opacity="0.7" />
          </>
        ) : (
          <>
            {/* Thinking/default eyes */}
            <circle cx="42" cy="33" r="3" fill="#2D1F6B" />
            <circle cx="58" cy="33" r="3" fill="#2D1F6B" />
            <circle cx="43" cy="32" r="1" fill="#fff" />
            <circle cx="59" cy="32" r="1" fill="#fff" />
          </>
        )}

        {/* Trunk */}
        {mood === "sad" ? (
          <path d="M50 42 Q50 52 46 58 Q44 62 42 60" stroke="#7C6BC4" strokeWidth="6" fill="none" strokeLinecap="round" />
        ) : mood === "celebrating" ? (
          <path d="M50 42 Q50 50 54 46 Q58 42 60 36" stroke="#7C6BC4" strokeWidth="6" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M50 42 Q50 52 54 56 Q58 58 56 54" stroke="#7C6BC4" strokeWidth="6" fill="none" strokeLinecap="round" />
        )}
        {/* Trunk inner line */}
        {mood === "sad" ? (
          <path d="M50 42 Q50 52 46 58 Q44 62 42 60" stroke="#9B8ED8" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : mood === "celebrating" ? (
          <path d="M50 42 Q50 50 54 46 Q58 42 60 36" stroke="#9B8ED8" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M50 42 Q50 52 54 56 Q58 58 56 54" stroke="#9B8ED8" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* Mouth */}
        {mood === "happy" || mood === "celebrating" ? (
          <path d="M44 44 Q50 50 56 44" stroke="#2D1F6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        ) : mood === "sad" ? (
          <path d="M44 47 Q50 43 56 47" stroke="#2D1F6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        ) : mood === "encouraging" ? (
          <path d="M44 45 Q50 49 56 45" stroke="#2D1F6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        ) : null}

        {/* Crown / gold accent on head */}
        <circle cx="50" cy="18" r="5" fill="#FFD54F" />
        <polygon points="46,18 50,10 54,18" fill="#FFD54F" />

        {/* Feet */}
        <ellipse cx="38" cy="86" rx="8" ry="5" fill="#6B5BAF" />
        <ellipse cx="62" cy="86" rx="8" ry="5" fill="#6B5BAF" />
        {/* Toenails */}
        <circle cx="34" cy="85" r="1.5" fill="#FFD54F" />
        <circle cx="38" cy="84" r="1.5" fill="#FFD54F" />
        <circle cx="42" cy="85" r="1.5" fill="#FFD54F" />
        <circle cx="58" cy="85" r="1.5" fill="#FFD54F" />
        <circle cx="62" cy="84" r="1.5" fill="#FFD54F" />
        <circle cx="66" cy="85" r="1.5" fill="#FFD54F" />

        {/* Encouraging arm gesture */}
        {mood === "encouraging" && (
          <>
            <path d="M76 58 Q82 50 86 44" stroke="#7C6BC4" strokeWidth="5" fill="none" strokeLinecap="round" />
            <text x="84" y="42" fontSize="10" textAnchor="middle">💪</text>
          </>
        )}

        {/* Thinking dots */}
        {mood === "thinking" && (
          <>
            <circle cx="68" cy="24" r="2.5" fill="#B8A9E8" opacity="0.6" />
            <circle cx="74" cy="18" r="3.5" fill="#B8A9E8" opacity="0.5" />
            <circle cx="82" cy="12" r="4.5" fill="#B8A9E8" opacity="0.4" />
          </>
        )}

        {/* Celebrating star */}
        {mood === "celebrating" && (
          <>
            <text x="26" y="16" fontSize="8">✦</text>
            <text x="72" y="12" fontSize="10">✧</text>
            <text x="18" y="30" fontSize="6">★</text>
            <text x="82" y="28" fontSize="7">✦</text>
          </>
        )}
      </svg>
    </div>
  );
}
