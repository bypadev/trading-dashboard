import { useQuery } from '@tanstack/react-query';
import { API_URL, CLIENT_ERRORS } from '@/consts';

export function useTickers() {
  return useQuery<string[]>({
    queryKey: ['tickers'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tickers`);
      if (!res.ok) throw new Error(CLIENT_ERRORS.FETCH_TICKERS_FAILED);
      return res.json() as Promise<string[]>;
    },
    staleTime: Infinity,
    retry: 3,
  });
}
