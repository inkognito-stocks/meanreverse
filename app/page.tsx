'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-red-500 text-6xl font-bold mb-4">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Välkommen till DownStreak</h1>
            <p className="text-slate-400 text-lg mb-8">Sidan är under arbete</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <Link
              href="/mean-reversion"
              className="p-6 bg-[#1e293b] border border-slate-700 rounded-xl hover:border-red-500/50 transition-colors"
            >
              <h2 className="text-xl font-bold text-white mb-2">Mean Reversion</h2>
              <p className="text-slate-400 text-sm">Analysera aktier med konsekutiva nedgångar</p>
            </Link>
            
            <Link
              href="/strategy"
              className="p-6 bg-[#1e293b] border border-slate-700 rounded-xl hover:border-red-500/50 transition-colors"
            >
              <h2 className="text-xl font-bold text-white mb-2">Strategi</h2>
              <p className="text-slate-400 text-sm">Sidan är under arbete</p>
            </Link>
            
            <Link
              href="/volume"
              className="p-6 bg-[#1e293b] border border-slate-700 rounded-xl hover:border-red-500/50 transition-colors"
            >
              <h2 className="text-xl font-bold text-white mb-2">Volym</h2>
              <p className="text-slate-400 text-sm">Sidan är under arbete</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
