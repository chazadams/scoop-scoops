import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get('placeId');
  if (!placeId) return NextResponse.json([]);

  const { data: stand } = await supabase
    .from('stands')
    .select('id')
    .eq('place_id', placeId)
    .single();

  if (!stand) return NextResponse.json([]);

  const { data: scoops } = await supabase
    .from('scoops')
    .select('flavor')
    .eq('stand_id', stand.id);

  const flavors = [...new Set((scoops ?? []).map((s: { flavor: string }) => s.flavor))].sort();
  return NextResponse.json(flavors);
}
