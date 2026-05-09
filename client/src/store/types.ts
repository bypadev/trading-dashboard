import type { TickerState, PriceAlert } from '../types';

export interface Notification {
  id: string;
  message: string;
  severity: 'success' | 'warning' | 'error' | 'info';
}

export interface MarketStore {
  tickers: Record<string, TickerState>;
  selectedTicker: string | null;
  wsConnected: boolean;
  alerts: PriceAlert[];
  notification: Notification | null;

  updateTicker: (payload: TickerState) => void;
  selectTicker: (symbol: string) => void;
  setWsConnected: (connected: boolean) => void;
  addAlert: (alert: { symbol: string; threshold: number }) => void;
  removeAlert: (symbol: string) => void;
  checkAlerts: (symbol: string, price: number) => void;
  dismissNotification: () => void;
}

export interface AuthState {
  token: string | null;
  username: string | null;
  error: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}