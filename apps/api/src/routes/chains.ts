import { Router } from 'express';
import type { ChainInfo } from '../types/index.js';

export const chainRoutes: Router = Router();

const chains: ChainInfo[] = [
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

chainRoutes.get('/', (_req, res) => {
  res.json({ data: chains });
});

chainRoutes.get('/:id', (req, res) => {
  const chain = chains.find((c) => c.id === req.params.id);

  if (!chain) {
    return res.status(404).json({ error: 'Chain not found' });
  }

  res.json({ data: chain });
});
