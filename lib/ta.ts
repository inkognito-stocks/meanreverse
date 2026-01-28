// Technical Analysis Functions
// Calculate various technical indicators from price history

import { DailyData } from '../types/stock';

/**
 * Calculate RSI (Relative Strength Index)
 * @param prices Array of closing prices
 * @param period Period for RSI calculation (default: 14)
 * @returns RSI value between 0-100
 */
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) {
    return 50; // Default neutral value if insufficient data
  }

  const recentPrices = prices.slice(-(period + 1));
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < recentPrices.length; i++) {
    const change = recentPrices[i] - recentPrices[i - 1];
    if (change > 0) {
      gains.push(change);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(change));
    }
  }

  const avgGain = gains.reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) return 100; // Avoid division by zero

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return Math.round(rsi * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate SMA (Simple Moving Average)
 * @param prices Array of closing prices
 * @param period Period for SMA calculation
 * @returns SMA value
 */
export function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) {
    return prices.length > 0 ? prices[prices.length - 1] : 0;
  }

  const recentPrices = prices.slice(-period);
  const sum = recentPrices.reduce((a, b) => a + b, 0);
  return sum / period;
}

/**
 * Calculate Bollinger Bands
 * @param prices Array of closing prices
 * @param period Period for calculation (default: 20)
 * @param stdDev Standard deviation multiplier (default: 2)
 * @returns Object with upper, middle (SMA), and lower bands
 */
export function calculateBollinger(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): { upper: number; middle: number; lower: number } {
  if (prices.length < period) {
    const lastPrice = prices.length > 0 ? prices[prices.length - 1] : 0;
    return { upper: lastPrice, middle: lastPrice, lower: lastPrice };
  }

  const sma = calculateSMA(prices, period);
  const recentPrices = prices.slice(-period);

  // Calculate standard deviation
  const variance = recentPrices.reduce((acc, price) => {
    return acc + Math.pow(price - sma, 2);
  }, 0) / period;

  const standardDeviation = Math.sqrt(variance);

  return {
    upper: sma + (standardDeviation * stdDev),
    middle: sma,
    lower: sma - (standardDeviation * stdDev),
  };
}

/**
 * Calculate average volume over a period
 * @param volumes Array of volume values
 * @param period Period for calculation
 * @returns Average volume
 */
export function calculateAverageVolume(volumes: number[], period: number): number {
  if (volumes.length < period) {
    return volumes.length > 0 
      ? volumes.reduce((a, b) => a + b, 0) / volumes.length 
      : 0;
  }

  const recentVolumes = volumes.slice(-period);
  const sum = recentVolumes.reduce((a, b) => a + b, 0);
  return sum / period;
}

/**
 * Calculate all technical indicators from DailyData history
 * @param history Array of DailyData
 * @returns Object with all calculated indicators
 */
export function calculateAllIndicators(history: DailyData[]) {
  if (!history || history.length === 0) {
    return {
      rsi2: 50,
      rsi14: 50,
      sma20: 0,
      sma50: 0,
      sma200: 0,
      bollingerUpper: 0,
      bollingerLower: 0,
      bollingerMiddle: 0,
      avgVolume: 0,
    };
  }

  const prices = history.map(d => d.close).filter(p => p > 0);
  const volumes = history.map(d => d.volume).filter(v => v > 0);

  const rsi2 = calculateRSI(prices, 2);
  const rsi14 = calculateRSI(prices, 14);
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const sma200 = calculateSMA(prices, 200);
  const bollinger = calculateBollinger(prices, 20, 2);
  const avgVolume = calculateAverageVolume(volumes, 20);

  return {
    rsi2,
    rsi14,
    sma20,
    sma50,
    sma200,
    bollingerUpper: bollinger.upper,
    bollingerLower: bollinger.lower,
    bollingerMiddle: bollinger.middle,
    avgVolume,
  };
}
