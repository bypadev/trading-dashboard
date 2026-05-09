import { priceRepository } from '../repositories/priceRepository';
import type { TickerState } from '../types';
import { logger } from '../../../shared/logger';
import { VOLATILITY } from '../consts';

type UpdateCallback = (state: TickerState) => void;

export function randomWalk(currentPrice: number): number {
  const change = (Math.random() - 0.5) * 2 * VOLATILITY * currentPrice;
  return Math.max(0.01, parseFloat((currentPrice + change).toFixed(2)));
}

class MarketSimulator {
  private interval: ReturnType<typeof setInterval> | null = null;
  private callbacks = new Set<UpdateCallback>();

  start(intervalMs = 1000): void {
    if (this.interval) return;

    logger.info({ intervalMs }, 'Market simulator started');

    this.interval = setInterval(() => {
      for (const symbol of priceRepository.getTickers()) {
        const state = priceRepository.getState(symbol);
        if (!state) continue;

        const newPrice = randomWalk(state.currentPrice);
        const updated = priceRepository.updatePrice(symbol, newPrice);
        if (updated) {
          this.callbacks.forEach((cb) => cb(updated));
        }
      }
    }, intervalMs);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      logger.info('Market simulator stopped');
    }
  }

  onUpdate(cb: UpdateCallback): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }
}

export const marketSimulator = new MarketSimulator();
