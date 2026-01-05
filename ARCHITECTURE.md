# VibeDeFi Farm Analyzer - Technical Architecture

## Overview

This document details the technical architecture for the VibeDeFi Farm Analyzer, a cross-chain DeFi yield aggregation platform.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     Vite + React 18 SPA                                │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │  │
│  │  │  Dashboard  │ │  Pool View  │ │ IL Calculator│ │  Portfolio  │     │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  TanStack Query (Server State) │ Zustand (Client State)         │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS / WebSocket
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     Node.js + Express                                  │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │  │
│  │  │  REST API   │ │  WebSocket  │ │ Rate Limiter│ │    Auth     │     │  │
│  │  │  /api/v1/*  │ │  Real-time  │ │  (Redis)    │ │  (Optional) │     │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICE LAYER                                      │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │  Pool Service   │ │  Risk Service   │ │ Protocol Service│               │
│  │  - CRUD pools   │ │  - Scoring      │ │  - Integrations │               │
│  │  - Aggregation  │ │  - IL calc      │ │  - Normalization│               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │  Price Service  │ │  Alert Service  │ │  Cache Service  │               │
│  │  - Token prices │ │  - Notifications│ │  - Redis ops    │               │
│  │  - Historical   │ │  - Webhooks     │ │  - Invalidation │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │   PostgreSQL    │ │   TimescaleDB   │ │     Redis       │               │
│  │  - Pools        │ │  - APY history  │ │  - Cache        │               │
│  │  - Protocols    │ │  - TVL history  │ │  - Sessions     │               │
│  │  - Tokens       │ │  - Price history│ │  - Rate limits  │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INDEXER LAYER (Python)                               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │  Data Fetchers  │ │   Processors    │ │   Schedulers    │               │
│  │  - DeFiLlama   │ │  - Normalize    │ │  - Cron jobs    │               │
│  │  - The Graph    │ │  - Validate     │ │  - Queue worker │               │
│  │  - Direct RPC   │ │  - Transform    │ │  - Retry logic  │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL DATA SOURCES                                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │
│  │ DeFiLlama │ │ The Graph │ │ CoinGecko │ │ RPC Nodes │ │ Protocol  │    │
│  │    API    │ │  Subgraph │ │    API    │ │  Direct   │ │   APIs    │    │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
vibe-defi/
├── apps/
│   ├── web/                          # Vite + React frontend
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/               # shadcn/ui components
│   │   │   │   ├── layout/           # Header, Sidebar, Footer
│   │   │   │   ├── farms/            # Farm-specific components
│   │   │   │   │   ├── FarmTable.tsx
│   │   │   │   │   ├── FarmCard.tsx
│   │   │   │   │   ├── FarmFilters.tsx
│   │   │   │   │   └── FarmDetails.tsx
│   │   │   │   ├── calculator/       # IL Calculator components
│   │   │   │   ├── portfolio/        # Portfolio components
│   │   │   │   └── charts/           # Chart components
│   │   │   ├── hooks/
│   │   │   │   ├── useFarms.ts       # Farm data hooks
│   │   │   │   ├── useFilters.ts     # Filter state hooks
│   │   │   │   ├── usePrices.ts      # Price data hooks
│   │   │   │   └── useWallet.ts      # Wallet connection
│   │   │   ├── lib/
│   │   │   │   ├── api.ts            # API client
│   │   │   │   ├── utils.ts          # Utility functions
│   │   │   │   ├── constants.ts      # App constants
│   │   │   │   └── calculations.ts   # IL, APY calculations
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── FarmDetail.tsx
│   │   │   │   ├── Calculator.tsx
│   │   │   │   └── Portfolio.tsx
│   │   │   ├── store/
│   │   │   │   ├── filterStore.ts    # Zustand filter state
│   │   │   │   └── settingsStore.ts  # User preferences
│   │   │   ├── types/
│   │   │   │   ├── farm.ts
│   │   │   │   ├── protocol.ts
│   │   │   │   └── api.ts
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── api/                          # Node.js backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── farms.ts
│       │   │   ├── protocols.ts
│       │   │   ├── chains.ts
│       │   │   ├── calculator.ts
│       │   │   └── alerts.ts
│       │   ├── services/
│       │   │   ├── farmService.ts
│       │   │   ├── riskService.ts
│       │   │   ├── priceService.ts
│       │   │   ├── cacheService.ts
│       │   │   └── alertService.ts
│       │   ├── middleware/
│       │   │   ├── rateLimiter.ts
│       │   │   ├── errorHandler.ts
│       │   │   └── validator.ts
│       │   ├── db/
│       │   │   ├── prisma/
│       │   │   │   └── schema.prisma
│       │   │   ├── migrations/
│       │   │   └── seed.ts
│       │   ├── utils/
│       │   │   ├── logger.ts
│       │   │   └── helpers.ts
│       │   ├── types/
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── indexer/                      # Python data indexer
│   │   ├── src/
│   │   │   ├── fetchers/
│   │   │   │   ├── defillama.py
│   │   │   │   ├── thegraph.py
│   │   │   │   ├── coingecko.py
│   │   │   │   └── rpc/
│   │   │   │       ├── ethereum.py
│   │   │   │       ├── solana.py
│   │   │   │       └── base.py
│   │   │   ├── processors/
│   │   │   │   ├── normalizer.py
│   │   │   │   ├── risk_calculator.py
│   │   │   │   └── validator.py
│   │   │   ├── protocols/
│   │   │   │   ├── uniswap.py
│   │   │   │   ├── aave.py
│   │   │   │   ├── curve.py
│   │   │   │   └── raydium.py
│   │   │   ├── db/
│   │   │   │   └── client.py
│   │   │   ├── scheduler.py
│   │   │   └── main.py
│   │   ├── requirements.txt
│   │   └── pyproject.toml
│   │
│   └── shared/                       # Shared types/utils
│       ├── src/
│       │   ├── types.ts
│       │   └── constants.ts
│       └── package.json
│
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.indexer
│   └── Dockerfile.web
│
├── scripts/
│   ├── setup.sh
│   ├── seed-data.ts
│   └── deploy.sh
│
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── PRD.md
├── ARCHITECTURE.md
├── IMPLEMENTATION_PLAN.md
├── package.json                      # Workspace root
├── pnpm-workspace.yaml
└── README.md
```

---

## Frontend Architecture (Vite + React)

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Vite | 5.x | Build tool, dev server |
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| TanStack Query | 5.x | Server state management |
| Zustand | 4.x | Client state management |
| React Router | 6.x | Routing |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | Latest | Component library |
| Recharts | 2.x | Charts |
| viem | 2.x | Ethereum interactions |
| @solana/web3.js | 1.x | Solana interactions |

### State Management Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      STATE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               TanStack Query (Server State)              │    │
│  │  - Farm data from API                                    │    │
│  │  - Protocol data                                         │    │
│  │  - Price data                                            │    │
│  │  - Automatic caching & refetching                        │    │
│  │  - Stale-while-revalidate pattern                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Zustand (Client State)                  │    │
│  │  - Filter selections                                     │    │
│  │  - Sort preferences                                      │    │
│  │  - UI state (modals, sidebars)                          │    │
│  │  - User settings (theme, defaults)                       │    │
│  │  - Persisted to localStorage                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  URL State (React Router)                │    │
│  │  - Current page/route                                    │    │
│  │  - Shareable filter state                                │    │
│  │  - Pool IDs for detail pages                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```typescript
// Example: FarmTable component structure

// components/farms/FarmTable.tsx
interface FarmTableProps {
  farms: Farm[];
  isLoading: boolean;
  onSort: (column: SortColumn) => void;
  sortConfig: SortConfig;
}

// Uses composition pattern
<FarmTable>
  <FarmTableHeader />
  <FarmTableBody>
    {farms.map(farm => (
      <FarmTableRow key={farm.id} farm={farm} />
    ))}
  </FarmTableBody>
  <FarmTablePagination />
</FarmTable>
```

### API Client

```typescript
// lib/api.ts
import { QueryClient } from '@tanstack/react-query';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute
      gcTime: 5 * 60 * 1000,       // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const api = {
  farms: {
    list: (params: FarmListParams) =>
      fetch(`${API_BASE}/farms?${new URLSearchParams(params)}`).then(r => r.json()),
    get: (id: string) =>
      fetch(`${API_BASE}/farms/${id}`).then(r => r.json()),
    history: (id: string, days: number) =>
      fetch(`${API_BASE}/farms/${id}/history?days=${days}`).then(r => r.json()),
  },
  protocols: {
    list: () => fetch(`${API_BASE}/protocols`).then(r => r.json()),
  },
  chains: {
    list: () => fetch(`${API_BASE}/chains`).then(r => r.json()),
  },
  calculator: {
    il: (params: ILParams) =>
      fetch(`${API_BASE}/calculator/il`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }).then(r => r.json()),
  },
};
```

---

## Backend Architecture (Node.js + Express)

### API Structure

```typescript
// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { farmRoutes } from './routes/farms';
import { protocolRoutes } from './routes/protocols';
import { chainRoutes } from './routes/chains';
import { calculatorRoutes } from './routes/calculator';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,             // 100 requests per minute
}));

// Routes
app.use('/api/v1/farms', farmRoutes);
app.use('/api/v1/protocols', protocolRoutes);
app.use('/api/v1/chains', chainRoutes);
app.use('/api/v1/calculator', calculatorRoutes);

// Error handling
app.use(errorHandler);

app.listen(process.env.PORT || 3001);
```

### Service Layer Pattern

```typescript
// services/farmService.ts
import { prisma } from '../db/client';
import { cacheService } from './cacheService';
import { Farm, FarmListParams, FarmListResponse } from '../types';

export const farmService = {
  async list(params: FarmListParams): Promise<FarmListResponse> {
    const cacheKey = `farms:${JSON.stringify(params)}`;

    // Check cache first
    const cached = await cacheService.get<FarmListResponse>(cacheKey);
    if (cached) return cached;

    // Build query
    const where = this.buildWhereClause(params);
    const orderBy = this.buildOrderBy(params);

    const [farms, total] = await Promise.all([
      prisma.pool.findMany({
        where,
        orderBy,
        skip: params.offset || 0,
        take: params.limit || 50,
        include: {
          protocol: true,
          chain: true,
        },
      }),
      prisma.pool.count({ where }),
    ]);

    const response = {
      farms: farms.map(this.transformFarm),
      total,
      page: Math.floor((params.offset || 0) / (params.limit || 50)) + 1,
      pageSize: params.limit || 50,
    };

    // Cache for 60 seconds
    await cacheService.set(cacheKey, response, 60);

    return response;
  },

  buildWhereClause(params: FarmListParams) {
    const where: any = { isActive: true };

    if (params.chains?.length) {
      where.chainId = { in: params.chains };
    }
    if (params.protocols?.length) {
      where.protocolId = { in: params.protocols };
    }
    if (params.minTvl) {
      where.tvl = { gte: params.minTvl };
    }
    if (params.maxRisk) {
      where.riskScore = { lte: params.maxRisk };
    }
    if (params.poolType) {
      where.poolType = params.poolType;
    }
    if (params.stablecoinOnly) {
      where.ilRisk = 'None';
    }

    return where;
  },

  buildOrderBy(params: FarmListParams) {
    const sortMap: Record<string, any> = {
      apy: { totalAPY: 'desc' },
      tvl: { tvl: 'desc' },
      risk: { riskScore: 'asc' },
      '-apy': { totalAPY: 'asc' },
      '-tvl': { tvl: 'asc' },
      '-risk': { riskScore: 'desc' },
    };
    return sortMap[params.sort || 'apy'];
  },

  transformFarm(pool: any): Farm {
    return {
      id: pool.id,
      name: pool.name,
      protocol: pool.protocol.name,
      protocolLogo: pool.protocol.logoUrl,
      chain: pool.chain.id,
      chainName: pool.chain.name,
      poolAddress: pool.poolAddress,
      poolType: pool.poolType,
      tokens: [pool.token0Id, pool.token1Id].filter(Boolean),
      tvl: pool.tvl,
      baseAPY: pool.baseAPY,
      rewardAPY: pool.rewardAPY,
      totalAPY: pool.totalAPY,
      riskScore: pool.riskScore,
      ilRisk: pool.ilRisk,
      farmUrl: pool.farmUrl,
      updatedAt: pool.updatedAt,
    };
  },
};
```

### Caching Strategy

```typescript
// services/cacheService.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(...keys);
    }
  },

  // Cache TTL strategy
  ttl: {
    farms: 60,           // 1 minute - frequently updated
    protocols: 3600,     // 1 hour - rarely changes
    chains: 86400,       // 24 hours - static
    prices: 30,          // 30 seconds - volatile
    history: 300,        // 5 minutes - historical data
  },
};
```

---

## Indexer Architecture (Python)

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      INDEXER PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │ FETCH   │ => │ PROCESS │ => │CALCULATE│ => │  STORE  │      │
│  │         │    │         │    │         │    │         │      │
│  │DeFiLlama│    │Normalize│    │Risk Calc│    │PostgreSQL│     │
│  │TheGraph │    │Validate │    │IL Risk  │    │TimescaleDB│    │
│  │RPC Nodes│    │Transform│    │APY Calc │    │Redis     │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Fetcher Implementation

```python
# src/fetchers/defillama.py
import aiohttp
import asyncio
from typing import List, Dict, Any
from dataclasses import dataclass

DEFILLAMA_BASE = "https://yields.llama.fi"

@dataclass
class RawPool:
    chain: str
    project: str
    symbol: str
    tvlUsd: float
    apy: float
    apyBase: float
    apyReward: float
    pool: str
    rewardTokens: List[str]
    underlyingTokens: List[str]
    stablecoin: bool

class DeFiLlamaFetcher:
    def __init__(self):
        self.session = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, *args):
        await self.session.close()

    async def fetch_pools(self, chains: List[str] = None) -> List[RawPool]:
        """Fetch all pools from DeFiLlama yields API."""
        async with self.session.get(f"{DEFILLAMA_BASE}/pools") as resp:
            data = await resp.json()

        pools = []
        for item in data.get("data", []):
            # Filter by chain if specified
            if chains and item.get("chain", "").lower() not in [c.lower() for c in chains]:
                continue

            # Skip pools with no TVL or APY
            if not item.get("tvlUsd") or item.get("tvlUsd") < 10000:
                continue

            pools.append(RawPool(
                chain=item.get("chain", ""),
                project=item.get("project", ""),
                symbol=item.get("symbol", ""),
                tvlUsd=item.get("tvlUsd", 0),
                apy=item.get("apy", 0),
                apyBase=item.get("apyBase", 0),
                apyReward=item.get("apyReward", 0),
                pool=item.get("pool", ""),
                rewardTokens=item.get("rewardTokens", []),
                underlyingTokens=item.get("underlyingTokens", []),
                stablecoin=item.get("stablecoin", False),
            ))

        return pools

    async def fetch_pool_history(self, pool_id: str) -> List[Dict]:
        """Fetch historical APY for a specific pool."""
        async with self.session.get(f"{DEFILLAMA_BASE}/chart/{pool_id}") as resp:
            data = await resp.json()
        return data.get("data", [])
```

### Risk Calculator

```python
# src/processors/risk_calculator.py
from dataclasses import dataclass
from typing import Optional
from enum import Enum

class ILRisk(Enum):
    NONE = "None"
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

@dataclass
class RiskFactors:
    smart_contract: int  # 0-100
    impermanent_loss: int
    protocol: int
    liquidity: int
    reward_token: int

@dataclass
class RiskAssessment:
    score: int  # 1-100
    factors: RiskFactors
    il_risk: ILRisk
    warnings: list[str]

class RiskCalculator:
    # Protocol trust scores (0-100, higher = safer)
    PROTOCOL_TRUST = {
        "uniswap": 95,
        "aave": 95,
        "curve": 90,
        "compound": 90,
        "balancer": 85,
        "sushiswap": 80,
        "pancakeswap": 80,
        "raydium": 75,
        "orca": 75,
        # Default for unknown
        "default": 50,
    }

    # Stablecoin addresses (lowercase)
    STABLECOINS = {
        "usdc", "usdt", "dai", "frax", "lusd", "gusd",
        "busd", "tusd", "usdp", "usdd", "crvusd", "gho",
    }

    def calculate_risk(
        self,
        protocol: str,
        tvl: float,
        tokens: list[str],
        is_audited: bool,
        pool_age_days: int,
        reward_token: Optional[str] = None,
    ) -> RiskAssessment:
        warnings = []

        # Smart contract risk
        sc_risk = self._calculate_sc_risk(is_audited, pool_age_days, tvl)

        # Impermanent loss risk
        il_risk_score, il_risk_level = self._calculate_il_risk(tokens)

        # Protocol risk
        protocol_risk = self._calculate_protocol_risk(protocol)

        # Liquidity risk
        liquidity_risk = self._calculate_liquidity_risk(tvl)

        # Reward token risk
        reward_risk = self._calculate_reward_risk(reward_token)

        # Weighted average
        total_score = (
            sc_risk * 0.25 +
            il_risk_score * 0.25 +
            protocol_risk * 0.20 +
            liquidity_risk * 0.15 +
            reward_risk * 0.15
        )

        # Generate warnings
        if not is_audited:
            warnings.append("Unaudited smart contract")
        if pool_age_days < 30:
            warnings.append("Pool is less than 30 days old")
        if tvl < 100_000:
            warnings.append("Low TVL - high liquidity risk")
        if il_risk_level in [ILRisk.MEDIUM, ILRisk.HIGH]:
            warnings.append(f"Impermanent loss risk: {il_risk_level.value}")

        return RiskAssessment(
            score=int(total_score),
            factors=RiskFactors(
                smart_contract=sc_risk,
                impermanent_loss=il_risk_score,
                protocol=protocol_risk,
                liquidity=liquidity_risk,
                reward_token=reward_risk,
            ),
            il_risk=il_risk_level,
            warnings=warnings,
        )

    def _calculate_sc_risk(self, is_audited: bool, age_days: int, tvl: float) -> int:
        score = 50  # Base score

        if is_audited:
            score -= 20
        else:
            score += 20

        if age_days > 365:
            score -= 15
        elif age_days > 180:
            score -= 10
        elif age_days > 90:
            score -= 5
        elif age_days < 30:
            score += 15

        if tvl > 100_000_000:
            score -= 10
        elif tvl > 10_000_000:
            score -= 5

        return max(1, min(100, score))

    def _calculate_il_risk(self, tokens: list[str]) -> tuple[int, ILRisk]:
        token_symbols = [t.lower() for t in tokens]

        # Both stablecoins = no IL
        stables = sum(1 for t in token_symbols if any(s in t for s in self.STABLECOINS))

        if stables >= 2:
            return 5, ILRisk.NONE
        elif stables == 1:
            return 50, ILRisk.MEDIUM
        else:
            # Both volatile - check if correlated (e.g., ETH-stETH)
            if self._are_correlated(token_symbols):
                return 25, ILRisk.LOW
            return 70, ILRisk.HIGH

    def _are_correlated(self, tokens: list[str]) -> bool:
        correlated_pairs = [
            ("eth", "steth"), ("eth", "wsteth"), ("eth", "reth"),
            ("btc", "wbtc"), ("sol", "msol"), ("sol", "jitosol"),
        ]
        for t1, t2 in correlated_pairs:
            if any(t1 in t for t in tokens) and any(t2 in t for t in tokens):
                return True
        return False

    def _calculate_protocol_risk(self, protocol: str) -> int:
        trust = self.PROTOCOL_TRUST.get(protocol.lower(), self.PROTOCOL_TRUST["default"])
        return 100 - trust  # Invert: high trust = low risk

    def _calculate_liquidity_risk(self, tvl: float) -> int:
        if tvl > 100_000_000:
            return 10
        elif tvl > 50_000_000:
            return 20
        elif tvl > 10_000_000:
            return 30
        elif tvl > 1_000_000:
            return 50
        elif tvl > 100_000:
            return 70
        return 90

    def _calculate_reward_risk(self, reward_token: Optional[str]) -> int:
        if not reward_token:
            return 20  # No reward token = lower risk

        # Major tokens = lower risk
        major_tokens = ["crv", "uni", "aave", "comp", "bal", "sushi", "ray"]
        if any(t in reward_token.lower() for t in major_tokens):
            return 30

        return 60  # Unknown reward token
```

### Scheduler

```python
# src/scheduler.py
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from fetchers.defillama import DeFiLlamaFetcher
from processors.normalizer import PoolNormalizer
from processors.risk_calculator import RiskCalculator
from db.client import DatabaseClient

SUPPORTED_CHAINS = ["ethereum", "arbitrum", "base", "bsc", "solana"]

class IndexerScheduler:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.db = DatabaseClient()
        self.risk_calc = RiskCalculator()

    def start(self):
        # Index pools every 5 minutes
        self.scheduler.add_job(
            self.index_all_pools,
            IntervalTrigger(minutes=5),
            id="index_pools",
            replace_existing=True,
        )

        # Update prices every minute
        self.scheduler.add_job(
            self.update_prices,
            IntervalTrigger(minutes=1),
            id="update_prices",
            replace_existing=True,
        )

        # Store historical snapshots every hour
        self.scheduler.add_job(
            self.store_history,
            IntervalTrigger(hours=1),
            id="store_history",
            replace_existing=True,
        )

        self.scheduler.start()

    async def index_all_pools(self):
        """Fetch and index all pools from all sources."""
        async with DeFiLlamaFetcher() as fetcher:
            raw_pools = await fetcher.fetch_pools(chains=SUPPORTED_CHAINS)

        normalizer = PoolNormalizer()

        for raw_pool in raw_pools:
            try:
                # Normalize pool data
                pool = normalizer.normalize(raw_pool)

                # Calculate risk
                risk = self.risk_calc.calculate_risk(
                    protocol=pool.protocol,
                    tvl=pool.tvl,
                    tokens=pool.tokens,
                    is_audited=pool.is_audited,
                    pool_age_days=pool.age_days,
                    reward_token=pool.reward_token,
                )

                # Upsert to database
                await self.db.upsert_pool(pool, risk)

            except Exception as e:
                print(f"Error processing pool {raw_pool.pool}: {e}")

    async def update_prices(self):
        """Update token prices from CoinGecko."""
        # Implementation...
        pass

    async def store_history(self):
        """Store APY/TVL snapshots for historical tracking."""
        # Implementation...
        pass

if __name__ == "__main__":
    scheduler = IndexerScheduler()
    scheduler.start()
    asyncio.get_event_loop().run_forever()
```

---

## Database Schema

### PostgreSQL + TimescaleDB

```sql
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Chains table
CREATE TABLE chains (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    chain_id INTEGER UNIQUE,
    rpc_url TEXT,
    explorer_url TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Protocols table
CREATE TABLE protocols (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    website TEXT,
    logo_url TEXT,
    audit_status VARCHAR(20) DEFAULT 'Unknown',
    description TEXT,
    twitter TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tokens table
CREATE TABLE tokens (
    id VARCHAR(100) PRIMARY KEY,  -- chain:address
    chain_id VARCHAR(20) REFERENCES chains(id),
    address VARCHAR(66) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    decimals INTEGER NOT NULL,
    logo_url TEXT,
    is_stablecoin BOOLEAN DEFAULT false,
    coingecko_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(chain_id, address)
);

-- Token prices table
CREATE TABLE token_prices (
    token_id VARCHAR(100) REFERENCES tokens(id),
    price_usd DECIMAL(30, 18) NOT NULL,
    price_change_24h DECIMAL(10, 4),
    volume_24h DECIMAL(30, 2),
    market_cap DECIMAL(30, 2),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (token_id)
);

-- Pools table
CREATE TABLE pools (
    id VARCHAR(100) PRIMARY KEY,  -- chain:protocol:address
    chain_id VARCHAR(20) REFERENCES chains(id),
    protocol_id VARCHAR(50) REFERENCES protocols(id),
    pool_address VARCHAR(66) NOT NULL,
    name VARCHAR(200) NOT NULL,
    pool_type VARCHAR(20) NOT NULL,  -- AMM, Lending, Staking, Vault

    -- Token composition
    token0_id VARCHAR(100) REFERENCES tokens(id),
    token1_id VARCHAR(100) REFERENCES tokens(id),

    -- Yield data
    tvl DECIMAL(30, 2) NOT NULL DEFAULT 0,
    tvl_change_24h DECIMAL(10, 4),
    base_apy DECIMAL(10, 4) NOT NULL DEFAULT 0,
    reward_apy DECIMAL(10, 4) NOT NULL DEFAULT 0,
    total_apy DECIMAL(10, 4) NOT NULL DEFAULT 0,

    -- Risk data
    risk_score INTEGER NOT NULL DEFAULT 50,
    il_risk VARCHAR(10) NOT NULL DEFAULT 'Medium',
    risk_factors JSONB,

    -- Metadata
    farm_url TEXT,
    is_active BOOLEAN DEFAULT true,
    defillama_id VARCHAR(200),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(chain_id, pool_address)
);

-- Create indexes
CREATE INDEX idx_pools_chain ON pools(chain_id);
CREATE INDEX idx_pools_protocol ON pools(protocol_id);
CREATE INDEX idx_pools_total_apy ON pools(total_apy DESC);
CREATE INDEX idx_pools_tvl ON pools(tvl DESC);
CREATE INDEX idx_pools_risk ON pools(risk_score ASC);
CREATE INDEX idx_pools_active ON pools(is_active) WHERE is_active = true;

-- APY History (TimescaleDB hypertable)
CREATE TABLE apy_history (
    pool_id VARCHAR(100) NOT NULL REFERENCES pools(id),
    timestamp TIMESTAMPTZ NOT NULL,
    tvl DECIMAL(30, 2),
    base_apy DECIMAL(10, 4),
    reward_apy DECIMAL(10, 4),
    total_apy DECIMAL(10, 4),
    PRIMARY KEY (pool_id, timestamp)
);

-- Convert to hypertable
SELECT create_hypertable('apy_history', 'timestamp');

-- Create index on pool_id for efficient lookups
CREATE INDEX idx_apy_history_pool ON apy_history(pool_id, timestamp DESC);

-- Retention policy: keep 1 year of data
SELECT add_retention_policy('apy_history', INTERVAL '365 days');

-- Compression policy: compress data older than 7 days
ALTER TABLE apy_history SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'pool_id'
);
SELECT add_compression_policy('apy_history', INTERVAL '7 days');

-- User alerts (Phase 2)
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(66),  -- Wallet address
    pool_id VARCHAR(100) REFERENCES pools(id),
    alert_type VARCHAR(20) NOT NULL,  -- apy_drop, apy_rise, tvl_drop, risk_change
    threshold DECIMAL(10, 4),
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_pool ON alerts(pool_id);
```

---

## API Specification

### Endpoints

#### GET /api/v1/farms

List farms with filtering and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| chains | string[] | all | Filter by chain IDs |
| protocols | string[] | all | Filter by protocol IDs |
| poolType | string | all | AMM, Lending, Staking, Vault |
| minTvl | number | 0 | Minimum TVL in USD |
| maxRisk | number | 100 | Maximum risk score |
| stablecoinOnly | boolean | false | Only stable-stable pairs |
| sort | string | -totalAPY | Sort field (prefix - for desc) |
| limit | number | 50 | Results per page (max 100) |
| offset | number | 0 | Pagination offset |

**Response:**
```json
{
  "data": [
    {
      "id": "ethereum:curve:0x...",
      "name": "3pool",
      "protocol": "Curve",
      "protocolLogo": "https://...",
      "chain": "ethereum",
      "chainName": "Ethereum",
      "poolType": "AMM",
      "tokens": ["USDC", "USDT", "DAI"],
      "tvl": 245000000,
      "tvlChange24h": 2.4,
      "baseAPY": 3.2,
      "rewardAPY": 1.0,
      "totalAPY": 4.2,
      "riskScore": 15,
      "ilRisk": "None",
      "farmUrl": "https://curve.fi/...",
      "updatedAt": "2026-01-05T12:00:00Z"
    }
  ],
  "meta": {
    "total": 1247,
    "page": 1,
    "pageSize": 50,
    "totalPages": 25
  }
}
```

#### GET /api/v1/farms/:id

Get detailed farm information.

**Response:**
```json
{
  "data": {
    "id": "ethereum:curve:0x...",
    "name": "3pool",
    "protocol": {
      "id": "curve",
      "name": "Curve Finance",
      "website": "https://curve.fi",
      "auditStatus": "Audited"
    },
    "chain": {
      "id": "ethereum",
      "name": "Ethereum",
      "explorerUrl": "https://etherscan.io"
    },
    "poolAddress": "0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7",
    "poolType": "AMM",
    "tokens": [
      { "symbol": "USDC", "address": "0xa0b8...", "logo": "..." },
      { "symbol": "USDT", "address": "0xdac1...", "logo": "..." },
      { "symbol": "DAI", "address": "0x6b17...", "logo": "..." }
    ],
    "tvl": 245000000,
    "tvlChange24h": 2.4,
    "baseAPY": 3.2,
    "rewardAPY": 1.0,
    "totalAPY": 4.2,
    "riskScore": 15,
    "riskFactors": {
      "smartContract": 10,
      "impermanentLoss": 5,
      "protocol": 10,
      "liquidity": 5,
      "rewardToken": 25
    },
    "ilRisk": "None",
    "warnings": [],
    "farmUrl": "https://curve.fi/...",
    "createdAt": "2020-09-15T00:00:00Z",
    "updatedAt": "2026-01-05T12:00:00Z"
  }
}
```

#### GET /api/v1/farms/:id/history

Get historical APY data.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | number | 30 | History duration (7, 30, 90, 365) |

**Response:**
```json
{
  "data": [
    {
      "timestamp": "2026-01-05T12:00:00Z",
      "tvl": 245000000,
      "baseAPY": 3.2,
      "rewardAPY": 1.0,
      "totalAPY": 4.2
    }
  ]
}
```

#### POST /api/v1/calculator/il

Calculate impermanent loss.

**Request:**
```json
{
  "token0Amount": 1,
  "token1Amount": 3500,
  "initialPrice": 3500,
  "currentPrice": 5250
}
```

**Response:**
```json
{
  "data": {
    "impermanentLoss": -2.02,
    "lpValue": 10798,
    "holdValue": 11000,
    "token0InLP": 0.816,
    "token1InLP": 4286,
    "breakEvenFees": 2.06
  }
}
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION DEPLOYMENT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Cloudflare (CDN + WAF)                            │   │
│  │  - Edge caching                                                      │   │
│  │  - DDoS protection                                                   │   │
│  │  - SSL termination                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────┐    ┌─────────────────────┐                        │
│  │  Cloudflare Pages   │    │      Railway        │                        │
│  │  ─────────────────  │    │  ─────────────────  │                        │
│  │  Vite Frontend      │    │  API Server         │                        │
│  │  - Static files     │    │  - Node.js          │                        │
│  │  - SPA routing      │    │  - Auto-scaling     │                        │
│  └─────────────────────┘    │  - Health checks    │                        │
│                              │                     │                        │
│                              │  Python Indexer     │                        │
│                              │  - Cron worker      │                        │
│                              │  - Background jobs  │                        │
│                              └─────────────────────┘                        │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Data Layer                                   │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │   │
│  │  │    Supabase     │  │   Upstash Redis │  │    Neon DB      │     │   │
│  │  │  (PostgreSQL +  │  │   (Serverless)  │  │  (Alternative)  │     │   │
│  │  │   TimescaleDB)  │  │                 │  │                 │     │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=https://api.vibedefi.com
VITE_WS_URL=wss://api.vibedefi.com

# Backend (.env)
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
CORS_ORIGIN=https://vibedefi.com

# Indexer (.env)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
DEFILLAMA_API=https://yields.llama.fi
COINGECKO_API_KEY=...
```

---

## Security Considerations

### Frontend
- No sensitive data in client
- CSP headers configured
- XSS protection via React
- No localStorage for sensitive data

### Backend
- Rate limiting (100 req/min)
- Input validation (zod)
- SQL injection prevention (Prisma)
- CORS restricted to frontend domain
- Helmet.js security headers

### Data
- Read-only blockchain interactions
- No private key handling
- No user funds custody
- API keys in environment variables

---

## Monitoring & Observability

### Metrics to Track
- API response times (p50, p95, p99)
- Error rates by endpoint
- Cache hit rates
- Indexer lag time
- Database query performance

### Tools
- **Logging**: Pino (structured JSON logs)
- **APM**: Sentry (error tracking)
- **Metrics**: Prometheus + Grafana (self-hosted) or Datadog
- **Uptime**: Better Uptime or UptimeRobot

---

*Architecture Version: 1.0*
*Last Updated: January 2026*
