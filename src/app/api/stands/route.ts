import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
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
    .limit(50);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
