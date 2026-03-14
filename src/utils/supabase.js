import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://tjbpuhjkzenacnhxibfb.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYnB1aGpremVuYWNuaHhpYmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTAxNTUsImV4cCI6MjA4OTA4NjE1NX0.tujzJ_FBb09RSRwZ44_AXZT-7qOFwYOCnm7MBl9My8I";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function isSupabaseConfigured() {
  return supabase !== null;
}
