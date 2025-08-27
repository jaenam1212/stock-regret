
export interface StockData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockInfo {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  data: StockData[];
  meta: {
    companyName: string;
    currency: string;
    exchangeName: string;
    lastUpdated: string;
  };
}

export interface CalculationResult {
  investAmount: number;
  investDate: string;
  pastPrice: number;
  currentPrice: number;
  shares: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  yearlyReturn: number;
  // 적립식 투자 관련 정보 (옵셔널)
  isMonthly?: boolean;
  monthlyAmount?: number;
  totalMonths?: number;
}

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type MarketType = 'us' | 'kr' | 'crypto';

export interface MarketTab {
  id: MarketType;
  label: string;
  searchPlaceholder: string;
}