import { normPhon } from "./phonetics";

// Thai particles to strip for forgiving comparison
const PARTICLES = [
  "ค่ะ", "ครับ", "คะ", "คับ", "ค่า", "จ้า", "จ้ะ", "นะ", "จ๊ะ",
  "khâ", "kráp", "khá", "kráp", "ná", "na", "jâ", "jâ",
];

const PARTICLE_RE = new RegExp(
  PARTICLES.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "gi"
);

/** Strip politeness particles and normalize whitespace */
function stripParticles(s) {
  return s.replace(PARTICLE_RE, "").replace(/\s+/g, " ").trim();
}

/** Levenshtein edit distance */
function editDist(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

/**
 * Expand slash-alternatives in expected text.
 * "phǒm/chǎn chûe [Name]" → ["phǒm chûe [Name]", "chǎn chûe [Name]"]
 * Only expands first slash found to avoid combinatorial explosion.
 */
function expandAlternatives(text) {
  // Find tokens with slashes
  const tokens = text.split(/\s+/);
  let slashIdx = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].includes("/") && !tokens[i].startsWith("[")) {
      slashIdx = i;
      break;
    }
  }
  if (slashIdx === -1) return [text];

  const parts = tokens[slashIdx].split("/");
  return parts.map(alt => {
    const copy = [...tokens];
    copy[slashIdx] = alt;
    return copy.join(" ");
  });
}

/** Remove bracketed placeholders like [Name] */
function stripBrackets(s) {
  return s.replace(/\[.*?\]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Compare user input against expected Thai response.
 * Returns { score: 0-1, level: "perfect"|"close"|"wrong" }
 */
export function compareThai(input, expected) {
  const inp = input.trim();
  const exp = expected.trim();

  if (!inp) return { score: 0, level: "wrong" };

  // Expand alternatives in expected text
  const variants = expandAlternatives(exp).map(v => stripBrackets(v));

  let bestScore = 0;

  for (const variant of variants) {
    // 1. Exact match
    if (inp === variant) return { score: 1, level: "perfect" };

    // 2. Particle-stripped match
    const inpStripped = stripParticles(inp);
    const varStripped = stripParticles(variant);
    if (inpStripped && varStripped && inpStripped === varStripped) {
      bestScore = Math.max(bestScore, 0.95);
      continue;
    }

    // 3. Phonetic normalized match
    const inpNorm = normPhon(inpStripped || inp);
    const varNorm = normPhon(varStripped || variant);
    if (inpNorm === varNorm) {
      bestScore = Math.max(bestScore, 0.9);
      continue;
    }

    // 4. Token-level overlap with phonetic normalization
    const inpTokens = inpNorm.split(/\s+/).filter(Boolean);
    const varTokens = varNorm.split(/\s+/).filter(Boolean);
    if (inpTokens.length > 0 && varTokens.length > 0) {
      // For phonetic comparison, join and compare as single normalized strings
      const joined1 = inpTokens.join("");
      const joined2 = varTokens.join("");
      if (joined1 === joined2) {
        bestScore = Math.max(bestScore, 0.9);
        continue;
      }

      // Token overlap
      let matched = 0;
      const used = new Set();
      for (const t of inpTokens) {
        for (let j = 0; j < varTokens.length; j++) {
          if (!used.has(j) && t === varTokens[j]) {
            matched++;
            used.add(j);
            break;
          }
        }
      }
      const tokenScore = matched / Math.max(inpTokens.length, varTokens.length);
      bestScore = Math.max(bestScore, tokenScore);
    }

    // 5. Character-level Levenshtein on normalized phonetics
    const joined1 = normPhon(inp);
    const joined2 = normPhon(variant);
    if (joined1.length > 0 && joined2.length > 0) {
      const dist = editDist(joined1, joined2);
      const levScore = 1 - dist / Math.max(joined1.length, joined2.length);
      bestScore = Math.max(bestScore, levScore);
    }
  }

  const level = bestScore >= 0.9 ? "perfect" : bestScore >= 0.6 ? "close" : "wrong";
  return { score: bestScore, level };
}
