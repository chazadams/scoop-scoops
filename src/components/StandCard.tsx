import { SIZE_LABELS, type Size } from '@/types/scoop';

interface StandCardProps {
  name: string;
  address: string;
  totalScoops: number;
  avgFlavorRating: number;
  avgValueRating: number;
  lastReviewedAt: Date;
  distance?: number | null;
  visited?: boolean;
  sizeScoop?: { size: string; avgScoops: number }[];
  onShopClick?: () => void;
  onReviewClick?: () => void;
}

function RatingBar({ rating }: { rating: number }) {
  return (
    <div className="flex-1 h-1 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
      <div className="h-full bg-brand rounded-full" style={{ width: `${(rating / 5) * 100}%` }} />
    </div>
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function StandCard({
  name,
  address,
  totalScoops,
  avgFlavorRating,
  avgValueRating,
  lastReviewedAt,
  distance,
  visited,
  sizeScoop,
  onShopClick,
  onReviewClick,
}: StandCardProps) {
  const topSize = sizeScoop?.[0];

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-100 dark:border-stone-700 overflow-hidden flex flex-col">
      <button
        type="button"
        onClick={onShopClick}
        className="px-4 pt-4 pb-3 border-b border-stone-100 dark:border-stone-700 text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors group"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm leading-tight truncate group-hover:text-brand transition-colors">{name}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 truncate">{address}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {distance != null ? (
              <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                {distance.toFixed(1)} mi
              </span>
            ) : (
              <span className="text-xs text-stone-300 dark:text-stone-600 bg-stone-50 dark:bg-stone-900 px-2 py-0.5 rounded">
                — mi
              </span>
            )}
            {visited && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                ✓ Visited
              </span>
            )}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={onReviewClick}
        className="flex-1 text-left hover:bg-stone-50/60 dark:hover:bg-stone-700/30 transition-colors"
      >
        <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-stone-400 dark:text-stone-500">
            {totalScoops} {totalScoops === 1 ? 'review' : 'reviews'}
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500">{timeAgo(lastReviewedAt)}</span>
        </div>

        <div className="px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wide uppercase text-stone-400 dark:text-stone-500 w-10 shrink-0">Flavor</span>
            <RatingBar rating={avgFlavorRating} />
            <span className="text-xs font-bold text-stone-700 dark:text-stone-200 w-6 text-right tabular-nums">{avgFlavorRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wide uppercase text-stone-400 dark:text-stone-500 w-10 shrink-0">Value</span>
            <RatingBar rating={avgValueRating} />
            <span className="text-xs font-bold text-stone-700 dark:text-stone-200 w-6 text-right tabular-nums">{avgValueRating.toFixed(1)}</span>
          </div>
          {topSize && (
            <div className="flex items-center justify-between pt-1.5 mt-0.5 border-t border-stone-100 dark:border-stone-700">
              <span className="text-xs font-semibold tracking-wide uppercase text-stone-400 dark:text-stone-500">Avg order</span>
              <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                {SIZE_LABELS[topSize.size as Size] ?? topSize.size} · ~{topSize.avgScoops} {topSize.avgScoops === 1 ? 'scoop' : 'scoops'}
              </span>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
