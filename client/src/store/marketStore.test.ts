import { describe, it, expect, beforeEach } from 'vitest';
import { useMarketStore } from './marketStore';

const reset = () =>
  useMarketStore.setState({
    tickers: {},
    selectedTicker: null,
    wsConnected: false,
    alerts: [],
    notification: null,
  });

const makeTicker = (symbol: string, price: number) => ({
  symbol,
  price,
  previousPrice: price,
  change: 0,
  changePercent: 0,
  timestamp: Date.now(),
});

describe('marketStore', () => {
  beforeEach(reset);

  it('updates ticker state', () => {
    useMarketStore.getState().updateTicker(makeTicker('AAPL', 190.5));
    expect(useMarketStore.getState().tickers['AAPL'].price).toBe(190.5);
  });

  it('selects a ticker', () => {
    useMarketStore.getState().selectTicker('BTC-USD');
    expect(useMarketStore.getState().selectedTicker).toBe('BTC-USD');
  });

  it('tracks websocket connection state', () => {
    useMarketStore.getState().setWsConnected(true);
    expect(useMarketStore.getState().wsConnected).toBe(true);
    useMarketStore.getState().setWsConnected(false);
    expect(useMarketStore.getState().wsConnected).toBe(false);
  });

  it('adds a price alert', () => {
    useMarketStore.getState().updateTicker(makeTicker('TSLA', 250));
    useMarketStore.getState().addAlert({ symbol: 'TSLA', threshold: 300 });
    const alerts = useMarketStore.getState().alerts;
    expect(alerts.length).toBe(1);
    expect(alerts[0]).toMatchObject({ symbol: 'TSLA', threshold: 300, triggered: false });
  });

  it('removes a price alert', () => {
    useMarketStore.getState().updateTicker(makeTicker('TSLA', 250));
    useMarketStore.getState().addAlert({ symbol: 'TSLA', threshold: 300 });
    useMarketStore.getState().removeAlert('TSLA');
    expect(useMarketStore.getState().alerts.length).toBe(0);
  });

  it('replaces existing alert for the same symbol', () => {
    useMarketStore.getState().updateTicker(makeTicker('AAPL', 100));
    useMarketStore.getState().addAlert({ symbol: 'AAPL', threshold: 200 });
    useMarketStore.getState().addAlert({ symbol: 'AAPL', threshold: 150 });
    const alerts = useMarketStore.getState().alerts;
    expect(alerts.length).toBe(1);
    expect(alerts[0].threshold).toBe(150);
  });

  it('derives direction above when current price is below threshold', () => {
    useMarketStore.getState().updateTicker(makeTicker('ETH-USD', 2900));
    useMarketStore.getState().addAlert({ symbol: 'ETH-USD', threshold: 3000 });
    expect(useMarketStore.getState().alerts[0].direction).toBe('above');
  });

  it('derives direction below when current price is above threshold', () => {
    useMarketStore.getState().updateTicker(makeTicker('ETH-USD', 3200));
    useMarketStore.getState().addAlert({ symbol: 'ETH-USD', threshold: 3000 });
    expect(useMarketStore.getState().alerts[0].direction).toBe('below');
  });

  it('triggers alert when price crosses threshold', () => {
    useMarketStore.getState().updateTicker(makeTicker('ETH-USD', 2900));
    useMarketStore.getState().addAlert({ symbol: 'ETH-USD', threshold: 3000 });
    useMarketStore.getState().checkAlerts('ETH-USD', 3100);

    const state = useMarketStore.getState();
    expect(state.alerts[0].triggered).toBe(true);
    expect(state.notification).not.toBeNull();
    expect(state.notification?.message).toContain('ETH-USD');
  });

  it('does not re-trigger an already triggered alert', () => {
    useMarketStore.getState().updateTicker(makeTicker('BTC-USD', 60000));
    useMarketStore.getState().addAlert({ symbol: 'BTC-USD', threshold: 70000 });
    useMarketStore.getState().checkAlerts('BTC-USD', 71000);
    useMarketStore.getState().dismissNotification();
    useMarketStore.getState().checkAlerts('BTC-USD', 72000);

    expect(useMarketStore.getState().notification).toBeNull();
  });
});
