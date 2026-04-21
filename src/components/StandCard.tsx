interface StandCardProps {
  name: string;
  address: string;
  totalScoops: number;
  avgFlavorRating: number;
  avgValueRating: number;
  lastReviewedAt: Date;
  distance?: number | null;
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
}: StandCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Stand header */}
      <div className="px-4 pt-4 pb-3 border-b border-stone-50">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-stone-900 text-sm leading-tight truncate">{name}</p>
            <p className="text-xs text-stone-400 mt-0.5 truncate">{address}</p>
          </div>
          {distance != null ? (
            <span className="shrink-0 text-xs font-medium text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
              {distance.toFixed(1)} mi
            </span>
          ) : (
            <span className="shrink-0 text-xs text-stone-300 bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-full">
              — mi
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-stone-50 flex items-center justify-between">
        <span className="text-xs font-medium text-stone-500">
          {totalScoops} {totalScoops === 1 ? 'review' : 'reviews'}
        </span>
        <span className="text-xs text-stone-400">
          Last visited {timeAgo(lastReviewedAt)}
        </span>
      </div>

      {/* Ratings */}
      <div className="px-4 py-3 flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Flavor</span>
          <div className="flex items-center gap-1.5">
            <Stars rating={avgFlavorRating} />
            <span className="text-stone-400">{avgFlavorRating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Value</span>
          <div className="flex items-center gap-1.5">
            <Stars rating={avgValueRating} />
            <span className="text-stone-400">{avgValueRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
