'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-stone-100 dark:border-stone-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" aria-label="Scoop Scoops">
          <ScoopScoopsLogo />
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-stone-500 dark:text-stone-400">
          <Link href="/" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">Discover</Link>
          <Link href="/stands" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">Stands</Link>
        </nav>
        <div className="flex items-center gap-3">
          {!loading && !user && (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <GoogleIcon />
              Sign in
            </button>
          )}
          {!loading && user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-xs font-bold text-rose-500 dark:text-rose-400">
                  {(user.user_metadata?.full_name ?? user.email ?? '?')[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.user_metadata?.full_name ?? user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function ScoopScoopsLogo() {
  return (
    <svg width="160" height="52" viewBox="0 0 680 220" role="img" xmlns="http://www.w3.org/2000/svg">
      <title>Scoop Scoops</title>
      <style>{`.wordmark { font-family: 'Playfair Display', Georgia, serif; } .tagline { font-family: 'Cormorant Garamond', 'Times New Roman', serif; }`}</style>
      <polygon points="160,178 124,92 196,92" fill="none" stroke="#C8A26B" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="129" y1="106" x2="191" y2="106" stroke="#C8A26B" strokeWidth="0.6" opacity="0.5"/>
      <line x1="126" y1="120" x2="194" y2="120" stroke="#C8A26B" strokeWidth="0.6" opacity="0.5"/>
      <line x1="124" y1="134" x2="196" y2="134" stroke="#C8A26B" strokeWidth="0.6" opacity="0.5"/>
      <line x1="124" y1="148" x2="196" y2="148" stroke="#C8A26B" strokeWidth="0.6" opacity="0.5"/>
      <line x1="124" y1="162" x2="196" y2="162" stroke="#C8A26B" strokeWidth="0.6" opacity="0.5"/>
      <line x1="130" y1="92" x2="160" y2="178" stroke="#C8A26B" strokeWidth="0.6" opacity="0.35"/>
      <line x1="144" y1="92" x2="160" y2="178" stroke="#C8A26B" strokeWidth="0.6" opacity="0.35"/>
      <line x1="158" y1="92" x2="160" y2="178" stroke="#C8A26B" strokeWidth="0.6" opacity="0.35"/>
      <line x1="172" y1="92" x2="160" y2="178" stroke="#C8A26B" strokeWidth="0.6" opacity="0.35"/>
      <line x1="186" y1="92" x2="160" y2="178" stroke="#C8A26B" strokeWidth="0.6" opacity="0.35"/>
      <ellipse cx="160" cy="92" rx="36" ry="12" fill="none" stroke="#8B6B8A" strokeWidth="1.5"/>
      <path d="M124,92 Q124,62 160,62 Q196,62 196,92" fill="none" stroke="#8B6B8A" strokeWidth="1.5"/>
      <ellipse cx="160" cy="62" rx="28" ry="9" fill="none" stroke="#5C8A7A" strokeWidth="1.5"/>
      <path d="M132,62 Q132,38 160,38 Q188,38 188,62" fill="none" stroke="#5C8A7A" strokeWidth="1.5"/>
      <ellipse cx="160" cy="38" rx="20" ry="7" fill="none" stroke="#C8A26B" strokeWidth="1.5"/>
      <path d="M140,38 Q140,20 160,20 Q180,20 180,38" fill="none" stroke="#C8A26B" strokeWidth="1.5"/>
      <circle cx="160" cy="13" r="5" fill="none" stroke="#B05050" strokeWidth="1.5"/>
      <path d="M160,8 Q164,0 170,2" fill="none" stroke="#B05050" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="228" y1="48" x2="228" y2="172" stroke="#C8A26B" strokeWidth="0.6" opacity="0.6"/>
      <line x1="248" y1="88" x2="620" y2="88" stroke="#C8A26B" strokeWidth="0.6" opacity="0.6"/>
      <text x="248" y="130" className="wordmark" fontSize="42" fontWeight="400" fill="#2A2A2A" textAnchor="start" letterSpacing="5">SCOOP SCOOPS</text>
      <line x1="248" y1="143" x2="620" y2="143" stroke="#C8A26B" strokeWidth="0.6" opacity="0.6"/>
      <text x="248" y="162" className="tagline" fontSize="13" fontWeight="300" fill="#8A7A6A" textAnchor="start" letterSpacing="4">THE ICE CREAM STAND GUIDE</text>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
