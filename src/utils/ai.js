import { getProxyUrl } from "./storage";

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
 * Check if the user has AI access (API key or proxy configured).
 */
export function hasAIAccess() {
  return !!(getApiKey() || getProxyUrl());
}

/**
 * Call Claude API with the given system prompt and messages.
 * Supports both direct API and proxy modes.
 *
 * @param {Object} opts
 * @param {string} opts.system - System prompt
 * @param {Array<{role: string, content: string}>} opts.messages - Conversation messages
 * @param {string} [opts.model] - Model to use (default: Sonnet)
 * @param {number} [opts.maxTokens] - Max tokens (default: 300)
 * @returns {Promise<string>} The assistant's reply text
 */
export async function callClaude({ system, messages, model = MODELS.SONNET, maxTokens = 300 }) {
  const proxyUrl = getProxyUrl();
  const apiKey = getApiKey();

  if (!proxyUrl && !apiKey) {
    throw new Error("No API key configured. Set up your Claude API key in AI Chat settings.");
  }

  const payload = {
    model,
    max_tokens: maxTokens,
    system,
    messages,
  };

  const res = proxyUrl
    ? await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    : await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify(payload),
      });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || "...";
}
