'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import StandModal from './StandModal';

type SortMode = 'today' | 'recent' | 'most-reviews' | 'nearest';

interface StandRow {
  stand_id: string;
  total_scoops: number;
  avg_flavor_rating: number;
  avg_value_rating: number;
  last_reviewed_at: string;
  stands: {
    id: string;
    place_id: string;
    name: string;
    address: string;
    lat: number | null;
    lng: number | null;
  } | null;
}

interface StandEntry {
  standId: string;
  placeId: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  totalScoops: number;
  avgFlavorRating: number;
  avgValueRating: number;
  lastReviewedAt: Date;
}

function toEntry(row: StandRow): StandEntry {
  return {
    standId: row.stand_id,
    placeId: row.stands?.place_id ?? '',
    name: row.stands?.name ?? 'Unknown stand',
    address: row.stands?.address ?? '',
    lat: row.stands?.lat ?? null,
    lng: row.stands?.lng ?? null,
    totalScoops: Number(row.total_scoops),
    avgFlavorRating: Number(row.avg_flavor_rating),
    avgValueRating: Number(row.avg_value_rating),
    lastReviewedAt: new Date(row.last_reviewed_at),
  };
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'text-amber-400' : 'text-stone-200'}>★</span>
      ))}
    </span>
  );
}

const SORT_LABELS: Record<SortMode, string> = {
  today: 'Today',
  recent: 'Most Recent',
  'most-reviews': 'Most Reviews',
  nearest: 'Nearest',
};

export default function StandsList() {
  const [stands, setStands] = useState<StandEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStand, setSelectedStand] = useState<StandEntry | null>(null);

  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [zipInput, setZipInput] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const zipRef = useRef<HTMLInputElement>(null);

  const fetchStands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stands');
      if (!res.ok) throw new Error('Failed to load stands');
      const rows: StandRow[] = await res.json();
      setStands(rows.map(toEntry));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStands(); }, [fetchStands]);

  useEffect(() => {
    if (sortMode === 'nearest') zipRef.current?.focus();
  }, [sortMode]);

  const geocodeZip = useCallback(async () => {
    if (!zipInput.trim()) return;
    setGeoError(null);
    setGeoLoading(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: zipInput.trim() }, (results, status) => {
        setGeoLoading(false);
        if (status === 'OK' && results?.[0]) {
          const loc = results[0].geometry.location;
          setUserCoords({ lat: loc.lat(), lng: loc.lng() });
        } else {
          setGeoError('Zip code not found — try again.');
        }
      });
    } catch {
      setGeoLoading(false);
      setGeoError('Could not geocode zip code.');
    }
  }, [zipInput]);

  const filtered = sortMode === 'today'
    ? stands.filter((s) => isToday(s.lastReviewedAt))
    : stands;

  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === 'most-reviews') return b.totalScoops - a.totalScoops;
    if (sortMode === 'nearest') {
      if (!userCoords) return 0;
      const distA = a.lat != null && a.lng != null ? haversine(userCoords.lat, userCoords.lng, a.lat, a.lng) : Infinity;
      const distB = b.lat != null && b.lng != null ? haversine(userCoords.lat, userCoords.lng, b.lat, b.lng) : Infinity;
      return distA - distB;
    }
    return b.lastReviewedAt.getTime() - a.lastReviewedAt.getTime();
  });

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      {/* Sort controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                sortMode === mode
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'border-stone-300 text-stone-600 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              {SORT_LABELS[mode]}
            </button>
          ))}
        </div>

        {sortMode === 'nearest' && (
          <div className="flex items-center gap-2">
            <input
              ref={zipRef}
              type="text"
              value={zipInput}
              onChange={(e) => { setZipInput(e.target.value); setUserCoords(null); setGeoError(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') geocodeZip(); }}
              placeholder="Enter zip code"
              className="w-36 px-3 py-1.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-stone-900 placeholder-stone-400 text-sm"
            />
            <button
              onClick={geocodeZip}
              disabled={!zipInput.trim() || geoLoading}
              className="px-3 py-1.5 rounded-xl text-sm font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:opacity-40 transition-colors"
            >
              {geoLoading ? '…' : 'Go'}
            </button>
            {geoError && <p className="text-xs text-red-500">{geoError}</p>}
            {userCoords && !geoError && <p className="text-xs text-stone-400">Sorted by distance</p>}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-16 text-stone-400 text-sm">Loading stands…</div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-stone-500 text-sm mb-3">{error}</p>
          <button onClick={fetchStands} className="text-sm text-rose-500 hover:text-rose-600 font-medium">Try again</button>
        </div>
      )}

      {!loading && !error && sorted.length === 0 && (
        <div className="text-center py-16 text-stone-400 text-sm">
          {sortMode === 'today' ? 'No stands visited today — be the first!' : 'No stands yet — log a scoop to add the first one!'}
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <ul className="flex flex-col divide-y divide-stone-100">
          {sorted.map((s) => {
            const distance =
              sortMode === 'nearest' && userCoords && s.lat != null && s.lng != null
                ? haversine(userCoords.lat, userCoords.lng, s.lat, s.lng)
                : null;

            return (
              <li key={s.standId}>
                <button
                  type="button"
                  onClick={() => setSelectedStand(s)}
                  className="w-full text-left py-4 px-2 hover:bg-stone-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">{s.address}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {distance != null ? (
                        <span className="text-xs font-medium text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                          {distance.toFixed(1)} mi
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400">{timeAgo(s.lastReviewedAt)}</span>
                      )}
                      <span className="text-xs text-stone-400">{s.totalScoops} {s.totalScoops === 1 ? 'review' : 'reviews'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <span>Flavor</span>
                      <Stars rating={s.avgFlavorRating} />
                      <span className="text-stone-400">{s.avgFlavorRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <span>Value</span>
                      <Stars rating={s.avgValueRating} />
                      <span className="text-stone-400">{s.avgValueRating.toFixed(1)}</span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <StandModal
        stand={selectedStand ? {
          placeId: selectedStand.placeId,
          name: selectedStand.name,
          address: selectedStand.address,
          totalScoops: selectedStand.totalScoops,
          avgFlavorRating: selectedStand.avgFlavorRating,
          avgValueRating: selectedStand.avgValueRating,
          lastReviewedAt: selectedStand.lastReviewedAt,
        } : null}
        onClose={() => setSelectedStand(null)}
      />
    </section>
  );
}
