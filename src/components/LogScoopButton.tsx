'use client';

import { useState } from 'react';
import LogScoopModal from './LogScoopModal';
import { useAuth } from '@/context/AuthContext';

export default function LogScoopButton({ onScoopLogged }: { onScoopLogged?: () => void }) {
  const [open, setOpen] = useState(false);
  const { user, signInWithGoogle } = useAuth();

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
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-rose-500 text-white font-semibold text-base hover:bg-rose-600 active:scale-95 transition-all shadow-lg shadow-rose-200"
      >
        <span>🍦</span>
        Log a Scoop
      </button>
      <LogScoopModal isOpen={open} onClose={handleClose} />
    </>
  );
}
