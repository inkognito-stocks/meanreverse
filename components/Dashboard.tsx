'use client';

import React, { useState, useMemo } from 'react';
import { ArrowDown, TrendingUp, ChevronUp, ChevronDown, RefreshCw, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import { StreakAnalysis } from '../types/stock';
import { LogoutButton } from './LogoutButton';

type SortColumn = 'streak' | 'hitRate' | 'decline' | 'zScore' | 'turnover';
type SortDirection = 'asc' | 'desc';

export const Dashboard = ({ stocks, isLoading, onRefresh }: { stocks: StreakAnalysis[]; isLoading?: boolean; onRefresh?: () => void }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('streak');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
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
    if (!stocks || stocks.length === 0) {
      return [];
    }
    
    const sorted = [...stocks];
    
    sorted.sort((a, b) => {
      let aValue: number;
      let bValue: number;
      
      switch (sortColumn) {
        case 'streak':
          aValue = a.currentStreak ?? 0;
          bValue = b.currentStreak ?? 0;
          break;
        case 'hitRate':
          aValue = a.historicalHitRate ?? 0;
          bValue = b.historicalHitRate ?? 0;
          break;
        case 'decline':
          aValue = a.totalDecline ?? 0;
          bValue = b.totalDecline ?? 0;
          break;
        case 'zScore':
          aValue = a.zScore ?? 0;
          bValue = b.zScore ?? 0;
          break;
        case 'turnover':
          aValue = a.avgTurnover20d ?? 0;
          bValue = b.avgTurnover20d ?? 0;
          break;
        default:
          return 0;
      }
      
      // Hantera NaN eller undefined
      if (isNaN(aValue)) aValue = 0;
      if (isNaN(bValue)) bValue = 0;
      
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

  // Säkerhetskontroller för att undvika fel när arrayer är tomma
  const longestStreak = stocks.length > 0 ? Math.max(...stocks.map(s => s.currentStreak)) : 0;
  const averageStreak = stocks.length > 0 
    ? (stocks.reduce((sum, s) => sum + s.currentStreak, 0) / stocks.length).toFixed(1)
    : '0.0';
  const worstDecline = stocks.length > 0 ? Math.min(...stocks.map(s => s.totalDecline)) : 0;
  const severeDeclines = stocks.length > 0 
    ? stocks.filter(s => s.totalDecline <= -10).length 
    : 0;

  const handleRefresh = () => {
    setLastUpdated(new Date());
    if (onRefresh) {
      onRefresh();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  // Hämta exchange från symbol (t.ex. .ST = Stockholm, .CO = Copenhagen, .HE = Helsinki, .OL = Oslo)
  const getExchange = (symbol: string) => {
    if (symbol.includes('.ST')) return 'OMX Stockholm';
    if (symbol.includes('.CO')) return 'Copenhagen';
    if (symbol.includes('.HE')) return 'Helsinki';
    if (symbol.includes('.OL')) return 'Oslo Børs';
    if (symbol.includes('.TO')) return 'TSX';
    if (symbol.includes('.') && !symbol.includes('.ST') && !symbol.includes('.CO') && !symbol.includes('.HE') && !symbol.includes('.OL') && !symbol.includes('.TO')) {
      return 'NYSE/NASDAQ';
    }
    return 'Unknown';
  };

  // Förkortat namn från fullständigt namn
  const getShortName = (name: string) => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) return name.substring(0, 4);
    return words[0].substring(0, 4);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* App Logo/Icon */}
            <div className="text-red-500 text-2xl font-bold">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">DownStreak</h1>
              <p className="text-slate-400 text-sm sm:text-base">Consecutive decline tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Updated timestamp */}
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Updated: {formatTime(lastUpdated)}</span>
            </div>
            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
            {/* Logout button */}
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard 
          title="AVERAGE STREAK" 
          value={averageStreak} 
          unit="days"
          icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
          valueColor="text-blue-500"
        />
        <StatCard 
          title="WORST DECLINE" 
          value={worstDecline.toFixed(1)} 
          unit="total loss"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          valueColor="text-red-500"
        />
      </div>

      {/* Watchlist Section */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Watchlist</h2>
        <p className="text-slate-400 text-sm">
          {sortedStocks.length} stocks • Sorted by consecutive decline days
        </p>
      </div>

      {/* Watchlist Table - Responsiv */}
      <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#334155] text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">RANK</th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('streak')}
                >
                  <div className="flex items-center gap-2">
                    DOWN STREAK
                    {sortColumn === 'streak' && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">SORTED</span>
                    )}
                    <SortIcon column="streak" />
                  </div>
                </th>
                <th className="p-4">SYMBOL</th>
                <th className="p-4">CO</th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('hitRate')}
                >
                  <div className="flex items-center gap-2">
                    HIT RATE
                    <SortIcon column="hitRate" />
                  </div>
                </th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('decline')}
                >
                  <div className="flex items-center gap-2">
                    DECLINE
                    <SortIcon column="decline" />
                  </div>
                </th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => handleSort('zScore')}
                >
                  <div className="flex items-center gap-2">
                    EXTREMITY (Z)
                    <SortIcon column="zScore" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.map((stock, i) => {
                return (
                  <tr key={stock.symbol} className="border-t border-slate-700 hover:bg-slate-800 transition">
                    <td className="p-4 font-bold text-white">#{i+1}</td>
                    <td className="p-4">
                      <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold inline-flex items-center gap-1">
                        {stock.currentStreak}d <ArrowDown className="w-3 h-3" />
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{stock.symbol}</div>
                      <div className="text-slate-400 text-sm">{getExchange(stock.symbol)}</div>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">{getShortName(stock.name)}</td>
                    <td className="p-4 font-mono text-green-400">{stock.historicalHitRate}%</td>
                    <td className="p-4 text-red-400">{stock.totalDecline.toFixed(1)}%</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded font-mono text-sm ${
                        (stock.zScore ?? 0) <= -2.5 ? 'bg-red-500/30 border border-red-500/50 text-red-400 font-bold' :
                        (stock.zScore ?? 0) <= -1.5 ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400' :
                        'text-slate-400'
                      }`}>
                        {(stock.zScore ?? 0).toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-700">
          {sortedStocks.map((stock, i) => (
            <div key={stock.symbol} className="p-4 bg-[#1e293b]">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <span className="text-slate-400 text-sm font-bold">#{i+1}</span>
                
                {/* Streak Badge */}
                <span className="bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold inline-flex items-center gap-1">
                  {stock.currentStreak}d <ArrowDown className="w-3 h-3" />
                </span>
                
                {/* Symbol and Exchange */}
                <div className="flex-1">
                  <div className="font-bold text-white">{stock.symbol}</div>
                  <div className="text-slate-400 text-xs">{getExchange(stock.symbol)}</div>
                </div>
                
                {/* Short Name */}
                <div className="text-white text-sm font-semibold">{getShortName(stock.name)}</div>
              </div>
              
              {/* Additional info row */}
              <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Hit Rate</p>
                  <p className="text-green-400 font-semibold">{stock.historicalHitRate}%</p>
                </div>
                <div>
                  <p className="text-slate-400">Decline</p>
                  <p className="text-red-400 font-semibold">{stock.totalDecline.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-slate-400">Z-Score</p>
                  <p className={`font-semibold ${
                    (stock.zScore ?? 0) <= -2.5 ? 'text-red-400' : 
                    (stock.zScore ?? 0) <= -1.5 ? 'text-orange-400' : 
                    'text-slate-400'
                  }`}>
                    {(stock.zScore ?? 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  valueColor = 'text-white' 
}: { 
  title: string; 
  value: string; 
  unit?: string;
  icon: React.ReactNode; 
  valueColor?: string;
}) => (
  <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 relative">
    <div className="flex justify-between items-start mb-2">
      <p className="text-slate-400 text-xs uppercase tracking-wide">{title}</p>
      <div className="absolute top-4 right-4">
        {icon}
      </div>
    </div>
    <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    {unit && <p className="text-slate-400 text-xs mt-1">{unit}</p>}
  </div>
);