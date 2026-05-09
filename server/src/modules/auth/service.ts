import { randomUUID } from 'node:crypto';

const USERS: Record<string, string> = {
  admin: 'password123',
  trader: 'trading456',
};

const tokens = new Map<string, string>();

export function login(username: string, password: string): string | null {
  if (USERS[username] !== password) return null;
  const token = randomUUID();
  tokens.set(token, username);
  return token;
}

export function logout(token: string): void {
  tokens.delete(token);
}

export function isValidToken(token: string): boolean {
  return tokens.has(token);
}
