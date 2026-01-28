'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dashboard } from '../../components/Dashboard';
import { StockSelector, FilterValues } from '../../components/StockSelector';
import { StreakAnalysis } from '../../types/stock';

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

  // Fetch data whenever countries change
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setStocks([]); // Clear previous data
      console.log(`Fetching stocks for: ${filters.selectedCountries.join(', ')}`);
      
      try {
        const allStocks: StreakAnalysis[] = [];

        // Fetch stocks for each selected country
        for (const country of filters.selectedCountries) {
          try {
            const url = `/api/stocks?country=${country}`;
            console.log(`Fetching from: ${url}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error(`API error for ${country}:`, response.status, errorData);
              continue; // Continue with next country
            }
            
            const data = await response.json();
            console.log(`Received ${data.length} stocks from ${country}`);
            
            if (Array.isArray(data) && data.length > 0) {
              // Validate that each stock has all required fields
              const validStocks = data.filter((stock: any) => 
                stock && 
                typeof stock === 'object' &&
                stock.symbol &&
                typeof stock.currentStreak === 'number' &&
                typeof stock.totalDecline === 'number'
              );
              console.log(`Valid stocks: ${validStocks.length} out of ${data.length} for ${country}`);
              allStocks.push(...validStocks);
            } else {
              console.log(`No stocks returned for ${country}`);
            }
          } catch (error: any) {
            console.error(`Error fetching ${country}:`, error);
            // Continue with next country even if this one failed
            continue;
          }
        }

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
    };

    loadData();
  }, [filters.selectedCountries]); // Re-fetch only when countries change

  // Handle filter changes from StockSelector
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    // The useEffect above will trigger when selectedCountries changes
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    // Re-trigger fetch with current filters
    const loadData = async () => {
      setIsLoading(true);
      setStocks([]);
      
      try {
        const allStocks: StreakAnalysis[] = [];
        for (const country of filters.selectedCountries) {
          try {
            const response = await fetch(`/api/stocks?country=${country}`);
            if (!response.ok) continue;
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              const validStocks = data.filter((stock: any) => 
                stock && stock.symbol && typeof stock.currentStreak === 'number'
              );
              allStocks.push(...validStocks);
            }
          } catch (error) {
            console.error(`Error fetching ${country}:`, error);
          }
        }
        
        const uniqueStocks = Array.from(
          new Map(allStocks.map((stock: any) => [stock.symbol, stock])).values()
        ) as StreakAnalysis[];
        
        setStocks(uniqueStocks.sort((a, b) => (b.currentStreak ?? 0) - (a.currentStreak ?? 0)));
      } catch (error) {
        console.error('Error refreshing stocks:', error);
        setStocks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [filters.selectedCountries]);

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
