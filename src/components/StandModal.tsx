'use client';

import { useEffect, useState } from 'react';
import { SIZE_LABELS, CONTAINER_LABELS } from '@/types/scoop';

interface ReviewRow {
  id: string;
  flavor: string;
  size: string;
  container: string;
  price: number | null;
  flavor_rating: number;
  value_rating: number;
  notes: string | null;
  created_at: string;
}

interface StandModalProps {
  stand: {
    standId?: string;
    placeId: string;
    name: string;
    address: string;
    totalScoops: number;
    avgFlavorRating: number;
    avgValueRating: number;
    lastReviewedAt: Date;
  } | null;
  initialView?: 'details' | 'reviews';
  onClose: () => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'text-amber-400' : 'text-stone-200 dark:text-stone-700'}>★</span>
      ))}
    </span>
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// weekday_text from Places API is Monday-first (index 0 = Monday).
// JS getDay() is Sunday-first (0 = Sunday). Convert:
function todayIndex() {
  return (new Date().getDay() + 6) % 7;
}

export default function StandModal({ stand, initialView = 'details', onClose }: StandModalProps) {
  const [view, setView] = useState<'details' | 'reviews'>(initialView);
  const [hours, setHours] = useState<string[] | null>(null);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Reset view and data when stand changes
  useEffect(() => {
    setView(initialView);
    setHours(null);
    setReviews([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stand?.placeId]);

  // Fetch hours when in details view
  useEffect(() => {
    if (!stand || view !== 'details') return;
    if (hours !== null || hoursLoading) return;
    setHoursLoading(true);
    fetch(`/api/places/${encodeURIComponent(stand.placeId)}`)
      .then((r) => r.json())
      .then((data) => setHours(data.hours ?? null))
      .catch(() => setHours(null))
      .finally(() => setHoursLoading(false));
  }, [stand, view, hours, hoursLoading]);

  // Fetch reviews when in reviews view
  useEffect(() => {
    if (!stand?.standId || view !== 'reviews') return;
    if (reviews.length > 0 || reviewsLoading) return;
    setReviewsLoading(true);
    fetch(`/api/stands/${encodeURIComponent(stand.standId)}/reviews`)
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [stand, view, reviews.length, reviewsLoading]);

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

      <div className="relative bg-white dark:bg-stone-900 w-full sm:rounded-2xl sm:max-w-md max-h-[92dvh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="min-w-0 pr-4">
            {view === 'reviews' && (
              <button
                onClick={() => setView('details')}
                className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium mb-1 flex items-center gap-1"
              >
                ← Back to details
              </button>
            )}
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-lg leading-tight">{stand.name}</h2>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{stand.address}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 text-xl leading-none mt-0.5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {view === 'details' && (
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Stats — review count is clickable */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => stand.standId && setView('reviews')}
                disabled={!stand.standId}
                className="flex flex-col items-center bg-stone-50 dark:bg-stone-800 rounded-xl py-3 px-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:ring-1 hover:ring-rose-200 dark:hover:ring-rose-800 transition-colors disabled:cursor-default disabled:hover:bg-stone-50 dark:disabled:hover:bg-stone-800 disabled:hover:ring-0 group"
              >
                <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{stand.totalScoops}</span>
                <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 group-hover:text-rose-400 transition-colors">{stand.totalScoops === 1 ? 'review' : 'reviews'}</span>
              </button>
              <div className="flex flex-col items-center bg-stone-50 dark:bg-stone-800 rounded-xl py-3 px-2">
                <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">{stand.avgFlavorRating.toFixed(1)}</span>
                <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">flavor</span>
              </div>
              <div className="flex flex-col items-center bg-stone-50 dark:bg-stone-800 rounded-xl py-3 px-2">
                <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">{stand.avgValueRating.toFixed(1)}</span>
                <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">value</span>
              </div>
            </div>

            {/* Last scooped */}
            <p className="text-xs text-stone-400 dark:text-stone-500 -mt-2">
              Last scooped{' '}
              <span className="text-stone-600 dark:text-stone-300 font-medium">
                {stand.lastReviewedAt.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </p>

            {/* Ratings */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
                <span>Flavor</span>
                <div className="flex items-center gap-2">
                  <Stars rating={stand.avgFlavorRating} />
                  <span className="text-stone-400 dark:text-stone-500 text-xs w-6 text-right">{stand.avgFlavorRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
                <span>Value</span>
                <div className="flex items-center gap-2">
                  <Stars rating={stand.avgValueRating} />
                  <span className="text-stone-400 dark:text-stone-500 text-xs w-6 text-right">{stand.avgValueRating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Hours</h3>
              {hoursLoading && (
                <p className="text-sm text-stone-400 dark:text-stone-500">Loading hours…</p>
              )}
              {!hoursLoading && hours === null && (
                <p className="text-sm text-stone-400 dark:text-stone-500">Hours not available</p>
              )}
              {!hoursLoading && hours !== null && (
                <ul className="flex flex-col gap-1">
                  {hours.map((line, i) => {
                    const [day, ...rest] = line.split(': ');
                    return (
                      <li
                        key={i}
                        className={`flex justify-between text-xs gap-3 py-1 px-2 rounded-lg ${
                          i === today
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-medium'
                            : 'text-stone-600 dark:text-stone-400'
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
        )}

        {view === 'reviews' && (
          <div className="px-6 py-5 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300">Recent Scoops</h3>

            {reviewsLoading && (
              <p className="text-sm text-stone-400 dark:text-stone-500">Loading reviews…</p>
            )}

            {!reviewsLoading && reviews.length === 0 && (
              <p className="text-sm text-stone-400 dark:text-stone-500">No reviews yet.</p>
            )}

            {!reviewsLoading && reviews.map((r) => {
              const containerInfo = CONTAINER_LABELS[r.container as keyof typeof CONTAINER_LABELS];
              const sizeLabel = SIZE_LABELS[r.size as keyof typeof SIZE_LABELS];
              return (
                <div key={r.id} className="bg-stone-50 dark:bg-stone-800 rounded-xl px-4 py-3 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">{r.flavor}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                        {sizeLabel} {containerInfo ? `· ${containerInfo.emoji} ${containerInfo.label}` : ''}
                        {r.price != null ? ` · $${r.price.toFixed(2)}` : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-stone-400 dark:text-stone-500">{timeAgo(new Date(r.created_at))}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                      <span>Flavor</span>
                      <Stars rating={r.flavor_rating} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                      <span>Value</span>
                      <Stars rating={r.value_rating} />
                    </div>
                  </div>
                  {r.notes && (
                    <p className="text-xs text-stone-600 dark:text-stone-400 italic">"{r.notes}"</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
