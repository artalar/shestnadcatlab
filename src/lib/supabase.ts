import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function hasSupabaseConfig(): boolean {
  return Boolean(
    import.meta.env.PUBLIC_SUPABASE_URL &&
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY &&
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY &&
      import.meta.env.DATA_STORE !== 'memory',
  );
}

export function createAnonClient(): SupabaseClient {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createServiceClient(): SupabaseClient {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
