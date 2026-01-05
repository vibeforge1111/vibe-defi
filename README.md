# VibeDeFi Farm Analyzer

A cross-chain DeFi yield farming analyzer that aggregates, analyzes, and ranks farming opportunities across Solana, Ethereum, Base, Arbitrum, and BNB Chain.

## Features

- **Yield Aggregation Dashboard**: Real-time APY/APR data from 90+ protocols across 5 chains
- **Risk Assessment Engine**: Calculate risk scores based on smart contract risk, IL, protocol trust, and liquidity
- **Impermanent Loss Calculator**: Interactive tool to simulate IL for any pool
- **Filtering & Sorting**: Filter by chain, protocol, TVL, risk score, and more
- **Portfolio Tracker** (Phase 2): Connect wallet to track active positions

## Tech Stack

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL + TimescaleDB (for time-series data)
- **Cache**: Redis
- **Indexer**: Python (aiohttp + APScheduler)
- **Data Sources**: DeFiLlama, CoinGecko, The Graph

## Project Structure

```
vibe-defi/
├── apps/
│   ├── web/                  # Vite + React frontend
│   └── api/                  # Node.js + Express backend
├── packages/
│   ├── indexer/              # Python data indexer
│   └── shared/               # Shared types and constants
├── docker/                   # Docker configurations
├── docs/                     # Documentation
├── PRD.md                    # Product Requirements Document
├── ARCHITECTURE.md           # Technical Architecture
└── IMPLEMENTATION_PLAN.md    # Step-by-step implementation plan
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Python 3.10+ (for indexer)
- PostgreSQL 15+
- Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibe-defi.git
cd vibe-defi
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# API
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your database credentials

# Web (optional)
cp apps/web/.env.example apps/web/.env
```

4. Set up the database:
```bash
pnpm db:migrate
pnpm db:seed
```

5. Start development servers:
```bash
# Start all services
pnpm dev

# Or start individually
pnpm dev:web  # Frontend on http://localhost:3000
pnpm dev:api  # Backend on http://localhost:3001
```

### Running the Indexer

```bash
cd packages/indexer
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python -m src.main
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/farms` | List farms with filtering |
| `GET /api/v1/farms/:id` | Get farm details |
| `GET /api/v1/farms/:id/history` | Get APY history |
| `GET /api/v1/chains` | List supported chains |
| `GET /api/v1/protocols` | List supported protocols |
| `POST /api/v1/calculator/il` | Calculate impermanent loss |

## Configuration

### Environment Variables

**Backend (`apps/api/.env`)**:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string (optional)
- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Allowed CORS origin

**Frontend (`apps/web/.env`)**:
- `VITE_API_URL` - Backend API URL

## Development

```bash
# Run linting
pnpm lint

# Run tests
pnpm test

# Build for production
pnpm build
```

## Deployment

### Frontend (Cloudflare Pages)
```bash
cd apps/web
pnpm build
# Deploy dist/ to Cloudflare Pages
```

### Backend (Railway/Render)
```bash
cd apps/api
pnpm build
# Deploy with start command: node dist/index.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

---

Built with [Claude Code](https://claude.ai/code)
