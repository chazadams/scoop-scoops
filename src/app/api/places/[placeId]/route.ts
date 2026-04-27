import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Response.json({ error: 'Maps API key not configured' }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=opening_hours&key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    return Response.json({ error: 'Places API request failed' }, { status: 502 });
  }

  const json = await res.json();
  const hours: string[] | null = json.result?.opening_hours?.weekday_text ?? null;

  return Response.json({ hours });
}
