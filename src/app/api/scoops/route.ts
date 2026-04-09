import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('scoops')
    .select(`
      id,
      flavor,
      size,
      container,
      price,
      toppings,
      flavor_rating,
      value_rating,
      notes,
      created_at,
      users ( name ),
      stands ( id, place_id, name, address )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url_here') {
    return Response.json({ error: 'Supabase is not configured yet' }, { status: 503 });
  }

  const body = await request.json();
  const { stand, flavor, size, container, price, toppings, flavorRating, valueRating, notes, userId } = body;

  // Upsert the stand by place_id so we don't create duplicates
  const { data: standRow, error: standError } = await supabase
    .from('stands')
    .upsert(
      { place_id: stand.placeId, name: stand.name, address: stand.address },
      { onConflict: 'place_id' }
    )
    .select('id')
    .single();

  if (standError) {
    return Response.json({ error: standError.message }, { status: 500 });
  }

  const { data: scoop, error: scoopError } = await supabase
    .from('scoops')
    .insert({
      user_id: userId,
      stand_id: standRow.id,
      flavor,
      size,
      container,
      price: price ?? null,
      toppings: toppings ?? [],
      flavor_rating: flavorRating,
      value_rating: valueRating,
      notes: notes ?? null,
    })
    .select('id')
    .single();

  if (scoopError) {
    return Response.json({ error: scoopError.message }, { status: 500 });
  }

  return Response.json(scoop, { status: 201 });
}
