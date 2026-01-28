'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StockSelector, FilterValues } from '../../components/StockSelector';
import { StreakAnalysis } from '../../types/stock';
import { calculateAllIndicators } from '../../lib/ta';
import { fetchStockHistory } from '../../lib/googleFinance';
import { Flame, TrendingDown, TrendingUp, BarChart2 } from 'lucide-react';

interface VolumeStats {
  highRVOL: number;
  liquidityCrunch: number;
  capitalFlow: number; // Net volume flow (positive = more buying, negative = more selling)
}

export default function VolumePage() {
  const [allStocks, setAllStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    activeRegion: 'nordic',
    selectedCountries: ['sweden'],
    marketCapMin: 0,
    marketCapMax: 500000,
    minTurnover: 0,
  });

  // Fetch stocks and enrich with volume data
  const fetchStocks = useCallback(async (countries: string[]) => {
    setIsLoading(true);
    setAllStocks([]);
    console.log(`Fetching stocks for volume analysis: ${countries.join(', ')}`);
    
    try {
      const enrichedStocks: StreakAnalysis[] = [];

      for (const country of countries) {
        try {
          const url = `/api/stocks?country=${country}`;
          const response = await fetch(url);
          
          if (!response.ok) {
            continue;
          }
          
          const data = await response.json();
          
          if (Array.isArray(data) && data.length > 0) {
            // Process up to 30 stocks per country for volume analysis
            for (const stock of data.slice(0, 30)) {
              try {
                const history = await fetchStockHistory(stock.symbol, 252, country as any);
                
                if (!history || history.length < 20) {
                  continue;
                }

                // Calculate technical indicators including RVOL
                const indicators = calculateAllIndicators(history);
                
                // Merge with stock data
                const enrichedStock: StreakAnalysis = {
                  ...stock,
                  ...indicators,
                };

                enrichedStocks.push(enrichedStock);
              } catch (error) {
                console.error(`Error processing ${stock.symbol}:`, error);
                continue;
              }
            }
          }
        } catch (error: any) {
          console.error(`Error fetching ${country}:`, error);
          continue;
        }
      }

      // Remove duplicates
      const uniqueStocks = Array.from(
        new Map(enrichedStocks
          .filter((stock: any) => stock && stock.symbol)
          .map((stock: any) => [stock.symbol, stock]))
          .values()
      ) as StreakAnalysis[];
      
      console.log(`Total stocks for volume analysis: ${uniqueStocks.length}`);
      setAllStocks(uniqueStocks);
    } catch (error: any) {
      console.error('Error fetching stocks:', error);
      setAllStocks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback((filters: FilterValues) => {
    setCurrentFilters(filters);
    fetchStocks(filters.selectedCountries);
  }, [fetchStocks]);

  useEffect(() => {
    fetchStocks(['sweden']);
  }, [fetchStocks]);

  // Calculate stats
  const stats: VolumeStats = useMemo(() => {
    return {
      highRVOL: allStocks.filter(s => (s.rvol ?? 0) > 2.0).length,
      liquidityCrunch: allStocks.filter(s => (s.rvol ?? 0) < 0.5 && (s.avgVolume ?? 0) > 0).length,
      capitalFlow: allStocks.reduce((sum, s) => {
        const volume = s.turnoverSEK || 0;
        return sum + (s.dailyChange > 0 ? volume : -volume);
      }, 0),
    };
  }, [allStocks]);

  // Filter and sort for each scanner
  const unusualVolume = useMemo(() => {
    return allStocks
      .filter(s => (s.rvol ?? 0) > 2.0)
      .sort((a, b) => (b.rvol ?? 0) - (a.rvol ?? 0))
      .slice(0, 20);
  }, [allStocks]);

  const capitulation = useMemo(() => {
    return allStocks
      .filter(s => s.dailyChange < -4 && (s.rvol ?? 0) > 1.5)
      .sort((a, b) => a.dailyChange - b.dailyChange)
      .slice(0, 20);
  }, [allStocks]);

  const powerBreakouts = useMemo(() => {
    return allStocks
      .filter(s => s.dailyChange > 3 && (s.rvol ?? 0) > 1.5)
      .sort((a, b) => b.dailyChange - a.dailyChange)
      .slice(0, 20);
  }, [allStocks]);

  return (
    <main>
      <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans pt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Volym Analys</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Identifiera ovanlig volymaktivitet och kapitalflöden
            </p>
          </div>

          {/* Stock Selector */}
          <StockSelector onFilterChange={handleFilterChange} isLoading={isLoading} />

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-medium text-slate-400">High RVOL</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.highRVOL}</p>
              <p className="text-xs text-slate-500 mt-1">Volym > 200% av snittet</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 text-yellow-500" />
                <h3 className="text-sm font-medium text-slate-400">Liquidity Crunch</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.liquidityCrunch}</p>
              <p className="text-xs text-slate-500 mt-1">Volym < 50% av snittet</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <BarChart2 className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-medium text-slate-400">Capital Flow</h3>
              </div>
              <p className={`text-3xl font-bold ${stats.capitalFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.capitalFlow >= 0 ? '+' : ''}
                {(stats.capitalFlow / 1_000_000_000).toFixed(2)}B
              </p>
              <p className="text-xs text-slate-500 mt-1">Netto volymflöde (SEK)</p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-slate-400">Laddar volymdata...</p>
            </div>
          )}

          {/* Volume Scanners Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Scanner 1: Unusual Volume */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-900">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h2 className="text-lg font-bold text-white">Unusual Volume (RVOL)</h2>
                  </div>
                  <p className="text-xs text-slate-400">Volym > 2.0x snittet</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="text-left p-3 text-slate-400 font-medium">Symbol</th>
                        <th className="text-right p-3 text-slate-400 font-medium">Pris</th>
                        <th className="text-right p-3 text-slate-400 font-medium">Change</th>
                        <th className="text-right p-3 text-slate-400 font-medium">RVOL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unusualVolume.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-500 text-sm">
                            Inga matchningar
                          </td>
                        </tr>
                      ) : (
                        unusualVolume.map((stock) => (
                          <tr key={stock.symbol} className="border-t border-slate-700 hover:bg-slate-900/50">
                            <td className="p-3 font-bold text-white">{stock.symbol}</td>
                            <td className="p-3 text-right text-white">
                              {(stock.lastPrice ?? 0).toFixed(2)}
                            </td>
                            <td className={`p-3 text-right font-medium ${
                              (stock.dailyChange ?? 0) > 0 ? 'text-green-500' :
                              (stock.dailyChange ?? 0) < 0 ? 'text-red-500' :
                              'text-slate-400'
                            }`}>
                              {(stock.dailyChange ?? 0) > 0 ? '+' : ''}
                              {(stock.dailyChange ?? 0).toFixed(2)}%
                            </td>
                            <td className="p-3 text-right font-bold text-orange-500">
                              {(stock.rvol ?? 0).toFixed(1)}x
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Scanner 2: Capitulation */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-900">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-bold text-white">Capitulation (Panic Sell)</h2>
                  </div>
                  <p className="text-xs text-slate-400">Change < -4% + Volym > 1.5x</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="text-left p-3 text-slate-400 font-medium">Symbol</th>
                        <th className="text-right p-3 text-slate-400 font-medium">Pris</th>
                        <th className="text-right p-3 text-slate-400 font-medium">Change</th>
                        <th className="text-right p-3 text-slate-400 font-medium">RVOL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {capitulation.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-500 text-sm">
                            Inga matchningar
                          </td>
                        </tr>
                      ) : (
                        capitulation.map((stock) => (
                          <tr key={stock.symbol} className="border-t border-slate-700 hover:bg-slate-900/50">
                            <td className="p-3 font-bold text-white">{stock.symbol}</td>
                            <td className="p-3 text-right text-white">
                              {(stock.lastPrice ?? 0).toFixed(2)}
                            </td>
                            <td className="p-3 text-right font-bold text-red-500">
                              {(stock.dailyChange ?? 0).toFixed(2)}%
                            </td>
                            <td className="p-3 text-right text-slate-400">
                              {(stock.rvol ?? 0).toFixed(1)}x
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Scanner 3: Power Breakouts */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-900">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h2 className="text-lg font-bold text-white">Power Breakouts</h2>
                  </div>
                  <p className="text-xs text-slate-400">Change > 3% + Volym > 1.5x</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="text-left p-3 text-slate-400 font-medium">Symbol</th>
                        <th className="text-right p-3 text-slate-400 font-medium">Pris</th>
                        <th className="text-right p-3 text-slate-400 font-medium">Change</th>
                        <th className="text-right p-3 text-slate-400 font-medium">RVOL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {powerBreakouts.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-500 text-sm">
                            Inga matchningar
                          </td>
                        </tr>
                      ) : (
                        powerBreakouts.map((stock) => (
                          <tr key={stock.symbol} className="border-t border-slate-700 hover:bg-slate-900/50">
                            <td className="p-3 font-bold text-white">{stock.symbol}</td>
                            <td className="p-3 text-right text-white">
                              {(stock.lastPrice ?? 0).toFixed(2)}
                            </td>
                            <td className="p-3 text-right font-bold text-green-500">
                              +{(stock.dailyChange ?? 0).toFixed(2)}%
                            </td>
                            <td className="p-3 text-right text-slate-400">
                              {(stock.rvol ?? 0).toFixed(1)}x
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
