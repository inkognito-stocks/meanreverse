// Hämtar aktiedata från Google Finance / Yahoo Finance
import { DailyData } from '../types/stock';

// Konverterar aktiesymboler till Yahoo Finance-format
// Sverige: VOLV-B -> VOLV-B.ST
// Kanada: RY.TO -> RY.TO (redan korrekt)
// USA: AAPL -> AAPL (ingen ändring)
function toYahooSymbol(symbol: string, country: 'sweden' | 'canada' | 'usa' = 'sweden'): string {
  if (symbol.includes('.')) {
    return symbol; // Redan i rätt format (t.ex. RY.TO eller VOLV-B.ST)
  }
  
  // Lägg till börs-suffix baserat på land
  switch (country) {
    case 'sweden':
      return `${symbol}.ST`; // Stockholmsbörsen
    case 'canada':
      return `${symbol}.TO`; // Toronto Stock Exchange
    case 'usa':
      return symbol; // USA behöver inget suffix
    default:
      return `${symbol}.ST`; // Default till Sverige
  }
}

// Hämtar historisk data från Yahoo Finance API
export async function fetchStockHistory(
  symbol: string,
  period: number = 252, // Antal dagar (ca 1 år)
  country: 'sweden' | 'canada' | 'usa' = 'sweden'
): Promise<DailyData[]> {
  const yahooSymbol = toYahooSymbol(symbol, country);
  
  try {
    // Använd Yahoo Finance API
    // För Next.js server-side kan vi använda direkt API-anrop
    // För client-side behöver vi använda API route (/api/finance)
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - (period * 24 * 60 * 60);
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?period1=${startDate}&period2=${endDate}&interval=1d`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      // Lägg till cache för att undvika för många requests
      next: { revalidate: 3600 }, // Cache i 1 timme
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${symbol}`);
    }

    const data = await response.json();
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error(`No data found for ${symbol}`);
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];
    const volumes = result.indicators?.quote?.[0]?.volume || [];
    const highs = result.indicators?.quote?.[0]?.high || [];
    const lows = result.indicators?.quote?.[0]?.low || [];

    const dailyData: DailyData[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const date = new Date(timestamps[i] * 1000);
      const close = closes[i];
      const volume = volumes[i] || 0;
      const high = highs[i] || close;
      const low = lows[i] || close;
      
      // Beräkna omsättning (turnover) som genomsnittlig pris * volym
      // För svenska aktier är detta en approximation
      const avgPrice = (high + low + close) / 3;
      const turnover = avgPrice * volume;

      if (close && !isNaN(close)) {
        dailyData.push({
          date: date.toISOString().split('T')[0],
          close: close,
          volume: volume,
          turnover: turnover,
        });
      }
    }

    return dailyData.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
}

// Hämtar aktuell information om en aktie
export async function fetchStockInfo(
  symbol: string,
  country: 'sweden' | 'canada' | 'usa' = 'sweden'
): Promise<{
  name: string;
  price: number;
  change: number;
  changePercent: number;
}> {
  const yahooSymbol = toYahooSymbol(symbol, country);
  
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache i 5 minuter för aktuell info
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch info for ${symbol}`);
    }

    const data = await response.json();
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error(`No data found for ${symbol}`);
    }

    const result = data.chart.result[0];
    const meta = result.meta || {};
    const closes = result.indicators?.quote?.[0]?.close || [];
    const currentPrice = closes[closes.length - 1] || meta.regularMarketPrice || 0;
    const previousClose = meta.previousClose || currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      name: meta.longName || meta.shortName || symbol,
      price: currentPrice,
      change: change,
      changePercent: changePercent,
    };
  } catch (error) {
    console.error(`Error fetching info for ${symbol}:`, error);
    throw error;
  }
}

// Importera aktielistor från separat fil
export { 
  SWEDISH_LARGE_CAP_SYMBOLS,
  LARGE_CAP_STOCKS,
  MID_CAP_STOCKS,
  TECH_STOCKS,
  BANK_STOCKS,
  INDUSTRIAL_STOCKS,
  CONSUMER_STOCKS,
  REAL_ESTATE_STOCKS,
  ALL_STOCKS
} from './stockLists';
