'use client';

import { useState, useEffect, useCallback } from 'react';
import StockChart from '@/components/chart/StockChart';
import StockHeader from '@/components/StockHeader';
import RegretCalculator from '@/components/calculator/RegretCalculator';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { StockInfo } from '@/types/stock';

export default function Home() {
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState('AAPL');

  const fetchStockData = useCallback(async (stockSymbol: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/stock-data?symbol=${stockSymbol}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setStockInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockData(symbol);
  }, [symbol, fetchStockData]);

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    fetchStockData(newSymbol);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={() => fetchStockData(symbol)} />;
  if (!stockInfo) return <ErrorDisplay error="No data available" />;

  return (
    <main className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
      {/* 헤더 */}
      <header className="flex-shrink-0 border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
                  <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            아! 살껄 계산기
          </h1>
          <a
            href="/stats"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition-colors"
          >
            통계 보기
          </a>
        </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          {/* 메인 영역 */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
              {/* 주식 정보 & 차트 */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
                <StockHeader 
                  stockInfo={stockInfo}
                  symbol={symbol}
                  onSymbolChange={handleSymbolChange}
                />
                <div className="p-4 lg:p-6">
                  <StockChart data={stockInfo.data} />
                </div>
              </div>

              {/* 후회 계산기 */}
              <RegretCalculator 
                stockInfo={stockInfo}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800"
              />
            </div>
          </div>

          {/* 사이드바 - 채팅 */}
          <ChatSidebar symbol={stockInfo.symbol} />
        </div>
      </div>
    </main>
  );
}