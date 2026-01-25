
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

// Replace these with your actual Supabase project credentials from the Supabase Dashboard
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Helper to check if Supabase is actually configured
export const isSupabaseConfigured = () => {
  return SUPABASE_URL !== 'https://your-project-url.supabase.co' && SUPABASE_ANON_KEY !== 'your-anon-key';
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
