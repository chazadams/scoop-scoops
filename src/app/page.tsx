'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ScoopFeed from '@/components/ScoopFeed';
import LogScoopButton from '@/components/LogScoopButton';

function HeroLogo() {
  return (
    <svg width="100%" viewBox="0 0 680 220" role="img" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: 520 }}>
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

export default function Home() {
  const [feedKey, setFeedKey] = useState(0);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-rose-50 via-amber-50 to-stone-50 dark:from-rose-950/20 dark:via-stone-900 dark:to-stone-900 py-20 px-4 text-center">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-5">
            <HeroLogo />
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-sm">
              Rate ice cream stands, log your flavors, and discover the best spots near you.
            </p>
            <LogScoopButton onScoopLogged={() => setFeedKey((k) => k + 1)} />
          </div>
        </section>

        <ScoopFeed key={feedKey} />
      </main>

      <footer className="border-t border-stone-100 dark:border-stone-800 py-6 text-center text-xs text-stone-400 dark:text-stone-500">
        Scoop Scoops — The Ice Cream Stand Guide
      </footer>
    </>
  );
}
