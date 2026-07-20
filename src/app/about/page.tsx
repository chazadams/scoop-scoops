import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About — Scoop Scoops',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-10">About</h1>

        <div className="prose-sm text-stone-700 dark:text-stone-300 space-y-8 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">What is Scoop Scoops?</h2>
            <p>
              Scoop Scoops is the Letterboxd of ice cream stands — a place to log, rate, and remember every scoop you&apos;ve had, and to discover the best stands near you through everyone else&apos;s logs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">How it works</h2>
            <p>
              Log a scoop after a visit — the stand, the flavor, how it tasted, and anything else worth remembering. Every log adds to that stand&apos;s public page, so the feed becomes a running record of the best (and worst) ice cream around. Set your location to find stands nearby, sorted by distance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Who&apos;s behind it</h2>
            <p>
              Scoop Scoops is an independent personal project, built for fun by someone who likes ice cream and side projects in roughly equal measure.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
