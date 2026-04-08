import Link from 'next/link';
import LogScoopButton from './LogScoopButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-stone-900 tracking-tight">
          <span>🍦</span>
          <span>Scoop Scoops</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-stone-500">
          <Link href="#" className="hover:text-stone-900 transition-colors">Discover</Link>
          <Link href="#" className="hover:text-stone-900 transition-colors">Stands</Link>
        </nav>
        <LogScoopButton />
      </div>
    </header>
  );
}
