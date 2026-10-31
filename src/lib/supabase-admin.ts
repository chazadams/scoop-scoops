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

// Best-effort insert for logging tables. Failures are logged, never thrown, so
// a missing or bad key can't break the request being logged.
export async function logAdminInsert(table: string, row: Record<string, unknown>) {
  try {
    const { error } = await getSupabaseAdmin().from(table).insert(row);
    if (error) console.error(`${table} insert failed:`, error.message);
  } catch (err) {
    console.error(`${table} insert failed:`, err instanceof Error ? err.message : err);
  }
}
