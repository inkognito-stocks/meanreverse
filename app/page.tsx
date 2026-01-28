'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { ServiceWorkerRegistration } from '../components/ServiceWorkerRegistration';
import { StockSelector } from '../components/StockSelector';
import { StreakAnalysis } from '../types/stock';

export default function Home() {
  const [stocks, setStocks] = useState<StreakAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<'sweden' | 'canada' | 'usa'>('sweden');
  const [selectedCapSize, setSelectedCapSize] = useState<'large' | 'mid' | 'small'>('large');

  const fetchStocks = async (country: 'sweden' | 'canada' | 'usa', capSize: 'large' | 'mid' | 'small') => {
    setIsLoading(true);
    
    try {
      // Använd API route för att hämta aktier (undviker CORS-problem)
      const response = await fetch(`/api/stocks?country=${country}&capSize=${capSize}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', response.status, errorData);
        throw new Error(errorData.error || `Failed to fetch stocks: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setStocks(data);
      } else {
        console.warn('No stocks returned from API');
        setStocks([]);
      }
    } catch (error: any) {
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
        <Dashboard stocks={stocks} isLoading={isLoading} />
      </div>
    </main>
  );
}
