'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalScoops: number;
  totalStands: number;
}

export default function StatsBanner({ refreshKey }: { refreshKey?: number }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => { if (typeof data.totalScoops === 'number') setStats(data); })
      .catch(() => {});
  }, [refreshKey]);

  if (!stats) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-stone-900 dark:bg-stone-800 border-t border-stone-800 dark:border-stone-700 shadow-lg px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-xs font-bold text-stone-400">
        <span className="text-base leading-none">🍦</span>
        <span>
          <span className="text-stone-50 tabular-nums">{stats.totalScoops.toLocaleString()}</span> scoops scooped
        </span>
        <span className="text-stone-800 dark:text-stone-700">·</span>
        <span>
          <span className="text-stone-50 tabular-nums">{stats.totalStands.toLocaleString()}</span> stands visited
        </span>
      </div>
    </div>
  );
}
