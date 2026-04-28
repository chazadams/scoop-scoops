import Header from '@/components/Header';
import StandsList from '@/components/StandsList';

export const metadata = { title: 'Stands — Scoop Scoops' };

export default function StandsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-rose-50 to-stone-50 dark:from-rose-950/20 dark:to-stone-900 py-10 px-4 text-center">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Ice Cream Stands</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Every stand the community has scooped.</p>
        </div>
        <StandsList />
      </main>
      <footer className="border-t border-stone-100 dark:border-stone-800 py-6 text-center text-xs text-stone-400 dark:text-stone-500">
        Scoop Scoops — The Ice Cream Stand Guide
      </footer>
    </>
  );
}
