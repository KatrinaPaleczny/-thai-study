import { getProxyUrl } from "./storage";
import { supabase, isSupabaseConfigured } from "./supabase";
import { getCurrentUserId } from "./storage";

export const MODELS = {
  HAIKU: "claude-haiku-4-5-20251001",
  SONNET: "claude-sonnet-4-20250514",
};

/**
 * Get the user's Claude API key from browser storage.
 */
export function getApiKey() {
  return sessionStorage.getItem("katthai_claude_key") || localStorage.getItem("katthai_claude_key") || "";
}

/**
 * Check if the user has AI access via any available method:
 * 1. Supabase Edge Function (authenticated user)
 * 2. Custom proxy URL
 * 3. Direct browser API key
 */
export function hasAIAccess() {
  return !!(getSupabaseFunctionUrl() || getApiKey() || getProxyUrl());
}

/**
 * Get the Supabase Edge Function URL if available (user is authenticated).
 */
function getSupabaseFunctionUrl() {
  if (!isSupabaseConfigured() || !getCurrentUserId()) return null;
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) return null;
  return `${url}/functions/v1/claude-proxy`;
}

/**
 * Call Claude API with the given system prompt and messages.
 * Priority: Supabase Edge Function > proxy URL > direct browser key.
 */
// Rate limiting: minimum 3 seconds between API calls
let _lastCallTime = 0;
let _callInFlight = false;

export async function callClaude({ system, messages, model = MODELS.SONNET, maxTokens = 300 }) {
  if (_callInFlight) {
    throw new Error("An AI request is already in progress. Please wait.");
  }

  const now = Date.now();
  const elapsed = now - _lastCallTime;
  if (elapsed < 3000 && _lastCallTime > 0) {
    throw new Error("Please wait a moment before making another AI request.");
  }

  const supabaseFnUrl = getSupabaseFunctionUrl();
  const proxyUrl = getProxyUrl();
  const apiKey = getApiKey();

  if (!supabaseFnUrl && !proxyUrl && !apiKey) {
    throw new Error("No API key configured. Sign in for server-side AI, or set up an API key in Settings.");
  }

  _callInFlight = true;
  _lastCallTime = now;

  const payload = {
    model,
    max_tokens: maxTokens,
    system,
    messages,
  };

  try {
    let res;

    if (supabaseFnUrl) {
      // Mode 1: Supabase Edge Function (most secure — key stays server-side)
      const { data: { session } } = await supabase.auth.getSession();
      res = await fetch(supabaseFnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(payload),
      });
    } else if (proxyUrl) {
      // Mode 2: Custom proxy (Cloudflare Worker etc.)
      res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Mode 3: Direct browser API call (least secure)
      res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text || "...";
  } finally {
    _callInFlight = false;
  }
}
