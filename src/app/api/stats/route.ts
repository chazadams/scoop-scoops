import { supabase } from '@/lib/supabase';

export async function GET() {
  const [scoopsResult, standsResult] = await Promise.all([
    supabase.from('scoops').select('*', { count: 'exact', head: true }),
    supabase.from('stands').select('*', { count: 'exact', head: true }),
  ]);

  if (scoopsResult.error) {
    return Response.json({ error: scoopsResult.error.message }, { status: 500 });
  }
  if (standsResult.error) {
    return Response.json({ error: standsResult.error.message }, { status: 500 });
  }

  return Response.json({
    totalScoops: scoopsResult.count ?? 0,
    totalStands: standsResult.count ?? 0,
  });
}
