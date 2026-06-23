import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('scoops')
    .select('stand_id')
    .eq('user_id', userId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const standIds = [...new Set((data ?? []).map((r) => r.stand_id as string))];
  return Response.json(standIds);
}
