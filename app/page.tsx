'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dashboard } from '../components/Dashboard';
import { ServiceWorkerRegistration } from '../components/ServiceWorkerRegistration';
import { StockSelector } from '../components/StockSelector';
import { StreakAnalysis } from '../types/stock';

export default function Home() {
  const [stocks, setStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCountries, setCurrentCountries] = useState<('sweden' | 'norway' | 'denmark' | 'finland' | 'canada' | 'usa')[]>(['sweden']);
  const [currentCapSizes, setCurrentCapSizes] = useState<('large' | 'mid' | 'small')[]>(['large']);

  // Använd useCallback för att stabilisera fetchStocks och undvika oändlig loop
  const fetchStocks = useCallback(async (
    countries: ('sweden' | 'norway' | 'denmark' | 'finland' | 'canada' | 'usa')[],
    capSizes: ('large' | 'mid' | 'small')[]
  ) => {
    setIsLoading(true);
    // Rensa gamla aktier när nya hämtas för att undvika att visa fel data
    setStocks([]);
    console.log(`Fetching stocks for: ${countries.join(', ')} - ${capSizes.join(', ')}`);
    
    try {
      const allStocks: StreakAnalysis[] = [];

      // Hämta aktier för varje kombination av land och kapitalstorlek
      for (const country of countries) {
        for (const capSize of capSizes) {
          try {
            const url = `/api/stocks?country=${country}&capSize=${capSize}`;
            console.log(`Fetching from: ${url}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error(`API error for ${country} ${capSize}:`, response.status, errorData);
              continue; // Fortsätt med nästa kombination
            }
            
            const data = await response.json();
            console.log(`Received ${data.length} stocks from ${country} ${capSize}`);
            
            if (Array.isArray(data) && data.length > 0) {
              // Validera att varje stock har alla nödvändiga fält
              const validStocks = data.filter((stock: any) => 
                stock && 
                typeof stock === 'object' &&
                stock.symbol &&
                typeof stock.currentStreak === 'number' &&
                typeof stock.totalDecline === 'number'
              );
              console.log(`Valid stocks: ${validStocks.length} out of ${data.length} for ${country} ${capSize}`);
              console.log(`Sample symbols:`, validStocks.slice(0, 3).map((s: any) => s.symbol));
              allStocks.push(...validStocks);
            } else {
              console.log(`No stocks returned for ${country} ${capSize}`);
            }
          } catch (error: any) {
            console.error(`Error fetching ${country} ${capSize}:`, error);
            // Fortsätt med nästa kombination även om denna misslyckades
            continue;
          }
        }
      }

      // Sortera alla aktier efter streak och ta bort dubbletter baserat på symbol
      const uniqueStocks = Array.from(
        new Map(allStocks
          .filter((stock: any) => stock && stock.symbol)
          .map((stock: any) => [stock.symbol, stock]))
          .values()
      ) as StreakAnalysis[];
      
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
  }, []); // Empty dependency array - funktionen behöver inte återskapas

  // Använd useCallback för att stabilisera funktionsreferensen och undvika oändlig loop
  const handleSelectionChange = useCallback((
    countries: ('sweden' | 'norway' | 'denmark' | 'finland' | 'canada' | 'usa')[],
    capSizes: ('large' | 'mid' | 'small')[]
  ) => {
    setCurrentCountries(countries);
    setCurrentCapSizes(capSizes);
    fetchStocks(countries, capSizes);
  }, [fetchStocks]); // fetchStocks är nu stabiliserad med useCallback

  // Använd useCallback för refresh-funktionen för att undvika oändlig loop
  const handleRefresh = useCallback(() => {
    // Trigger refresh by re-fetching with current selections
    fetchStocks(currentCountries, currentCapSizes);
  }, [fetchStocks, currentCountries, currentCapSizes]);

  useEffect(() => {
    // Initial load med default values
    fetchStocks(['sweden'], ['large']);
  }, [fetchStocks]); // fetchStocks är nu stabiliserad med useCallback

  return (
    <main>
      <ServiceWorkerRegistration />
      <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans">
        <StockSelector onSelect={handleSelectionChange} isLoading={isLoading} />
        <Dashboard 
          stocks={stocks} 
          isLoading={isLoading} 
          onRefresh={handleRefresh}
        />
      </div>
    </main>
  );
}
