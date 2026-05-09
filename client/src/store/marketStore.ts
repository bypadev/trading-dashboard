import { create } from 'zustand';
import { AlertDirection } from '@/types';
import type { MarketStore } from './types';

export const useMarketStore = create<MarketStore>((set, get) => ({
  tickers: {},
  selectedTicker: null,

  wsConnected: false,

  alerts: [],
  notification: null,

  updateTicker: (payload) =>
    set((state) => ({
      tickers: {
        ...state.tickers,
        [payload.symbol]: payload,
      },
    })),

  selectTicker: (symbol) =>
    set({
      selectedTicker: symbol,
    }),

  setWsConnected: (connected) =>
    set({
      wsConnected: connected,
    }),

  addAlert: ({ symbol, threshold }) => {
    const currentPrice = get().tickers[symbol]?.price;

    if (currentPrice === undefined) {
      return;
    }

    const direction =
      currentPrice < threshold
        ? AlertDirection.ABOVE
        : AlertDirection.BELOW;

    set((state) => ({
      alerts: [
        ...state.alerts.filter(
          (alert) => alert.symbol !== symbol,
        ),
        {
          symbol,
          threshold,
          direction,
          triggered: false,
        },
      ],
    }));
  },

  removeAlert: (symbol) =>
    set((state) => ({
      alerts: state.alerts.filter(
        (alert) => alert.symbol !== symbol,
      ),
    })),

  checkAlerts: (symbol, price) => {
    const alerts = get().alerts;

    const triggeredAlert = alerts.find((alert) => {
      if (alert.symbol !== symbol || alert.triggered) {
        return false;
      }

      return (
        (alert.direction === AlertDirection.ABOVE &&
          price >= alert.threshold) ||
        (alert.direction === AlertDirection.BELOW &&
          price <= alert.threshold)
      );
    });

    if (!triggeredAlert) {
      return;
    }

    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.symbol === symbol
          ? {
              ...alert,
              triggered: true,
            }
          : alert,
      ),

      notification: {
        id: crypto.randomUUID(),

        message: `${symbol} hit $${price.toFixed(
          2,
        )} (alert: ${
          triggeredAlert.direction
        } $${triggeredAlert.threshold})`,

        severity: 'warning',
      },
    }));
  },

  dismissNotification: () =>
    set({
      notification: null,
    }),
}));