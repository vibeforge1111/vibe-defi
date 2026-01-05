import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { calculateLPValue, calculateDaysToBreakeven, generateILCurveData } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export function Calculator() {
  const [token0Amount, setToken0Amount] = useState(1);
  const [token1Amount, setToken1Amount] = useState(3500);
  const [initialPrice, setInitialPrice] = useState(3500);
  const [priceChange, setPriceChange] = useState(0);
  const [poolAPY, setPoolAPY] = useState(20);

  const currentPrice = initialPrice * (1 + priceChange / 100);

  const results = useMemo(() => {
    return calculateLPValue(token0Amount, token1Amount, initialPrice, currentPrice);
  }, [token0Amount, token1Amount, initialPrice, currentPrice]);

  const daysToBreakeven = calculateDaysToBreakeven(results.impermanentLoss * 100, poolAPY);

  const chartData = generateILCurveData(0.1, 5, 100);

  // Find current position on chart
  const currentPriceRatio = currentPrice / initialPrice;
  const currentIL = results.impermanentLoss * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Impermanent Loss Calculator</h1>
        <p className="text-text-secondary mt-1">
          Calculate potential impermanent loss for liquidity pool positions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Position Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-secondary">Token A Amount</label>
                <input
                  type="number"
                  value={token0Amount}
                  onChange={(e) => setToken0Amount(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-surface rounded-lg text-text-primary border border-surface focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary">Token B Amount</label>
                <input
                  type="number"
                  value={token1Amount}
                  onChange={(e) => setToken1Amount(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-surface rounded-lg text-text-primary border border-surface focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary">Initial Price (Token A in Token B)</label>
              <input
                type="number"
                value={initialPrice}
                onChange={(e) => setInitialPrice(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-surface rounded-lg text-text-primary border border-surface focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-text-secondary">
                Price Change: {priceChange > 0 ? '+' : ''}{priceChange}% (${currentPrice.toFixed(2)})
              </label>
              <input
                type="range"
                min="-90"
                max="500"
                value={priceChange}
                onChange={(e) => setPriceChange(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>-90%</span>
                <span>0%</span>
                <span>+500%</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary">Pool APY (%)</label>
              <input
                type="number"
                value={poolAPY}
                onChange={(e) => setPoolAPY(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-surface rounded-lg text-text-primary border border-surface focus:border-primary outline-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setPriceChange(-50)}
                size="sm"
              >
                -50%
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPriceChange(0)}
                size="sm"
              >
                0%
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPriceChange(100)}
                size="sm"
              >
                +100%
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPriceChange(200)}
                size="sm"
              >
                +200%
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-text-secondary">Impermanent Loss</p>
                <p className={`text-2xl font-bold mt-1 ${currentIL < 0 ? 'text-danger' : 'text-success'}`}>
                  {currentIL.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-text-secondary">LP Value</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {formatCurrency(results.lpValue)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-text-secondary">HODL Value</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {formatCurrency(results.holdValue)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-text-secondary">Token A in LP</p>
                  <p className="text-lg font-medium text-text-primary">
                    {results.token0InLP.toFixed(4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary">Token B in LP</p>
                  <p className="text-lg font-medium text-text-primary">
                    {results.token1InLP.toFixed(2)}
                  </p>
                </div>
              </div>
              {currentIL < 0 && poolAPY > 0 && (
                <div className="mt-4 pt-4 border-t border-surface">
                  <p className="text-sm text-text-secondary">
                    At {poolAPY}% APY, breakeven in:{' '}
                    <span className="text-text-primary font-medium">
                      {daysToBreakeven === Infinity
                        ? 'Never'
                        : `${Math.ceil(daysToBreakeven)} days`}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* IL Curve Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">IL Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis
                      dataKey="priceChange"
                      stroke="#94A3B8"
                      fontSize={12}
                      tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={12}
                      tickFormatter={(v) => `${v.toFixed(0)}%`}
                      domain={[-50, 5]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(v) => `Price Change: ${v > 0 ? '+' : ''}${v}%`}
                      formatter={(v: number) => [`${v.toFixed(2)}%`, 'IL']}
                    />
                    <ReferenceLine y={0} stroke="#6366F1" strokeDasharray="5 5" />
                    <ReferenceLine
                      x={(currentPriceRatio - 1) * 100}
                      stroke="#EAB308"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="il"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-text-secondary text-center mt-2">
                Yellow line shows your current position
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
