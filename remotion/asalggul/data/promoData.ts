export interface PromoScenario {
  stockName: string;
  symbol: string;
  investDate: string;
  investAmount: number;
  pastPrice: number;
  currentPrice: number;
  currency: 'KRW' | 'USD';
}

export const DEFAULT_SCENARIO: PromoScenario = {
  stockName: '비트코인',
  symbol: 'BTC-USD',
  investDate: '2024.01.01',
  investAmount: 1_000_000,
  pastPrice: 56_800_000,
  currentPrice: 145_000_000,
  currency: 'KRW',
};

export const SCENARIOS: PromoScenario[] = [
  DEFAULT_SCENARIO,
  {
    stockName: 'NVIDIA',
    symbol: 'NVDA',
    investDate: '2023.01.01',
    investAmount: 1_000_000,
    pastPrice: 14.63,
    currentPrice: 142.5,
    currency: 'USD',
  },
  {
    stockName: '테슬라',
    symbol: 'TSLA',
    investDate: '2020.01.01',
    investAmount: 1_000_000,
    pastPrice: 28.3,
    currentPrice: 395.0,
    currency: 'USD',
  },
];
