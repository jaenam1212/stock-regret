'use client';

import { getMarketType, getStockData } from '@/app/api';
import CommonHeader from '@/app/components/CommonHeader';
import TabNavigation from '@/app/components/TabNavigation';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import StockSimulation from '@/components/simulation/StockSimulation';
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
  data: [
    {
      time: String(Math.floor(Date.now() / 1000) - 86400 * 30),
      open: 140.0,
      high: 145.0,
      low: 138.0,
      close: 142.0,
      volume: 1000000,
    },
    {
      time: String(Math.floor(Date.now() / 1000) - 86400 * 20),
      open: 142.0,
      high: 148.0,
      low: 140.0,
      close: 146.0,
      volume: 1200000,
    },
    {
      time: String(Math.floor(Date.now() / 1000) - 86400 * 10),
      open: 146.0,
      high: 152.0,
      low: 144.0,
      close: 150.0,
      volume: 1100000,
    },
    {
      time: String(Math.floor(Date.now() / 1000)),
      open: 150.0,
      high: 155.0,
      low: 148.0,
      close: 152.0,
      volume: 1400000,
    },
  ],
  meta: {
    companyName: 'NVIDIA Corporation',
    currency: 'USD',
    exchangeName: 'NASDAQ',
    lastUpdated: new Date(0).toISOString(),
  },
};

export default function SimulationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stockInfo, setStockInfo] = useState<StockInfo>(defaultStockInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL 쿼리에서 심볼 읽기
  const symbol = searchParams.get('symbol') || 'NVDA';

  const loadStockData = async (newSymbol: string) => {
    try {
      setLoading(true);
      setError(null);
      const marketType = getMarketType(newSymbol);
      const data = await getStockData(newSymbol, marketType);
      setStockInfo(data);

      // URL 업데이트
      if (newSymbol !== 'NVDA') {
        const params = new URLSearchParams(searchParams);
        params.set('symbol', newSymbol);
        router.replace(`/simulation?${params.toString()}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로딩 실패');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    // 기본 임시 데이터일 때 또는 심볼이 다를 때 로딩
    if (symbol !== stockInfo.symbol || stockInfo.meta.lastUpdated === new Date(0).toISOString()) {
      loadStockData(symbol);
    }
  }, [symbol]);

  const handleSearch = (newSymbol: string, marketType: MarketType) => {
    loadStockData(newSymbol);
  };

  if (loading) {
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
          <ErrorDisplay error={error} onRetry={() => loadStockData(symbol)} />
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
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-800">
              <StockSimulation stockInfo={stockInfo} />
            </div>
          </div>
        </div>

        <ChatSidebar symbol={stockInfo.symbol} />
      </div>
    </main>
  );
}
