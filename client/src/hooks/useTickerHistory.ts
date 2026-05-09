import { useQuery } from '@tanstack/react-query';
import type { PricePoint } from '@/types';
import { API_URL, CLIENT_ERRORS } from '@/consts';

export function useTickerHistory(symbol: string | null) {
  return useQuery<PricePoint[]>({
    queryKey: ['history', symbol],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/history/${symbol}`);
      if (!res.ok) throw new Error(CLIENT_ERRORS.FETCH_HISTORY_FAILED);
      return res.json() as Promise<PricePoint[]>;
    },
    enabled: Boolean(symbol),
    staleTime: 30_000,
  });
}
