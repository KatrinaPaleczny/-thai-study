import { useState } from "react";

export const K_FAV = "katthai_favs_v2";
export const K_STU = "katthai_studied_v2";
export const K_CUSTOM = "katthai_custom_v1";
export const K_PINNED = "katthai_pinned_v1";
export const K_CONV = "katthai_conv_progress_v1";
export const K_CONV_CUSTOM = "katthai_conv_custom_v1";
export const K_HIDDEN = "katthai_hidden_v1";
export const K_SCRIPT = "katthai_script_v1";
export const K_LESSON_ACTIVE = "katthai_lesson_active_v1";
export const K_STREAK = "katthai_streak_v1";
export const K_CONFIDENCE = "katthai_confidence_v1";
export const K_ROLEPLAY = "katthai_roleplay_v1";

export function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}
export function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

export function useLocalSet(key) {
  const [s, setS] = useState(() => new Set(loadLS(key, [])));
  const toggle = id => setS(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id);
    saveLS(key, [...n]); return n;
  });
  return [s, toggle];
}
