'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { ServiceWorkerRegistration } from '../components/ServiceWorkerRegistration';
import { StockSelector } from '../components/StockSelector';
import { StreakAnalysis } from '../types/stock';

export default function Home() {
  const [stocks, setStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCountries, setCurrentCountries] = useState<('sweden' | 'canada' | 'usa')[]>(['sweden']);
  const [currentCapSizes, setCurrentCapSizes] = useState<('large' | 'mid' | 'small')[]>(['large']);

  const fetchStocks = async (
    countries: ('sweden' | 'canada' | 'usa')[],
    capSizes: ('large' | 'mid' | 'small')[]
  ) => {
    setIsLoading(true);
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
              allStocks.push(...data);
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
        new Map(allStocks.map(stock => [stock.symbol, stock])).values()
      );
      
      const sortedStocks = uniqueStocks.sort((a, b) => b.currentStreak - a.currentStreak);
      
      console.log(`Total unique stocks: ${sortedStocks.length}`);
      setStocks(sortedStocks);
    } catch (error: any) {
      console.error('Error fetching stocks:', error);
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (
    countries: ('sweden' | 'canada' | 'usa')[],
    capSizes: ('large' | 'mid' | 'small')[]
  ) => {
    setCurrentCountries(countries);
    setCurrentCapSizes(capSizes);
    fetchStocks(countries, capSizes);
  };

  useEffect(() => {
    // Initial load med default values
    fetchStocks(['sweden'], ['large']);
  }, []); // Kör endast vid första laddningen

  return (
    <main>
      <ServiceWorkerRegistration />
      <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans">
        <StockSelector onSelect={handleSelectionChange} isLoading={isLoading} />
        <Dashboard 
          stocks={stocks} 
          isLoading={isLoading} 
          onRefresh={() => {
            // Trigger refresh by re-fetching with current selections
            fetchStocks(currentCountries, currentCapSizes);
          }}
        />
      </div>
    </main>
  );
}
