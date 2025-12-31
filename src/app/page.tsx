import StockContent from '@/app/components/StockContent';

export default function Home() {
  // SSR에서는 빈 데이터로 로딩 상태 표시 (클라이언트에서 실제 데이터 로드)
  const initialStockInfo = {
    symbol: 'NVDA',
    currentPrice: 0,
    change: 0,
    changePercent: 0,
    data: [],
    meta: {
      companyName: 'Loading...',
      currency: 'USD',
      exchangeName: 'NASDAQ',
      lastUpdated: new Date(0).toISOString(),
    },
  };

  return <StockContent initialStockInfo={initialStockInfo} />;
}
