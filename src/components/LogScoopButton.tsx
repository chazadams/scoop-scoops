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
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-brand text-white font-bold text-sm tracking-wide uppercase hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 touch-manipulation"
      >
        <span>🍦</span>
        Log a Scoop
      </button>
      <LogScoopModal isOpen={open} onClose={handleClose} />
    </>
  );
}
