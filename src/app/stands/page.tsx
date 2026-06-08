import Header from '@/components/Header';
import StandsList from '@/components/StandsList';
import Footer from '@/components/Footer';

export const metadata = { title: 'Stands — Scoop Scoops' };

export default function StandsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 py-5 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-sm font-bold tracking-[0.1em] uppercase text-stone-900 dark:text-stone-100">Ice Cream Stands</h1>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Every stand the community has scooped.</p>
          </div>
        </div>
        <StandsList />
      </main>
      <Footer />
    </>
  );
}
