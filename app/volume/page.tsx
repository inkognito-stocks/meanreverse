'use client';

import React, { useState, useEffect } from 'react';
import { StockSelector, FilterValues } from '../../components/StockSelector';
import { StreakAnalysis } from '../../types/stock';
import { Flame, TrendingUp, TrendingDown, Activity, Zap, BarChart3, Loader2 } from 'lucide-react';

export default function VolumePage() {
  const [stocks, setStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    activeRegion: 'nordic',
    selectedCountries: ['sweden', 'usa', 'canada'], // Default to broad search
    marketCapMin: 0,
    marketCapMax: 500000,
    minTurnover: 0
  });

  // Fetch data based on selected countries
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const promises = filters.selectedCountries.map(async (country) => {
          try {
            const response = await fetch(`/api/stocks?country=${country}`);
            if (!response.ok) return [];
            const data = await response.json();
            return Array.isArray(data) ? data : [];
          } catch (error) {
            console.error(`Error fetching ${country}:`, error);
            return [];
          }
        });
        
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
    }
    load();
  }, [filters.selectedCountries]);

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

  const processedStocks = stocks.map(s => ({
    ...s,
    rvol: getRVOL(s)
  }));

  // 1. THE HOTLIST: High Activity (>2x RVOL)
  const hotList = processedStocks
    .filter(s => s.rvol > 2.0)
    .sort((a, b) => b.rvol - a.rvol)
    .slice(0, 15);

  // 2. BREAKOUTS: Price Up + Volume Up
  const breakouts = processedStocks
    .filter(s => s.dailyChange > 2.5 && s.rvol > 1.5)
    .sort((a, b) => b.dailyChange - a.dailyChange)
    .slice(0, 5);

  // 3. CAPITULATION: Price Down + Volume Up (Panic)
  const panicList = processedStocks
    .filter(s => s.dailyChange < -4.0 && s.rvol > 1.5)
    .sort((a, b) => a.dailyChange - b.dailyChange)
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
                <StatBox label="Avg RVOL" value={hotList.length > 0 ? `${(hotList.reduce((sum, s) => sum + s.rvol, 0) / hotList.length).toFixed(1)}x` : '0.0x'} icon={<BarChart3 className="text-blue-500" />} />
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
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-right">Change</th>
                        <th className="p-4 w-1/3">Activity Intensity</th>
                        <th className="p-4 text-right">RVOL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {hotList.map((stock) => (
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
                  {panicList.map(s => <SignalRow key={s.symbol} stock={s} type="bear" />)}
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
                  {breakouts.map(s => <SignalRow key={s.symbol} stock={s} type="bull" />)}
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
        Vol: <span className="text-white">{stock.rvol.toFixed(1)}x</span>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="p-4 text-center text-slate-500 text-xs italic">No signals detected.</div>
);
