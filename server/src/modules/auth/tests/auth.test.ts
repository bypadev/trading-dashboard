import { describe, it, expect } from 'vitest';
import { login, logout, isValidToken } from '../service';
import { buildApp } from '../../../app';

describe('auth service', () => {
  it('returns a token on valid credentials', () => {
    const token = login('admin', 'password123');
    expect(token).not.toBeNull();
    if (token) logout(token);
  });

  it('returns null on wrong password', () => {
    expect(login('admin', 'wrongpassword')).toBeNull();
  });

  it('returns null on unknown username', () => {
    expect(login('unknown', 'password123')).toBeNull();
  });

  it('issued token is valid', () => {
    const token = login('trader', 'trading456');
    expect(isValidToken(token ?? '')).toBe(true);
    if (token) logout(token);
  });

  it('token is invalid after logout', () => {
    const token = login('admin', 'password123');
    expect(token).not.toBeNull();
    if (token) {
      logout(token);
      expect(isValidToken(token)).toBe(false);
    }
  });

  it('unknown token is invalid', () => {
    expect(isValidToken('00000000-0000-0000-0000-000000000000')).toBe(false);
  });

  it('each login produces a unique token', () => {
    const t1 = login('admin', 'password123');
    const t2 = login('admin', 'password123');
    expect(t1).not.toBe(t2);
    if (t1) logout(t1);
    if (t2) logout(t2);
  });
});

describe('auth REST API', () => {
  it('POST /api/auth/login → 200 with token and username', async () => {
    const app = await buildApp();
    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      body: { username: 'admin', password: 'password123' },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json<{ token: string; username: string }>();
    expect(body.username).toBe('admin');
    expect(typeof body.token).toBe('string');
    logout(body.token);
    await app.close();
  });

  it('POST /api/auth/login → 401 on wrong credentials', async () => {
    const app = await buildApp();
    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      body: { username: 'admin', password: 'wrong' },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it('POST /api/auth/logout → 204 and token is invalidated', async () => {
    const app = await buildApp();
    await app.ready();

    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      body: { username: 'trader', password: 'trading456' },
    });
    const { token } = loginRes.json<{ token: string }>();
    expect(isValidToken(token)).toBe(true);

    const logoutRes = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(logoutRes.statusCode).toBe(204);
    expect(isValidToken(token)).toBe(false);
    await app.close();
  });
});
