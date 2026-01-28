'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { ServiceWorkerRegistration } from '../components/ServiceWorkerRegistration';
import { StockSelector } from '../components/StockSelector';
import { StreakAnalysis } from '../types/stock';
import { analyzeStock } from '../lib/calculations';
import { fetchStockHistory, fetchStockInfo } from '../lib/googleFinance';
import { STOCK_LISTS } from '../lib/stockLists';

export default function Home() {
  const [stocks, setStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<'sweden' | 'canada' | 'usa'>('sweden');
  const [selectedCapSize, setSelectedCapSize] = useState<'large' | 'mid' | 'small'>('large');

  const fetchStocks = async (country: 'sweden' | 'canada' | 'usa', capSize: 'large' | 'mid' | 'small') => {
    setIsLoading(true);
    const analyses: StreakAnalysis[] = [];

    try {
      // Hämta rätt lista baserat på val
      const stockList = STOCK_LISTS[country][capSize];
      
      // Hämta data för de första 15 aktierna (för att undvika för många requests)
      const symbolsToFetch = stockList.slice(0, 15);

      for (const symbol of symbolsToFetch) {
        try {
          // Hämta historisk data (ca 1 år)
          const history = await fetchStockHistory(symbol, 252, country);
          
          if (history.length < 30) {
            // Behöver minst 30 dagar för att göra analys
            continue;
          }

          // Hämta aktuell info för namn
          const info = await fetchStockInfo(symbol, country);
          
          // Analysera aktien
          const analysis = analyzeStock(symbol, info.name, history);
          
          if (analysis) {
            analyses.push(analysis);
          }
        } catch (error) {
          console.error(`Failed to analyze ${symbol}:`, error);
          // Fortsätt med nästa aktie även om denna misslyckades
          continue;
        }
      }

      setStocks(analyses.sort((a, b) => b.currentStreak - a.currentStreak));
    } catch (error) {
      console.error('Error fetching stocks:', error);
      // Fallback till exempeldata om API-anropet misslyckas
      setStocks([
        {
          symbol: 'VOLV-B',
          name: 'Volvo AB',
          currentStreak: 5,
          totalDecline: -8.5,
          avgTurnover20d: 250000000,
          historicalHitRate: 72,
          lastPrice: 245.50,
          dailyChange: -1.2,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks(selectedCountry, selectedCapSize);
  }, []); // Kör endast vid första laddningen

  const handleSelectionChange = (country: 'sweden' | 'canada' | 'usa', capSize: 'large' | 'mid' | 'small') => {
    setSelectedCountry(country);
    setSelectedCapSize(capSize);
    fetchStocks(country, capSize);
  };

  return (
    <main>
      <ServiceWorkerRegistration />
      <div className="min-h-screen bg-[#0f172a] text-white p-3 sm:p-6 font-sans">
        <StockSelector onSelect={handleSelectionChange} isLoading={isLoading} />
        <Dashboard stocks={stocks} />
      </div>
    </main>
  );
}
