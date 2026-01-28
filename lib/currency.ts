// Currency normalization utilities - Convert all currencies to SEK for comparison

export type Currency = 'SEK' | 'USD' | 'CAD' | 'EUR' | 'DKK' | 'NOK';

// Exchange rates to SEK (approximate fixed rates)
const EXCHANGE_RATES: Record<Currency, number> = {
  SEK: 1.0,
  USD: 10.5,
  CAD: 7.5,
  EUR: 11.2,
  DKK: 1.5,
  NOK: 1.0,
};

// Map country to currency
export function getCurrencyForCountry(country: 'sweden' | 'norway' | 'denmark' | 'finland' | 'canada' | 'usa'): Currency {
  switch (country) {
    case 'sweden':
      return 'SEK';
    case 'norway':
      return 'NOK';
    case 'denmark':
      return 'DKK';
    case 'finland':
      return 'EUR';
    case 'canada':
      return 'CAD';
    case 'usa':
      return 'USD';
    default:
      return 'SEK';
  }
}

// Normalize value to SEK
export function normalizeToSEK(value: number, currency: Currency): number {
  if (!value || value <= 0) return 0;
  const rate = EXCHANGE_RATES[currency] || 1.0;
  return value * rate;
}

// Get exchange rate for a currency
export function getExchangeRate(currency: Currency): number {
  return EXCHANGE_RATES[currency] || 1.0;
}
