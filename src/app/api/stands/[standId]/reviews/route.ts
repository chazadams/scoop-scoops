import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ standId: string }> }
) {
  const { standId } = await params;

  const { data, error } = await supabase
    .from('scoops')
    .select(`
      id,
      flavor,
      size,
      container,
      price,
      flavor_rating,
      value_rating,
      notes,
      created_at
    `)
    .eq('stand_id', standId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
