import { StreakAnalysis } from '../types/stock';
import { normalizeToSEK, Currency } from './currency';

// Global Cache Object - stores results outside function scope
interface CacheEntry {
  timestamp: number;
  data: StreakAnalysis[];
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (300,000 ms)

/**
 * Fetches stocks for a given country with client-side caching
 * @param country - The country code (sweden, usa, canada, norway, denmark, finland)
 * @param forceRefresh - If true, bypasses cache and fetches fresh data
 * @returns Promise<StreakAnalysis[]> - Array of normalized stock analyses
 */
export const fetchStocks = async (
  country: string,
  forceRefresh: boolean = false
): Promise<StreakAnalysis[]> => {
  const now = Date.now();

  // 1. Check Cache
  // If !forceRefresh AND cache exists for this country AND cache is younger than 5 minutes
  if (!forceRefresh && cache[country] && (now - cache[country].timestamp < CACHE_DURATION)) {
    console.log(`[Cache HIT] Returning cached data for ${country} (age: ${Math.round((now - cache[country].timestamp) / 1000)}s)`);
    return cache[country].data;
  }

  // 2. Fetch from API (cache miss or forceRefresh)
  console.log(`[Cache MISS] Fetching fresh data for ${country}${forceRefresh ? ' (force refresh)' : ''}`);
  
  try {
    const url = `/api/stocks?country=${country}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API error for ${country}:`, response.status, errorData);
      
      // Fallback: Return expired cache if available
      if (cache[country]) {
        console.log(`[Fallback] Using expired cache for ${country} due to API error`);
        return cache[country].data;
      }
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error(`Invalid data format for ${country}:`, data);
      
      // Fallback: Return expired cache if available
      if (cache[country]) {
        console.log(`[Fallback] Using expired cache for ${country} due to invalid data format`);
        return cache[country].data;
      }
      return [];
    }
    
    // 3. Validate and Normalize Data
    const normalizedStocks: StreakAnalysis[] = data
      .filter((stock: any) => {
        // Basic validation
        return (
          stock &&
          typeof stock === 'object' &&
          stock.symbol &&
          typeof stock.currentStreak === 'number' &&
          typeof stock.totalDecline === 'number' &&
          typeof stock.lastPrice === 'number' &&
          typeof stock.dailyChange === 'number' &&
          stock.currency
        );
      })
      .map((stock: any) => {
        // Ensure marketCapSEK and turnoverSEK are normalized
        // The API should already provide these, but we ensure they exist
        const currency = stock.currency as Currency;
        
        // If marketCapSEK is missing, calculate it from marketCap
        if (typeof stock.marketCapSEK !== 'number' || isNaN(stock.marketCapSEK)) {
          stock.marketCapSEK = stock.marketCap 
            ? normalizeToSEK(stock.marketCap, currency)
            : 0;
        }
        
        // If turnoverSEK is missing, calculate it from turnover
        if (typeof stock.turnoverSEK !== 'number' || isNaN(stock.turnoverSEK)) {
          stock.turnoverSEK = stock.turnover
            ? normalizeToSEK(stock.turnover, currency)
            : 0;
        }
        
        return stock as StreakAnalysis;
      });

    // 4. Save to Cache with current timestamp
    cache[country] = {
      timestamp: now,
      data: normalizedStocks,
    };
    
    console.log(`[Cache SAVED] Cached ${normalizedStocks.length} stocks for ${country}`);
    
    return normalizedStocks;
  } catch (error: any) {
    console.error(`Error fetching stocks for ${country}:`, error);
    
    // Fallback: Return expired cache if available
    if (cache[country]) {
      console.log(`[Fallback] Using expired cache for ${country} due to fetch error`);
      return cache[country].data;
    }
    
    return [];
  }
};

/**
 * Clears the cache for a specific country or all countries
 * @param country - Optional country code. If not provided, clears all cache.
 */
export const clearCache = (country?: string): void => {
  if (country) {
    delete cache[country];
    console.log(`[Cache CLEARED] Cleared cache for ${country}`);
  } else {
    Object.keys(cache).forEach(key => delete cache[key]);
    console.log(`[Cache CLEARED] Cleared all cache`);
  }
};

/**
 * Gets cache statistics for debugging
 */
export const getCacheStats = () => {
  const now = Date.now();
  return Object.keys(cache).map(country => ({
    country,
    age: Math.round((now - cache[country].timestamp) / 1000),
    isExpired: (now - cache[country].timestamp) >= CACHE_DURATION,
    count: cache[country].data.length,
  }));
};
