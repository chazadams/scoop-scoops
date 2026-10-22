import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

// Service-role client for server-only tables (page_views, login_events,
// error_log) that have no RLS policies for the anon/authenticated roles.
// Never import this into a client component.
// Created on first use so builds don't need SUPABASE_SERVICE_ROLE_KEY.
export function getSupabaseAdmin() {
  client ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  return client;
}
