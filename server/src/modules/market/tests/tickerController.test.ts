import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../../app';

describe('Ticker REST API', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health → 200 with status ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok' });
  });

  it('GET /api/tickers → 200 array of strings', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tickers' });
    expect(res.statusCode).toBe(200);
    const body: unknown[] = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((t) => typeof t === 'string')).toBe(true);
  });

  it('GET /api/tickers/AAPL → 200 with price data', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tickers/AAPL' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('symbol', 'AAPL');
    expect(body).toHaveProperty('price');
    expect(body).toHaveProperty('change');
    expect(body).toHaveProperty('changePercent');
  });

  it('GET /api/tickers/aapl → case-insensitive, returns AAPL', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tickers/aapl' });
    expect(res.statusCode).toBe(200);
    expect(res.json().symbol).toBe('AAPL');
  });

  it('GET /api/tickers/UNKNOWN → 404', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tickers/UNKNOWN' });
    expect(res.statusCode).toBe(404);
  });

  it('GET /api/history/BTC-USD → 200 array with price and timestamp', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/history/BTC-USD' });
    expect(res.statusCode).toBe(200);
    const body: Array<{ price: number; timestamp: number }> = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('price');
    expect(body[0]).toHaveProperty('timestamp');
  });

  it('GET /api/history/NOTEXIST → 404', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/history/NOTEXIST' });
    expect(res.statusCode).toBe(404);
  });
});
