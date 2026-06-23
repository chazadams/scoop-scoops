'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import StandCard from './StandCard';
import StandModal from './StandModal';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { haversine } from '@/lib/haversine';

type SortMode = 'recent' | 'most-reviews' | 'nearest';

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
  sizeScoop: { size: string; avgScoops: number }[];
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
    sizeScoop: (row as StandRow & { sizeScoop?: { size: string; avgScoops: number }[] }).sizeScoop ?? [],
  };
}

const SORT_LABELS: Record<SortMode, string> = {
  recent: 'Most Recent',
  'most-reviews': 'Most Reviews',
  nearest: 'Nearest',
};

export default function ScoopFeed() {
  const { coords, zip, source, loading: geoLoading, error: geoError, requestGPS, geocodeZip, clear } = useLocation();
  const { user } = useAuth();

  const [stands, setStands] = useState<StandEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStand, setSelectedStand] = useState<StandEntry | null>(null);
  const [modalView, setModalView] = useState<'details' | 'reviews'>('details');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [zipInput, setZipInput] = useState('');
  const [visitedStandIds, setVisitedStandIds] = useState<Set<string>>(new Set());
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
    if (!user) { setVisitedStandIds(new Set()); return; }
    fetch(`/api/scoops/my-stands?userId=${encodeURIComponent(user.id)}`)
      .then(r => r.json())
      .then((ids: string[]) => { if (Array.isArray(ids)) setVisitedStandIds(new Set(ids)); })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (sortMode === 'nearest' && !coords) zipRef.current?.focus();
  }, [sortMode, coords]);

  // Sync zipInput display with context
  useEffect(() => {
    if (source === 'zip' && zip) setZipInput(zip);
  }, [zip, source]);

  const handleZipSubmit = () => geocodeZip(zipInput);

  const sorted = [...stands].sort((a, b) => {
    if (sortMode === 'most-reviews') return b.totalScoops - a.totalScoops;
    if (sortMode === 'nearest') {
      if (!coords) return 0;
      const distA = a.lat != null && a.lng != null ? haversine(coords.lat, coords.lng, a.lat, a.lng) : Infinity;
      const distB = b.lat != null && b.lng != null ? haversine(coords.lat, coords.lng, b.lat, b.lng) : Infinity;
      return distA - distB;
    }
    return b.lastReviewedAt.getTime() - a.lastReviewedAt.getTime();
  });

  return (
    <section className="bg-stone-50 dark:bg-stone-950 min-h-full">
      {/* Sort tab bar */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-0 overflow-x-auto">
          {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`px-4 py-3.5 text-xs font-bold tracking-[0.08em] uppercase whitespace-nowrap border-b-2 transition-colors ${
                sortMode === mode
                  ? 'border-brand text-brand'
                  : 'border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              {SORT_LABELS[mode]}
            </button>
          ))}
        </div>

        {sortMode === 'nearest' && (
          <div className="max-w-5xl mx-auto px-4 pb-3">
            {coords ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 dark:text-stone-400">
                  📍 {source === 'gps' ? 'Using your location' : `Zip ${zip}`}
                </span>
                <button
                  onClick={clear}
                  className="text-brand hover:opacity-70 font-semibold transition-opacity"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={requestGPS}
                    disabled={geoLoading}
                    className="px-3 py-2 rounded-lg text-xs font-bold tracking-wide uppercase bg-brand text-white hover:opacity-90 disabled:opacity-40 transition-colors"
                  >
                    {geoLoading ? '…' : '📍 Use my location'}
                  </button>
                  <span className="text-xs text-stone-400 dark:text-stone-500">or</span>
                  <input
                    ref={zipRef}
                    type="text"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleZipSubmit(); }}
                    placeholder="Enter zip code"
                    className="w-32 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-brand text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm"
                  />
                  <button
                    onClick={handleZipSubmit}
                    disabled={!zipInput.trim() || geoLoading}
                    className="px-3 py-2 rounded-lg text-xs font-bold tracking-wide uppercase bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-80 disabled:opacity-40 transition-colors"
                  >
                    {geoLoading ? '…' : 'Go'}
                  </button>
                </div>
                {geoError && <p className="text-xs text-red-500">{geoError}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-16 text-stone-400 dark:text-stone-500 text-sm">Loading stands…</div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-3">{error}</p>
            <button onClick={fetchStands} className="text-xs font-bold tracking-wide uppercase text-brand hover:opacity-80 transition-colors">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && stands.length === 0 && (
          <div className="text-center py-16 text-stone-400 dark:text-stone-500 text-sm">
            No stands yet — log a scoop to add the first one!
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((s) => {
              const distance =
                sortMode === 'nearest' && coords && s.lat != null && s.lng != null
                  ? haversine(coords.lat, coords.lng, s.lat, s.lng)
                  : sortMode === 'nearest'
                  ? null
                  : undefined;
              return (
                <StandCard
                  key={s.standId}
                  name={s.name}
                  address={s.address}
                  totalScoops={s.totalScoops}
                  avgFlavorRating={s.avgFlavorRating}
                  avgValueRating={s.avgValueRating}
                  lastReviewedAt={s.lastReviewedAt}
                  distance={distance}
                  visited={visitedStandIds.has(s.standId)}
                  sizeScoop={s.sizeScoop}
                  onShopClick={() => { setSelectedStand(s); setModalView('details'); }}
                  onReviewClick={() => { setSelectedStand(s); setModalView('reviews'); }}
                />
              );
            })}
          </div>
        )}

        <StandModal
          stand={selectedStand ? {
            standId: selectedStand.standId,
            placeId: selectedStand.placeId,
            name: selectedStand.name,
            address: selectedStand.address,
            totalScoops: selectedStand.totalScoops,
            avgFlavorRating: selectedStand.avgFlavorRating,
            avgValueRating: selectedStand.avgValueRating,
            lastReviewedAt: selectedStand.lastReviewedAt,
            sizeScoop: selectedStand.sizeScoop,
          } : null}
          initialView={modalView}
          onClose={() => setSelectedStand(null)}
        />
      </div>
    </section>
  );
}
