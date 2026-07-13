'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

type Theme = 'system' | 'light' | 'dark';
const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
const LABELS: Record<Theme, string> = { system: 'Auto', light: 'Light', dark: 'Dark' };
const ICONS: Record<Theme, string> = { system: '◑', light: '○', dark: '●' };

export default function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 py-6 text-center">
      <p className="text-xs font-bold tracking-[0.1em] uppercase text-stone-400 dark:text-stone-500">Scoop Scoops</p>
      <div className="flex items-center justify-center gap-4 mt-2">
        <Link
          href="/privacy"
          className="text-xs text-stone-400 dark:text-stone-500 hover:text-brand transition-colors underline underline-offset-2"
        >
          Privacy Policy
        </Link>
        <span className="text-stone-200 dark:text-stone-700 select-none">·</span>
        <button
          onClick={() => setTheme(NEXT[theme])}
          className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500 hover:text-brand dark:hover:text-brand transition-colors touch-manipulation"
          title="Cycle theme"
        >
          <span>{ICONS[theme]}</span>
          <span>{LABELS[theme]}</span>
        </button>
      </div>
    </footer>
  );
}
