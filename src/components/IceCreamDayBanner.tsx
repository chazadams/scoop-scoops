'use client';

import { useEffect, useState } from 'react';
import { isNationalIceCreamDay } from '@/lib/iceCreamDay';

function todayKey(): string {
  const now = new Date();
  return `scoop_ice_cream_day_dismissed_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export default function IceCreamDayBanner() {
  const [visible, setVisible] = useState(false);

  // Reads localStorage/today's date, both unavailable during SSR — can't be a lazy useState initializer
  // without causing a hydration mismatch, so this has to run post-mount instead.
  useEffect(() => {
    const shouldShow = isNationalIceCreamDay() && !localStorage.getItem(todayKey());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (shouldShow) setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(todayKey(), '1');
    setVisible(false);
  };

  return (
    <div className="bg-brand/5 border-b border-brand/10 px-4 py-3 flex-shrink-0">
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none mt-0.5 flex-shrink-0">🍦</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-stone-900 dark:text-stone-100">Happy National Ice Cream Day!</p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Today&apos;s the day — go log a scoop.</p>
        </div>
        <button
          onClick={dismiss}
          className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 text-lg leading-none flex-shrink-0 touch-manipulation"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
