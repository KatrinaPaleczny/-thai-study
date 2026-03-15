import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase, isSupabaseConfigured } from "../utils/supabase";
import { setCurrentUserId } from "../utils/storage";
import { syncOnLogin, pushAllToCloud } from "../utils/cloudSync";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setCurrentUserId(u?.id ?? null);
      if (u && !syncedRef.current) {
        syncedRef.current = true;
        setSyncing(true);
        syncOnLogin(u.id).finally(() => setSyncing(false));
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setCurrentUserId(u?.id ?? null);
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
      }
      if (u && event === "SIGNED_IN" && !syncedRef.current) {
        syncedRef.current = true;
        setSyncing(true);
        syncOnLogin(u.id).finally(() => setSyncing(false));
      }
      if (event === "SIGNED_OUT") {
        syncedRef.current = false;
        setRecoveryMode(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password) => {
    if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
    setError(null);
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    if (err) { setError(err.message); throw err; }
    return data;
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
    setError(null);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); throw err; }
    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    setError(null);
    const { error: err } = await supabase.auth.signOut();
    if (err) { setError(err.message); throw err; }
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
    setError(null);
    const redirectTo = `${window.location.origin}/account`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (err) { setError(err.message); throw err; }
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) { setError(err.message); throw err; }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    syncing,
    error,
    isAuthenticated: !!user,
    supabaseConfigured: isSupabaseConfigured(),
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    recoveryMode,
    setRecoveryMode,
  }), [user, loading, syncing, error, signUp, signIn, signOut, resetPassword, updatePassword, recoveryMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
