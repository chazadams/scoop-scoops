import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 py-6 text-center">
      <p className="text-xs font-bold tracking-[0.1em] uppercase text-stone-400 dark:text-stone-500">Scoop Scoops</p>
      <p className="mt-1.5">
        <Link href="/privacy" className="text-xs text-stone-400 dark:text-stone-500 hover:text-brand transition-colors underline underline-offset-2">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}
