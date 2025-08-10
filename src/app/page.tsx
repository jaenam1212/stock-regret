import StockContent from '@/app/components/StockContent';
import { StockInfo } from '@/types/stock';

export default async function Home() {
  // SSR로 초기 데이터 가져오기
  let stockInfo: StockInfo;
  let error: string | null = null;

  try {
    // SSR에서는 직접 외부 API 호출 (로컬 개발용)
    const externalApiBase = process.env.NEXT_PUBLIC_API_URL;

    if (externalApiBase) {
      // 외부 백엔드가 있으면 사용
      const url = `${externalApiBase.replace(/\/$/, '')}/api/stock/data?symbol=NVDA`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      stockInfo = await response.json();
    } else {
      // 로컬 개발용 기본 데이터
      stockInfo = {
        symbol: 'NVDA',
        currentPrice: 150.0,
        change: 2.5,
        changePercent: 1.67,
        data: [
          {
            time: '2024-01-01',
            open: 147.5,
            high: 149.0,
            low: 147.0,
            close: 148.0,
            volume: 1000000,
          },
          {
            time: '2024-01-02',
            open: 148.0,
            high: 150.0,
            low: 147.5,
            close: 149.5,
            volume: 1200000,
          },
          {
            time: '2024-01-03',
            open: 149.5,
            high: 151.0,
            low: 149.0,
            close: 150.0,
            volume: 1100000,
          },
        ],
        meta: {
          companyName: 'Apple Inc.',
          currency: 'USD',
          exchangeName: 'NASDAQ',
          lastUpdated: new Date().toISOString(),
        },
      };
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching stock data:', err);
    // 에러 시 기본 데이터로 폴백
    stockInfo = {
      symbol: 'NVDA',
      currentPrice: 0,
      change: 0,
      changePercent: 0,
      data: [],
      meta: {
        companyName: 'Apple Inc.',
        currency: 'USD',
        exchangeName: 'NASDAQ',
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  return <StockContent initialStockInfo={stockInfo} />;
}
