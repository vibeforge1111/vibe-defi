export type Chain = 'ethereum' | 'arbitrum' | 'base' | 'bnb' | 'solana';

export type PoolType = 'AMM' | 'Lending' | 'Staking' | 'Vault';

export type ILRisk = 'None' | 'Low' | 'Medium' | 'High';

export type AuditStatus = 'Audited' | 'Unaudited' | 'Unknown';

export interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  chainId: string;
  isStablecoin: boolean;
  logoUrl?: string;
  coingeckoId?: string;
}

export interface Protocol {
  id: string;
  name: string;
  website: string;
  logoUrl: string;
  auditStatus: AuditStatus;
  description?: string;
}

export interface ChainInfo {
  id: Chain;
  name: string;
  chainId: number;
  rpcUrl?: string;
  explorerUrl: string;
  logoUrl: string;
  isActive: boolean;
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

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface ILCalculatorParams {
  token0Amount: number;
  token1Amount: number;
  initialPrice: number;
  currentPrice: number;
}

export interface ILCalculatorResult {
  impermanentLoss: number;
  lpValue: number;
  holdValue: number;
  token0InLP: number;
  token1InLP: number;
  breakEvenFees: number;
}
