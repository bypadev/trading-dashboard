export const HEARTBEAT_MS = 25_000;
export const BASE_RECONNECT_MS = 2_000;
export const MAX_RECONNECT_ATTEMPTS = 10;
export const MAX_RECONNECT_DELAY_MS = 30_000;
export const WS_MESSAGE_TYPES = {
  PRICE_UPDATE: 'PRICE_UPDATE',
  PING: 'PING',
  PONG: 'PONG',
} as const;