export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

export const MAX_POINTS = 100;
export const CANDLE_MS = 5_000;

export const CLIENT_ERRORS = {
  FETCH_TICKERS_FAILED: 'Failed to fetch tickers',
  FETCH_HISTORY_FAILED: 'Failed to fetch history',
  SERVER_UNREACHABLE: 'Server unreachable',
} as const;

export const DECIMAL_PRICE_REGEX = /^\d*\.?\d*$/;