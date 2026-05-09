import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsService } from '@/services/websocketService';
import { useMarketStore } from '@/store/marketStore';
import { useAuthStore } from '@/store/authStore';

export function useWebSocket(): void {
  const updateTicker = useMarketStore((s) => s.updateTicker);
  const setWsConnected = useMarketStore((s) => s.setWsConnected);
  const checkAlerts = useMarketStore((s) => s.checkAlerts);
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;

    wsService.connect(token);

    const unsubPrice = wsService.onPriceUpdate((payload) => {
      updateTicker({
        symbol: payload.symbol,
        price: payload.price,
        previousPrice: payload.previousPrice,
        change: payload.change,
        changePercent: payload.changePercent,
        timestamp: payload.timestamp,
      });
      checkAlerts(payload.symbol, payload.price);
    });

    const unsubConn = wsService.onConnectionChange((connected) => {
      setWsConnected(connected);
      if (connected) {
        queryClient.invalidateQueries({ queryKey: ['history'] });
      }
    });

    return () => {
      unsubPrice();
      unsubConn();
      wsService.disconnect();
    };
  }, [token, updateTicker, setWsConnected, checkAlerts, queryClient]);
}
