import { supabase, isSupabaseConfigured } from "./supabase";

// Keys that contain arrays (merged by union)
const ARRAY_KEYS = [
  "katthai_favs_v2", "katthai_studied_v2", "katthai_custom_v1",
  "katthai_pinned_v1", "katthai_hidden_v1", "katthai_script_v1",
];

// Keys that contain objects (merged by keeping higher values)
const OBJECT_KEYS = [
  "katthai_confidence_v1", "katthai_conv_progress_v1",
  "katthai_conv_custom_v1", "katthai_adaptive_v1",
  "katthai_roleplay_v1",
];

// Keys with special merge logic
const SPECIAL_KEYS = ["katthai_streak_v1", "katthai_xp_v1", "katthai_srs_v1", "katthai_mistakes_v1"];

// All syncable keys
const ALL_SYNC_KEYS = [
  ...ARRAY_KEYS, ...OBJECT_KEYS, ...SPECIAL_KEYS,
  "katthai_lesson_active_v1", "katthai_daily_v1",
  "katthai_placement_v1", "katthai_unit_tests_v1",
];

/**
 * Merge local and cloud data, keeping highest progress.
 */
function mergeValue(key, local, cloud) {
  if (local == null) return cloud;
  if (cloud == null) return local;

  // Arrays: union
  if (ARRAY_KEYS.includes(key)) {
    if (Array.isArray(local) && Array.isArray(cloud)) {
      // For arrays of objects (custom words), merge by id
      if (local.length > 0 && typeof local[0] === "object" && local[0]?.id) {
        const map = new Map();
        for (const item of cloud) map.set(item.id, item);
        for (const item of local) map.set(item.id, item);
        return [...map.values()];
      }
      // For arrays of primitives (ids): union
      return [...new Set([...cloud, ...local])];
    }
    return local;
  }

  // Objects: keep higher values per key
  if (OBJECT_KEYS.includes(key)) {
    if (typeof local === "object" && typeof cloud === "object") {
      const merged = { ...cloud };
      for (const [k, v] of Object.entries(local)) {
        if (typeof v === "number" && typeof merged[k] === "number") {
          merged[k] = Math.max(v, merged[k]);
        } else if (merged[k] == null) {
          merged[k] = v;
        }
      }
      return merged;
    }
    return local;
  }

  // Streak: keep higher streak, most recent date
  if (key === "katthai_streak_v1") {
    const ls = typeof local === "object" ? local : {};
    const cs = typeof cloud === "object" ? cloud : {};
    return {
      streak: Math.max(ls.streak || 0, cs.streak || 0),
      lastDate: (ls.lastDate || "") > (cs.lastDate || "") ? ls.lastDate : cs.lastDate,
    };
  }

  // XP: keep higher totalXP
  if (key === "katthai_xp_v1") {
    const lx = typeof local === "object" ? local : {};
    const cx = typeof cloud === "object" ? cloud : {};
    return {
      ...lx,
      ...cx,
      totalXP: Math.max(lx.totalXP || 0, cx.totalXP || 0),
    };
  }

  // SRS: merge by word id, keep the one with more reviews
  if (key === "katthai_srs_v1") {
    if (typeof local === "object" && typeof cloud === "object") {
      const merged = { ...cloud };
      for (const [k, v] of Object.entries(local)) {
        if (!merged[k] || (v.reviews || 0) > (merged[k].reviews || 0)) {
          merged[k] = v;
        }
      }
      return merged;
    }
    return local;
  }

  // Mistakes: merge by word id, keep higher count
  if (key === "katthai_mistakes_v1") {
    if (typeof local === "object" && typeof cloud === "object") {
      const merged = { ...cloud };
      for (const [k, v] of Object.entries(local)) {
        if (!merged[k] || (v.count || 0) > (merged[k].count || 0)) {
          merged[k] = v;
        }
      }
      return merged;
    }
    return local;
  }

  // Default: prefer local (most recent user action)
  return local;
}

/**
 * Pull all data from Supabase for the current user.
 */
export async function pullCloudData(userId) {
  if (!isSupabaseConfigured() || !userId) return {};

  const { data, error } = await supabase
    .from("user_data")
    .select("data_key, data_value")
    .eq("user_id", userId);

  if (error) {
    console.error("Cloud pull failed:", error.message);
    return {};
  }

  const cloudData = {};
  for (const row of data || []) {
    cloudData[row.data_key] = row.data_value;
  }
  return cloudData;
}

/**
 * Push a single key to Supabase (upsert).
 */
export async function pushCloudData(userId, key, value) {
  if (!isSupabaseConfigured() || !userId) return;
  if (!ALL_SYNC_KEYS.includes(key)) return;

  const { error } = await supabase
    .from("user_data")
    .upsert(
      { user_id: userId, data_key: key, data_value: value, updated_at: new Date().toISOString() },
      { onConflict: "user_id,data_key" }
    );

  if (error) {
    console.error(`Cloud push failed for ${key}:`, error.message);
  }
}

/**
 * Sync on login: merge local + cloud, write merged result to both.
 */
export async function syncOnLogin(userId) {
  if (!isSupabaseConfigured() || !userId) return;

  const cloudData = await pullCloudData(userId);

  for (const key of ALL_SYNC_KEYS) {
    let local = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) local = JSON.parse(raw);
    } catch { /* ignore */ }

    const cloud = cloudData[key] ?? null;
    const merged = mergeValue(key, local, cloud);

    if (merged != null) {
      // Write merged to localStorage
      localStorage.setItem(key, JSON.stringify(merged));
      // Write merged to cloud
      await pushCloudData(userId, key, merged);
    }
  }
}

/**
 * Push all local data to cloud (initial backup after first signup).
 */
export async function pushAllToCloud(userId) {
  if (!isSupabaseConfigured() || !userId) return;

  for (const key of ALL_SYNC_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        await pushCloudData(userId, key, JSON.parse(raw));
      }
    } catch { /* ignore */ }
  }
}

/**
 * Save Claude API key securely in Supabase.
 */
export async function saveClaudeKey(userId, apiKey) {
  if (!isSupabaseConfigured() || !userId) return;

  const { error } = await supabase
    .from("user_secrets")
    .upsert(
      { user_id: userId, claude_api_key: apiKey, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

  if (error) console.error("Failed to save API key:", error.message);
}

/**
 * Load Claude API key from Supabase.
 */
export async function loadClaudeKey(userId) {
  if (!isSupabaseConfigured() || !userId) return null;

  const { data, error } = await supabase
    .from("user_secrets")
    .select("claude_api_key")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data.claude_api_key;
}

/**
 * Delete Claude API key from Supabase.
 */
export async function deleteClaudeKey(userId) {
  if (!isSupabaseConfigured() || !userId) return;

  await supabase
    .from("user_secrets")
    .delete()
    .eq("user_id", userId);
}

export { ALL_SYNC_KEYS };
