import { NextResponse } from 'next/server';
import { analyzeStock } from '../../../lib/calculations';
import { fetchStockHistory, fetchStockInfo } from '../../../lib/googleFinance';
import { STOCK_LISTS } from '../../../lib/stockLists';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get('country') as 'sweden' | 'canada' | 'usa') || 'sweden';
  const capSize = (searchParams.get('capSize') as 'large' | 'mid' | 'small') || 'large';

  console.log(`API called with country: ${country}, capSize: ${capSize}`);

  try {
    const analyses = [];
    
    // Hämta rätt lista baserat på val
    const stockList = STOCK_LISTS[country]?.[capSize];
    
    if (!stockList || stockList.length === 0) {
      console.error(`No stock list found for country: ${country}, capSize: ${capSize}`);
      console.error('Available countries:', Object.keys(STOCK_LISTS));
      console.error(`Available capSizes for ${country}:`, STOCK_LISTS[country] ? Object.keys(STOCK_LISTS[country]) : 'none');
      return NextResponse.json(
        { error: 'No stocks found for selected criteria', country, capSize },
        { status: 404 }
      );
    }
    
    console.log(`Found ${stockList.length} stocks for ${country} ${capSize}`);
    console.log(`First 5 symbols:`, stockList.slice(0, 5));
    
    // Hämta data för de första 15 aktierna (för att undvika för många requests)
    const symbolsToFetch = stockList.slice(0, 15);
    
    console.log(`Processing ${symbolsToFetch.length} symbols`);

    let successCount = 0;
    let failCount = 0;

    for (const symbol of symbolsToFetch) {
      try {
        console.log(`Processing ${symbol} for ${country}...`);
        
        // Hämta historisk data (ca 1 år)
        const history = await fetchStockHistory(symbol, 252, country);
        
        if (!history || history.length < 30) {
          // Behöver minst 30 dagar för att göra analys
          console.log(`Skipping ${symbol}: insufficient history (${history?.length || 0} days)`);
          failCount++;
          continue;
        }

        // Hämta aktuell info för namn
        const info = await fetchStockInfo(symbol, country);
        
        // Analysera aktien (använd symbol som fallback om namn saknas)
        const analysis = analyzeStock(symbol, info.name || symbol, history);
        
        if (analysis) {
          analyses.push(analysis);
          successCount++;
          console.log(`✓ Successfully analyzed ${symbol} (${info.name})`);
        } else {
          console.log(`✗ Analysis returned null for ${symbol}`);
          failCount++;
        }
      } catch (error: any) {
        console.error(`Failed to analyze ${symbol}:`, error.message || error);
        failCount++;
        // Fortsätt med nästa aktie även om denna misslyckades
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
