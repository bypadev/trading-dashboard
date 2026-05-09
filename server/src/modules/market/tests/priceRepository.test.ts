import { describe, it, expect } from 'vitest';
import { priceRepository } from '../repositories/priceRepository';
import { randomWalk } from '../services/marketSimulator';

describe('PriceRepository', () => {
  it('returns all tickers', () => {
    const tickers = priceRepository.getTickers();
    expect(tickers.length).toBeGreaterThan(0);
    expect(tickers).toContain('BTC-USD');
    expect(tickers).toContain('AAPL');
    expect(tickers).toContain('TSLA');
  });

  it('returns initial state for a known ticker', () => {
    const state = priceRepository.getState('AAPL');
    expect(state).toBeDefined();
    expect(state?.symbol).toBe('AAPL');
    expect(state?.currentPrice).toBeGreaterThan(0);
    expect(state?.history.length).toBeGreaterThanOrEqual(1);
  });

  it('returns undefined for an unknown ticker', () => {
    expect(priceRepository.getState('UNKNOWN')).toBeUndefined();
  });

  it('updates price and tracks previous price', () => {
    const before = priceRepository.getState('MSFT')!;
    const newPrice = before.currentPrice * 1.01;

    const updated = priceRepository.updatePrice('MSFT', newPrice);

    expect(updated).not.toBeNull();
    expect(updated!.currentPrice).toBe(newPrice);
    expect(updated!.previousPrice).toBe(before.currentPrice);
  });

  it('appends price to history', () => {
    const before = priceRepository.getState('GOOGL')!;
    const sizeBefore = before.history.length;

    priceRepository.updatePrice('GOOGL', before.currentPrice * 1.005);

    const after = priceRepository.getState('GOOGL')!;
    expect(after.history.length).toBe(Math.min(sizeBefore + 1, 100));
  });

  it('caps history at 100 entries', () => {
    for (let i = 0; i < 120; i++) {
      priceRepository.updatePrice('ETH-USD', 3000 + i);
    }
    const state = priceRepository.getState('ETH-USD')!;
    expect(state.history.length).toBeLessThanOrEqual(100);
  });

  it('returns empty array for unknown ticker history', () => {
    expect(priceRepository.getHistory('NOTREAL')).toEqual([]);
  });
});

describe('randomWalk', () => {
  it('always returns a positive price', () => {
    let price = 100;
    for (let i = 0; i < 10_000; i++) {
      price = randomWalk(price);
    }
    expect(price).toBeGreaterThan(0);
  });

  it('stays within reasonable bounds over short period', () => {
    const initial = 100;
    const prices = [initial];
    for (let i = 0; i < 100; i++) {
      prices.push(randomWalk(prices[prices.length - 1]));
    }
    // With 0.2% volatility over 100 ticks, price should stay within ±30% of initial
    const last = prices[prices.length - 1];
    expect(last).toBeGreaterThan(initial * 0.7);
    expect(last).toBeLessThan(initial * 1.3);
  });

  it('returns value rounded to 2 decimal places', () => {
    const result = randomWalk(100);
    expect(result).toBe(parseFloat(result.toFixed(2)));
  });
});
