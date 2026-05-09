export enum AlertDirection {
  ABOVE = 'above',
  BELOW = 'below',
}

export interface PricePoint {
  price: number;
  timestamp: number;
}

export interface TickerState {
  symbol: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface PriceAlert {
  symbol: string;
  threshold: number;
  direction: AlertDirection;
  triggered: boolean;
}

export interface PriceUpdatePayload {
  symbol: string;
  price: number;
  previousPrice: number;
  timestamp: number;
  change: number;
  changePercent: number;
}

export type WsMessageType = 'PRICE_UPDATE' | 'PONG' | 'ERROR';

export interface WsMessage<T = unknown> {
  type: WsMessageType;
  payload: T;
}
