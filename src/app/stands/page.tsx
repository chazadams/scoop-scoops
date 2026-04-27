import Header from '@/components/Header';
import StandsList from '@/components/StandsList';

export const metadata = { title: 'Stands — Scoop Scoops' };

export default function StandsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-rose-50 to-stone-50 py-10 px-4 text-center">
          <h1 className="text-2xl font-bold text-stone-900">Ice Cream Stands</h1>
          <p className="text-sm text-stone-500 mt-1">Every stand the community has scooped.</p>
        </div>
        <StandsList />
      </main>
      <footer className="border-t border-stone-100 py-6 text-center text-xs text-stone-400">
        Scoop Scoops — The Ice Cream Stand Guide
      </footer>
    </>
  );
}
