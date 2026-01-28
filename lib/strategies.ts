// Strategy Filter Logic
// Defines filtering functions for each trading strategy

import { StreakAnalysis } from '../types/stock';

export interface StrategyConfig {
  title: string;
  description: string;
  filter: (stock: StreakAnalysis) => boolean;
}

export const STRATEGIES: Record<string, StrategyConfig> = {
  'rsi-2': {
    title: 'RSI 2 Sniper',
    description: 'Köp när RSI(2) < 10. Sälj när priset går över SMA(5).',
    filter: (s: StreakAnalysis) => {
      const rsi2 = s.rsi2 ?? 100;
      return rsi2 < 10;
    },
  },
  'bollinger-squeeze': {
    title: 'Bollinger Squeeze',
    description: 'Låg volatilitet. Bandbredden är extremt liten.',
    filter: (s: StreakAnalysis) => {
      if (!s.bollingerUpper || !s.bollingerLower || !s.sma20 || s.sma20 === 0) {
        return false;
      }
      const bandwidth = (s.bollingerUpper - s.bollingerLower) / s.sma20;
      return bandwidth < 0.10; // Bandwidth less than 10% of SMA20
    },
  },
  'golden-cross': {
    title: 'Golden Cross',
    description: 'SMA50 > SMA200 (Bullish Trend).',
    filter: (s: StreakAnalysis) => {
      const sma50 = s.sma50 ?? 0;
      const sma200 = s.sma200 ?? 999999;
      return sma50 > sma200 && sma50 > 0 && sma200 > 0;
    },
  },
  'volume-breakout': {
    title: 'Volume Breakout',
    description: 'Volym > 200% av snittet + Pris upp.',
    filter: (s: StreakAnalysis) => {
      if (!s.avgVolume || s.avgVolume === 0) {
        return false;
      }
      // Check if current volume (turnoverSEK) is > 200% of average
      // Note: We use turnoverSEK as a proxy for volume since we have it normalized
      // In a real implementation, you'd want actual volume data
      const volumeRatio = s.turnoverSEK / s.avgVolume;
      return s.dailyChange > 0 && volumeRatio > 2.0;
    },
  },
  'trend-pullback': {
    title: 'Trend Pullback',
    description: 'Pris > SMA200 men RSI(14) < 30.',
    filter: (s: StreakAnalysis) => {
      const lastPrice = s.lastPrice ?? 0;
      const sma200 = s.sma200 ?? 0;
      const rsi14 = s.rsi14 ?? 100;
      return lastPrice > sma200 && sma200 > 0 && rsi14 < 30;
    },
  },
};

/**
 * Get strategy configuration by ID
 */
export function getStrategy(id: string): StrategyConfig | null {
  return STRATEGIES[id] || null;
}

/**
 * Get all available strategy IDs
 */
export function getStrategyIds(): string[] {
  return Object.keys(STRATEGIES);
}
