import { supabase } from '@/lib/supabase';

export async function GET() {
  const [statsResult, scoopCountResult, dairyFreeResult] = await Promise.all([
    supabase
      .from('stand_stats')
      .select(`
        stand_id,
        total_scoops,
        avg_flavor_rating,
        avg_value_rating,
        last_reviewed_at,
        stands ( id, place_id, name, address, lat, lng )
      `)
      .order('last_reviewed_at', { ascending: false })
      .limit(50),
    supabase
      .from('scoops')
      .select('stand_id, size, scoop_count')
      .not('scoop_count', 'is', null),
    supabase
      .from('scoops')
      .select('stand_id')
      .eq('is_dairy_free', true),
  ]);

  if (statsResult.error) {
    return Response.json({ error: statsResult.error.message }, { status: 500 });
  }

  // Aggregate scoop counts: stand_id → size → { sum, count }
  const agg: Record<string, Record<string, { sum: number; count: number }>> = {};
  for (const row of scoopCountResult.data ?? []) {
    if (!agg[row.stand_id]) agg[row.stand_id] = {};
    if (!agg[row.stand_id][row.size]) agg[row.stand_id][row.size] = { sum: 0, count: 0 };
    agg[row.stand_id][row.size].sum += row.scoop_count;
    agg[row.stand_id][row.size].count += 1;
  }

  // Per stand: sorted array of { size, avgScoops } by report count desc
  const sizeScoop: Record<string, { size: string; avgScoops: number }[]> = {};
  for (const [standId, sizes] of Object.entries(agg)) {
    sizeScoop[standId] = Object.entries(sizes)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([size, { sum, count }]) => ({ size, avgScoops: Math.round(sum / count) }));
  }

  const dairyFreeStandIds = new Set((dairyFreeResult.data ?? []).map((row) => row.stand_id));

  const data = statsResult.data.map((row) => ({
    ...row,
    sizeScoop: sizeScoop[row.stand_id] ?? [],
    hasDairyFree: dairyFreeStandIds.has(row.stand_id),
  }));

  return Response.json(data);
}
