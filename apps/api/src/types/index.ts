import { z } from 'zod';

export const ChainSchema = z.enum(['ethereum', 'arbitrum', 'base', 'bnb', 'solana']);
export type Chain = z.infer<typeof ChainSchema>;

export const PoolTypeSchema = z.enum(['AMM', 'Lending', 'Staking', 'Vault']);
export type PoolType = z.infer<typeof PoolTypeSchema>;

export const ILRiskSchema = z.enum(['None', 'Low', 'Medium', 'High']);
export type ILRisk = z.infer<typeof ILRiskSchema>;

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
  riskFactors: {
    smartContract: number;
    impermanentLoss: number;
    protocol: number;
    liquidity: number;
    rewardToken: number;
  };
  warnings: string[];
  createdAt: string;
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

export const FarmListQuerySchema = z.object({
  query: z.object({
    chains: z.union([z.array(ChainSchema), ChainSchema]).optional(),
    protocols: z.union([z.array(z.string()), z.string()]).optional(),
    poolType: PoolTypeSchema.optional(),
    minTvl: z.coerce.number().min(0).optional(),
    maxRisk: z.coerce.number().min(1).max(100).optional(),
    stablecoinOnly: z.coerce.boolean().optional(),
    sort: z.string().default('-totalAPY'),
    limit: z.coerce.number().min(1).max(100).default(50),
    offset: z.coerce.number().min(0).default(0),
  }),
});

export const ILCalculatorSchema = z.object({
  body: z.object({
    token0Amount: z.number().positive(),
    token1Amount: z.number().positive(),
    initialPrice: z.number().positive(),
    currentPrice: z.number().positive(),
  }),
});
