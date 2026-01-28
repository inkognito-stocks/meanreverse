import { DailyData, StreakAnalysis } from '../types/stock';
import { normalizeToSEK, Currency } from './currency';
import { calculateAllIndicators } from './ta';

export function analyzeStock(
  symbol: string, 
  name: string, 
  history: DailyData[], 
  minTurnover: number = 1000000,
  marketCap: number = 0,
  currency: Currency = 'SEK'
): StreakAnalysis | null {
  
  // 1. Volymfilter: Beräkna genomsnittlig omsättning senaste 20 dagarna
  const recent20 = history.slice(-20);
  const avgTurnover = recent20.reduce((acc, d) => acc + d.turnover, 0) / 20;
  
  // Normalize turnover to SEK for filtering
  const avgTurnoverSEK = normalizeToSEK(avgTurnover, currency);
  const minTurnoverSEK = normalizeToSEK(minTurnover, currency);
  
  if (avgTurnoverSEK < minTurnoverSEK) return null; // Filtrera bort illikvida aktier

  // 2. Beräkna nuvarande Down Streak
  let currentStreak = 0;
  const reversedHistory = [...history].reverse();
  
  // Säkerhetskontroll: behöver minst 2 datapunkter för att beräkna streak
  if (reversedHistory.length >= 2) {
    for (let i = 0; i < reversedHistory.length - 1; i++) {
      if (reversedHistory[i]?.close < reversedHistory[i + 1]?.close) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // 3. Beräkna Historisk Hit Rate för just denna streak-längd
  // "Hur ofta har den gått upp efter X röda dagar?"
  let occurrences = 0;
  let successes = 0;

  for (let i = 0; i < history.length - (currentStreak + 1); i++) {
    let isMatch = true;
    for (let j = 0; j < currentStreak; j++) {
      if (history[i + j + 1].close >= history[i + j].close) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      occurrences++;
      // Gick den upp dagen efter streaken bröts?
      if (history[i + currentStreak + 1].close > history[i + currentStreak].close) {
        successes++;
      }
    }
  }

  const hitRate = occurrences > 0 ? (successes / occurrences) * 100 : 0;
  const lastPrice = reversedHistory[0]?.close ?? 0;
  const prevPrice = reversedHistory[1]?.close ?? lastPrice; // Fallback till lastPrice om prevPrice saknas
  const firstPriceInStreak = reversedHistory[currentStreak]?.close ?? lastPrice; // Fallback om index saknas

  // 4. Beräkna Z-score för att mäta extremitet (hur långt från medelvärdet)
  // Använd senaste 20 dagarna för beräkning
  const prices = recent20.map(d => d.close).filter(p => p > 0); // Filtrera bort ogiltiga priser
  let zScore = 0;
  
  if (prices.length > 1 && lastPrice > 0) {
    const n = prices.length;
    const mean = prices.reduce((a, b) => a + b, 0) / n;
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    // Beräkna Z-score: (lastPrice - mean) / stdDev
    // Negativt värde betyder att priset är under medelvärdet
    zScore = stdDev > 0 ? (lastPrice - mean) / stdDev : 0;
  }

  // Säkerhetskontroller för division med noll
  const dailyChange = prevPrice > 0 ? ((lastPrice - prevPrice) / prevPrice) * 100 : 0;
  const totalDecline = firstPriceInStreak > 0 ? ((lastPrice - firstPriceInStreak) / firstPriceInStreak) * 100 : 0;

  // Normalize market cap to SEK
  const marketCapSEK = normalizeToSEK(marketCap, currency);

  // Calculate technical indicators
  const indicators = calculateAllIndicators(history);

  return {
    symbol,
    name,
    currentStreak,
    totalDecline,
    lastPrice,
    dailyChange,
    marketCapSEK: marketCapSEK, // REQUIRED: Normalized to SEK for filtering/sorting
    turnoverSEK: avgTurnoverSEK, // REQUIRED: Normalized to SEK for filtering/sorting
    historicalHitRate: Math.round(hitRate),
    zScore: Math.round(zScore * 10) / 10, // Avrunda till en decimal
    currency: currency,
    // Technical indicators
    ...indicators,
  };
}