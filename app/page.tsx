'use client';

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
            <p className="text-slate-400 text-lg">Sidan är under uppbyggnad</p>
          </div>
        </div>
      </div>
    </main>
  );
}
