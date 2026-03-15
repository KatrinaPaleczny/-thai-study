import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../utils/supabase";

export function AuthPage() {
  const { signIn, signUp, resetPassword, updatePassword, error: authError, isAuthenticated, supabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "reset" | "newpassword"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Detect Supabase password recovery redirect (URL contains #type=recovery or ?type=recovery)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("newpassword");
        setMsg(null);
      }
    });
  }, []);

  // If already logged in and NOT in newpassword mode, redirect
  if (isAuthenticated && mode !== "newpassword") {
    navigate("/settings", { replace: true });
    return null;
  }

  if (!supabaseConfigured) {
    return (
      <div className="page">
        <div className="ph"><h1 className="ph-t">Account</h1><p className="ph-s">Sign in to sync your progress across devices</p></div>
        <div className="sett-section">
          <h2 className="sett-h">Not Configured</h2>
          <p className="sett-desc">
            Cloud sync requires Supabase to be set up. Add your Supabase URL and anon key to the environment variables
            (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) and restart the app.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (mode === "newpassword") {
        await updatePassword(password);
        setMsg({ type: "success", text: "Password updated! You're now signed in." });
        setTimeout(() => navigate("/", { replace: true }), 1500);
      } else if (mode === "reset") {
        await resetPassword(email);
        setMsg({ type: "success", text: "Password reset email sent! Check your inbox." });
      } else if (mode === "signup") {
        await signUp(email, password);
        setMsg({ type: "success", text: "Account created! You can now sign in." });
        setMode("signin");
      } else {
        await signIn(email, password);
        navigate("/", { replace: true });
      }
    } catch (err) {
      // Show detailed error for debugging
      console.error("Auth error:", err);
      if (err?.message === "Failed to fetch") {
        setMsg({ type: "error", text: `Network error: could not reach Supabase. Check your internet connection or try disabling ad blockers / VPN.` });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="ph">
        <h1 className="ph-t">{mode === "newpassword" ? "Set New Password" : mode === "reset" ? "Reset Password" : mode === "signup" ? "Create Account" : "Sign In"}</h1>
        <p className="ph-s">
          {mode === "newpassword" ? "Choose a new password for your account" : mode === "reset" ? "We'll send you a reset link" : "Sync your study progress across devices"}
        </p>
      </div>

      {(msg || authError) && (
        <div className={`sett-msg sett-msg-${msg?.type || "error"}`}>
          {msg?.text || authError}
        </div>
      )}

      <div className="sett-section" style={{ maxWidth: 420 }}>
        <form onSubmit={handleSubmit}>
          {/* Email — shown for signin, signup, reset but NOT newpassword */}
          {mode !== "newpassword" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--t2)", marginBottom: 4 }}>Email</label>
              <input
                type="email"
                className="sett-proxy-input"
                style={{ width: "100%", boxSizing: "border-box" }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
          )}

          {/* Password — shown for signin, signup, newpassword but NOT reset */}
          {mode !== "reset" && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--t2)", marginBottom: 4 }}>
                {mode === "newpassword" ? "New Password" : "Password"}
              </label>
              <input
                type="password"
                className="sett-proxy-input"
                style={{ width: "100%", boxSizing: "border-box" }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "signup" || mode === "newpassword" ? "new-password" : "current-password"}
                placeholder="At least 6 characters"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-pri"
            disabled={loading}
            style={{ width: "100%", padding: "10px 0", fontSize: 14, marginBottom: 14 }}
          >
            {loading ? "..." : mode === "newpassword" ? "Set New Password" : mode === "reset" ? "Send Reset Link" : mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={{ fontSize: 13, color: "var(--t3)", textAlign: "center" }}>
          {mode === "signin" && (
            <>
              <span>Don't have an account? </span>
              <button onClick={() => { setMode("signup"); setMsg(null); }} style={{ background: "none", border: "none", color: "var(--act)", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>
                Sign up
              </button>
              <span style={{ margin: "0 8px" }}>|</span>
              <button onClick={() => { setMode("reset"); setMsg(null); }} style={{ background: "none", border: "none", color: "var(--act)", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>
                Forgot password?
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              <span>Already have an account? </span>
              <button onClick={() => { setMode("signin"); setMsg(null); }} style={{ background: "none", border: "none", color: "var(--act)", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>
                Sign in
              </button>
            </>
          )}
          {(mode === "reset" || mode === "newpassword") && (
            <button onClick={() => { setMode("signin"); setMsg(null); }} style={{ background: "none", border: "none", color: "var(--act)", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>
              Back to sign in
            </button>
          )}
        </div>
      </div>

      <div className="sett-section" style={{ maxWidth: 420, marginTop: 16 }}>
        <p className="sett-desc" style={{ marginBottom: 0 }}>
          Your study progress is always saved locally. Signing in adds cloud backup and sync so you
          can continue studying on any device.
        </p>
      </div>
    </div>
  );
}
