import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const metadata: Metadata = {
  title: 'Weekly Stats — Scoop Scoops',
};

function oneWeekAgo() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

async function getCurrentUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() { /* read-only in a Server Component */ },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function AdminStatsPage() {
  const user = await getCurrentUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/');
  }

  const since = oneWeekAgo();

  const [scoopsResult, pageViewsResult, loginsResult, errorsResult] = await Promise.all([
    getSupabaseAdmin().from('scoops').select('*', { count: 'exact', head: true }).gte('created_at', since),
    getSupabaseAdmin().from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', since),
    getSupabaseAdmin().from('login_events').select('*', { count: 'exact', head: true }).gte('created_at', since),
    getSupabaseAdmin().from('error_log').select('message, path, method, created_at').gte('created_at', since).order('created_at', { ascending: false }),
  ]);

  const stats = [
    { label: 'Scoops Logged', value: scoopsResult.count ?? 0 },
    { label: 'Page Views', value: pageViewsResult.count ?? 0 },
    { label: 'Logins', value: loginsResult.count ?? 0 },
  ];
  const errors = errorsResult.data ?? [];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">Weekly Stats</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-10">Last 7 days</p>

        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-stone-200 dark:border-stone-700 p-4 text-center">
              <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">{stat.value.toLocaleString()}</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3">Errors ({errors.length})</h2>
        {errors.length === 0 ? (
          <p className="text-sm text-stone-500 dark:text-stone-400">No errors this week.</p>
        ) : (
          <ul className="space-y-2">
            {errors.map((err, i) => (
              <li key={i} className="text-sm border border-stone-200 dark:border-stone-700 rounded-lg p-3">
                <div className="font-mono text-stone-900 dark:text-stone-100">{err.message}</div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {err.method} {err.path} · {new Date(err.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
