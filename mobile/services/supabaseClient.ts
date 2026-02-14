import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://your-project-url.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

export const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL !== "https://your-project-url.supabase.co" &&
    SUPABASE_ANON_KEY !== "your-anon-key"
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
