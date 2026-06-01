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
        {/* Hero */}
        <section className="bg-gradient-to-b from-rose-50 via-amber-50 to-stone-50 dark:from-rose-950/20 dark:via-stone-900 dark:to-stone-900 py-8 sm:py-20 px-4 text-center">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-3 sm:gap-5">
            <p className="hidden sm:block text-lg text-stone-500 dark:text-stone-400 max-w-sm">
              Rate ice cream stands, log your flavors, and discover the best spots near you.
            </p>
            <LogScoopButton onScoopLogged={() => setFeedKey((k) => k + 1)} />
          </div>
        </section>

        <ScoopFeed key={feedKey} />
      </main>

      <Footer />
    </>
  );
}
