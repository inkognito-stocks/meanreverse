'use client';

import React from 'react';
import { ArrowDown, TrendingUp } from 'lucide-react';
import { StreakAnalysis } from '../types/stock';
import { LogoutButton } from './LogoutButton';

export const Dashboard = ({ stocks }: { stocks: StreakAnalysis[] }) => {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-6 font-sans flex items-center justify-center">
        <p className="text-slate-400">Inga aktier att visa</p>
      </div>
    );
  }

  const longestStreak = Math.max(...stocks.map(s => s.currentStreak));
  const bestHitRate = Math.max(...stocks.map(s => s.historicalHitRate));

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans">
      {/* Header med logout-knapp */}
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard title="Longest Streak" value={`${longestStreak} Days`} icon={<ArrowDown className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />} />
        <StatCard title="Best Hist. Hit Rate" value={`${bestHitRate}%`} icon={<TrendingUp className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />} />
      </div>

      {/* Watchlist Table - Responsiv */}
      <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#334155] text-slate-400 text-sm uppercase">
              <tr>
                <th className="p-4">Rank/Symbol</th>
                <th className="p-4">Streak</th>
                <th className="p-4">Hit Rate (Vändning)</th>
                <th className="p-4">Total Decline</th>
                <th className="p-4">Turnover (20d)</th>
              </tr>
            </thead>
            <tbody>
              {stocks.sort((a,b) => b.currentStreak - a.currentStreak).map((stock, i) => (
                <tr key={stock.symbol} className="border-t border-slate-700 hover:bg-slate-800 transition">
                  <td className="p-4 font-bold">#{i+1} {stock.symbol}</td>
                  <td className="p-4">
                    <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm font-bold">
                      {stock.currentStreak}d ↓
                    </span>
                  </td>
                  <td className="p-4 font-mono text-green-400">{stock.historicalHitRate}%</td>
                  <td className="p-4 text-red-400">{stock.totalDecline.toFixed(2)}%</td>
                  <td className="p-4 text-slate-400">{(stock.avgTurnover20d / 1000000).toFixed(1)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-700">
          {stocks.sort((a,b) => b.currentStreak - a.currentStreak).map((stock, i) => (
            <div key={stock.symbol} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-400 text-xs">#{i+1}</span>
                  <h3 className="font-bold text-lg">{stock.symbol}</h3>
                </div>
                <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded-full text-xs font-bold">
                  {stock.currentStreak}d ↓
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Hit Rate</p>
                  <p className="font-mono text-green-400 font-semibold">{stock.historicalHitRate}%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Decline</p>
                  <p className="text-red-400 font-semibold">{stock.totalDecline.toFixed(2)}%</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-xs">Turnover (20d)</p>
                  <p className="text-slate-300">{(stock.avgTurnover20d / 1000000).toFixed(1)}M SEK</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-[#1e293b] p-3 sm:p-4 rounded-xl border border-slate-700">
    <div className="flex justify-between items-start">
      <p className="text-slate-400 text-xs sm:text-sm">{title}</p>
      {icon}
    </div>
    <p className="text-xl sm:text-2xl font-bold mt-2">{value}</p>
  </div>
);