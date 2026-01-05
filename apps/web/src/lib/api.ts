import type { FarmDetail, FarmListParams, FarmListResponse, APYHistoryPoint, ChainInfo, Protocol } from '@/types/farm';
import type { ApiResponse, ILCalculatorParams, ILCalculatorResult } from '@/types/api';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

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

export const api = {
  farms: {
    list: async (params: FarmListParams = {}): Promise<FarmListResponse> => {
      const queryString = buildQueryString(params as unknown as Record<string, unknown>);
      return fetchApi<FarmListResponse>(`/farms${queryString}`);
    },

    get: async (id: string): Promise<ApiResponse<FarmDetail>> => {
      return fetchApi<ApiResponse<FarmDetail>>(`/farms/${encodeURIComponent(id)}`);
    },

    history: async (id: string, days = 30): Promise<ApiResponse<APYHistoryPoint[]>> => {
      return fetchApi<ApiResponse<APYHistoryPoint[]>>(
        `/farms/${encodeURIComponent(id)}/history?days=${days}`
      );
    },
  },

  chains: {
    list: async (): Promise<ApiResponse<ChainInfo[]>> => {
      return fetchApi<ApiResponse<ChainInfo[]>>('/chains');
    },
  },

  protocols: {
    list: async (): Promise<ApiResponse<Protocol[]>> => {
      return fetchApi<ApiResponse<Protocol[]>>('/protocols');
    },
  },

  calculator: {
    il: async (params: ILCalculatorParams): Promise<ApiResponse<ILCalculatorResult>> => {
      return fetchApi<ApiResponse<ILCalculatorResult>>('/calculator/il', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },
  },
};

export default api;
