'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';
export type DarkStyle = 'cold' | 'warm' | 'slate' | 'soft';

const DARK_STYLE_CLASSES: Record<DarkStyle, string> = {
  cold:  '',
  warm:  'theme-warm',
  slate: 'theme-slate',
  soft:  'theme-soft',
};

function applyTheme(theme: Theme, darkStyle: DarkStyle) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const html = document.documentElement;
  html.classList.toggle('dark', isDark);
  for (const cls of Object.values(DARK_STYLE_CLASSES)) {
    if (cls) html.classList.remove(cls);
  }
  if (isDark && DARK_STYLE_CLASSES[darkStyle]) {
    html.classList.add(DARK_STYLE_CLASSES[darkStyle]);
  }
}

// Read from localStorage immediately on the client so the initial state is
// correct from the very first render, avoiding a two-effect timing race.
function readTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const v = localStorage.getItem('theme');
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

function readDarkStyle(): DarkStyle {
  if (typeof window === 'undefined') return 'cold';
  const v = localStorage.getItem('darkStyle');
  return v && v in DARK_STYLE_CLASSES ? (v as DarkStyle) : 'cold';
}

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  darkStyle: DarkStyle;
  setDarkStyle: (s: DarkStyle) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readTheme);
  const [darkStyle, setDarkStyleState] = useState<DarkStyle>(readDarkStyle);

  useEffect(() => {
    applyTheme(theme, darkStyle);
    localStorage.setItem('theme', theme);
    localStorage.setItem('darkStyle', darkStyle);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system', darkStyle);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme, darkStyle]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme: setThemeState,
      darkStyle,
      setDarkStyle: setDarkStyleState,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
