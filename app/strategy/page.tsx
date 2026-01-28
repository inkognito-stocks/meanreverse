'use client';

import Link from 'next/link';
import { ArrowDown, Crosshair, Minimize2, TrendingUp, BarChart2, Activity } from 'lucide-react';

interface StrategyCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  tag: string;
  tagColor: string;
  status: 'active' | 'coming-soon';
  description: string;
  href?: string;
}

const strategies: StrategyCard[] = [
  {
    id: 'downstreak',
    title: 'DownStreak',
    icon: <ArrowDown className="w-8 h-8" />,
    tag: 'Reversion',
    tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    status: 'active',
    description: 'Fångar aktier som fallit onaturligt många dagar i rad. Baserad på sannolikhetslära för jämviktspendling.',
    href: '/mean-reversion',
  },
  {
    id: 'rsi-sniper',
    title: 'RSI 2 Sniper',
    icon: <Crosshair className="w-8 h-8" />,
    tag: 'Aggressive',
    tagColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    status: 'coming-soon',
    description: 'Larry Connors berömda strategi. Köper extremt översålda lägen (RSI < 10) och säljer vid första styrketecken.',
  },
  {
    id: 'bollinger-squeeze',
    title: 'Bollinger Squeeze',
    icon: <Minimize2 className="w-8 h-8" />,
    tag: 'Volatility',
    tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    status: 'coming-soon',
    description: 'Identifierar aktier med historiskt låg volatilitet som laddar upp för en kraftig rörelse (utbrott).',
  },
  {
    id: 'golden-cross',
    title: 'Golden Cross',
    icon: <TrendingUp className="w-8 h-8" />,
    tag: 'Trend',
    tagColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    status: 'coming-soon',
    description: 'Klassisk trendstrategi där MA50 bryter upp över MA200. Signalerar ofta starten på en långsiktig uppgång.',
  },
  {
    id: 'volume-breakout',
    title: 'Volume Breakout',
    icon: <BarChart2 className="w-8 h-8" />,
    tag: 'Momentum',
    tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    status: 'coming-soon',
    description: 'Följ pengarna. Identifierar aktier som stiger kraftigt under onormalt hög volym (>200%), vilket indikerar institutionellt köptryck.',
  },
  {
    id: 'trend-pullback',
    title: 'Trend Pullback',
    icon: <Activity className="w-8 h-8" />,
    tag: 'Trend + Reversion',
    tagColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    status: 'coming-soon',
    description: 'Den säkra vägen. Hittar fundamentalt starka aktier i långsiktig upptrend (över MA200) som är tillfälligt översålda.',
  },
];

export default function StrategyPage() {
  return (
    <main>
      <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans pt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Trading Strategier</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Välj en strategi för att börja analysera aktier
            </p>
          </div>

          {/* Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy) => {
              const CardContent = (
                <div
                  className={`h-full p-6 bg-slate-800 border border-slate-700 rounded-xl transition-all duration-200 ${
                    strategy.status === 'active'
                      ? 'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer'
                      : 'opacity-75 hover:border-slate-600 hover:shadow-md'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500">{strategy.icon}</div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{strategy.title}</h2>
                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium border mt-1 ${strategy.tagColor}`}>
                          {strategy.tag}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    {strategy.status === 'active' ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-green-400 font-medium">ACTIVE</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                        <span className="text-xs text-yellow-400 font-medium">Coming Soon</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed">{strategy.description}</p>
                </div>
              );

              // Render as Link if active, otherwise as div
              if (strategy.status === 'active' && strategy.href) {
                return (
                  <Link key={strategy.id} href={strategy.href}>
                    {CardContent}
                  </Link>
                );
              }

              return <div key={strategy.id}>{CardContent}</div>;
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
