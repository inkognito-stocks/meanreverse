'use client';

import Link from 'next/link';
import { ArrowRight, TrendingDown, Activity, Target } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-screen flex items-end">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/mogotes-pic.jpeg)',
          }}
        />
        
        {/* Dark Overlay Gradient (from transparent to dark at bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent" />
        
        {/* Content Container */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Main Heading - Subtle, don't obstruct image text */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl">
                DownStreak
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 font-light">
                Professional Stock Analysis & Trading Tools
              </p>
            </div>

            {/* Navigation Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Primary: Mean Reversion */}
              <Link 
                href="/mean-reversion"
                className="group relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 rounded-xl p-6 sm:p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingDown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200" />
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Mean Reversion</h2>
                  <p className="text-sm sm:text-base text-amber-100/90">
                    Find oversold stocks ready to bounce
                  </p>
                </div>
              </Link>

              {/* Secondary: Market Scanner */}
              <Link 
                href="/volume"
                className="group relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 rounded-xl p-6 sm:p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-slate-500/20 border border-slate-600/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Market Scanner</h2>
                  <p className="text-sm sm:text-base text-slate-300/90">
                    Discover unusual volume activity
                  </p>
                </div>
              </Link>

              {/* Ghost: Strategies */}
              <Link 
                href="/strategy"
                className="group relative overflow-hidden bg-slate-800/50 hover:bg-slate-800/70 rounded-xl p-6 sm:p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-slate-700/50 hover:border-amber-500/50"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400/80 group-hover:text-amber-400 transition-colors" />
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Strategies</h2>
                  <p className="text-sm sm:text-base text-slate-400 group-hover:text-slate-300 transition-colors">
                    Advanced trading strategies
                  </p>
                </div>
              </Link>

            </div>

            {/* Footer Text */}
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-500">
                Powered by advanced technical analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
