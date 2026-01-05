import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useProtocols() {
  return useQuery({
    queryKey: ['protocols'],
    queryFn: async () => {
      const response = await api.protocols.list();
      return response.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
