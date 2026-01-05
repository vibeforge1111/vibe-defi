/**
 * Calculate impermanent loss for a 50/50 liquidity pool
 * @param priceRatio - The ratio of current price to initial price (e.g., 1.5 for 50% increase)
 * @returns Impermanent loss as a decimal (e.g., -0.0572 for -5.72%)
 */
export function calculateImpermanentLoss(priceRatio: number): number {
  if (priceRatio <= 0) return 0;

  // IL formula: 2 * sqrt(r) / (1 + r) - 1
  // where r is the price ratio
  const sqrtR = Math.sqrt(priceRatio);
  const il = (2 * sqrtR) / (1 + priceRatio) - 1;

  return il;
}

/**
 * Calculate LP position value
 */
export function calculateLPValue(
  token0Amount: number,
  token1Amount: number,
  _initialPrice: number,
  currentPrice: number
): {
  lpValue: number;
  holdValue: number;
  impermanentLoss: number;
  token0InLP: number;
  token1InLP: number;
} {
  // Initial LP value (constant product: k = x * y)
  const k = token0Amount * token1Amount;

  // New token amounts in LP (maintaining constant product)
  // x * y = k, and price = y/x
  // So: x = sqrt(k / price), y = sqrt(k * price)
  const token0InLP = Math.sqrt(k / currentPrice);
  const token1InLP = Math.sqrt(k * currentPrice);

  // Current LP value
  const lpValue = token0InLP * currentPrice + token1InLP;

  // HODL value (if we just held the initial tokens)
  const holdValue = token0Amount * currentPrice + token1Amount;

  // Impermanent loss
  const impermanentLoss = (lpValue - holdValue) / holdValue;

  return {
    lpValue,
    holdValue,
    impermanentLoss,
    token0InLP,
    token1InLP,
  };
}

/**
 * Calculate breakeven APY needed to overcome IL
 * @param ilPercent - Impermanent loss as a percentage (e.g., -5.72)
 * @param days - Number of days
 * @returns Required APY percentage
 */
export function calculateBreakevenAPY(ilPercent: number, days: number): number {
  if (days <= 0) return 0;

  // Convert daily return needed to annual
  const ilDecimal = Math.abs(ilPercent) / 100;
  const dailyReturn = ilDecimal / days;
  const annualReturn = dailyReturn * 365;

  return annualReturn * 100;
}

/**
 * Calculate days to breakeven given APY and IL
 */
export function calculateDaysToBreakeven(ilPercent: number, apy: number): number {
  if (apy <= 0) return Infinity;

  const ilDecimal = Math.abs(ilPercent) / 100;
  const dailyReturn = apy / 100 / 365;

  return ilDecimal / dailyReturn;
}

/**
 * Generate IL curve data points for charting
 */
export function generateILCurveData(
  minRatio = 0.1,
  maxRatio = 5,
  points = 50
): Array<{ priceChange: number; il: number }> {
  const data: Array<{ priceChange: number; il: number }> = [];
  const step = (maxRatio - minRatio) / points;

  for (let ratio = minRatio; ratio <= maxRatio; ratio += step) {
    const il = calculateImpermanentLoss(ratio);
    const priceChange = (ratio - 1) * 100; // Convert to percentage change

    data.push({
      priceChange,
      il: il * 100, // Convert to percentage
    });
  }

  return data;
}
