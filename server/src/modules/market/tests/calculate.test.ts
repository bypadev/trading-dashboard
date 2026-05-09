import { describe, it, expect } from 'vitest';
import { calcPriceChange } from '../utils/calculate';

describe('calcPriceChange', () => {
  it('calculates positive change correctly', () => {
    const { change, changePercent } = calcPriceChange(110, 100);
    expect(change).toBe(10);
    expect(changePercent).toBe(10);
  });

  it('calculates negative change correctly', () => {
    const { change, changePercent } = calcPriceChange(90, 100);
    expect(change).toBe(-10);
    expect(changePercent).toBe(-10);
  });

  it('returns zero change when prices are equal', () => {
    const { change, changePercent } = calcPriceChange(100, 100);
    expect(change).toBe(0);
    expect(changePercent).toBe(0);
  });

  it('returns zero changePercent when previousPrice is 0', () => {
    const { changePercent } = calcPriceChange(100, 0);
    expect(changePercent).toBe(0);
  });

  it('rounds change to 2 decimal places', () => {
    const { change } = calcPriceChange(100.01, 100);
    expect(change).toBe(0.01);
  });

  it('rounds changePercent to 4 decimal places', () => {
    const { changePercent } = calcPriceChange(67341.82, 67298.1);
    expect(String(changePercent).split('.')[1]?.length ?? 0).toBeLessThanOrEqual(4);
  });
});
