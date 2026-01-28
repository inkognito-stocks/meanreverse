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
  avgTurnover20d: number;
  historicalHitRate: number; // Sannolikhet för grön dag efter n dagar
  lastPrice: number;
  dailyChange: number;
  zScore: number; // Z-score för att mäta extremitet (hur långt från medelvärdet)
}