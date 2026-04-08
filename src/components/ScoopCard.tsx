import { type Scoop, SIZE_LABELS, CONTAINER_LABELS } from '@/types/scoop';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'text-amber-400' : 'text-stone-200'}>★</span>
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

export default function ScoopCard({ scoop }: { scoop: Scoop }) {
  const { label: containerLabel, emoji } = CONTAINER_LABELS[scoop.container];

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Stand */}
      <div className="px-4 pt-4 pb-3 border-b border-stone-50">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-stone-900 text-sm leading-tight">{scoop.stand.name}</p>
            <p className="text-xs text-stone-400 mt-0.5 truncate">{scoop.stand.address}</p>
          </div>
          <span className="text-xs text-stone-400 whitespace-nowrap mt-0.5">
            {timeAgo(scoop.createdAt)}
          </span>
        </div>
      </div>

      {/* What they got */}
      <div className="px-4 py-3 border-b border-stone-50">
        <div className="flex items-center gap-1.5 text-sm text-stone-700 font-medium">
          <span>{emoji}</span>
          <span>{scoop.flavor}</span>
          <span className="text-stone-300">·</span>
          <span>{SIZE_LABELS[scoop.size]}</span>
          <span className="text-stone-300">·</span>
          <span>{containerLabel}</span>
        </div>
        {scoop.toppings.length > 0 && (
          <p className="text-xs text-stone-400 mt-1.5">
            {scoop.toppings.join(', ')}
          </p>
        )}
      </div>

      {/* Ratings */}
      <div className="px-4 py-3 flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Flavor</span>
          <Stars rating={scoop.flavorRating} />
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Value</span>
          <Stars rating={scoop.valueRating} />
        </div>
      </div>

      {/* Notes */}
      {scoop.notes && (
        <div className="px-4 pb-4">
          <p className="text-xs text-stone-500 italic border-t border-stone-50 pt-3">
            &ldquo;{scoop.notes}&rdquo;
          </p>
        </div>
      )}

      {/* User */}
      <div className="px-4 pb-3 flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-500">
          {scoop.user.name[0]}
        </div>
        <span className="text-xs text-stone-400">{scoop.user.name}</span>
      </div>
    </div>
  );
}
