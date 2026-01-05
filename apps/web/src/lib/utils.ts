import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCurrency(num: number): string {
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
}

export function formatPercentage(num: number): string {
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function getChainColor(chain: string): string {
  const colors: Record<string, string> = {
    ethereum: '#627EEA',
    arbitrum: '#12AAFF',
    base: '#0052FF',
    bnb: '#F0B90B',
    solana: '#14F195',
  };
  return colors[chain.toLowerCase()] || '#6366F1';
}

export function getChainName(chain: string): string {
  const names: Record<string, string> = {
    ethereum: 'Ethereum',
    arbitrum: 'Arbitrum',
    base: 'Base',
    bnb: 'BNB Chain',
    solana: 'Solana',
  };
  return names[chain.toLowerCase()] || chain;
}
