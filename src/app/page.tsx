import StockContent from '@/app/components/StockContent';

export default function Home() {
  // 정적 생성을 위한 기본 데이터 (클라이언트에서 실제 데이터로 교체됨)
  const initialStockInfo = {
    symbol: 'NVDA',
    currentPrice: 150.0,
    change: 2.5,
    changePercent: 1.67,
    data: [
      {
        time: String(Math.floor(Date.now() / 1000) - 86400 * 4),
        open: 147.5,
        high: 149.0,
        low: 147.0,
        close: 148.0,
        volume: 1000000,
      },
      {
        time: String(Math.floor(Date.now() / 1000) - 86400 * 3),
        open: 148.0,
        high: 150.0,
        low: 147.5,
        close: 149.5,
        volume: 1200000,
      },
      {
        time: String(Math.floor(Date.now() / 1000) - 86400 * 2),
        open: 149.5,
        high: 151.0,
        low: 149.0,
        close: 150.0,
        volume: 1100000,
      },
      {
        time: String(Math.floor(Date.now() / 1000) - 86400),
        open: 150.0,
        high: 152.0,
        low: 149.5,
        close: 151.5,
        volume: 1300000,
      },
      {
        time: String(Math.floor(Date.now() / 1000)),
        open: 151.5,
        high: 153.0,
        low: 150.5,
        close: 152.0,
        volume: 1400000,
      },
    ],
    meta: {
      companyName: 'NVIDIA Corporation',
      currency: 'USD',
      exchangeName: 'NASDAQ',
      lastUpdated: new Date(0).toISOString(), // 목 데이터로 표시
    },
  };

  return <StockContent initialStockInfo={initialStockInfo} />;
}
