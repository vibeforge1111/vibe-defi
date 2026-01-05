import { Router } from 'express';
import { farmService } from '../services/farmService.js';
import { validate } from '../middleware/validator.js';
import { FarmListQuerySchema } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

export const farmRoutes: Router = Router();

// List farms with filtering
farmRoutes.get('/', validate(FarmListQuerySchema), async (req, res, next) => {
  try {
    const query = req.query as unknown as z.infer<typeof FarmListQuerySchema>['query'];

    // Normalize chains to array
    const chains = query.chains
      ? Array.isArray(query.chains) ? query.chains : [query.chains]
      : undefined;

    // Normalize protocols to array
    const protocols = query.protocols
      ? Array.isArray(query.protocols) ? query.protocols : [query.protocols]
      : undefined;

    const result = await farmService.list({
      chains,
      protocols,
      poolType: query.poolType,
      minTvl: query.minTvl,
      maxRisk: query.maxRisk,
      stablecoinOnly: query.stablecoinOnly,
      sort: query.sort,
      limit: query.limit,
      offset: query.offset,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get single farm
farmRoutes.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const farm = await farmService.get(decodeURIComponent(id));

    if (!farm) {
      throw new AppError(404, 'Farm not found');
    }

    res.json({ data: farm });
  } catch (err) {
    next(err);
  }
});

// Get farm history
farmRoutes.get('/:id/history', async (req, res, next) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const history = await farmService.getHistory(decodeURIComponent(id), days);

    res.json({ data: history });
  } catch (err) {
    next(err);
  }
});
