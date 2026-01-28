import { NextResponse } from 'next/server';
import { analyzeStock } from '../../../lib/calculations';
import { fetchStockHistory, fetchStockInfo } from '../../../lib/googleFinance';
import { STOCK_LISTS } from '../../../lib/stockLists';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get('country') as 'sweden' | 'canada' | 'usa') || 'sweden';
  const capSize = (searchParams.get('capSize') as 'large' | 'mid' | 'small') || 'large';

  try {
    const analyses = [];
    
    // Hämta rätt lista baserat på val
    const stockList = STOCK_LISTS[country]?.[capSize];
    
    if (!stockList || stockList.length === 0) {
      console.error(`No stock list found for country: ${country}, capSize: ${capSize}`);
      return NextResponse.json(
        { error: 'No stocks found for selected criteria', country, capSize },
        { status: 404 }
      );
    }
    
    console.log(`Fetching ${stockList.length} stocks for ${country} ${capSize}`);
    
    // Hämta data för de första 15 aktierna (för att undvika för många requests)
    const symbolsToFetch = stockList.slice(0, 15);
    
    console.log(`Processing ${symbolsToFetch.length} symbols:`, symbolsToFetch.slice(0, 5));

    for (const symbol of symbolsToFetch) {
      try {
        // Hämta historisk data (ca 1 år)
        const history = await fetchStockHistory(symbol, 252, country);
        
        if (!history || history.length < 30) {
          // Behöver minst 30 dagar för att göra analys
          console.log(`Skipping ${symbol}: insufficient history (${history?.length || 0} days)`);
          continue;
        }

        // Hämta aktuell info för namn
        const info = await fetchStockInfo(symbol, country);
        
        // Analysera aktien
        const analysis = analyzeStock(symbol, info.name, history);
        
        if (analysis) {
          analyses.push(analysis);
          console.log(`✓ Successfully analyzed ${symbol}`);
        } else {
          console.log(`✗ Analysis returned null for ${symbol}`);
        }
      } catch (error: any) {
        console.error(`Failed to analyze ${symbol}:`, error.message || error);
        // Fortsätt med nästa aktie även om denna misslyckades
        continue;
      }
    }

    console.log(`Returning ${analyses.length} analyses`);
    return NextResponse.json(analyses.sort((a, b) => b.currentStreak - a.currentStreak));
  } catch (error: any) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}
