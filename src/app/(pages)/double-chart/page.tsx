'use client';

import { getMarketType, getStockData } from '@/app/api';
import CommonHeader from '@/app/components/CommonHeader';
import TabNavigation from '@/app/components/TabNavigation';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import DualChartComparison from '@/components/calculator/DualChartComparison';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MarketType, StockInfo } from '@/types/stock';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// 기본 주식 정보
const defaultStockInfo: StockInfo = {
  symbol: 'NVDA',
  currentPrice: 150.0,
  change: 2.5,
  changePercent: 1.67,
  data: [],
  meta: {
    companyName: 'NVIDIA Corporation',
    currency: 'USD',
    exchangeName: 'NASDAQ',
    lastUpdated: new Date(0).toISOString(),
  },
};

export default function DoubleChartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stockInfo1, setStockInfo1] = useState<StockInfo>(defaultStockInfo);
  const [stockInfo2, setStockInfo2] = useState<StockInfo>({
    ...defaultStockInfo,
    symbol: 'AAPL',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL 쿼리에서 심볼 읽기
  const symbol1 = searchParams.get('symbol1') || 'NVDA';
  const symbol2 = searchParams.get('symbol2') || 'AAPL';

  const loadStockData = async (
    symbol: string,
    setStock: (stock: StockInfo) => void
  ) => {
    try {
      setLoading(true);
      const marketType = getMarketType(symbol);
      const data = await getStockData(symbol, marketType);
      setStock(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로딩 실패');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    loadStockData(symbol1, setStockInfo1);
    loadStockData(symbol2, setStockInfo2);
  }, [symbol1, symbol2]);

  const handleSearch = (newSymbol: string, marketType: MarketType) => {
    // URL 업데이트
    const params = new URLSearchParams(searchParams);
    if (!params.get('symbol1') || params.get('symbol1') === 'NVDA') {
      params.set('symbol1', newSymbol);
    } else {
      params.set('symbol2', newSymbol);
    }
    router.replace(`/double-chart?${params.toString()}`);

    // 데이터 로딩
    if (!params.get('symbol1') || params.get('symbol1') === 'NVDA') {
      loadStockData(newSymbol, setStockInfo1);
    } else {
      loadStockData(newSymbol, setStockInfo2);
    }
  };

  if (loading && (!stockInfo1.data.length || !stockInfo2.data.length)) {
    return (
      <main className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
        <CommonHeader onSearch={handleSearch} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
        <CommonHeader onSearch={handleSearch} />
        <div className="flex-1 flex items-center justify-center">
          <ErrorDisplay
            error={error}
            onRetry={() => {
              loadStockData(symbol1, setStockInfo1);
              loadStockData(symbol2, setStockInfo2);
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
      <CommonHeader onSearch={handleSearch} />

      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <TabNavigation />
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-800 p-3 sm:p-4 lg:p-6">
              <DualChartComparison />
            </div>
          </div>
        </div>

        <ChatSidebar symbol={`${stockInfo1.symbol}-${stockInfo2.symbol}`} />
      </div>
    </main>
  );
}
