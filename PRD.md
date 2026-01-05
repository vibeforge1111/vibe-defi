# Product Requirements Document: DeFi Farm Analyzer

## Executive Summary

**Product Name:** VibeDeFi Farm Analyzer
**Version:** 1.0
**Date:** January 2026
**Author:** Development Team

### Vision
A cross-chain DeFi yield farming analyzer that aggregates, analyzes, and ranks farming opportunities across Solana, Ethereum, Base, Arbitrum, and BNB Chain to help users identify the most profitable and risk-adjusted yield farming strategies.

### Problem Statement
DeFi users face significant challenges when trying to optimize their yield farming strategies:
- **Fragmented Data**: Yield opportunities are scattered across 100+ protocols on 5+ chains
- **Hidden Risks**: High APY often masks impermanent loss, smart contract risk, or rug potential
- **Time-Consuming**: Manual research across protocols takes hours daily
- **Missed Opportunities**: Best yields often appear and disappear within hours
- **Complexity**: Comparing APY across different reward structures is non-trivial

### Solution
A unified dashboard that:
1. Aggregates real-time yield data from major DeFi protocols
2. Calculates risk-adjusted returns with impermanent loss modeling
3. Ranks opportunities by user-defined risk tolerance
4. Provides actionable insights with one-click farming links

---

## Target Users

### Primary Personas

| Persona | Description | Needs |
|---------|-------------|-------|
| **Yield Hunter** | Active DeFi user with $10k-$100k portfolio | Real-time yields, risk scores, gas optimization |
| **Stablecoin Farmer** | Risk-averse user seeking stable returns | Stablecoin-only filters, low-risk rankings |
| **DeFi Degen** | Aggressive user chasing highest yields | High APY alerts, new pool notifications |
| **Institutional** | Fund/treasury manager | API access, historical data, audit reports |

### User Stories

```
AS A yield hunter
I WANT TO see all farming opportunities ranked by risk-adjusted APY
SO THAT I can maximize returns without excessive research time

AS A stablecoin farmer
I WANT TO filter for stable-stable pairs only
SO THAT I avoid impermanent loss entirely

AS A DeFi degen
I WANT TO receive alerts when new high-APY pools launch
SO THAT I can be early to the best opportunities

AS AN institutional user
I WANT TO export historical yield data via API
SO THAT I can integrate with my portfolio management system
```

---

## Supported Chains & Protocols

### Chains (Phase 1)

| Chain | RPC Source | Block Time | Priority |
|-------|-----------|------------|----------|
| Ethereum | Alchemy/Infura | 12s | P0 |
| Arbitrum | Arbitrum RPC | 0.25s | P0 |
| Base | Base RPC | 2s | P0 |
| BNB Chain | BNB RPC | 3s | P1 |
| Solana | Helius/QuickNode | 0.4s | P1 |

### Protocol Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROTOCOL COVERAGE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DEXs/AMMs        │  Uniswap, SushiSwap, Curve, Balancer,       │
│                   │  PancakeSwap, Raydium, Orca, Aerodrome       │
│  ─────────────────────────────────────────────────────────────  │
│  LENDING          │  Aave, Compound, Morpho, Kamino,            │
│                   │  Venus, Spark                                │
│  ─────────────────────────────────────────────────────────────  │
│  YIELD AGG.       │  Yearn, Convex, Beefy, Pendle,              │
│                   │  Sommelier, Harvest                          │
│  ─────────────────────────────────────────────────────────────  │
│  LIQUID STAKING   │  Lido, Rocket Pool, Jito, Marinade,         │
│                   │  Frax, Coinbase cbETH                        │
│  ─────────────────────────────────────────────────────────────  │
│  STABLECOINS      │  USDC, USDT, DAI, FRAX, GHO,                │
│                   │  crvUSD, LUSD, USDe                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Protocol Count Targets

| Chain | Target Protocols | Example Protocols |
|-------|-----------------|-------------------|
| Ethereum | 25+ | Aave, Compound, Curve, Uniswap, Lido |
| Arbitrum | 20+ | GMX, Camelot, Radiant, Pendle |
| Base | 15+ | Aerodrome, Moonwell, Seamless |
| BNB Chain | 15+ | PancakeSwap, Venus, Alpaca |
| Solana | 15+ | Raydium, Orca, Marinade, Kamino |

---

## Core Features

### 1. Yield Aggregation Dashboard

**Description**: Real-time dashboard showing all farming opportunities across chains.

**Requirements**:
- [ ] Display APY/APR for each pool (base + rewards)
- [ ] Show TVL (Total Value Locked) per pool
- [ ] Display token pair composition
- [ ] Show protocol name and chain
- [ ] Auto-refresh every 60 seconds (configurable)
- [ ] Support pagination (100 pools per page)

**Data Points Per Pool**:
```typescript
interface FarmPool {
  id: string;
  protocol: string;
  chain: Chain;

  // Pool Info
  name: string;
  tokenPair: [Token, Token];
  poolType: 'AMM' | 'Lending' | 'Staking' | 'Vault';

  // Yield Data
  baseAPY: number;        // Trading fees / interest
  rewardAPY: number;      // Token incentives
  totalAPY: number;       // Combined
  apyHistory: APYDataPoint[];

  // Risk Metrics
  tvl: number;
  tvlChange24h: number;
  riskScore: number;      // 1-100, lower = safer
  impermanentLossRisk: 'None' | 'Low' | 'Medium' | 'High';

  // Metadata
  contractAddress: string;
  auditStatus: 'Audited' | 'Unaudited' | 'Unknown';
  launchDate: Date;

  // Links
  farmUrl: string;
  docsUrl?: string;
}
```

### 2. Risk Assessment Engine

**Description**: Calculate and display risk scores for each farming opportunity.

**Risk Factors**:

| Factor | Weight | Calculation |
|--------|--------|-------------|
| Smart Contract Risk | 25% | Audit status, age, TVL history |
| Impermanent Loss | 25% | Token correlation, volatility |
| Protocol Risk | 20% | Team reputation, governance |
| Liquidity Risk | 15% | TVL depth, withdrawal ease |
| Reward Token Risk | 15% | Token utility, emission schedule |

**Risk Score Formula**:
```python
risk_score = (
    smart_contract_risk * 0.25 +
    impermanent_loss_risk * 0.25 +
    protocol_risk * 0.20 +
    liquidity_risk * 0.15 +
    reward_token_risk * 0.15
)
# Output: 1-100 (1 = lowest risk, 100 = highest risk)
```

**Risk Categories**:
- **Low Risk (1-30)**: Audited protocols, stablecoin pairs, high TVL
- **Medium Risk (31-60)**: Newer protocols, volatile pairs, moderate TVL
- **High Risk (61-100)**: Unaudited, new launches, low TVL

### 3. Impermanent Loss Calculator

**Description**: Interactive tool showing potential IL for any pool.

**Features**:
- [ ] Input current holdings or hypothetical amounts
- [ ] Simulate price changes (-90% to +1000%)
- [ ] Compare LP value vs HODL value
- [ ] Show breakeven fee income needed
- [ ] Historical IL for existing positions

**IL Visualization**:
```
Price Change: -50%  →  IL: -5.7%
Price Change: +100% →  IL: -5.7%
Price Change: +400% →  IL: -20.0%

[Interactive Chart]
X-axis: Price ratio change
Y-axis: Impermanent Loss %
```

### 4. Filtering & Sorting

**Filter Options**:
- [ ] Chain (multi-select)
- [ ] Protocol (multi-select)
- [ ] Pool type (AMM, Lending, Staking, Vault)
- [ ] Token type (Stablecoin-only, Blue-chip, All)
- [ ] Minimum TVL ($100k, $1M, $10M, $100M)
- [ ] Risk score range
- [ ] APY range
- [ ] Audited only toggle

**Sort Options**:
- [ ] Total APY (default)
- [ ] Risk-adjusted APY
- [ ] TVL (highest/lowest)
- [ ] Risk score
- [ ] 24h APY change
- [ ] Protocol name

### 5. Portfolio Tracker (Phase 2)

**Description**: Connect wallet to track active farming positions.

**Features**:
- [ ] Read-only wallet connection
- [ ] Display active LP positions
- [ ] Calculate current P&L
- [ ] Track accumulated rewards
- [ ] IL tracking for each position
- [ ] Export to CSV/PDF

### 6. Alerts & Notifications (Phase 2)

**Alert Types**:
- [ ] New pool with APY > X%
- [ ] APY drop/increase > X%
- [ ] TVL drop > X%
- [ ] Risk score increase
- [ ] Reward program ending soon

**Delivery**:
- [ ] In-app notifications
- [ ] Email (optional)
- [ ] Telegram bot (optional)
- [ ] Discord webhook (optional)

---

## Technical Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Dashboard  │  │   Filters   │  │  IL Calc    │  │  Portfolio  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ REST/GraphQL API
┌────────────────────────────▼─────────────────────────────────────────┐
│                         BACKEND (Node.js/Python)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  API Layer  │  │   Indexer   │  │   Risk Eng  │  │  Scheduler  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│                         DATA LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  PostgreSQL │  │    Redis    │  │  TimescaleDB│  │   S3/R2     │  │
│  │  (Pools)    │  │  (Cache)    │  │ (APY History)│  │ (Snapshots) │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│                      EXTERNAL DATA SOURCES                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  DeFiLlama  │  │  The Graph  │  │  RPC Nodes  │  │  CoinGecko  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | Vite + React 18 | Fast HMR, lightweight, no SSR needed |
| Styling | Tailwind CSS + shadcn/ui | Rapid development, consistent |
| State | TanStack Query + Zustand | Caching, real-time updates, global state |
| Charts | Recharts / Lightweight Charts | Financial charts |
| Backend | Node.js + Express | Fast, async-friendly |
| Indexer | Python | Web3.py, data processing |
| Database | PostgreSQL + TimescaleDB | Relational + time-series |
| Cache | Redis | Real-time data, rate limiting |
| Queue | BullMQ | Job scheduling |
| Hosting | Cloudflare Pages (FE) + Railway (BE) | Fast edge deployment |

### Data Sources

| Source | Data Provided | Update Frequency |
|--------|---------------|------------------|
| **DeFiLlama API** | TVL, yields, protocols | 5 min |
| **The Graph** | On-chain events, pools | Real-time |
| **Direct RPC** | Live pool states | 60 sec |
| **CoinGecko API** | Token prices | 60 sec |
| **DefiSafety** | Audit/security scores | Daily |
| **Protocol APIs** | Native yield data | Varies |

### API Endpoints

```yaml
# Core Endpoints
GET  /api/v1/farms                 # List all farms (paginated)
GET  /api/v1/farms/:id             # Single farm details
GET  /api/v1/farms/search          # Search farms

# Filters
GET  /api/v1/chains                # Supported chains
GET  /api/v1/protocols             # Supported protocols
GET  /api/v1/tokens                # Token list

# Analytics
GET  /api/v1/farms/:id/history     # Historical APY
GET  /api/v1/farms/:id/risk        # Risk breakdown
POST /api/v1/calculator/il         # IL calculator

# Portfolio (Phase 2)
GET  /api/v1/portfolio/:address    # User positions
GET  /api/v1/portfolio/:address/pnl # P&L calculation

# Alerts (Phase 2)
POST /api/v1/alerts                # Create alert
GET  /api/v1/alerts                # List user alerts
DELETE /api/v1/alerts/:id          # Delete alert
```

### Data Models

```typescript
// Database Schema (Prisma)

model Chain {
  id        String   @id
  name      String
  chainId   Int      @unique
  rpcUrl    String
  explorerUrl String
  pools     Pool[]
}

model Protocol {
  id          String   @id
  name        String
  website     String
  logoUrl     String
  auditStatus String   @default("Unknown")
  riskScore   Int      @default(50)
  pools       Pool[]
  chains      Chain[]  @relation("ProtocolChains")
}

model Token {
  id            String   @id
  symbol        String
  name          String
  decimals      Int
  address       String
  chainId       String
  isStablecoin  Boolean  @default(false)
  logoUrl       String?
  price         Float?
  priceUpdatedAt DateTime?
}

model Pool {
  id              String   @id @default(cuid())
  protocolId      String
  chainId         String
  name            String
  poolAddress     String
  poolType        String   // AMM, Lending, Staking, Vault

  token0Id        String
  token1Id        String?

  tvl             Float
  baseAPY         Float
  rewardAPY       Float
  totalAPY        Float

  riskScore       Int
  ilRisk          String   // None, Low, Medium, High

  farmUrl         String
  isActive        Boolean  @default(true)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  protocol        Protocol @relation(fields: [protocolId], references: [id])
  chain           Chain    @relation(fields: [chainId], references: [id])
  apyHistory      APYHistory[]

  @@unique([chainId, poolAddress])
}

model APYHistory {
  id        String   @id @default(cuid())
  poolId    String
  baseAPY   Float
  rewardAPY Float
  totalAPY  Float
  tvl       Float
  timestamp DateTime @default(now())

  pool      Pool     @relation(fields: [poolId], references: [id])

  @@index([poolId, timestamp])
}
```

---

## UI/UX Requirements

### Design Principles

1. **Data Density**: Show maximum useful data without clutter
2. **Speed**: <2s initial load, <500ms interactions
3. **Clarity**: Clear risk indicators, no jargon without tooltips
4. **Mobile-First**: Responsive design, usable on mobile

### Key Screens

#### 1. Dashboard (Home)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo] VibeDeFi Farm Analyzer              [Chain Filter] [Connect] │
├─────────────────────────────────────────────────────────────────────┤
│  Summary Cards:                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ 1,247    │ │ $48.2B   │ │ 12.4%    │ │ 156      │               │
│  │ Pools    │ │ Total TVL│ │ Avg APY  │ │ Protocols│               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
├─────────────────────────────────────────────────────────────────────┤
│  Filters: [Chain ▼] [Protocol ▼] [Type ▼] [Risk ▼] [More Filters]  │
├─────────────────────────────────────────────────────────────────────┤
│  Sort by: [APY ▼]                                    View: [≡] [⊞] │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Pool              Chain    TVL        APY      Risk    Actions  ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ USDC-USDT        [ETH]    $245M      4.2%     🟢 Low   [Farm]  ││
│  │ Curve 3pool                                                     ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ ETH-USDC         [ARB]    $89M       18.5%    🟡 Med   [Farm]  ││
│  │ Uniswap V3                          +2.1%                       ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ SOL-USDC         [SOL]    $34M       24.2%    🟡 Med   [Farm]  ││
│  │ Raydium                             -0.8%                       ││
│  └─────────────────────────────────────────────────────────────────┘│
│                        [Load More]                                   │
└─────────────────────────────────────────────────────────────────────┘
```

#### 2. Pool Detail Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back    ETH-USDC on Uniswap V3                    [🔗] [Farm →] │
├─────────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │ Total APY      │  │ TVL            │  │ Risk Score     │        │
│  │ 18.5%          │  │ $89.2M         │  │ 42/100 🟡      │        │
│  │ Base: 12.3%    │  │ +2.4% 24h      │  │ Medium Risk    │        │
│  │ Rewards: 6.2%  │  │                │  │                │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
├─────────────────────────────────────────────────────────────────────┤
│  APY History (30d)                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │     25% ─┐      ╱╲                                              ││
│  │     20% ─┤    ╱    ╲    ╱──╲                                    ││
│  │     15% ─┤ ──╱        ──      ╲──────                           ││
│  │     10% ─┤                                                      ││
│  │      └───┴────────────────────────────────────────────────────  ││
│  │         Jan 1    Jan 7    Jan 14    Jan 21    Jan 28            ││
│  └─────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│  Risk Breakdown                                                      │
│  ├── Smart Contract: 35/100  [████████░░] Audited by Trail of Bits │
│  ├── Impermanent Loss: 55/100 [████████████░░░] High volatility    │
│  ├── Protocol Risk: 25/100   [█████░░░░░] Established protocol     │
│  ├── Liquidity: 40/100       [████████░░] Good depth               │
│  └── Reward Token: 50/100    [██████████░] UNI - Moderate utility  │
├─────────────────────────────────────────────────────────────────────┤
│  Pool Details                                                        │
│  Contract: 0x8ad5...3f2a  [Copy] [Etherscan]                        │
│  Protocol: Uniswap V3                                                │
│  Chain: Arbitrum                                                     │
│  Fee Tier: 0.3%                                                      │
│  Created: 2024-03-15                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3. IL Calculator

```
┌─────────────────────────────────────────────────────────────────────┐
│  Impermanent Loss Calculator                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Token A: [ETH        ▼]    Token B: [USDC       ▼]                │
│                                                                      │
│  Initial Price Ratio: [$3,500 per ETH]                              │
│                                                                      │
│  Simulate Price Change:                                              │
│  ├──●─────────────────────────────────────────────────────┤         │
│  -90%              0%              +100%           +500%             │
│                                                                      │
│  Current Simulation: ETH +50% ($5,250)                              │
├─────────────────────────────────────────────────────────────────────┤
│  Results:                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Impermanent Loss │  │ LP Value         │  │ HODL Value       │  │
│  │     -2.02%       │  │    $10,798       │  │    $11,000       │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                      │
│  To break even, you need: 2.06% in trading fees                     │
│  At current APY (18.5%), breakeven in: 41 days                      │
├─────────────────────────────────────────────────────────────────────┤
│  IL Chart:                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │      0% ┤                    ●                                  ││
│  │     -5% ┤         ╱────────────────╲                            ││
│  │    -10% ┤      ╱                      ╲                         ││
│  │    -25% ┤   ╱                            ╲                      ││
│  │    -50% ┤╱                                  ╲                   ││
│  │         └─────────────────────────────────────                  ││
│  │        -90%    -50%     0%    +100%   +500%                     ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| Primary | `#6366F1` (Indigo) | CTAs, links, highlights |
| Success/Low Risk | `#22C55E` (Green) | Low risk, positive changes |
| Warning/Med Risk | `#EAB308` (Yellow) | Medium risk, caution |
| Danger/High Risk | `#EF4444` (Red) | High risk, negative changes |
| Background | `#0F172A` (Dark slate) | Dark mode default |
| Surface | `#1E293B` (Slate) | Cards, panels |
| Text Primary | `#F8FAFC` (White) | Main text |
| Text Secondary | `#94A3B8` (Gray) | Secondary text |

---

## Non-Functional Requirements

### Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load | < 2s | Lighthouse |
| API Response | < 200ms | p95 latency |
| Data Freshness | < 5 min | Time since last update |
| Uptime | 99.5% | Monthly SLA |

### Scalability

- Support 10,000+ concurrent users
- Handle 1,500+ pools across all chains
- Store 1 year of historical APY data
- Process 100+ API requests/second

### Security

- [ ] No private key storage
- [ ] Read-only wallet connections
- [ ] Rate limiting on all endpoints
- [ ] Input validation and sanitization
- [ ] HTTPS only
- [ ] CSP headers configured
- [ ] Regular dependency audits

---

## Phases & Milestones

### Phase 1: MVP (4-6 weeks)

**Goal**: Launch core yield aggregation for Ethereum + Arbitrum

- [ ] Data indexer for DeFiLlama + direct protocols
- [ ] Dashboard with filtering and sorting
- [ ] Basic risk scoring
- [ ] IL calculator
- [ ] 10+ protocols integrated
- [ ] Mobile-responsive design

**Success Metrics**:
- 500+ daily active users
- <3s page load time
- 50+ pools displayed

### Phase 2: Multi-Chain Expansion (4 weeks)

**Goal**: Add remaining chains and advanced features

- [ ] Base, BNB Chain, Solana support
- [ ] Wallet connection (read-only)
- [ ] Portfolio tracking
- [ ] APY historical charts
- [ ] 50+ protocols integrated

**Success Metrics**:
- 2,000+ DAU
- 90%+ data accuracy
- 500+ pools displayed

### Phase 3: Alerts & API (4 weeks)

**Goal**: Notification system and developer API

- [ ] Alert system (email, Telegram, Discord)
- [ ] Public REST API
- [ ] GraphQL API
- [ ] API key management
- [ ] Rate limiting tiers

**Success Metrics**:
- 100+ active alert subscriptions
- 50+ API integrations
- <100ms API response time

### Phase 4: Advanced Analytics (Ongoing)

**Goal**: Differentiated analytics features

- [ ] Yield strategy recommendations
- [ ] Auto-compound calculator
- [ ] Gas optimization suggestions
- [ ] Social features (share strategies)
- [ ] Premium tier features

---

## Success Metrics

### Key Performance Indicators

| KPI | Phase 1 Target | Phase 2 Target | Phase 3 Target |
|-----|---------------|----------------|----------------|
| Daily Active Users | 500 | 2,000 | 5,000 |
| Pools Indexed | 200 | 500 | 1,000 |
| Protocols Covered | 15 | 40 | 75 |
| Data Accuracy | 85% | 90% | 95% |
| User Retention (7d) | 20% | 30% | 40% |
| API Uptime | 99% | 99.5% | 99.9% |

### Analytics to Track

- Page views and user flows
- Most-used filters
- Popular protocols/chains
- Alert conversion rates
- API usage patterns
- Error rates by endpoint

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| API rate limits | High | Medium | Multiple data sources, caching |
| Data inaccuracy | High | Medium | Cross-verify sources, monitoring |
| Smart contract exploits | High | Low | Only read data, no transactions |
| Regulatory changes | Medium | Low | No custody, information only |
| Competitor launch | Medium | Medium | Fast iteration, unique features |
| Protocol API changes | Medium | High | Abstraction layer, monitoring |

---

## Open Questions

1. **Monetization**: Free tier limits? Premium features? API pricing?
2. **Data Sources**: Build indexer vs. rely on DeFiLlama?
3. **Wallet Integration**: Read-only sufficient or transaction support?
4. **Mobile**: PWA vs. native app for Phase 3+?
5. **Social**: User accounts and saved strategies?

---

## Appendix

### Competitive Analysis

| Competitor | Strengths | Weaknesses |
|------------|-----------|------------|
| DeFiLlama | Comprehensive data, trusted | No risk scoring, basic UI |
| Zapper | Great UX, portfolio tracking | Limited yield data |
| DeBank | Excellent portfolio view | No yield comparison |
| APY.vision | IL tracking | Limited protocol coverage |
| Vaults.fyi | Clean UI | Yield aggregators only |

### Glossary

- **APY**: Annual Percentage Yield (compounded)
- **APR**: Annual Percentage Rate (non-compounded)
- **TVL**: Total Value Locked
- **IL**: Impermanent Loss
- **AMM**: Automated Market Maker
- **LP**: Liquidity Provider

---

*Document Version: 1.0*
*Last Updated: January 2026*
