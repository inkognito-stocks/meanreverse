// Huvudsidan - Hämtar data från Google Finance

import { Dashboard } from '../components/Dashboard';
import { ServiceWorkerRegistration } from '../components/ServiceWorkerRegistration';
import { StreakAnalysis } from '../types/stock';
import { analyzeStock } from '../lib/calculations';
import { fetchStockHistory, fetchStockInfo } from '../lib/googleFinance';
import { 
  LARGE_CAP_STOCKS, 
  MID_CAP_STOCKS, 
  TECH_STOCKS, 
  BANK_STOCKS,
  INDUSTRIAL_STOCKS,
  ALL_STOCKS 
} from '../lib/stockLists';

async function getStockAnalyses(): Promise<StreakAnalysis[]> {
  const analyses: StreakAnalysis[] = [];
  
  // Välj vilken lista du vill använda:
  // - LARGE_CAP_STOCKS: Största aktierna (default)
  // - MID_CAP_STOCKS: Medelstora aktier
  // - TECH_STOCKS: Teknologiaktier
  // - BANK_STOCKS: Bankaktier
  // - INDUSTRIAL_STOCKS: Industriaktier
  // - ALL_STOCKS: Alla aktier kombinerat
  const selectedStockList = LARGE_CAP_STOCKS;
  
  // Hämta data för de första 10 aktierna (för att undvika för många requests)
  // Ändra detta nummer om du vill hämta fler/färre aktier
  const symbolsToFetch = selectedStockList.slice(0, 10);
  
  for (const symbol of symbolsToFetch) {
    try {
      // Hämta historisk data (ca 1 år)
      const history = await fetchStockHistory(symbol, 252);
      
      if (history.length < 30) {
        // Behöver minst 30 dagar för att göra analys
        continue;
      }

      // Hämta aktuell info för namn
      const info = await fetchStockInfo(symbol);
      
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
  
  return analyses.sort((a, b) => b.currentStreak - a.currentStreak);
}

export default async function Home() {
  let stocks: StreakAnalysis[] = [];
  
  try {
    stocks = await getStockAnalyses();
  } catch (error) {
    console.error('Error fetching stocks:', error);
    // Fallback till exempeldata om API-anropet misslyckas
    stocks = [
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
      {
        symbol: 'ASSA-B',
        name: 'Assa Abloy AB',
        currentStreak: 4,
        totalDecline: -6.3,
        avgTurnover20d: 180000000,
        historicalHitRate: 68,
        lastPrice: 312.75,
        dailyChange: -0.8,
      },
      {
        symbol: 'ERIC',
        name: 'Ericsson AB',
        currentStreak: 3,
        totalDecline: -4.1,
        avgTurnover20d: 320000000,
        historicalHitRate: 65,
        lastPrice: 58.20,
        dailyChange: -0.5,
      },
    ];
  }

  return (
    <main>
      <ServiceWorkerRegistration />
      <Dashboard stocks={stocks} />
    </main>
  );
}
