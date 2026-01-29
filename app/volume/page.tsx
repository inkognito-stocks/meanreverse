'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StockSelector, FilterValues } from '../../components/StockSelector';
import { StreakAnalysis } from '../../types/stock';
import { fetchStocks } from '../../lib/borsdata';
import { Flame, TrendingUp, TrendingDown, Activity, Zap, BarChart3, Loader2, HelpCircle, ChevronUp, ChevronDown, X } from 'lucide-react';

type SortColumn = 'price' | 'change' | 'rvol' | 'intensity';
type SortDirection = 'asc' | 'desc';

export default function VolumePage() {
  const [stocks, setStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<SortColumn>('rvol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [mobileTooltip, setMobileTooltip] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    activeRegion: 'nordic',
    selectedCountries: ['sweden', 'usa', 'canada'], // Default to broad search
    marketCapMin: 0,
    marketCapMax: 500000,
    minTurnover: 0
  });

  // Fetch data function with caching support
  const load = useCallback(async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    if (forceRefresh) {
      setStocks([]); // Clear previous data on force refresh
    }
    
    try {
      const promises = filters.selectedCountries.map((c: string) => fetchStocks(c, forceRefresh));
      const results = await Promise.all(promises);
      const allStocks = results.flat();
      
      // Remove duplicates based on symbol
      const uniqueStocks = Array.from(
        new Map(allStocks.map((stock: any) => [stock.symbol, stock])).values()
      ) as StreakAnalysis[];
      
      setStocks(uniqueStocks);
    } catch (e) {
      console.error('Error loading stocks:', e);
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.selectedCountries]);

  // Initial load (use cached data)
  useEffect(() => {
    load(false);
  }, [load]);

  // Refresh handler (force refresh, bypass cache)
  const handleRefresh = useCallback(() => {
    // Force refresh by calling load with forceRefresh = true
    // This will call fetchStocks(country, true) for each country to bypass cache
    load(true);
  }, [load]);

  // --- ANALYSIS LOGIC --- //
  
  // Calculate a mock "RVOL" (Relative Volume) score since we lack historical volume arrays in this demo.
  // In a real app, this would be: CurrentVolume / AvgVolume20d.
  // Here we simulate it based on Turnover/Cap ratio anomalies or raw turnover spikes.
  const getRVOL = (s: StreakAnalysis) => {
    // If we have rvol from technical analysis, use it
    if (s.rvol !== undefined && s.rvol !== null && s.rvol > 0) {
      return s.rvol;
    }
    
    // Fallback: simulate based on turnover/market cap ratio
    if (!s.turnoverSEK || !s.marketCapSEK || s.marketCapSEK === 0) return 1.0;
    
    // Basic simulation: Smaller caps usually have lower turnover ratios, so we normalize.
    // This is just to demonstrate the UI sorting.
    const activityRatio = (s.turnoverSEK / s.marketCapSEK) * 1000;
    // Cap between 0.5x and 8.5x
    return Math.min(Math.max(activityRatio, 0.5), 8.5); 
  };

  const processedStocks = stocks.map((s: StreakAnalysis) => ({
    ...s,
    rvol: getRVOL(s)
  }));

  // Sort function
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // 1. THE HOTLIST: High Activity (>2x RVOL) with sorting
  const hotList = useMemo(() => {
    const filtered = processedStocks.filter((s: StreakAnalysis & { rvol: number }) => s.rvol > 2.0);
    
    const sorted = [...filtered].sort((a: StreakAnalysis & { rvol: number }, b: StreakAnalysis & { rvol: number }) => {
      let aValue: number;
      let bValue: number;
      
      switch (sortColumn) {
        case 'price':
          aValue = a.lastPrice ?? 0;
          bValue = b.lastPrice ?? 0;
          break;
        case 'change':
          aValue = a.dailyChange ?? 0;
          bValue = b.dailyChange ?? 0;
          break;
        case 'rvol':
          aValue = a.rvol;
          bValue = b.rvol;
          break;
        case 'intensity':
          aValue = a.rvol;
          bValue = b.rvol;
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
    
    return sorted.slice(0, 15);
  }, [processedStocks, sortColumn, sortDirection]);

  // 2. BREAKOUTS: Price Up + Volume Up
  const breakouts = processedStocks
    .filter((s: StreakAnalysis & { rvol: number }) => (s.dailyChange ?? 0) > 2.5 && s.rvol > 1.5)
    .sort((a: StreakAnalysis, b: StreakAnalysis) => (b.dailyChange ?? 0) - (a.dailyChange ?? 0))
    .slice(0, 5);

  // 3. CAPITULATION: Price Down + Volume Up (Panic)
  const panicList = processedStocks
    .filter((s: StreakAnalysis & { rvol: number }) => (s.dailyChange ?? 0) < -4.0 && s.rvol > 1.5)
    .sort((a: StreakAnalysis, b: StreakAnalysis) => (a.dailyChange ?? 0) - (b.dailyChange ?? 0))
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white pb-20">
      <div className="container mx-auto px-4 py-6">
        
        {/* Header & Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Activity className="w-8 h-8 text-blue-500" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-white">Market Scanner</h1>
               <p className="text-slate-400">Finding the hottest liquidity flows right now.</p>
             </div>
          </div>
          
          <StockSelector 
            onFilterChange={setFilters} 
            isLoading={isLoading} 
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* --- MAIN SECTION: THE HEATMAP LIST (8 Cols) --- */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Top Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox label="Active Stocks" value={hotList.length} icon={<Zap className="text-yellow-500" />} />
                <StatBox label="Breakouts" value={breakouts.length} icon={<TrendingUp className="text-green-500" />} />
                <StatBox label="Panic Sells" value={panicList.length} icon={<TrendingDown className="text-red-500" />} />
                <StatBox label="Avg RVOL" value={hotList.length > 0 ? `${(hotList.reduce((sum: number, s: StreakAnalysis & { rvol: number }) => sum + s.rvol, 0) / hotList.length).toFixed(1)}x` : '0.0x'} icon={<BarChart3 className="text-blue-500" />} />
              </div>

              {/* The Visual Table */}
              <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                  <h2 className="font-bold flex items-center gap-2 text-white">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Unusual Volume (RVOL)
                  </h2>
                  <span className="text-xs font-mono text-slate-400">SORT: INTENSITY</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                      <tr>
                        <th className="p-4">Symbol</th>
                        <th 
                          className="p-4 text-right cursor-pointer hover:text-white transition-colors select-none"
                          onClick={() => handleSort('price')}
                        >
                          <div className="flex items-center justify-end gap-1">
                            Price
                            {sortColumn === 'price' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="p-4 text-right cursor-pointer hover:text-white transition-colors select-none"
                          onClick={() => handleSort('change')}
                        >
                          <div className="flex items-center justify-end gap-1">
                            Change
                            <Tooltip id="change" text="Dagens procentuella förändring i priset. Positivt värde = upp, negativt = ner." mobileTooltip={mobileTooltip} setMobileTooltip={setMobileTooltip} />
                            {sortColumn === 'change' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                        <th className="p-4 w-1/3">
                          <div className="flex items-center gap-1">
                            Activity Intensity
                            <Tooltip id="intensity" text="Visuell indikator för volymaktivitet. Längre bar = högre ovanlig volym." mobileTooltip={mobileTooltip} setMobileTooltip={setMobileTooltip} />
                          </div>
                        </th>
                        <th 
                          className="p-4 text-right cursor-pointer hover:text-white transition-colors select-none"
                          onClick={() => handleSort('rvol')}
                        >
                          <div className="flex items-center justify-end gap-1">
                            RVOL
                            <Tooltip id="rvol" text="Relative Volume - Hur många gånger högre volymen är jämfört med genomsnittet. 2.0x = dubbel volym." mobileTooltip={mobileTooltip} setMobileTooltip={setMobileTooltip} />
                            {sortColumn === 'rvol' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {hotList.map((stock: StreakAnalysis & { rvol: number }) => (
                        <tr key={stock.symbol} className="hover:bg-slate-700/30 transition group">
                          <td className="p-4">
                            <div className="font-bold font-mono text-white text-base">{stock.symbol}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[120px]">{stock.name}</div>
                          </td>
                          <td className="p-4 text-right font-mono text-slate-300">
                            {stock.lastPrice?.toFixed(2) || 'N/A'}
                          </td>
                          <td className="p-4 text-right">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold font-mono ${
                              (stock.dailyChange ?? 0) > 0 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {(stock.dailyChange ?? 0) > 0 ? '+' : ''}{(stock.dailyChange ?? 0).toFixed(2)}%
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                  style={{ width: `${Math.min(stock.rvol * 15, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-white">
                            {stock.rvol.toFixed(1)}x
                          </td>
                        </tr>
                      ))}
                      {hotList.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">No unusual activity found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* --- SIDEBAR: SIGNALS (4 Cols) --- */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Panic Card */}
              <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-red-500/5">
                  <h3 className="font-bold flex items-center gap-2 text-red-400">
                    <TrendingDown className="w-4 h-4" /> Capitulation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Crashing on high volume (Potential Reversal)</p>
                </div>
                <div className="divide-y divide-slate-700">
                  {panicList.map((s: StreakAnalysis & { rvol: number }) => <SignalRow key={s.symbol} stock={s} type="bear" />)}
                  {panicList.length === 0 && <EmptyState />}
                </div>
              </div>

              {/* Breakout Card */}
              <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-green-500/5">
                  <h3 className="font-bold flex items-center gap-2 text-green-400">
                    <TrendingUp className="w-4 h-4" /> Power Breakouts
                  </h3>
                   <p className="text-xs text-slate-500 mt-1">Surging on high volume (Momentum)</p>
                </div>
                <div className="divide-y divide-slate-700">
                  {breakouts.map((s: StreakAnalysis & { rvol: number }) => <SignalRow key={s.symbol} stock={s} type="bull" />)}
                  {breakouts.length === 0 && <EmptyState />}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// --- Sub Components ---

const StatBox = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-[#1e293b] p-3 rounded-xl border border-slate-700 flex items-center justify-between">
    <div>
      <div className="text-slate-500 text-[10px] uppercase font-bold">{label}</div>
      <div className="text-xl font-mono font-bold text-white mt-1">{value}</div>
    </div>
    <div className="opacity-80">{icon}</div>
  </div>
);

const SignalRow = ({ stock, type }: { stock: StreakAnalysis, type: 'bull'|'bear' }) => (
  <div className="p-3 hover:bg-slate-700/50 transition flex justify-between items-center group cursor-pointer">
    <div>
      <div className="font-bold font-mono text-white text-sm">{stock.symbol}</div>
      <div className="text-[10px] text-slate-500">{stock.name ? stock.name.substring(0, 15) + '...' : ''}</div>
    </div>
    <div className="text-right">
      <div className={`font-mono font-bold text-sm ${type === 'bull' ? 'text-green-400' : 'text-red-400'}`}>
        {(stock.dailyChange ?? 0) > 0 ? '+' : ''}{(stock.dailyChange ?? 0).toFixed(2)}%
      </div>
      <div className="text-[10px] text-slate-400">
        Vol: <span className="text-white">{(stock.rvol ?? 0).toFixed(1)}x</span>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="p-4 text-center text-slate-500 text-xs italic">No signals detected.</div>
);

// Tooltip component for help icons
const Tooltip = ({ id, text, mobileTooltip, setMobileTooltip }: { id: string; text: string; mobileTooltip: string | null; setMobileTooltip: (id: string | null) => void }) => {
  const [isMobile, setIsMobile] = useState(false);
  const isOpen = mobileTooltip === id;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="relative inline-block">
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setMobileTooltip(isOpen ? null : id);
          }}
          className="inline-flex items-center"
          aria-label="Visa förklaring"
        >
          <HelpCircle className="w-3 h-3 ml-1 text-slate-400 hover:text-white transition-colors" />
        </button>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setMobileTooltip(null)}>
            <div className="bg-[#1e293b] border border-slate-600 rounded-lg p-4 max-w-sm relative" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <button
                onClick={() => setMobileTooltip(null)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
                aria-label="Stäng"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-sm text-white pr-6">{text}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop: Tooltip on hover
  return (
    <div className="relative group inline-flex items-center">
      <HelpCircle className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors cursor-help" />
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#1e293b] border border-slate-600 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-xs">
        {text}
        <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-slate-600"></div>
      </div>
    </div>
  );
};
