import { DailyData, StreakAnalysis } from '../types/stock';

export function analyzeStock(
  symbol: string, 
  name: string, 
  history: DailyData[], 
  minTurnover: number = 1000000
): StreakAnalysis | null {
  
  // 1. Volymfilter: Beräkna genomsnittlig omsättning senaste 20 dagarna
  const recent20 = history.slice(-20);
  const avgTurnover = recent20.reduce((acc, d) => acc + d.turnover, 0) / 20;
  
  if (avgTurnover < minTurnover) return null; // Filtrera bort illikvida aktier

  // 2. Beräkna nuvarande Down Streak
  let currentStreak = 0;
  const reversedHistory = [...history].reverse();
  
  for (let i = 0; i < reversedHistory.length - 1; i++) {
    if (reversedHistory[i].close < reversedHistory[i + 1].close) {
      currentStreak++;
    } else {
      break;
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
  const lastPrice = reversedHistory[0].close;
  const prevPrice = reversedHistory[1].close;
  const firstPriceInStreak = reversedHistory[currentStreak].close;

  return {
    symbol,
    name,
    currentStreak,
    avgTurnover20d: avgTurnover,
    historicalHitRate: Math.round(hitRate),
    lastPrice,
    dailyChange: ((lastPrice - prevPrice) / prevPrice) * 100,
    totalDecline: ((lastPrice - firstPriceInStreak) / firstPriceInStreak) * 100
  };
}