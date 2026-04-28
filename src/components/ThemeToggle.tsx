'use client';

import { useTheme, type DarkStyle } from '@/context/ThemeContext';

type Theme = 'system' | 'light' | 'dark';
const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
const LABELS: Record<Theme, string> = { system: 'Auto', light: 'Light', dark: 'Dark' };

const STYLES: { id: DarkStyle; label: string; bg: string; surface: string }[] = [
  { id: 'cold',  label: 'Cold',  bg: '#0c0a09', surface: '#1c1917' },
  { id: 'warm',  label: 'Warm',  bg: '#130d08', surface: '#1e1409' },
  { id: 'slate', label: 'Slate', bg: '#020618', surface: '#0f1729' },
  { id: 'soft',  label: 'Soft',  bg: '#1a1a1a', surface: '#252525' },
];

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const ICONS: Record<Theme, React.ReactNode> = {
  system: <AutoIcon />,
  light:  <SunIcon />,
  dark:   <MoonIcon />,
};

export default function ThemeToggle() {
  const { theme, setTheme, darkStyle, setDarkStyle } = useTheme();
  const isDark = theme === 'dark' || theme === 'system';

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {/* Dark style swatches — only visible when dark mode is active */}
      {isDark && (
        <div className="flex gap-1.5 p-2 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur border border-white/20 dark:border-stone-700">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setDarkStyle(s.id)}
              title={s.label}
              className="flex flex-col items-center gap-1 group"
            >
              {/* Swatch */}
              <span
                className="block w-7 h-7 rounded-lg border-2 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${s.bg} 50%, ${s.surface} 50%)`,
                  borderColor: darkStyle === s.id ? '#f43f5e' : 'transparent',
                  boxShadow: darkStyle === s.id ? '0 0 0 1px #f43f5e' : 'none',
                }}
              />
              <span className="text-[10px] text-white/60 group-hover:text-white/90 transition-colors leading-none">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Theme cycle button */}
      <button
        onClick={() => setTheme(NEXT[theme])}
        title={`Theme: ${LABELS[theme]} — click to cycle`}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
      >
        {ICONS[theme]}
        <span>{LABELS[theme]}</span>
      </button>
    </div>
  );
}
