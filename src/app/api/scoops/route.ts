import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url_here') {
    return Response.json({ error: 'Supabase is not configured yet' }, { status: 503 });
  }

  const body = await request.json();
  const { stand, flavor, size, container, price, toppings, flavorRating, valueRating, notes, userId, scoopCount } = body;

  // Upsert the stand by place_id so we don't create duplicates
  const { data: standRow, error: standError } = await supabase
    .from('stands')
    .upsert(
      { place_id: stand.placeId, name: stand.name, address: stand.address, lat: stand.lat ?? null, lng: stand.lng ?? null },
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
      scoop_count: scoopCount ?? null,
    })
    .select('id')
    .single();

  if (scoopError) {
    return Response.json({ error: scoopError.message }, { status: 500 });
  }

  return Response.json(scoop, { status: 201 });
}
