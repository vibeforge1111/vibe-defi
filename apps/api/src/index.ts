import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { farmRoutes } from './routes/farms.js';
import { protocolRoutes } from './routes/protocols.js';
import { chainRoutes } from './routes/chains.js';
import { calculatorRoutes } from './routes/calculator.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Body parsing
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/farms', farmRoutes);
app.use('/api/v1/protocols', protocolRoutes);
app.use('/api/v1/chains', chainRoutes);
app.use('/api/v1/calculator', calculatorRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`);
});

export default app;
