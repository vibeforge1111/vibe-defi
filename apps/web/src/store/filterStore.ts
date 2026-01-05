import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chain, PoolType } from '@/types/farm';

interface FilterState {
  chains: Chain[];
  protocols: string[];
  poolType: PoolType | null;
  minTvl: number;
  maxRisk: number;
  stablecoinOnly: boolean;
  sort: string;
  page: number;
  pageSize: number;

  // Actions
  setChains: (chains: Chain[]) => void;
  toggleChain: (chain: Chain) => void;
  setProtocols: (protocols: string[]) => void;
  toggleProtocol: (protocol: string) => void;
  setPoolType: (poolType: PoolType | null) => void;
  setMinTvl: (minTvl: number) => void;
  setMaxRisk: (maxRisk: number) => void;
  setStablecoinOnly: (stablecoinOnly: boolean) => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
}

const initialState = {
  chains: [] as Chain[],
  protocols: [] as string[],
  poolType: null as PoolType | null,
  minTvl: 0,
  maxRisk: 100,
  stablecoinOnly: false,
  sort: '-totalAPY',
  page: 1,
  pageSize: 50,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,

      setChains: (chains) => set({ chains, page: 1 }),

      toggleChain: (chain) =>
        set((state) => ({
          chains: state.chains.includes(chain)
            ? state.chains.filter((c) => c !== chain)
            : [...state.chains, chain],
          page: 1,
        })),

      setProtocols: (protocols) => set({ protocols, page: 1 }),

      toggleProtocol: (protocol) =>
        set((state) => ({
          protocols: state.protocols.includes(protocol)
            ? state.protocols.filter((p) => p !== protocol)
            : [...state.protocols, protocol],
          page: 1,
        })),

      setPoolType: (poolType) => set({ poolType, page: 1 }),

      setMinTvl: (minTvl) => set({ minTvl, page: 1 }),

      setMaxRisk: (maxRisk) => set({ maxRisk, page: 1 }),

      setStablecoinOnly: (stablecoinOnly) => set({ stablecoinOnly, page: 1 }),

      setSort: (sort) => set({ sort, page: 1 }),

      setPage: (page) => set({ page }),

      setPageSize: (pageSize) => set({ pageSize, page: 1 }),

      resetFilters: () => set(initialState),
    }),
    {
      name: 'vibe-defi-filters',
      partialize: (state) => ({
        sort: state.sort,
        pageSize: state.pageSize,
      }),
    }
  )
);
