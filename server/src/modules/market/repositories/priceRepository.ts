import type { TickerState, PricePoint } from '../types';
import { TICKERS, INITIAL_PRICES, MAX_HISTORY } from '../consts';

class PriceRepository {
  private store = new Map<string, TickerState>();

  constructor() {
    for (const symbol of TICKERS) {
      const price = INITIAL_PRICES[symbol];
      this.store.set(symbol, {
        symbol,
        currentPrice: price,
        previousPrice: price,
        history: [{ price, timestamp: Date.now() }],
      });
    }
  }

  getTickers(): string[] {
    return [...TICKERS];
  }

  getState(symbol: string): TickerState | undefined {
    return this.store.get(symbol);
  }

  updatePrice(symbol: string, newPrice: number): TickerState | null {
    const state = this.store.get(symbol);
    if (!state) return null;

    const point: PricePoint = { price: newPrice, timestamp: Date.now() };
    const history = [...state.history, point].slice(-MAX_HISTORY);

    const updated: TickerState = {
      ...state,
      previousPrice: state.currentPrice,
      currentPrice: newPrice,
      history,
    };

    this.store.set(symbol, updated);
    return updated;
  }

  getHistory(symbol: string): PricePoint[] {
    return this.store.get(symbol)?.history ?? [];
  }
}

export const priceRepository = new PriceRepository();
