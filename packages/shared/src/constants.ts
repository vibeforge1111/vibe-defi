import type { ChainInfo, Chain } from './types';

export const SUPPORTED_CHAINS: ChainInfo[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    explorerUrl: 'https://etherscan.io',
    logoUrl: '/chains/ethereum.svg',
    isActive: true,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    explorerUrl: 'https://arbiscan.io',
    logoUrl: '/chains/arbitrum.svg',
    isActive: true,
  },
  {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    explorerUrl: 'https://basescan.org',
    logoUrl: '/chains/base.svg',
    isActive: true,
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    chainId: 56,
    explorerUrl: 'https://bscscan.com',
    logoUrl: '/chains/bnb.svg',
    isActive: true,
  },
  {
    id: 'solana',
    name: 'Solana',
    chainId: 0,
    explorerUrl: 'https://solscan.io',
    logoUrl: '/chains/solana.svg',
    isActive: true,
  },
];

export const POOL_TYPES = ['AMM', 'Lending', 'Staking', 'Vault'] as const;

export const IL_RISK_LEVELS = ['None', 'Low', 'Medium', 'High'] as const;

export const AUDIT_STATUSES = ['Audited', 'Unaudited', 'Unknown'] as const;

export const RISK_WEIGHTS = {
  smartContract: 0.25,
  impermanentLoss: 0.25,
  protocol: 0.20,
  liquidity: 0.15,
  rewardToken: 0.15,
} as const;

export const STABLECOINS = [
  'USDC', 'USDT', 'DAI', 'FRAX', 'LUSD', 'GUSD',
  'BUSD', 'TUSD', 'USDP', 'USDD', 'crvUSD', 'GHO',
  'USDe', 'USDbC',
] as const;

export function getChainById(id: Chain): ChainInfo | undefined {
  return SUPPORTED_CHAINS.find((chain) => chain.id === id);
}

export function isStablecoin(symbol: string): boolean {
  return STABLECOINS.some((s) => symbol.toUpperCase().includes(s));
}
