import { StreakAnalysis } from '../types/stock';

// Define the Cache Type
interface CacheEntry {
  timestamp: number;
  data: StreakAnalysis[];
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches stocks for a given country with caching support
 * @param country - The country code (sweden, usa, canada, etc.)
 * @param forceRefresh - If true, bypasses cache and fetches fresh data
 * @returns Promise<StreakAnalysis[]> - Array of stock analyses
 */
export const fetchStocks = async (
  country: string,
  forceRefresh: boolean = false
): Promise<StreakAnalysis[]> => {
  // 1. Check Cache
  const now = Date.now();
  if (!forceRefresh && cache[country] && (now - cache[country].timestamp < CACHE_DURATION)) {
    console.log(`Returning cached data for ${country}`);
    return cache[country].data;
  }

  // 2. Fetch Logic
  try {
    const url = `/api/stocks?country=${country}`;
    console.log(`Fetching stocks for ${country}${forceRefresh ? ' (force refresh)' : ''}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API error for ${country}:`, response.status, errorData);
      // Return cached data if available, even if expired
      if (cache[country]) {
        console.log(`Using expired cache for ${country} due to API error`);
        return cache[country].data;
      }
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error(`Invalid data format for ${country}:`, data);
      // Return cached data if available
      if (cache[country]) {
        console.log(`Using expired cache for ${country} due to invalid data format`);
        return cache[country].data;
      }
      return [];
    }
    
    // Validate and normalize data
    const validStocks = data.filter((stock: any) => 
      stock && 
      typeof stock === 'object' &&
      stock.symbol &&
      typeof stock.currentStreak === 'number' &&
      typeof stock.totalDecline === 'number'
    ) as StreakAnalysis[];
    
    // 3. Save to Cache
    cache[country] = { timestamp: now, data: validStocks };
    console.log(`Cached ${validStocks.length} stocks for ${country}`);
    
    return validStocks;
  } catch (error: any) {
    console.error(`Error fetching stocks for ${country}:`, error);
    // Return cached data if available, even if expired
    if (cache[country]) {
      console.log(`Using expired cache for ${country} due to fetch error`);
      return cache[country].data;
    }
    return [];
  }
};
