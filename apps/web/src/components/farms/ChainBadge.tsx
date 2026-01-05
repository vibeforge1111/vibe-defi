import { cn } from '@/lib/utils';
import type { Chain } from '@/types/farm';

interface ChainBadgeProps {
  chain: Chain;
  showName?: boolean;
}

const chainConfig: Record<Chain, { name: string; shortName: string; className: string; dotColor: string }> = {
  ethereum: {
    name: 'Ethereum',
    shortName: 'ETH',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotColor: 'bg-blue-400',
  },
  arbitrum: {
    name: 'Arbitrum',
    shortName: 'ARB',
    className: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    dotColor: 'bg-sky-400',
  },
  base: {
    name: 'Base',
    shortName: 'BASE',
    className: 'bg-blue-600/10 text-blue-400 border-blue-600/20',
    dotColor: 'bg-blue-400',
  },
  bnb: {
    name: 'BNB Chain',
    shortName: 'BNB',
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    dotColor: 'bg-yellow-400',
  },
  solana: {
    name: 'Solana',
    shortName: 'SOL',
    className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    dotColor: 'bg-purple-400',
  },
};

export function ChainBadge({ chain, showName = false }: ChainBadgeProps) {
  const config = chainConfig[chain];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border',
        config.className
      )}
    >
      <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
      {showName ? config.name : config.shortName}
    </div>
  );
}
