import { NextResponse } from 'next/server';
import { analyzeStock } from '../../../lib/calculations';
import { fetchStockHistory, fetchStockInfo } from '../../../lib/googleFinance';
import { STOCK_LISTS } from '../../../lib/stockLists';

// Get all stocks for a country (including TSXV/CSE for Canada)
function getAllStocksForCountry(country: 'sweden' | 'norway' | 'denmark' | 'finland' | 'canada' | 'usa'): string[] {
  const countryLists = STOCK_LISTS[country];
  if (!countryLists) return [];
  
  // For Canada, include TSXV and CSE
  if (country === 'canada') {
    // Type guard: check if 'all' property exists (only Canada has it)
    const canadaLists = countryLists as typeof countryLists & { all?: string[]; tsxv?: string[]; cse?: string[] };
    return canadaLists.all || [
      ...(countryLists.large || []),
      ...(countryLists.mid || []),
      ...(countryLists.small || []),
      ...(canadaLists.tsxv || []),
      ...(canadaLists.cse || []),
    ];
  }
  
  // For other countries, combine all cap sizes
  return [
    ...(countryLists.large || []),
    ...(countryLists.mid || []),
    ...(countryLists.small || []),
  ];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get('country') as 'sweden' | 'norway' | 'denmark' | 'finland' | 'canada' | 'usa') || 'sweden';

  console.log(`API called with country: ${country} (no server-side filtering - done client-side)`);

  try {
    const analyses = [];
    
    // Get all stocks for the country (including TSXV/CSE for Canada)
    const allStocks = getAllStocksForCountry(country);
    
    if (allStocks.length === 0) {
      console.error(`No stocks found for country: ${country}`);
      return NextResponse.json(
        { error: 'No stocks found for selected country', country },
        { status: 404 }
      );
    }
    
    console.log(`Found ${allStocks.length} total stocks for ${country}`);
    
    // Limit to first 100 stocks to avoid too many requests (increased since filtering is client-side)
    const symbolsToFetch = allStocks.slice(0, 100);
    
    console.log(`Processing ${symbolsToFetch.length} symbols`);

    let successCount = 0;
    let failCount = 0;

    for (const symbol of symbolsToFetch) {
      try {
        console.log(`Processing ${symbol} for ${country}...`);
        
        // Fetch current info first to get market cap and currency
        const info = await fetchStockInfo(symbol, country);
        
        // Safety check: ensure currency exists
        if (!info.currency) {
          console.log(`Skipping ${symbol}: missing currency`);
          failCount++;
          continue;
        }
        
        // Fetch historical data (ca 1 year)
        const history = await fetchStockHistory(symbol, 252, country);
        
        if (!history || history.length < 30) {
          // Need at least 30 days for analysis
          console.log(`Skipping ${symbol}: insufficient history (${history?.length || 0} days)`);
          failCount++;
          continue;
        }

        // Analyze the stock (pass market cap and currency)
        const analysis = analyzeStock(symbol, info.name || symbol, history, 1000000, info.marketCap || 0, info.currency);
        
        if (!analysis) {
          console.log(`✗ Analysis returned null for ${symbol}`);
          failCount++;
          continue;
        }
        
        // Safety check: ensure marketCapSEK exists and is a valid number
        if (typeof analysis.marketCapSEK !== 'number' || isNaN(analysis.marketCapSEK)) {
          console.log(`Skipping ${symbol}: invalid marketCapSEK (${analysis.marketCapSEK})`);
          failCount++;
          continue;
        }
        
        // Add to results (no server-side filtering - done client-side)
        analyses.push(analysis);
        successCount++;
        console.log(`✓ Successfully analyzed ${symbol} (${info.name}) - Market Cap: ${(analysis.marketCapSEK / 1_000_000_000).toFixed(2)}B SEK`);
      } catch (error: any) {
        console.error(`Failed to analyze ${symbol}:`, error.message || error);
        failCount++;
        // Continue with next stock even if this one failed
        continue;
      }
    }

    console.log(`Completed: ${successCount} successful, ${failCount} failed, returning ${analyses.length} analyses`);
    return NextResponse.json(analyses.sort((a, b) => b.currentStreak - a.currentStreak));
  } catch (error: any) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}
