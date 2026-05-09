export interface PricePoint {
  price: number;
  timestamp: number;
}

export interface TickerState {
  symbol: string;
  currentPrice: number;
  previousPrice: number;
  history: PricePoint[];
}

export interface PriceUpdatePayload {
  symbol: string;
  price: number;
  previousPrice: number;
  timestamp: number;
  change: number;
  changePercent: number;
}

import type { WsMessageType } from '../ts/enum';

export type { WsMessageType } from '../ts/enum';

export interface WsMessage<T = unknown> {
  type: WsMessageType;
  payload: T;
}
