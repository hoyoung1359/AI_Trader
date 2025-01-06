export type ChartPeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y';
export type ChartType = 'line' | 'candle';
export type TechnicalIndicator = 'MA5' | 'MA20' | 'MA60' | 'MA120' | 'MACD' | 'RSI';

export interface ChartOptions {
  period: ChartPeriod;
  type: ChartType;
  indicators: TechnicalIndicator[];
} 