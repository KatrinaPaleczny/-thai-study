import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  // Verify the user is authenticated via Supabase JWT
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json(
      { error: { message: "Missing authorization header" } },
      { status: 401, headers: CORS_HEADERS },
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json(
      { error: { message: "Invalid or expired session. Please sign in again." } },
      { status: 401, headers: CORS_HEADERS },
    );
  }

  // Get the API key from Supabase secrets
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey) {
    return Response.json(
      { error: { message: "API key not configured on server. Run: supabase secrets set ANTHROPIC_API_KEY=sk-ant-..." } },
      { status: 500, headers: CORS_HEADERS },
    );
  }

  try {
    const body = await req.json();

    // Only allow specific fields through (prevent prompt injection via extra fields)
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
        "x-api-key": anthropicKey,
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
    return Response.json(
      { error: { message: "Proxy error: " + (e as Error).message } },
      { status: 500, headers: CORS_HEADERS },
    );
  }
});
