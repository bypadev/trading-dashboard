export const TICKERS = ['AAPL', 'TSLA', 'BTC-USD', 'ETH-USD', 'GOOGL', 'MSFT'] as const;

export type Ticker = typeof TICKERS[number];

export const INITIAL_PRICES: Record<Ticker, number> = {
  AAPL: 189.5,
  TSLA: 245.3,
  'BTC-USD': 67200.0,
  'ETH-USD': 3540.0,
  GOOGL: 175.2,
  MSFT: 415.8,
};

export const MAX_HISTORY = 100;