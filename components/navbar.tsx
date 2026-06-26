import Link from 'next/link';
import { Home, Info, Sparkles, Upload, Activity } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-tight text-lg">FreshPoultry</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-500">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" /> Beranda
          </Link>
          <Link href="/#tentang" className="hover:text-primary transition-colors flex items-center gap-2">
            <Info className="w-4 h-4" /> Tentang
          </Link>
          <Link href="/#fitur" className="hover:text-primary transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Fitur
          </Link>
          <Link href="/history" className="hover:text-primary transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" /> Riwayat
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/upload" 
            className="hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Upload className="w-4 h-4" />
            Mulai Deteksi
          </Link>
          <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
