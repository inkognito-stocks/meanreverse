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
  lastPrice: number; // Current price
  dailyChange: number; // Daily change percentage
  zScore: number; // Z-score för att mäta extremitet (hur långt från medelvärdet)
  marketCap: number; // Market cap in original currency (raw value)
  turnover: number; // Average turnover in original currency (raw value)
  currency: 'SEK' | 'USD' | 'CAD' | 'EUR' | 'DKK' | 'NOK'; // Original currency
  marketCapSEK: number; // Market cap normalized to SEK (for filtering/sorting)
  turnoverSEK: number; // Average turnover normalized to SEK (for filtering/sorting)
}