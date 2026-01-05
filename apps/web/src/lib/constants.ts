import type { Chain, ChainInfo } from '@/types/farm';

export const SUPPORTED_CHAINS: ChainInfo[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    explorerUrl: 'https://etherscan.io',
    logoUrl: '/chains/ethereum.svg',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    explorerUrl: 'https://arbiscan.io',
    logoUrl: '/chains/arbitrum.svg',
  },
  {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    explorerUrl: 'https://basescan.org',
    logoUrl: '/chains/base.svg',
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    chainId: 56,
    explorerUrl: 'https://bscscan.com',
    logoUrl: '/chains/bnb.svg',
  },
  {
    id: 'solana',
    name: 'Solana',
    chainId: 0,
    explorerUrl: 'https://solscan.io',
    logoUrl: '/chains/solana.svg',
  },
];

export const POOL_TYPES = ['AMM', 'Lending', 'Staking', 'Vault'] as const;

export const MIN_TVL_OPTIONS = [
  { label: 'All', value: 0 },
  { label: '$100K+', value: 100_000 },
  { label: '$1M+', value: 1_000_000 },
  { label: '$10M+', value: 10_000_000 },
  { label: '$100M+', value: 100_000_000 },
];

export const SORT_OPTIONS = [
  { label: 'Highest APY', value: '-totalAPY' },
  { label: 'Lowest APY', value: 'totalAPY' },
  { label: 'Highest TVL', value: '-tvl' },
  { label: 'Lowest TVL', value: 'tvl' },
  { label: 'Lowest Risk', value: 'riskScore' },
  { label: 'Highest Risk', value: '-riskScore' },
];

export const REFRESH_INTERVAL = 60_000; // 1 minute

export function getChainById(id: Chain): ChainInfo | undefined {
  return SUPPORTED_CHAINS.find((chain) => chain.id === id);
}
