import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_FOURCHINESE_SUPABASE_URL;
const key = import.meta.env.VITE_FOURCHINESE_SUPABASE_ANON_KEY;
let client: SupabaseClient | null = null;
export const communityConfigured = Boolean(url && key);
export function getCommunityClient() {
  if (!communityConfigured) return null;
  return client ??= createClient(url, key, { auth: { storageKey: '4chinese.web.community.session', persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
}
