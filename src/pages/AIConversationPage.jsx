import { useState, useRef, useEffect } from "react";
import { speakThai } from "../utils/speech";
import { awardXP } from "../utils/xp";
import { recordMistake } from "../utils/mistakes";

const SCENARIOS = [
  { id: "vendor", emoji: "🛒", title: "Street Vendor", desc: "Buy food at a Thai market stall", sysPrompt: "You are a friendly Thai street vendor selling grilled meats, sticky rice, and som tam. Speak naturally in Thai (with English translations in parentheses). Start simple and match the user's level. If they make grammar mistakes, gently model the correct form in your reply." },
  { id: "taxi", emoji: "🚕", title: "Taxi Driver", desc: "Tell the driver where to go and negotiate", sysPrompt: "You are a Bangkok taxi driver. You're friendly but busy. Speak in Thai (with English in parentheses). Help the user practice directions, prices, and polite requests. If they struggle, simplify your Thai." },
  { id: "cafe", emoji: "☕", title: "Café Barista", desc: "Order your favorite drink and chat", sysPrompt: "You are a barista at a cozy Thai café. Speak in Thai (with English in parentheses). Help the user order drinks, specify sweetness levels, and have small talk. Be warm and patient with beginners." },
  { id: "friend", emoji: "👋", title: "New Friend", desc: "Introduce yourself and get to know someone", sysPrompt: "You are a Thai university student meeting someone new. Speak in Thai (with English in parentheses). Help practice introductions, asking about hobbies, family, and where they're from. Keep it casual and fun." },
  { id: "hotel", emoji: "🏨", title: "Hotel Reception", desc: "Check in and ask about facilities", sysPrompt: "You are a hotel receptionist in Thailand. Speak in Thai (with English in parentheses). Help the user check in, ask about rooms, Wi-Fi, breakfast times, and nearby attractions. Be professional but friendly." },
  { id: "doctor", emoji: "🏥", title: "At the Clinic", desc: "Describe symptoms and understand instructions", sysPrompt: "You are a Thai doctor at a clinic. Speak in Thai (with English in parentheses). Help the user describe how they feel, understand basic medical instructions, and learn health vocabulary. Be patient and clear." },
];

const API_HELP = `To use AI Conversations, you need a Claude API key.

1. Go to console.anthropic.com
2. Create an API key
3. Paste it below

Your key stays in your browser only — it's never sent anywhere except directly to the Claude API.`;

export function AIConversationPage() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("katthai_claude_key") || "");
  const [keyInput, setKeyInput] = useState("");
  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [corrections, setCorrections] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current && !loading) inputRef.current.focus();
  }, [loading, messages]);

  const saveKey = () => {
    const k = keyInput.trim();
    if (k.startsWith("sk-ant-")) {
      localStorage.setItem("katthai_claude_key", k);
      setApiKey(k);
      setError(null);
    } else {
      setError("That doesn't look like a Claude API key. It should start with sk-ant-");
    }
  };

  const clearKey = () => {
    localStorage.removeItem("katthai_claude_key");
    setApiKey("");
    setKeyInput("");
  };

  const startScenario = (sc) => {
    setScenario(sc);
    setMessages([]);
    setCorrections([]);
    setError(null);
    // Send initial greeting
    sendToAPI(sc, [], null);
  };

  const sendToAPI = async (sc, prevMessages, userMsg) => {
    setLoading(true);
    setError(null);

    const systemPrompt = `${sc.sysPrompt}

IMPORTANT INSTRUCTIONS:
- Always respond in Thai first, then provide English translation in parentheses
- Format: Thai text (English translation)
- Keep responses short (1-3 sentences)
- If the user writes in Thai with mistakes, include a "💡 Correction:" section at the end showing the correct Thai
- If this is the start of conversation, greet the user naturally in Thai
- Match the user's skill level — if they use simple Thai, keep yours simple too`;

    const apiMessages = [];
    for (const m of prevMessages) {
      apiMessages.push({ role: m.role, content: m.content });
    }
    if (userMsg) {
      apiMessages.push({ role: "user", content: userMsg });
    }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: systemPrompt,
          messages: apiMessages.length > 0 ? apiMessages : [{ role: "user", content: "สวัสดีครับ" }],
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.content?.[0]?.text || "...";

      // Check for corrections in the reply
      const correctionMatch = reply.match(/💡\s*Correction:?\s*([\s\S]*?)$/i);
      if (correctionMatch && userMsg) {
        setCorrections(c => [...c, { userMsg, correction: correctionMatch[1].trim() }]);
        recordMistake({
          source: "roleplay",
          prompt: userMsg,
          userAnswer: userMsg,
          correctAnswer: correctionMatch[1].trim(),
          score: 0.5,
        });
      }

      const newMessages = [...prevMessages];
      if (userMsg) {
        newMessages.push({ role: "user", content: userMsg });
        awardXP("roleplay_turn");
      }
      newMessages.push({ role: "assistant", content: reply });
      setMessages(newMessages);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    sendToAPI(scenario, messages, msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // No API key — show setup
  if (!apiKey) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">AI Conversation Partner</div>
          <div className="ph-s">Practice real Thai conversations with Claude AI</div>
        </div>
        <div className="aic-setup">
          <div className="aic-setup-icon">🤖</div>
          <div className="aic-setup-text">{API_HELP}</div>
          <div className="aic-key-input-row">
            <input
              type="password"
              className="aic-key-input"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="sk-ant-..."
              onKeyDown={e => e.key === "Enter" && saveKey()}
            />
            <button className="btn btn-pri" onClick={saveKey}>Save Key</button>
          </div>
          {error && <div className="aic-error">{error}</div>}
        </div>
      </div>
    );
  }

  // Scenario picker
  if (!scenario) {
    return (
      <div className="page">
        <div className="ph">
          <div className="ph-t">AI Conversation Partner</div>
          <div className="ph-s">Pick a scenario and start speaking Thai with AI</div>
        </div>
        <div className="aic-scenarios">
          {SCENARIOS.map(sc => (
            <button key={sc.id} className="aic-scenario-card" onClick={() => startScenario(sc)}>
              <div className="aic-scenario-emoji">{sc.emoji}</div>
              <div className="aic-scenario-title">{sc.title}</div>
              <div className="aic-scenario-desc">{sc.desc}</div>
            </button>
          ))}
        </div>
        <button className="btn btn-sec btn-sm" onClick={clearKey} style={{ marginTop: 20 }}>
          Change API Key
        </button>
      </div>
    );
  }

  // Chat view
  return (
    <div className="page aic-page">
      <div className="aic-chat-header">
        <button className="btn btn-sec btn-sm" onClick={() => setScenario(null)}>← Scenarios</button>
        <div className="aic-chat-title">{scenario.emoji} {scenario.title}</div>
        <div className="aic-chat-desc">{scenario.desc}</div>
      </div>

      <div className="aic-chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`aic-msg ${m.role}`}>
            <div className="aic-msg-bubble">
              {m.content}
              {m.role === "assistant" && (
                <button
                  className="aic-speak-btn"
                  onClick={() => {
                    // Extract Thai text (before parentheses)
                    const thaiParts = m.content.split(/\s*\(/).map(p => p.replace(/\).*/, "").trim());
                    speakThai(thaiParts[0] || m.content);
                  }}
                  title="Listen"
                >🔊</button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="aic-msg assistant">
            <div className="aic-msg-bubble aic-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && <div className="aic-error">{error}</div>}

      <div className="aic-input-bar">
        <input
          ref={inputRef}
          className="aic-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type in Thai or English..."
          disabled={loading}
          autoComplete="off"
          lang="th"
        />
        <button className="btn btn-pri" onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>

      {corrections.length > 0 && (
        <div className="aic-corrections">
          <div className="aic-corrections-title">💡 Corrections this session</div>
          {corrections.map((c, i) => (
            <div key={i} className="aic-correction-item">
              <span className="aic-correction-you">You: {c.userMsg}</span>
              <span className="aic-correction-fix">→ {c.correction}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
