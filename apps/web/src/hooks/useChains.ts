import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SUPPORTED_CHAINS } from '@/lib/constants';

export function useChains() {
  return useQuery({
    queryKey: ['chains'],
    queryFn: async () => {
      try {
        const response = await api.chains.list();
        return response.data;
      } catch {
        // Fallback to static chain data if API is unavailable
        return SUPPORTED_CHAINS;
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - chains rarely change
  });
}
