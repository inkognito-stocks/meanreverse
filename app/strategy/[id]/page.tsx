'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Dashboard } from '../../../components/Dashboard';
import { StockSelector, FilterValues } from '../../../components/StockSelector';
import { StreakAnalysis } from '../../../types/stock';
import { getStrategy } from '../../../lib/strategies';
import { calculateAllIndicators } from '../../../lib/ta';
import { fetchStockHistory } from '../../../lib/googleFinance';

export default function StrategyDetailPage() {
  const params = useParams();
  const strategyId = params?.id as string;
  
  const [stocks, setStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    activeRegion: 'nordic',
    selectedCountries: ['sweden'],
    marketCapMin: 0,
    marketCapMax: 500000,
    minTurnover: 0,
  });

  const strategy = getStrategy(strategyId || '');

  // Fetch stocks and calculate technical indicators
  const fetchStocks = useCallback(async (countries: string[]) => {
    if (!strategy) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setStocks([]);
    console.log(`Fetching stocks for strategy: ${strategyId}, countries: ${countries.join(', ')}`);
    
    try {
      const allStocks: StreakAnalysis[] = [];

      // Fetch stocks for each country
      for (const country of countries) {
        try {
          const url = `/api/stocks?country=${country}`;
          console.log(`Fetching from: ${url}`);
          
          const response = await fetch(url);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`API error for ${country}:`, response.status, errorData);
            continue;
          }
          
          const data = await response.json();
          console.log(`Received ${data.length} stocks from ${country}`);
          
          if (Array.isArray(data) && data.length > 0) {
            // For each stock, fetch history and calculate technical indicators
            // Limit to 20 stocks per country to avoid too many API calls (each needs history fetch)
            for (const stock of data.slice(0, 20)) {
              try {
                // Fetch full history for TA calculations
                const history = await fetchStockHistory(stock.symbol, 252, country as any);
                
                if (!history || history.length < 50) {
                  continue; // Skip if insufficient history
                }

                // Calculate technical indicators
                const indicators = calculateAllIndicators(history);
                
                // Merge indicators with stock data
                const enrichedStock: StreakAnalysis = {
                  ...stock,
                  ...indicators,
                };

                // Apply strategy filter
                if (strategy.filter(enrichedStock)) {
                  allStocks.push(enrichedStock);
                  console.log(`✓ ${stock.symbol} matches ${strategyId} filter`);
                }
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

      // Remove duplicates and sort
      const uniqueStocks = Array.from(
        new Map(allStocks
          .filter((stock: any) => stock && stock.symbol)
          .map((stock: any) => [stock.symbol, stock]))
          .values()
      ) as StreakAnalysis[];
      
      console.log(`Total filtered stocks for ${strategyId}: ${uniqueStocks.length}`);
      setStocks(uniqueStocks);
    } catch (error: any) {
      console.error('Error fetching stocks:', error);
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  }, [strategyId, strategy]);

  const handleFilterChange = useCallback((filters: FilterValues) => {
    setCurrentFilters(filters);
    fetchStocks(filters.selectedCountries);
  }, [fetchStocks]);

  const handleRefresh = useCallback(() => {
    fetchStocks(currentFilters.selectedCountries);
  }, [fetchStocks, currentFilters]);

  useEffect(() => {
    if (strategy) {
      fetchStocks(['sweden']);
    }
  }, [strategy, fetchStocks]);

  if (!strategy) {
    return (
      <main>
        <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Strategi hittades inte</h1>
            <p className="text-slate-400">Strategin "{strategyId}" finns inte.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans pt-20">
        {/* Strategy Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{strategy.title}</h1>
          <p className="text-slate-400 text-sm sm:text-base">{strategy.description}</p>
        </div>

        <StockSelector onFilterChange={handleFilterChange} isLoading={isLoading} />
        <Dashboard 
          stocks={stocks} 
          isLoading={isLoading} 
          onRefresh={handleRefresh}
          filters={currentFilters}
        />
      </div>
    </main>
  );
}
