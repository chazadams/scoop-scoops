interface StandCardProps {
  name: string;
  address: string;
  totalScoops: number;
  avgFlavorRating: number;
  avgValueRating: number;
  lastReviewedAt: Date;
  distance?: number | null;
  onShopClick?: () => void;
  onReviewClick?: () => void;
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

export default function StandCard({
  name,
  address,
  totalScoops,
  avgFlavorRating,
  avgValueRating,
  lastReviewedAt,
  distance,
  onShopClick,
  onReviewClick,
}: StandCardProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Stand header — click for shop details */}
      <button
        type="button"
        onClick={onShopClick}
        className="px-4 pt-4 pb-3 border-b border-stone-50 dark:border-stone-800 text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors group"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm leading-tight truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{name}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 truncate">{address}</p>
          </div>
          {distance != null ? (
            <span className="shrink-0 text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 px-2 py-0.5 rounded-full">
              {distance.toFixed(1)} mi
            </span>
          ) : (
            <span className="shrink-0 text-xs text-stone-300 dark:text-stone-600 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 px-2 py-0.5 rounded-full">
              — mi
            </span>
          )}
        </div>
      </button>

      {/* Stats + ratings — click for recent reviews */}
      <button
        type="button"
        onClick={onReviewClick}
        className="flex-1 text-left hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-colors"
      >
        <div className="px-4 py-3 border-b border-stone-50 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
            {totalScoops} {totalScoops === 1 ? 'review' : 'reviews'}
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500">
            Last visited {timeAgo(lastReviewedAt)}
          </span>
        </div>

        <div className="px-4 py-3 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Flavor</span>
            <div className="flex items-center gap-1.5">
              <Stars rating={avgFlavorRating} />
              <span className="text-stone-400 dark:text-stone-500">{avgFlavorRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Value</span>
            <div className="flex items-center gap-1.5">
              <Stars rating={avgValueRating} />
              <span className="text-stone-400 dark:text-stone-500">{avgValueRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
