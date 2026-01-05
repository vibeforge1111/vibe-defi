import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed chains
  const chains = [
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

  for (const chain of chains) {
    await prisma.chain.upsert({
      where: { id: chain.id },
      update: chain,
      create: chain,
    });
  }
  console.log(`Seeded ${chains.length} chains`);

  // Seed protocols
  const protocols = [
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
      id: 'curve',
      name: 'Curve Finance',
      website: 'https://curve.fi',
      logoUrl: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
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
    {
      id: 'pancakeswap',
      name: 'PancakeSwap',
      website: 'https://pancakeswap.finance',
      logoUrl: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png',
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
  ];

  for (const protocol of protocols) {
    await prisma.protocol.upsert({
      where: { id: protocol.id },
      update: protocol,
      create: protocol,
    });
  }
  console.log(`Seeded ${protocols.length} protocols`);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
