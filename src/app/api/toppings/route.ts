import { supabase } from '@/lib/supabase';
import { TOPPINGS } from '@/types/scoop';

export async function GET() {
  const { data, error } = await supabase
    .from('topping_counts')
    .select('topping, uses')
    .gte('uses', 5);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const statics = new Set<string>(TOPPINGS);
  const promoted = (data ?? [])
    .map((row) => row.topping as string)
    .filter((t) => !statics.has(t));

  return Response.json([...TOPPINGS, ...promoted]);
}
