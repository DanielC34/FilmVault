
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

const SUPABASE_URL = 'https://egdnxhafhcqbvkomdjkr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZG54aGFmaGNxYnZrb21kamtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NzQ4MDAsImV4cCI6MjA1MzE1MDgwMH0.sb_publishable_YN0S4NpwhY6fB_3sKMDYsg_31GmJA_2';

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
