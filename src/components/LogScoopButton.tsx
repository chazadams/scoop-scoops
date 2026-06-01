'use client';

import { useState } from 'react';
import LogScoopModal from './LogScoopModal';
import { useAuth } from '@/context/AuthContext';

export default function LogScoopButton({ onScoopLogged }: { onScoopLogged?: () => void }) {
  const [open, setOpen] = useState(false);
  const { user, loading, signInWithGoogle } = useAuth();

  const handleClick = () => {
    if (!user) {
      signInWithGoogle();
    } else {
      setOpen(true);
    }
  };

  const handleClose = (logged?: boolean) => {
    setOpen(false);
    if (logged) onScoopLogged?.();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={handleClick}
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-rose-500 text-white font-semibold text-base hover:bg-rose-600 active:scale-95 transition-all shadow-lg shadow-rose-500/30 disabled:opacity-50 touch-manipulation"
        >
          <span>🍦</span>
          Log a Scoop
        </button>
        {!loading && !user && (
          <p className="text-xs text-stone-400 dark:text-stone-500">
            Continues to Google sign-in
          </p>
        )}
      </div>
      <LogScoopModal isOpen={open} onClose={handleClose} />
    </>
  );
}
