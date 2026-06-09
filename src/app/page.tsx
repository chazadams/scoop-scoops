'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ScoopFeed from '@/components/ScoopFeed';
import LogScoopButton from '@/components/LogScoopButton';
import Footer from '@/components/Footer';

export default function Home() {
  const [feedKey, setFeedKey] = useState(0);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 px-4 py-4">
          <div className="max-w-5xl mx-auto">
            <LogScoopButton onScoopLogged={() => setFeedKey((k) => k + 1)} />
          </div>
        </div>
        <ScoopFeed key={feedKey} />
      </main>
      <Footer />
    </>
  );
}
