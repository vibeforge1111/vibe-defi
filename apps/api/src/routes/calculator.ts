import { Router } from 'express';
import { validate } from '../middleware/validator.js';
import { ILCalculatorSchema } from '../types/index.js';
import { z } from 'zod';

export const calculatorRoutes: Router = Router();

/**
 * Calculate impermanent loss for a 50/50 liquidity pool
 */
function calculateIL(token0Amount: number, token1Amount: number, _initialPrice: number, currentPrice: number) {
  // Initial LP value (constant product: k = x * y)
  const k = token0Amount * token1Amount;

  // New token amounts in LP (maintaining constant product)
  const token0InLP = Math.sqrt(k / currentPrice);
  const token1InLP = Math.sqrt(k * currentPrice);

  // Current LP value in token1 terms
  const lpValue = token0InLP * currentPrice + token1InLP;

  // HODL value (if we just held the initial tokens)
  const holdValue = token0Amount * currentPrice + token1Amount;

  // Impermanent loss percentage
  const impermanentLoss = ((lpValue - holdValue) / holdValue) * 100;

  // Calculate breakeven fees
  const breakEvenFees = Math.abs(impermanentLoss);

  return {
    impermanentLoss: Number(impermanentLoss.toFixed(4)),
    lpValue: Number(lpValue.toFixed(2)),
    holdValue: Number(holdValue.toFixed(2)),
    token0InLP: Number(token0InLP.toFixed(6)),
    token1InLP: Number(token1InLP.toFixed(6)),
    breakEvenFees: Number(breakEvenFees.toFixed(4)),
  };
}

calculatorRoutes.post('/il', validate(ILCalculatorSchema), (req, res) => {
  const { token0Amount, token1Amount, initialPrice, currentPrice } =
    req.body as z.infer<typeof ILCalculatorSchema>['body'];

  const result = calculateIL(token0Amount, token1Amount, initialPrice, currentPrice);

  res.json({ data: result });
});
