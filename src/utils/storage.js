import { useState } from "react";
import { pushCloudData } from "./cloudSync";

// Debounced cloud sync — batches all writes within a 2-second window
let _pendingCloudWrites = new Map();
let _cloudDebounceTimer = null;
function debouncedCloudPush(userId, key, val) {
  _pendingCloudWrites.set(key, { userId, val });
  if (_cloudDebounceTimer) clearTimeout(_cloudDebounceTimer);
  _cloudDebounceTimer = setTimeout(() => {
    const batch = new Map(_pendingCloudWrites);
    _pendingCloudWrites.clear();
    _cloudDebounceTimer = null;
    for (const [k, { userId: uid, val: v }] of batch) {
      pushCloudData(uid, k, v).catch(() => {});
    }
  }, 2000);
}

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
export const K_UNIT_TESTS = "katthai_unit_tests_v1";

// Cloud sync: set by AuthContext when user logs in/out
let _currentUserId = null;
export function setCurrentUserId(id) { _currentUserId = id; }
export function getCurrentUserId() { return _currentUserId; }

// All data keys for export/import (hardcoded strings to avoid circular imports)
const ALL_DATA_KEYS = [
  "katthai_favs_v2", "katthai_studied_v2", "katthai_custom_v1", "katthai_pinned_v1",
  "katthai_conv_progress_v1", "katthai_conv_custom_v1", "katthai_hidden_v1",
  "katthai_script_v1", "katthai_lesson_active_v1", "katthai_streak_v1",
  "katthai_confidence_v1", "katthai_roleplay_v1", "katthai_xp_v1", "katthai_srs_v1",
  "katthai_mistakes_v1", "katthai_adaptive_v1", "katthai_daily_v1",
  "katthai_placement_v1",
  "katthai_unit_tests_v1",
];

export function exportAllData() {
  const data = {};
  for (const key of ALL_DATA_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try { data[key] = JSON.parse(raw); } catch { data[key] = raw; }
    }
  }
  return { version: 1, exportedAt: new Date().toISOString(), data };
}

export function importAllData(jsonObj) {
  if (!jsonObj || typeof jsonObj !== "object" || !jsonObj.data || typeof jsonObj.data !== "object") {
    throw new Error("Invalid backup file format");
  }
  const validKeys = new Set(ALL_DATA_KEYS);
  let imported = 0, skipped = 0;
  for (const [key, value] of Object.entries(jsonObj.data)) {
    if (validKeys.has(key)) {
      localStorage.setItem(key, JSON.stringify(value));
      imported++;
    } else {
      skipped++;
    }
  }
  return { imported, skipped };
}

export function clearAllData() {
  for (const key of ALL_DATA_KEYS) localStorage.removeItem(key);
}

export function getDataStats() {
  const count = (key) => { try { const v = JSON.parse(localStorage.getItem(key) || "null"); return Array.isArray(v) ? v.length : v instanceof Object ? Object.keys(v).length : 0; } catch { return 0; } };
  const xp = (() => { try { return JSON.parse(localStorage.getItem("katthai_xp_v1") || "{}").totalXP || 0; } catch { return 0; } })();
  const streak = (() => { try { return JSON.parse(localStorage.getItem("katthai_streak_v1") || "{}").streak || 0; } catch { return 0; } })();
  return {
    favorites: count("katthai_favs_v2"),
    studied: count("katthai_studied_v2"),
    customWords: count("katthai_custom_v1"),
    srsWords: count("katthai_srs_v1"),
    mistakes: count("katthai_mistakes_v1"),
    totalXP: xp,
    streak,
  };
}

const K_LAST_EXPORT = "katthai_last_export";
const K_PROXY_URL = "katthai_proxy_url";

export function getLastExportDate() {
  return localStorage.getItem(K_LAST_EXPORT);
}
export function setLastExportDate() {
  localStorage.setItem(K_LAST_EXPORT, new Date().toISOString());
}
export function getProxyUrl() {
  return localStorage.getItem(K_PROXY_URL) || "";
}
export function setProxyUrl(url) {
  if (url) localStorage.setItem(K_PROXY_URL, url.trim());
  else localStorage.removeItem(K_PROXY_URL);
}

export function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}
export function saveLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
  // Debounced cloud push — batches writes within a 2-second window
  if (_currentUserId) {
    debouncedCloudPush(_currentUserId, key, val);
  }
}

export function useLocalSet(key) {
  const [s, setS] = useState(() => new Set(loadLS(key, [])));
  const toggle = id => setS(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id);
    saveLS(key, [...n]); return n;
  });
  return [s, toggle];
}
