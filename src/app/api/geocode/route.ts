import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const zip = req.nextUrl.searchParams.get('zip');
  if (!zip || !/^\d{5}(-\d{4})?$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid zip code' }, { status: 400 });
  }

  // Primary: Zippopotam.us — purpose-built for US postal code lookups
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(zip)}`);
    if (res.ok) {
      const data = await res.json();
      const place = data.places?.[0];
      if (place?.latitude && place?.longitude) {
        console.log(`[geocode] zippopotam ok: ${zip} → ${place.latitude}, ${place.longitude}`);
        return NextResponse.json({ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) });
      }
    }
    console.error(`[geocode] zippopotam non-ok: ${res.status} for zip ${zip}`);
  } catch (err) {
    console.error(`[geocode] zippopotam error for zip ${zip}:`, err);
  }

  // Fallback: Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&countrycodes=us&format=json&limit=1`,
      { headers: { 'User-Agent': 'scoop-scoops/1.0 (chazadams@gmail.com)', 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      console.log(`[geocode] nominatim fallback ok: ${zip}`);
      return NextResponse.json({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
    }
    console.error(`[geocode] nominatim empty for zip ${zip}`);
  } catch (err) {
    console.error(`[geocode] nominatim error for zip ${zip}:`, err);
  }

  return NextResponse.json({ error: 'Zip code not found' }, { status: 404 });
}
