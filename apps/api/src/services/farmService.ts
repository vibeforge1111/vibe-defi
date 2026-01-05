import type { Farm, FarmDetail, Chain, PoolType } from '../types/index.js';

// Mock data for development - will be replaced with database queries
const mockFarms: Farm[] = [
  {
    id: 'ethereum:curve:0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
    name: '3pool',
    protocol: 'Curve',
    protocolLogo: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
    chain: 'ethereum',
    chainName: 'Ethereum',
    poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
    poolType: 'AMM',
    tokens: ['USDC', 'USDT', 'DAI'],
    tvl: 245000000,
    tvlChange24h: 2.4,
    baseAPY: 3.2,
    rewardAPY: 1.0,
    totalAPY: 4.2,
    riskScore: 15,
    ilRisk: 'None',
    farmUrl: 'https://curve.fi/3pool',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'arbitrum:uniswap:0x1234567890abcdef',
    name: 'ETH-USDC',
    protocol: 'Uniswap V3',
    protocolLogo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    chain: 'arbitrum',
    chainName: 'Arbitrum',
    poolAddress: '0x1234567890abcdef1234567890abcdef12345678',
    poolType: 'AMM',
    tokens: ['ETH', 'USDC'],
    tvl: 89200000,
    tvlChange24h: -0.8,
    baseAPY: 12.3,
    rewardAPY: 6.2,
    totalAPY: 18.5,
    riskScore: 42,
    ilRisk: 'Medium',
    farmUrl: 'https://app.uniswap.org/pools',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'solana:raydium:0xabc123',
    name: 'SOL-USDC',
    protocol: 'Raydium',
    protocolLogo: 'https://cryptologos.cc/logos/raydium-ray-logo.png',
    chain: 'solana',
    chainName: 'Solana',
    poolAddress: 'Abc123xyz789DefGhiJklMnoPqrStuvWxyz12345',
    poolType: 'AMM',
    tokens: ['SOL', 'USDC'],
    tvl: 34000000,
    tvlChange24h: 5.2,
    baseAPY: 18.5,
    rewardAPY: 5.7,
    totalAPY: 24.2,
    riskScore: 55,
    ilRisk: 'Medium',
    farmUrl: 'https://raydium.io/pools/',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ethereum:aave:0xabc789',
    name: 'USDC Supply',
    protocol: 'Aave V3',
    protocolLogo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    chain: 'ethereum',
    chainName: 'Ethereum',
    poolAddress: '0xabc789def012345678901234567890abcdef0123',
    poolType: 'Lending',
    tokens: ['USDC'],
    tvl: 1250000000,
    tvlChange24h: 1.1,
    baseAPY: 4.8,
    rewardAPY: 0,
    totalAPY: 4.8,
    riskScore: 12,
    ilRisk: 'None',
    farmUrl: 'https://app.aave.com/',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'base:aerodrome:0xdef456',
    name: 'ETH-USDbC',
    protocol: 'Aerodrome',
    protocolLogo: 'https://aerodrome.finance/logo.png',
    chain: 'base',
    chainName: 'Base',
    poolAddress: '0xdef456789012345678901234567890abcdef5678',
    poolType: 'AMM',
    tokens: ['ETH', 'USDbC'],
    tvl: 45000000,
    tvlChange24h: 8.5,
    baseAPY: 22.1,
    rewardAPY: 15.3,
    totalAPY: 37.4,
    riskScore: 48,
    ilRisk: 'Medium',
    farmUrl: 'https://aerodrome.finance/liquidity',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bnb:pancakeswap:0x123abc',
    name: 'CAKE-BNB',
    protocol: 'PancakeSwap',
    protocolLogo: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png',
    chain: 'bnb',
    chainName: 'BNB Chain',
    poolAddress: '0x123abc456def789012345678901234567890cdef',
    poolType: 'AMM',
    tokens: ['CAKE', 'BNB'],
    tvl: 78000000,
    tvlChange24h: -2.3,
    baseAPY: 28.5,
    rewardAPY: 12.0,
    totalAPY: 40.5,
    riskScore: 58,
    ilRisk: 'High',
    farmUrl: 'https://pancakeswap.finance/liquidity',
    updatedAt: new Date().toISOString(),
  },
];

interface ListParams {
  chains?: Chain[];
  protocols?: string[];
  poolType?: PoolType;
  minTvl?: number;
  maxRisk?: number;
  stablecoinOnly?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
}

export const farmService = {
  async list(params: ListParams) {
    let filtered = [...mockFarms];

    // Apply filters
    if (params.chains && params.chains.length > 0) {
      filtered = filtered.filter((f) => params.chains!.includes(f.chain));
    }
    if (params.protocols && params.protocols.length > 0) {
      filtered = filtered.filter((f) =>
        params.protocols!.some((p) => f.protocol.toLowerCase().includes(p.toLowerCase()))
      );
    }
    if (params.poolType) {
      filtered = filtered.filter((f) => f.poolType === params.poolType);
    }
    if (params.minTvl && params.minTvl > 0) {
      filtered = filtered.filter((f) => f.tvl >= params.minTvl!);
    }
    if (params.maxRisk && params.maxRisk < 100) {
      filtered = filtered.filter((f) => f.riskScore <= params.maxRisk!);
    }
    if (params.stablecoinOnly) {
      filtered = filtered.filter((f) => f.ilRisk === 'None');
    }

    // Apply sorting
    const sortField = params.sort?.replace('-', '') || 'totalAPY';
    const sortDesc = params.sort?.startsWith('-') ?? true;

    filtered.sort((a, b) => {
      const aVal = a[sortField as keyof Farm];
      const bVal = b[sortField as keyof Farm];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDesc ? bVal - aVal : aVal - bVal;
      }
      return 0;
    });

    const total = filtered.length;
    const limit = params.limit || 50;
    const offset = params.offset || 0;

    // Apply pagination
    const paged = filtered.slice(offset, offset + limit);

    return {
      data: paged,
      meta: {
        total,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async get(id: string): Promise<FarmDetail | null> {
    const farm = mockFarms.find((f) => f.id === id);
    if (!farm) return null;

    return {
      ...farm,
      riskFactors: {
        smartContract: Math.floor(Math.random() * 40) + 10,
        impermanentLoss: farm.ilRisk === 'None' ? 5 : farm.ilRisk === 'Low' ? 25 : farm.ilRisk === 'Medium' ? 50 : 75,
        protocol: Math.floor(Math.random() * 30) + 10,
        liquidity: Math.floor(Math.random() * 40) + 20,
        rewardToken: Math.floor(Math.random() * 50) + 20,
      },
      warnings: farm.riskScore > 50
        ? ['High volatility pair - significant IL risk', 'Reward token may be volatile']
        : [],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  async getHistory(id: string, days: number) {
    // Generate mock historical data
    const data = [];
    const now = Date.now();
    const farm = mockFarms.find((f) => f.id === id);
    if (!farm) return [];

    for (let i = days; i >= 0; i--) {
      const timestamp = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();
      const variation = 1 + (Math.random() - 0.5) * 0.2;

      data.push({
        timestamp,
        tvl: farm.tvl * variation,
        baseAPY: farm.baseAPY * variation,
        rewardAPY: farm.rewardAPY * variation,
        totalAPY: farm.totalAPY * variation,
      });
    }

    return data;
  },
};
