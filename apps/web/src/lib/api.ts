import type { FarmDetail, FarmListParams, FarmListResponse, APYHistoryPoint, ChainInfo, Protocol } from '@/types/farm';
import type { ApiResponse, ILCalculatorParams, ILCalculatorResult } from '@/types/api';
import { mockFarms } from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || '';
const USE_MOCK = !import.meta.env.VITE_API_URL;

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Mock implementations
function getMockFarms(params: FarmListParams = {}): FarmListResponse {
  let filtered = [...mockFarms];

  // Filter by chains
  if (params.chains && params.chains.length > 0) {
    filtered = filtered.filter(f => params.chains!.includes(f.chain));
  }

  // Filter by pool type
  if (params.poolType) {
    filtered = filtered.filter(f => f.poolType === params.poolType);
  }

  // Filter by min TVL
  if (params.minTvl && params.minTvl > 0) {
    filtered = filtered.filter(f => f.tvl >= params.minTvl!);
  }

  // Filter stablecoin only
  if (params.stablecoinOnly) {
    filtered = filtered.filter(f => f.isStablecoin);
  }

  // Sort
  const sortField = params.sort?.replace('-', '') || 'tvl';
  const sortDesc = params.sort?.startsWith('-') ?? true;

  filtered.sort((a, b) => {
    const aVal = a[sortField as keyof typeof a] as number;
    const bVal = b[sortField as keyof typeof b] as number;
    return sortDesc ? bVal - aVal : aVal - bVal;
  });

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    data: paged,
    meta: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
}

export const api = {
  farms: {
    list: async (params: FarmListParams = {}): Promise<FarmListResponse> => {
      if (USE_MOCK) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return getMockFarms(params);
      }
      const queryString = buildQueryString(params as unknown as Record<string, unknown>);
      return fetchApi<FarmListResponse>(`/farms${queryString}`);
    },

    get: async (id: string): Promise<ApiResponse<FarmDetail>> => {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const farm = mockFarms.find(f => f.id === id);
        if (!farm) throw new Error('Farm not found');
        return {
          data: {
            ...farm,
            description: `${farm.protocol} ${farm.poolType} pool on ${farm.chain}`,
            audits: ['Certik', 'OpenZeppelin'],
            contracts: { pool: '0x1234...5678' },
          } as FarmDetail
        };
      }
      return fetchApi<ApiResponse<FarmDetail>>(`/farms/${encodeURIComponent(id)}`);
    },

    history: async (id: string, days = 30): Promise<ApiResponse<APYHistoryPoint[]>> => {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const farm = mockFarms.find(f => f.id === id);
        const baseAPY = farm?.totalAPY || 10;
        const history: APYHistoryPoint[] = [];
        for (let i = days; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          history.push({
            timestamp: date.toISOString(),
            apy: baseAPY + (Math.random() - 0.5) * 5,
            tvl: (farm?.tvl || 100000000) * (0.95 + Math.random() * 0.1),
          });
        }
        return { data: history };
      }
      return fetchApi<ApiResponse<APYHistoryPoint[]>>(
        `/farms/${encodeURIComponent(id)}/history?days=${days}`
      );
    },
  },

  chains: {
    list: async (): Promise<ApiResponse<ChainInfo[]>> => {
      if (USE_MOCK) {
        return {
          data: [
            { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
            { id: 'arbitrum', name: 'Arbitrum', icon: '🔵' },
            { id: 'base', name: 'Base', icon: '🔷' },
            { id: 'bnb', name: 'BNB Chain', icon: '🟡' },
            { id: 'solana', name: 'Solana', icon: '🟣' },
          ],
        };
      }
      return fetchApi<ApiResponse<ChainInfo[]>>('/chains');
    },
  },

  protocols: {
    list: async (): Promise<ApiResponse<Protocol[]>> => {
      if (USE_MOCK) {
        const protocols = [...new Set(mockFarms.map(f => f.protocol))];
        return {
          data: protocols.map(name => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            website: '#',
            chains: ['ethereum'],
          })),
        };
      }
      return fetchApi<ApiResponse<Protocol[]>>('/protocols');
    },
  },

  calculator: {
    il: async (params: ILCalculatorParams): Promise<ApiResponse<ILCalculatorResult>> => {
      if (USE_MOCK) {
        const priceChange = params.currentPrice / params.entryPrice;
        const holdValue = params.amount * (1 + priceChange) / 2;
        const lpValue = params.amount * Math.sqrt(priceChange);
        const ilPercent = ((holdValue - lpValue) / holdValue) * 100;
        return {
          data: {
            impermanentLoss: ilPercent,
            holdValue,
            lpValue,
            netGain: lpValue - params.amount,
          },
        };
      }
      return fetchApi<ApiResponse<ILCalculatorResult>>('/calculator/il', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },
  },
};

export default api;
