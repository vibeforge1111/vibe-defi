import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useFilterStore } from '@/store/filterStore';
import { REFRESH_INTERVAL } from '@/lib/constants';
import type { FarmListParams } from '@/types/farm';

export function useFarms() {
  const {
    chains,
    protocols,
    poolType,
    minTvl,
    maxRisk,
    stablecoinOnly,
    sort,
    page,
    pageSize,
  } = useFilterStore();

  const params: FarmListParams = {
    chains: chains.length > 0 ? chains : undefined,
    protocols: protocols.length > 0 ? protocols : undefined,
    poolType: poolType || undefined,
    minTvl: minTvl > 0 ? minTvl : undefined,
    maxRisk: maxRisk < 100 ? maxRisk : undefined,
    stablecoinOnly: stablecoinOnly || undefined,
    sort,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  };

  return useQuery({
    queryKey: ['farms', params],
    queryFn: () => api.farms.list(params),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30_000,
  });
}

export function useFarm(id: string) {
  return useQuery({
    queryKey: ['farm', id],
    queryFn: () => api.farms.get(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useFarmHistory(id: string, days = 30) {
  return useQuery({
    queryKey: ['farmHistory', id, days],
    queryFn: () => api.farms.history(id, days),
    enabled: !!id,
    staleTime: 5 * 60_000, // 5 minutes
  });
}
