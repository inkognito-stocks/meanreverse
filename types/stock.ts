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
  // Technical indicators (optional)
  rsi2?: number;
  rsi14?: number;
  sma20?: number;
  sma50?: number;
  sma200?: number;
  bollingerUpper?: number;
  bollingerLower?: number;
  bollingerMiddle?: number;
  avgVolume?: number;
}
