import { describe, it, expect } from 'vitest';
import {
  formatPriceFull,
  formatPriceCompact,
  formatChangePercent,
  formatChange,
} from './format';

describe('formatPriceFull', () => {
  it('formats price with dollar sign and 2 decimal places', () => {
    expect(formatPriceFull(189.5)).toBe('$189.50');
  });

  it('formats large price with thousand separator', () => {
    expect(formatPriceFull(67341.82)).toBe('$67,341.82');
  });

  it('pads trailing zeros', () => {
    expect(formatPriceFull(100)).toBe('$100.00');
  });
});

describe('formatPriceCompact', () => {
  it('formats prices below 1000 with 2 decimal places', () => {
    expect(formatPriceCompact(189.5)).toBe('$189.50');
  });

  it('formats prices >= 1000 in k notation', () => {
    expect(formatPriceCompact(67341.82)).toBe('$67.3k');
  });

  it('formats exactly 1000', () => {
    expect(formatPriceCompact(1000)).toBe('$1.0k');
  });
});

describe('formatChangePercent', () => {
  it('adds + prefix when up', () => {
    expect(formatChangePercent(1.23, true)).toBe('+1.23%');
  });

  it('no prefix when down', () => {
    expect(formatChangePercent(-1.23, false)).toBe('-1.23%');
  });

  it('formats zero change', () => {
    expect(formatChangePercent(0, true)).toBe('+0.00%');
  });
});

describe('formatChange', () => {
  it('adds + prefix when up', () => {
    expect(formatChange(5.5, true)).toBe('+5.50');
  });

  it('no prefix when down', () => {
    expect(formatChange(-5.5, false)).toBe('-5.50');
  });
});
