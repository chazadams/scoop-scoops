import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import './globals.css';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scoop Scoops',
  description: 'The Letterboxd of ice cream stands',
};

// Runs before hydration to prevent flash of wrong theme
const themeScript = `
  try {
    var t = localStorage.getItem('theme') || 'system';
    var s = localStorage.getItem('darkStyle') || 'cold';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) {
      document.documentElement.classList.add('dark');
      var cls = {warm:'theme-warm',slate:'theme-slate',soft:'theme-soft'}[s];
      if (cls) document.documentElement.classList.add(cls);
    }
  } catch {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <ThemeToggle />
        </ThemeProvider>
      </body>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
      />
    </html>
  );
}
