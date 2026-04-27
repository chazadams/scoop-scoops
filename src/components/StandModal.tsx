'use client';

import { useEffect, useState } from 'react';

interface StandModalProps {
  stand: {
    placeId: string;
    name: string;
    address: string;
    totalScoops: number;
    avgFlavorRating: number;
    avgValueRating: number;
    lastReviewedAt: Date;
  } | null;
  onClose: () => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'text-amber-400' : 'text-stone-200'}>★</span>
      ))}
    </span>
  );
}

// weekday_text from Places API is Monday-first (index 0 = Monday).
// JS getDay() is Sunday-first (0 = Sunday). Convert:
function todayIndex() {
  return (new Date().getDay() + 6) % 7;
}

export default function StandModal({ stand, onClose }: StandModalProps) {
  const [hours, setHours] = useState<string[] | null>(null);
  const [hoursLoading, setHoursLoading] = useState(false);

  useEffect(() => {
    if (!stand) return;
    setHours(null);
    setHoursLoading(true);
    fetch(`/api/places/${encodeURIComponent(stand.placeId)}`)
      .then((r) => r.json())
      .then((data) => setHours(data.hours ?? null))
      .catch(() => setHours(null))
      .finally(() => setHoursLoading(false));
  }, [stand?.placeId]);

  useEffect(() => {
    if (!stand) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [stand, onClose]);

  if (!stand) return null;

  const today = todayIndex();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:rounded-2xl sm:max-w-md max-h-[92dvh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-100">
          <div className="min-w-0 pr-4">
            <h2 className="font-bold text-stone-900 text-lg leading-tight">{stand.name}</h2>
            <p className="text-xs text-stone-400 mt-1">{stand.address}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-stone-400 hover:text-stone-600 text-xl leading-none mt-0.5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center bg-stone-50 rounded-xl py-3 px-2">
              <span className="text-2xl font-bold text-stone-900">{stand.totalScoops}</span>
              <span className="text-xs text-stone-400 mt-0.5">{stand.totalScoops === 1 ? 'review' : 'reviews'}</span>
            </div>
            <div className="flex flex-col items-center bg-stone-50 rounded-xl py-3 px-2">
              <span className="text-2xl font-bold text-stone-900">{stand.avgFlavorRating.toFixed(1)}</span>
              <span className="text-xs text-stone-400 mt-0.5">flavor</span>
            </div>
            <div className="flex flex-col items-center bg-stone-50 rounded-xl py-3 px-2">
              <span className="text-2xl font-bold text-stone-900">{stand.avgValueRating.toFixed(1)}</span>
              <span className="text-xs text-stone-400 mt-0.5">value</span>
            </div>
          </div>

          {/* Last scooped */}
          <p className="text-xs text-stone-400 -mt-2">
            Last scooped{' '}
            <span className="text-stone-600 font-medium">
              {stand.lastReviewedAt.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </p>

          {/* Ratings */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Flavor</span>
              <div className="flex items-center gap-2">
                <Stars rating={stand.avgFlavorRating} />
                <span className="text-stone-400 text-xs w-6 text-right">{stand.avgFlavorRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Value</span>
              <div className="flex items-center gap-2">
                <Stars rating={stand.avgValueRating} />
                <span className="text-stone-400 text-xs w-6 text-right">{stand.avgValueRating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-2">Hours</h3>
            {hoursLoading && (
              <p className="text-sm text-stone-400">Loading hours…</p>
            )}
            {!hoursLoading && hours === null && (
              <p className="text-sm text-stone-400">Hours not available</p>
            )}
            {!hoursLoading && hours !== null && (
              <ul className="flex flex-col gap-1">
                {hours.map((line, i) => {
                  const [day, ...rest] = line.split(': ');
                  return (
                    <li
                      key={i}
                      className={`flex justify-between text-xs gap-3 py-1 px-2 rounded-lg ${
                        i === today ? 'bg-rose-50 text-rose-700 font-medium' : 'text-stone-600'
                      }`}
                    >
                      <span className="shrink-0">{day}</span>
                      <span className="text-right">{rest.join(': ')}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
