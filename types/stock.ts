export interface DailyData {
    date: string;
    close: number;
    volume: number;
    turnover: number; // Omsättning i SEK/valuta
  }
  
export interface StreakAnalysis {
  symbol: string;
  name: string;
  currentStreak: number;
  totalDecline: number;
  lastPrice: number;      // REQUIRED
  dailyChange: number;    // REQUIRED
  marketCapSEK: number;   // REQUIRED (Normalized)
  turnoverSEK: number;    // REQUIRED (Normalized)
  historicalHitRate: number;
  zScore: number;
  currency: string;
}
