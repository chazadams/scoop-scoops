import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-stone-100 dark:border-stone-800 py-6 text-center text-xs text-stone-400 dark:text-stone-500">
      <p>Scoop Scoops — The Ice Cream Stand Guide</p>
      <p className="mt-1">
        <Link href="/privacy" className="hover:text-stone-600 dark:hover:text-stone-300 underline underline-offset-2 transition-colors">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}
