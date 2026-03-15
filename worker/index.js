const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "API key not configured on server" }, { status: 500, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json();

      // Only allow specific fields through
      const payload = {
        model: body.model || "claude-sonnet-4-20250514",
        max_tokens: Math.min(body.max_tokens || 300, 2048),
        system: body.system,
        messages: body.messages,
      };

      const res = await fetch(ANTHROPIC_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    } catch (e) {
      return Response.json({ error: "Proxy error: " + e.message }, { status: 500, headers: CORS_HEADERS });
    }
  },
};
