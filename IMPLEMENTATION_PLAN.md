# VibeDeFi Farm Analyzer - Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for building the VibeDeFi Farm Analyzer. The plan is organized into phases with clear deliverables and dependencies.

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Project Setup

#### Task 1.1.1: Initialize Monorepo
```bash
# Create project structure
mkdir -p vibe-defi/{apps/{web,api},packages/{indexer,shared}}
cd vibe-defi
pnpm init
```

**Deliverables:**
- [ ] pnpm workspace configuration
- [ ] Root package.json with scripts
- [ ] .gitignore, .prettierrc, .eslintrc
- [ ] TypeScript base configuration

**Files to create:**
- `pnpm-workspace.yaml`
- `package.json`
- `tsconfig.base.json`
- `.gitignore`
- `.prettierrc`
- `.eslintrc.js`

#### Task 1.1.2: Setup Vite + React Frontend
```bash
cd apps/web
pnpm create vite . --template react-ts
```

**Deliverables:**
- [ ] Vite configuration with path aliases
- [ ] Tailwind CSS setup
- [ ] shadcn/ui initialization
- [ ] React Router setup
- [ ] TanStack Query provider
- [ ] Zustand store skeleton

**Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.4.7",
    "recharts": "^2.10.0",
    "viem": "^2.7.0",
    "@solana/web3.js": "^1.87.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

#### Task 1.1.3: Setup Node.js Backend
```bash
cd apps/api
pnpm init
```

**Deliverables:**
- [ ] Express server with TypeScript
- [ ] Prisma ORM setup
- [ ] Basic middleware (CORS, helmet, rate limiting)
- [ ] Error handling middleware
- [ ] Health check endpoint

**Dependencies:**
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.0",
    "ioredis": "^5.3.0",
    "@prisma/client": "^5.8.0",
    "zod": "^3.22.0",
    "pino": "^8.17.0",
    "pino-pretty": "^10.3.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "prisma": "^5.8.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0"
  }
}
```

#### Task 1.1.4: Setup Python Indexer
```bash
cd packages/indexer
python -m venv venv
pip install -r requirements.txt
```

**Deliverables:**
- [ ] Python project structure
- [ ] Virtual environment
- [ ] Base fetcher classes
- [ ] Database client module

**Requirements.txt:**
```
aiohttp>=3.9.0
asyncpg>=0.29.0
apscheduler>=3.10.0
python-dotenv>=1.0.0
pydantic>=2.5.0
redis>=5.0.0
```

### 1.2 Database Setup

#### Task 1.2.1: PostgreSQL + TimescaleDB Schema
**Deliverables:**
- [ ] Prisma schema file
- [ ] Initial migration
- [ ] TimescaleDB hypertable setup
- [ ] Seed data for chains/protocols

**Steps:**
1. Create Prisma schema (see ARCHITECTURE.md)
2. Run `npx prisma migrate dev --name init`
3. Execute TimescaleDB SQL for hypertables
4. Create seed script for static data

#### Task 1.2.2: Redis Setup
**Deliverables:**
- [ ] Redis connection module
- [ ] Cache service with TTL management
- [ ] Cache key naming convention

---

## Phase 2: Core Data Pipeline (Week 2-3)

### 2.1 Data Fetchers

#### Task 2.1.1: DeFiLlama Fetcher
**Deliverables:**
- [ ] Fetch all pools from yields API
- [ ] Filter by supported chains
- [ ] Handle rate limiting
- [ ] Error handling and retries

**API Endpoints:**
- `GET https://yields.llama.fi/pools` - All pools
- `GET https://yields.llama.fi/chart/{pool}` - Pool history

#### Task 2.1.2: CoinGecko Price Fetcher
**Deliverables:**
- [ ] Fetch token prices
- [ ] Batch requests (250 tokens/request)
- [ ] Cache prices in Redis

#### Task 2.1.3: Protocol-Specific Fetchers (Optional Enhancement)
For more accurate data, implement direct fetchers:
- [ ] Uniswap V3 subgraph
- [ ] Aave V3 subgraph
- [ ] Curve API

### 2.2 Data Processing

#### Task 2.2.1: Pool Normalizer
**Deliverables:**
- [ ] Normalize pool data from different sources
- [ ] Map chain names to internal IDs
- [ ] Map protocol names to internal IDs
- [ ] Extract token information

**Normalization Rules:**
```python
CHAIN_MAP = {
    "ethereum": "ethereum",
    "Ethereum": "ethereum",
    "arbitrum": "arbitrum",
    "Arbitrum": "arbitrum",
    "arbitrum_one": "arbitrum",
    "base": "base",
    "Base": "base",
    "bsc": "bnb",
    "BSC": "bnb",
    "Binance": "bnb",
    "solana": "solana",
    "Solana": "solana",
}
```

#### Task 2.2.2: Risk Calculator
**Deliverables:**
- [ ] Smart contract risk scoring
- [ ] Impermanent loss risk detection
- [ ] Protocol trust scoring
- [ ] Liquidity risk assessment
- [ ] Reward token risk evaluation

#### Task 2.2.3: Data Validator
**Deliverables:**
- [ ] Validate APY ranges (0-10000%)
- [ ] Validate TVL (> $10k)
- [ ] Check for required fields
- [ ] Flag anomalies

### 2.3 Scheduler

#### Task 2.3.1: Indexer Scheduler
**Deliverables:**
- [ ] Pool indexing job (every 5 min)
- [ ] Price update job (every 1 min)
- [ ] History snapshot job (every 1 hour)
- [ ] Stale data cleanup job (daily)

---

## Phase 3: Backend API (Week 3-4)

### 3.1 Core Endpoints

#### Task 3.1.1: Farms Endpoints
**Deliverables:**
- [ ] `GET /api/v1/farms` - List farms with filters
- [ ] `GET /api/v1/farms/:id` - Farm details
- [ ] `GET /api/v1/farms/:id/history` - APY history

**Query Parameters:**
- chains, protocols, poolType
- minTvl, maxRisk, stablecoinOnly
- sort, limit, offset

#### Task 3.1.2: Reference Data Endpoints
**Deliverables:**
- [ ] `GET /api/v1/chains` - Supported chains
- [ ] `GET /api/v1/protocols` - All protocols
- [ ] `GET /api/v1/tokens` - Token list

#### Task 3.1.3: Calculator Endpoint
**Deliverables:**
- [ ] `POST /api/v1/calculator/il` - IL calculation

### 3.2 Services

#### Task 3.2.1: Farm Service
**Deliverables:**
- [ ] Query builder for filters
- [ ] Sorting logic
- [ ] Pagination
- [ ] Response transformation

#### Task 3.2.2: Cache Service
**Deliverables:**
- [ ] Cache-aside pattern
- [ ] TTL management
- [ ] Cache invalidation on updates

#### Task 3.2.3: Price Service
**Deliverables:**
- [ ] Get token prices
- [ ] Price change calculations
- [ ] Historical price lookup

---

## Phase 4: Frontend Core (Week 4-5)

### 4.1 Layout & Navigation

#### Task 4.1.1: App Shell
**Deliverables:**
- [ ] Header with logo, chain selector
- [ ] Sidebar navigation (mobile: drawer)
- [ ] Footer with links
- [ ] Dark theme (default)

#### Task 4.1.2: Routing Setup
**Routes:**
```typescript
const routes = [
  { path: '/', element: <Dashboard /> },
  { path: '/farm/:id', element: <FarmDetail /> },
  { path: '/calculator', element: <Calculator /> },
  { path: '/portfolio', element: <Portfolio /> },  // Phase 2
];
```

### 4.2 Dashboard Page

#### Task 4.2.1: Summary Cards
**Deliverables:**
- [ ] Total pools count
- [ ] Total TVL across all pools
- [ ] Average APY
- [ ] Protocol count

#### Task 4.2.2: Filter Bar
**Deliverables:**
- [ ] Chain multi-select
- [ ] Protocol multi-select
- [ ] Pool type dropdown
- [ ] Risk slider
- [ ] TVL minimum input
- [ ] Stablecoin toggle
- [ ] Clear filters button
- [ ] URL state sync

#### Task 4.2.3: Farm Table
**Deliverables:**
- [ ] Sortable columns (APY, TVL, Risk)
- [ ] Pool name with tokens
- [ ] Chain badge
- [ ] Protocol logo
- [ ] APY with breakdown tooltip
- [ ] TVL with 24h change
- [ ] Risk score badge (green/yellow/red)
- [ ] Farm link button
- [ ] Row click → detail page

#### Task 4.2.4: Pagination
**Deliverables:**
- [ ] Page size selector (25, 50, 100)
- [ ] Page navigation
- [ ] Total count display

### 4.3 Farm Detail Page

#### Task 4.3.1: Pool Header
**Deliverables:**
- [ ] Pool name and tokens
- [ ] Protocol and chain info
- [ ] Farm button (external link)
- [ ] Share button

#### Task 4.3.2: Metrics Cards
**Deliverables:**
- [ ] Total APY (base + rewards)
- [ ] TVL with 24h change
- [ ] Risk score with category

#### Task 4.3.3: APY History Chart
**Deliverables:**
- [ ] Line chart (Recharts)
- [ ] 7d / 30d / 90d toggle
- [ ] Tooltip with exact values
- [ ] Base vs Reward APY breakdown

#### Task 4.3.4: Risk Breakdown
**Deliverables:**
- [ ] Progress bars for each factor
- [ ] Tooltips explaining each factor
- [ ] Warnings list

#### Task 4.3.5: Pool Details
**Deliverables:**
- [ ] Contract address (copyable)
- [ ] Block explorer link
- [ ] Token addresses
- [ ] Pool creation date

### 4.4 IL Calculator Page

#### Task 4.4.1: Input Form
**Deliverables:**
- [ ] Token A selector
- [ ] Token B selector
- [ ] Initial amounts
- [ ] Price change slider (-90% to +500%)

#### Task 4.4.2: Results Display
**Deliverables:**
- [ ] Impermanent loss percentage
- [ ] LP value vs HODL value
- [ ] Token amounts in LP
- [ ] Breakeven fees needed

#### Task 4.4.3: IL Chart
**Deliverables:**
- [ ] IL curve visualization
- [ ] Current position marker
- [ ] Interactive hover

---

## Phase 5: Integration & Polish (Week 5-6)

### 5.1 Data Integration

#### Task 5.1.1: API Client
**Deliverables:**
- [ ] Typed API client
- [ ] Error handling
- [ ] Request interceptors

#### Task 5.1.2: React Query Hooks
**Deliverables:**
- [ ] `useFarms(filters)`
- [ ] `useFarm(id)`
- [ ] `useFarmHistory(id, days)`
- [ ] `useChains()`
- [ ] `useProtocols()`

#### Task 5.1.3: State Management
**Deliverables:**
- [ ] Filter store (Zustand)
- [ ] Settings store (theme, defaults)
- [ ] URL state sync utility

### 5.2 UI Polish

#### Task 5.2.1: Loading States
**Deliverables:**
- [ ] Skeleton loaders for table
- [ ] Skeleton for cards
- [ ] Spinner for actions

#### Task 5.2.2: Error States
**Deliverables:**
- [ ] Error boundary
- [ ] API error display
- [ ] Retry functionality

#### Task 5.2.3: Empty States
**Deliverables:**
- [ ] No results message
- [ ] Suggestions for filters

#### Task 5.2.4: Responsive Design
**Deliverables:**
- [ ] Mobile table (card view)
- [ ] Touch-friendly filters
- [ ] Responsive charts

### 5.3 Performance

#### Task 5.3.1: Frontend Optimization
**Deliverables:**
- [ ] Code splitting by route
- [ ] Image optimization
- [ ] Bundle analysis
- [ ] Lighthouse audit (>90 score)

#### Task 5.3.2: Backend Optimization
**Deliverables:**
- [ ] Query optimization
- [ ] Response compression
- [ ] Cache hit rate monitoring

---

## Phase 6: Deployment (Week 6)

### 6.1 Infrastructure

#### Task 6.1.1: Database Deployment
**Options:**
- Supabase (PostgreSQL + built-in TimescaleDB alternative)
- Neon (Serverless PostgreSQL)
- Railway (PostgreSQL)

**Deliverables:**
- [ ] Production database instance
- [ ] Connection pooling
- [ ] Backups configured

#### Task 6.1.2: Redis Deployment
**Options:**
- Upstash (Serverless Redis)
- Railway Redis

**Deliverables:**
- [ ] Production Redis instance
- [ ] Connection configuration

#### Task 6.1.3: Backend Deployment
**Platform:** Railway

**Deliverables:**
- [ ] API service deployed
- [ ] Python indexer as cron service
- [ ] Environment variables configured
- [ ] Health checks enabled

#### Task 6.1.4: Frontend Deployment
**Platform:** Cloudflare Pages

**Deliverables:**
- [ ] Build pipeline configured
- [ ] Custom domain setup
- [ ] SSL certificate

### 6.2 DevOps

#### Task 6.2.1: CI/CD Pipeline
**Deliverables:**
- [ ] GitHub Actions workflow
- [ ] Lint + type check on PR
- [ ] Auto-deploy on merge to main
- [ ] Preview deployments for PRs

#### Task 6.2.2: Monitoring
**Deliverables:**
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] API latency alerts

---

## Phase 7: Additional Chains (Week 7-8)

### 7.1 BNB Chain Integration

#### Task 7.1.1: Chain Configuration
**Deliverables:**
- [ ] Add BNB chain to database
- [ ] Configure RPC endpoints
- [ ] Add BNB protocols (PancakeSwap, Venus, Alpaca)

#### Task 7.1.2: Protocol Fetchers
**Deliverables:**
- [ ] PancakeSwap pools
- [ ] Venus lending
- [ ] Alpaca Finance

### 7.2 Solana Integration

#### Task 7.2.1: Chain Configuration
**Deliverables:**
- [ ] Add Solana chain
- [ ] Configure Helius/QuickNode RPC
- [ ] Add Solana protocols (Raydium, Orca, Marinade, Kamino)

#### Task 7.2.2: Solana-Specific Handling
**Deliverables:**
- [ ] Different address format
- [ ] SPL token handling
- [ ] Solana-specific risk factors

---

## Phase 8: Advanced Features (Week 8-10)

### 8.1 Portfolio Tracking

#### Task 8.1.1: Wallet Connection
**Deliverables:**
- [ ] EVM wallet connection (viem)
- [ ] Solana wallet connection
- [ ] Read-only mode (no signing)

#### Task 8.1.2: Position Detection
**Deliverables:**
- [ ] Detect LP positions
- [ ] Fetch position values
- [ ] Calculate P&L

#### Task 8.1.3: Portfolio Dashboard
**Deliverables:**
- [ ] Positions list
- [ ] Total value
- [ ] Aggregate P&L
- [ ] IL tracking per position

### 8.2 Alerts System

#### Task 8.2.1: Alert Configuration
**Deliverables:**
- [ ] Alert creation UI
- [ ] Alert types (APY drop, TVL drop, risk change)
- [ ] Threshold configuration

#### Task 8.2.2: Alert Processing
**Deliverables:**
- [ ] Background job for alert checks
- [ ] Notification delivery (email, Telegram)
- [ ] Rate limiting notifications

---

## Development Guidelines

### Code Standards

**TypeScript:**
- Strict mode enabled
- No `any` types
- Explicit return types for functions

**React:**
- Functional components only
- Custom hooks for logic reuse
- Memoization where needed

**API:**
- RESTful conventions
- Zod validation on all inputs
- Consistent error format

### Git Workflow

```
main (production)
  └── develop (staging)
        ├── feature/farm-table
        ├── feature/risk-calculator
        └── fix/cache-invalidation
```

**Commit Convention:**
```
feat: add farm filtering by chain
fix: correct IL calculation formula
chore: update dependencies
docs: add API documentation
```

### Testing Strategy

**Unit Tests:**
- Risk calculator functions
- IL calculation functions
- Data transformers

**Integration Tests:**
- API endpoints
- Database queries

**E2E Tests (Phase 2):**
- Critical user flows
- Filter interactions

---

## Success Criteria per Phase

| Phase | Success Criteria |
|-------|-----------------|
| 1 | Project builds, DB migrations run |
| 2 | Indexer fetches 500+ pools successfully |
| 3 | API returns filtered pools <200ms |
| 4 | Dashboard loads with real data |
| 5 | Lighthouse score >90, no critical bugs |
| 6 | Production deployment live |
| 7 | 5 chains, 1000+ pools indexed |
| 8 | Wallet connection working |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| DeFiLlama API changes | Abstract fetcher layer, monitor for changes |
| Rate limiting | Implement backoff, multiple API keys |
| Data accuracy | Cross-validate with protocol APIs |
| Performance at scale | Pagination, caching, query optimization |
| Chain RPC failures | Multiple RPC providers, fallbacks |

---

## Resource Requirements

**Development:**
- 1-2 Full-stack developers
- Familiarity with React, Node.js, Python
- DeFi/Web3 knowledge helpful

**Infrastructure (Monthly):**
- Database: ~$25-50 (Supabase/Neon)
- Redis: ~$10 (Upstash)
- Backend hosting: ~$20 (Railway)
- Frontend: Free (Cloudflare Pages)
- **Total: ~$55-80/month**

---

*Implementation Plan Version: 1.0*
*Last Updated: January 2026*
