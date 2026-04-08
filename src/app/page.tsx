import Header from '@/components/Header';
import ScoopFeed from '@/components/ScoopFeed';
import LogScoopButton from '@/components/LogScoopButton';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-rose-50 via-amber-50 to-stone-50 py-20 px-4 text-center">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-5">
            <div className="text-6xl">🍦</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
              Track every scoop.
            </h1>
            <p className="text-lg text-stone-500 max-w-sm">
              Rate ice cream stands, log your flavors, and discover the best spots near you.
            </p>
            <LogScoopButton />
          </div>
        </section>

        <ScoopFeed />
      </main>

      <footer className="border-t border-stone-100 py-6 text-center text-xs text-stone-400">
        Scoop Scoops — the Letterboxd of ice cream stands 🍦
      </footer>
    </>
  );
}
