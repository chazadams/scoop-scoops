'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-stone-900 tracking-tight">
          <span>🍦</span>
          <span>Scoop Scoops</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-stone-500">
          <Link href="#" className="hover:text-stone-900 transition-colors">Discover</Link>
          <Link href="#" className="hover:text-stone-900 transition-colors">Stands</Link>
        </nav>
        <div className="flex items-center gap-3">
          {!loading && !user && (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <GoogleIcon />
              Sign in
            </button>
          )}
          {!loading && user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-500">
                  {(user.user_metadata?.full_name ?? user.email ?? '?')[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.user_metadata?.full_name ?? user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
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
