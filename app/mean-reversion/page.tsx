'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dashboard } from '../../components/Dashboard';
import { StockSelector, FilterValues } from '../../components/StockSelector';
import { StreakAnalysis } from '../../types/stock';
import { fetchStocks } from '../../lib/borsdata';

export default function MeanReversionPage() {
  const [stocks, setStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default Filter State
  const [filters, setFilters] = useState<FilterValues>({
    activeRegion: 'nordic',
    selectedCountries: ['sweden'],
    marketCapMin: 0,
    marketCapMax: 500000,
    minTurnover: 0,
  });

  // Fetch data function with caching support
  const loadData = useCallback(async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    if (forceRefresh) {
      setStocks([]); // Clear previous data on force refresh
    }
    console.log(`Loading stocks for: ${filters.selectedCountries.join(', ')}${forceRefresh ? ' (force refresh)' : ''}`);
    
    try {
      const promises = filters.selectedCountries.map(c => fetchStocks(c, forceRefresh));
      const results = await Promise.all(promises);
      const allStocks = results.flat();

      // Remove duplicates based on symbol
      const uniqueStocks = Array.from(
        new Map(allStocks
          .filter((stock: any) => stock && stock.symbol)
          .map((stock: any) => [stock.symbol, stock]))
          .values()
      ) as StreakAnalysis[];
      
      // Sort by streak (default)
      const sortedStocks = uniqueStocks.sort((a, b) => {
        const aStreak = a?.currentStreak ?? 0;
        const bStreak = b?.currentStreak ?? 0;
        return bStreak - aStreak;
      });
      
      console.log(`Total unique stocks: ${sortedStocks.length}`);
      setStocks(sortedStocks);
    } catch (error: any) {
      console.error('Error fetching stocks:', error);
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.selectedCountries]);

  // Fetch data whenever countries change (use cached data)
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Handle filter changes from StockSelector
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    // The useEffect above will trigger when selectedCountries changes
  }, []);

  // Refresh handler (force refresh, bypass cache)
  const handleRefresh = useCallback(() => {
    // Force refresh by calling loadData with forceRefresh = true
    // This will call fetchStocks(country, true) for each country to bypass cache
    loadData(true);
  }, [loadData]);

  return (
    <main>
      <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans pt-20">
        <StockSelector 
          onFilterChange={handleFilterChange} 
          isLoading={isLoading}
        />
        
        {/* Pass the numeric filters to Dashboard so it can filter the list locally */}
        <Dashboard 
          stocks={stocks} 
          isLoading={isLoading} 
          filters={filters}
          onRefresh={handleRefresh}
        />
      </div>
    </main>
  );
}
