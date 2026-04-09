'use client';

import { useEffect, useState, useCallback } from 'react';
import ScoopCard from './ScoopCard';
import { type Scoop } from '@/types/scoop';

// Shape returned by GET /api/scoops
interface ScoopRow {
  id: string;
  flavor: string;
  size: string;
  container: string;
  price: number | null;
  toppings: string[];
  flavor_rating: number;
  value_rating: number;
  notes: string | null;
  created_at: string;
  users: { name: string } | null;
  stands: { id: string; place_id: string; name: string; address: string } | null;
}

function toScoop(row: ScoopRow): Scoop {
  return {
    id: row.id,
    flavor: row.flavor,
    size: row.size as Scoop['size'],
    container: row.container as Scoop['container'],
    price: row.price ?? undefined,
    toppings: row.toppings as Scoop['toppings'],
    flavorRating: row.flavor_rating,
    valueRating: row.value_rating,
    notes: row.notes ?? undefined,
    createdAt: new Date(row.created_at),
    user: { name: row.users?.name ?? 'Anonymous' },
    stand: {
      name: row.stands?.name ?? 'Unknown stand',
      placeId: row.stands?.place_id ?? '',
      address: row.stands?.address ?? '',
    },
  };
}

export default function ScoopFeed() {
  const [scoops, setScoops] = useState<Scoop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScoops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/scoops');
      if (!res.ok) throw new Error('Failed to load scoops');
      const rows: ScoopRow[] = await res.json();
      setScoops(rows.map(toScoop));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchScoops(); }, [fetchScoops]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-900">Recent Scoops</h2>
        <span className="text-sm text-stone-400">Community feed</span>
      </div>

      {loading && (
        <div className="text-center py-16 text-stone-400 text-sm">Loading scoops…</div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-stone-500 text-sm mb-3">{error}</p>
          <button
            onClick={fetchScoops}
            className="text-sm text-rose-500 hover:text-rose-600 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && scoops.length === 0 && (
        <div className="text-center py-16 text-stone-400 text-sm">
          No scoops yet — be the first to log one!
        </div>
      )}

      {!loading && !error && scoops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scoops.map((scoop) => (
            <ScoopCard key={scoop.id} scoop={scoop} />
          ))}
        </div>
      )}
    </section>
  );
}
