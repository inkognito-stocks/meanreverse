'use client';

import React, { useState, useMemo } from 'react';
import { ArrowDown, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import { StreakAnalysis } from '../types/stock';
import { LogoutButton } from './LogoutButton';

type SortColumn = 'streak' | 'hitRate' | 'decline' | 'zScore' | 'turnover';
type SortDirection = 'asc' | 'desc';

export const Dashboard = ({ stocks, isLoading }: { stocks: StreakAnalysis[]; isLoading?: boolean }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('streak');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-6 font-sans flex items-center justify-center">
        <p className="text-slate-400">Laddar aktier...</p>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-6 font-sans flex flex-col items-center justify-center">
        <p className="text-slate-400 mb-2">Inga aktier att visa</p>
        <p className="text-slate-500 text-sm">Kontrollera konsolen för felmeddelanden</p>
      </div>
    );
  }

  // Sortera aktier baserat på vald kolumn och riktning
  const sortedStocks = useMemo(() => {
    const sorted = [...stocks];
    
    sorted.sort((a, b) => {
      let aValue: number;
      let bValue: number;
      
      switch (sortColumn) {
        case 'streak':
          aValue = a.currentStreak;
          bValue = b.currentStreak;
          break;
        case 'hitRate':
          aValue = a.historicalHitRate;
          bValue = b.historicalHitRate;
          break;
        case 'decline':
          aValue = a.totalDecline;
          bValue = b.totalDecline;
          break;
        case 'zScore':
          aValue = a.zScore;
          bValue = b.zScore;
          break;
        case 'turnover':
          aValue = a.avgTurnover20d;
          bValue = b.avgTurnover20d;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    
    return sorted;
  }, [stocks, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Växla riktning om samma kolumn klickas igen
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sätt ny kolumn och default till desc (högsta först)
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ChevronDown className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const longestStreak = Math.max(...stocks.map(s => s.currentStreak));
  const bestHitRate = Math.max(...stocks.map(s => s.historicalHitRate));
  const mostExtreme = Math.min(...stocks.map(s => s.zScore)); // Lägsta Z-score = mest extremt

  return (
    <div>
      {/* Header med logout-knapp */}
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard title="Longest Streak" value={`${longestStreak} Days`} icon={<ArrowDown className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />} />
        <StatCard title="Best Hist. Hit Rate" value={`${bestHitRate}%`} icon={<TrendingUp className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />} />
        <StatCard title="Most Extreme (Z)" value={mostExtreme.toFixed(1)} icon={<ArrowDown className="text-red-400 w-5 h-5 sm:w-6 sm:h-6" />} />
      </div>

      {/* Watchlist Table - Responsiv */}
      <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#334155] text-slate-400 text-sm uppercase">
              <tr>
                <th className="p-4">Rank/Symbol</th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('streak')}
                >
                  <div className="flex items-center gap-2">
                    Streak
                    <SortIcon column="streak" />
                  </div>
                </th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('hitRate')}
                >
                  <div className="flex items-center gap-2">
                    Hit Rate (Vändning)
                    <SortIcon column="hitRate" />
                  </div>
                </th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('decline')}
                >
                  <div className="flex items-center gap-2">
                    Total Decline
                    <SortIcon column="decline" />
                  </div>
                </th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('zScore')}
                >
                  <div className="flex items-center gap-2">
                    Extremity (Z)
                    <SortIcon column="zScore" />
                  </div>
                </th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('turnover')}
                >
                  <div className="flex items-center gap-2">
                    Turnover (20d)
                    <SortIcon column="turnover" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.map((stock, i) => {
                // Färgkodning för Z-score
                const getZScoreColor = (zScore: number) => {
                  if (zScore <= -2.5) {
                    return 'text-red-400 font-bold'; // Lysande rött/neon för extremt lågt
                  } else if (zScore <= -1.5) {
                    return 'text-orange-400'; // Orange för moderat lågt
                  } else {
                    return 'text-slate-400'; // Grått för normalt
                  }
                };

                const getZScoreBg = (zScore: number) => {
                  if (zScore <= -2.5) {
                    return 'bg-red-500/30 border border-red-500/50'; // Lysande rött bakgrund
                  } else if (zScore <= -1.5) {
                    return 'bg-orange-500/20 border border-orange-500/30'; // Orange bakgrund
                  } else {
                    return ''; // Ingen bakgrund för normalt
                  }
                };

                return (
                  <tr key={stock.symbol} className="border-t border-slate-700 hover:bg-slate-800 transition">
                    <td className="p-4 font-bold">#{i+1} {stock.symbol}</td>
                    <td className="p-4">
                      <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm font-bold">
                        {stock.currentStreak}d ↓
                      </span>
                    </td>
                    <td className="p-4 font-mono text-green-400">{stock.historicalHitRate}%</td>
                    <td className="p-4 text-red-400">{stock.totalDecline.toFixed(2)}%</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded ${getZScoreBg(stock.zScore)} ${getZScoreColor(stock.zScore)} font-mono text-sm`}>
                        {stock.zScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{(stock.avgTurnover20d / 1000000).toFixed(1)}M</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-700">
          {sortedStocks.map((stock, i) => (
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
                <div>
                  <p className="text-slate-400 text-xs">Extremity (Z)</p>
                  <p className={`font-mono font-semibold ${
                    stock.zScore <= -2.5 ? 'text-red-400' : 
                    stock.zScore <= -1.5 ? 'text-orange-400' : 
                    'text-slate-400'
                  }`}>
                    {stock.zScore.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Turnover (20d)</p>
                  <p className="text-slate-300">{(stock.avgTurnover20d / 1000000).toFixed(1)}M</p>
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