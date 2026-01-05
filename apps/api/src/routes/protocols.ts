import { Router } from 'express';
import type { Protocol } from '../types/index.js';

export const protocolRoutes: Router = Router();

const protocols: Protocol[] = [
  {
    id: 'curve',
    name: 'Curve Finance',
    website: 'https://curve.fi',
    logoUrl: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
    auditStatus: 'Audited',
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    website: 'https://uniswap.org',
    logoUrl: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    auditStatus: 'Audited',
  },
  {
    id: 'aave',
    name: 'Aave',
    website: 'https://aave.com',
    logoUrl: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    auditStatus: 'Audited',
  },
  {
    id: 'raydium',
    name: 'Raydium',
    website: 'https://raydium.io',
    logoUrl: 'https://cryptologos.cc/logos/raydium-ray-logo.png',
    auditStatus: 'Audited',
  },
  {
    id: 'aerodrome',
    name: 'Aerodrome',
    website: 'https://aerodrome.finance',
    logoUrl: 'https://aerodrome.finance/logo.png',
    auditStatus: 'Audited',
  },
  {
    id: 'pancakeswap',
    name: 'PancakeSwap',
    website: 'https://pancakeswap.finance',
    logoUrl: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png',
    auditStatus: 'Audited',
  },
  {
    id: 'compound',
    name: 'Compound',
    website: 'https://compound.finance',
    logoUrl: 'https://cryptologos.cc/logos/compound-comp-logo.png',
    auditStatus: 'Audited',
  },
  {
    id: 'balancer',
    name: 'Balancer',
    website: 'https://balancer.fi',
    logoUrl: 'https://cryptologos.cc/logos/balancer-bal-logo.png',
    auditStatus: 'Audited',
  },
];

protocolRoutes.get('/', (_req, res) => {
  res.json({ data: protocols });
});

protocolRoutes.get('/:id', (req, res) => {
  const protocol = protocols.find((p) => p.id === req.params.id);

  if (!protocol) {
    return res.status(404).json({ error: 'Protocol not found' });
  }

  res.json({ data: protocol });
});
