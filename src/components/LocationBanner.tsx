'use client';

import { useState } from 'react';
import { useLocation } from '@/context/LocationContext';

export default function LocationBanner() {
  const { coords, cityState, loading, error, requestGPS, clear } = useLocation();
  const [dismissed, setDismissed] = useState(false);

  // Status banner: location is set
  if (coords) {
    return (
      <div className="bg-brand/5 border-b border-brand/10 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
          📍 {cityState ?? 'Location set'}
        </span>
        <button
          onClick={clear}
          className="text-xs font-bold tracking-wide uppercase text-brand hover:opacity-70 transition-opacity touch-manipulation"
        >
          Change
        </button>
      </div>
    );
  }

  // Don't show request banner if dismissed this session
  if (dismissed) return null;

  return (
    <div className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 px-4 py-3 flex-shrink-0">
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none mt-0.5 flex-shrink-0">📍</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-stone-900 dark:text-stone-100">See stands near you?</p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Share your location for nearby results</p>
          {error && (
            <p className="text-xs text-red-500 mt-1.5">{error}</p>
          )}
          <div className="mt-2.5">
            <button
              onClick={requestGPS}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-bold tracking-wide uppercase hover:opacity-90 disabled:opacity-50 transition-opacity touch-manipulation"
            >
              {loading ? 'Locating…' : 'Use my location'}
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 text-lg leading-none flex-shrink-0 touch-manipulation"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
