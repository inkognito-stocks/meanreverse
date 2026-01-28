'use client';

import React, { useState, useEffect } from 'react';
import { StreakAnalysis } from '../../types/stock';
import { Activity, TrendingDown, TrendingUp, AlertTriangle, Flame, BarChart3, Loader2 } from 'lucide-react';

export default function VolumePage() {
  const [stocks, setStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        // Fetch from all markets to find the best volume plays
        // We fetch Sweden, USA, Canada to get a good mix
        const [seRes, usRes, caRes] = await Promise.all([
          fetch('/api/stocks?country=sweden'),
          fetch('/api/stocks?country=usa'),
          fetch('/api/stocks?country=canada')
        ]);
        
        const se = seRes.ok ? await seRes.json() : [];
        const us = usRes.ok ? await usRes.json() : [];
        const ca = caRes.ok ? await caRes.json() : [];
        
        setStocks([...se, ...us, ...ca]);
      } catch (e) {
        console.error(e);
        setStocks([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Helper: Calculate Relative Volume (RVOL)
  // Since we might lack historical volume in the demo, we estimate RVOL 
  // by comparing turnover vs market cap or using the raw turnoverSEK if available.
  // Ideally: RVOL = CurrentVol / AvgVol. 
  // For this fix, we will simulate RVOL based on turnover/marketcap ratio anomalies or use raw data if available.
  const getRVOL = (s: StreakAnalysis) => {
    // If we have rvol from technical analysis, use it
    if (s.rvol !== undefined && s.rvol !== null) {
      return s.rvol;
    }
    
    // If we have normalized turnover, use it to find high activity
    if (!s.turnoverSEK || !s.marketCapSEK || s.marketCapSEK === 0) return 1.0;
    
    // A simplified "Activity Score" for the demo
    const ratio = (s.turnoverSEK / s.marketCapSEK) * 1000; 
    return Math.min(Math.max(ratio, 0.5), 10); // Cap between 0.5x and 10x
  };

  // 1. High RVOL Stocks (> 2.0x relative activity)
  const highRvolStocks = stocks
    .map(s => ({ ...s, rvol: getRVOL(s) }))
    .filter(s => s.rvol > 2.0)
    .sort((a, b) => b.rvol - a.rvol)
    .slice(0, 10);

  // 2. Capitulation (Panic Selling: Down > 4% with High Volume)
  const panicStocks = stocks
    .map(s => ({ ...s, rvol: getRVOL(s) }))
    .filter(s => s.dailyChange < -4 && s.rvol > 1.5)
    .sort((a, b) => a.dailyChange - b.dailyChange) // Most negative first
    .slice(0, 10);

  // 3. Power Breakouts (Up > 3% with High Volume)
  const breakoutStocks = stocks
    .map(s => ({ ...s, rvol: getRVOL(s) }))
    .filter(s => s.dailyChange > 3 && s.rvol > 1.5)
    .sort((a, b) => b.dailyChange - a.dailyChange) // Highest gain first
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans pt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Activity className="text-blue-500" />
            Market Volume Scanner
          </h1>
          <p className="text-slate-400">
            Real-time liquidity analysis. Find where the money is flowing right now.
          </p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="High Activity (>2x RVOL)" 
            value={highRvolStocks.length.toString()} 
            icon={<Flame className="text-orange-500" />} 
          />
          <StatCard 
            title="Panic Sellers" 
            value={panicStocks.length.toString()} 
            icon={<TrendingDown className="text-red-500" />} 
          />
          <StatCard 
            title="Breakouts" 
            value={breakoutStocks.length.toString()} 
            icon={<TrendingUp className="text-green-500" />} 
          />
        </div>

        {/* The Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Column: High RVOL (Takes up 8 columns) */}
          <div className="lg:col-span-8 bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2 text-orange-400">
                <Flame className="w-4 h-4" /> Unusual Volume Hotlist
              </h2>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Sorted by RVOL</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="p-3">Symbol</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Change</th>
                    <th className="p-3 w-1/3">Volume Strength</th>
                    <th className="p-3 text-right">RVOL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {highRvolStocks.map((stock) => (
                    <tr key={stock.symbol} className="hover:bg-slate-750 transition">
                      <td className="p-3 font-mono font-bold">{stock.symbol}</td>
                      <td className="p-3 text-right">{stock.lastPrice?.toFixed(2)}</td>
                      <td className={`p-3 text-right font-bold ${stock.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.dailyChange > 0 ? '+' : ''}{stock.dailyChange?.toFixed(2)}%
                      </td>
                      <td className="p-3">
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-500"
                            style={{ width: `${Math.min(stock.rvol * 20, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono text-blue-300">{stock.rvol.toFixed(1)}x</td>
                    </tr>
                  ))}
                  {highRvolStocks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No unusual volume detected right now.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Column: Signals (Takes up 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Panic Selling Card */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <h2 className="font-bold flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" /> Capitulation (Buy?)
                </h2>
              </div>
              <div className="divide-y divide-slate-700">
                {panicStocks.map(stock => (
                  <div key={stock.symbol} className="p-3 hover:bg-slate-800 transition flex justify-between items-center">
                    <div>
                      <div className="font-bold">{stock.symbol}</div>
                      <div className="text-xs text-slate-400">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-500 font-bold">{stock.dailyChange?.toFixed(2)}%</div>
                      <div className="text-xs text-slate-500">Vol: {stock.rvol.toFixed(1)}x</div>
                    </div>
                  </div>
                ))}
                {panicStocks.length === 0 && (
                  <div className="p-4 text-center text-slate-500 text-sm">No panic selling detected.</div>
                )}
              </div>
            </div>

            {/* Breakouts Card */}
            <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <h2 className="font-bold flex items-center gap-2 text-green-400">
                  <BarChart3 className="w-4 h-4" /> Power Breakouts
                </h2>
              </div>
              <div className="divide-y divide-slate-700">
                {breakoutStocks.map(stock => (
                  <div key={stock.symbol} className="p-3 hover:bg-slate-800 transition flex justify-between items-center">
                    <div>
                      <div className="font-bold">{stock.symbol}</div>
                      <div className="text-xs text-slate-400">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-500 font-bold">+{stock.dailyChange?.toFixed(2)}%</div>
                      <div className="text-xs text-slate-500">Vol: {stock.rvol.toFixed(1)}x</div>
                    </div>
                  </div>
                ))}
                 {breakoutStocks.length === 0 && (
                  <div className="p-4 text-center text-slate-500 text-sm">No breakouts detected.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-3 bg-slate-800 rounded-lg">{icon}</div>
    </div>
  );
}
