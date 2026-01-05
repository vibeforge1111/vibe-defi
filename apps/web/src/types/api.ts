export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface ILCalculatorParams {
  token0Amount: number;
  token1Amount: number;
  initialPrice: number;
  currentPrice: number;
}

export interface ILCalculatorResult {
  impermanentLoss: number;
  lpValue: number;
  holdValue: number;
  token0InLP: number;
  token1InLP: number;
  breakEvenFees: number;
}
