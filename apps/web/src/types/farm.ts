export type Chain = 'ethereum' | 'arbitrum' | 'base' | 'bnb' | 'solana';

export type PoolType = 'AMM' | 'Lending' | 'Staking' | 'Vault';

export type ILRisk = 'None' | 'Low' | 'Medium' | 'High';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl?: string;
  isStablecoin: boolean;
}

export interface Protocol {
  id: string;
  name: string;
  website: string;
  logoUrl: string;
  auditStatus: 'Audited' | 'Unaudited' | 'Unknown';
}

export interface ChainInfo {
  id: Chain;
  name: string;
  chainId: number;
  explorerUrl: string;
  logoUrl: string;
}

export interface RiskFactors {
  smartContract: number;
  impermanentLoss: number;
  protocol: number;
  liquidity: number;
  rewardToken: number;
}

export interface Farm {
  id: string;
  name: string;
  protocol: string;
  protocolLogo: string;
  chain: Chain;
  chainName: string;
  poolAddress: string;
  poolType: PoolType;
  tokens: string[];
  tvl: number;
  tvlChange24h: number;
  baseAPY: number;
  rewardAPY: number;
  totalAPY: number;
  riskScore: number;
  ilRisk: ILRisk;
  farmUrl: string;
  updatedAt: string;
}

export interface FarmDetail extends Farm {
  protocolInfo: Protocol;
  chainInfo: ChainInfo;
  tokenDetails: Token[];
  riskFactors: RiskFactors;
  warnings: string[];
  createdAt: string;
}

export interface APYHistoryPoint {
  timestamp: string;
  tvl: number;
  baseAPY: number;
  rewardAPY: number;
  totalAPY: number;
}

export interface FarmListParams {
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

export interface FarmListResponse {
  data: Farm[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
}

export function formatAPY(apy: number): string {
  if (apy >= 1000) {
    return `${(apy / 1000).toFixed(1)}K%`;
  }
  return `${apy.toFixed(2)}%`;
}

export function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) {
    return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  }
  if (tvl >= 1_000_000) {
    return `$${(tvl / 1_000_000).toFixed(2)}M`;
  }
  if (tvl >= 1_000) {
    return `$${(tvl / 1_000).toFixed(2)}K`;
  }
  return `$${tvl.toFixed(2)}`;
}
