import type { Instrumentation } from 'next';
import { logAdminInsert } from '@/lib/supabase-admin';

export const onRequestError: Instrumentation.onRequestError = async (err, request) => {
  const message = err instanceof Error ? err.message : String(err);
  const digest = err instanceof Error ? (err as Error & { digest?: string }).digest ?? null : null;

  await logAdminInsert('error_log', {
    message,
    digest,
    path: request.path,
    method: request.method,
  });
};
