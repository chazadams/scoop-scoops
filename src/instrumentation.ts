import type { Instrumentation } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const onRequestError: Instrumentation.onRequestError = async (err, request) => {
  const message = err instanceof Error ? err.message : String(err);
  const digest = err instanceof Error ? (err as Error & { digest?: string }).digest ?? null : null;

  const { error } = await getSupabaseAdmin().from('error_log').insert({
    message,
    digest,
    path: request.path,
    method: request.method,
  });
  if (error) console.error('error_log insert failed:', error.message);
};
