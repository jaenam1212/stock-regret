'use client';

import { getStockData } from '@/app/api';
import AuthModal from '@/app/components/auth/AuthModal';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import { useAuth } from '@/app/hooks/useAuth';
import StockHeader from '@/components/StockHeader';
import RegretCalculator from '@/components/calculator/RegretCalculator';
import StockChart from '@/components/chart/StockChart';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { StockInfo } from '@/types/stock';
import { useState } from 'react';

interface StockContentProps {
  initialStockInfo: StockInfo;
}

export default function StockContent({ initialStockInfo }: StockContentProps) {
  const [stockInfo, setStockInfo] = useState<StockInfo>(initialStockInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState(initialStockInfo.symbol);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, signOut } = useAuth();

  const handleSymbolChange = async (newSymbol: string) => {
    setSymbol(newSymbol);
    setLoading(true);
    setError(null);

    try {
      const data = await getStockData(newSymbol);
      setStockInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: string, price: number) => {
    setSelectedDate(date);
    setSelectedPrice(price);
    console.log(`선택된 날짜: ${date}, 가격: ${price}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <ErrorDisplay error={error} onRetry={() => handleSymbolChange(symbol)} />
    );
  }

  return (
    <main className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
      {/* 헤더 */}
      <header className="flex-shrink-0 border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              아! 살껄 계산기
            </h1>
            <div className="flex items-center gap-2">
              <a
                href="/history"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition-colors"
              >
                계산 내역
              </a>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{user.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-hidden relative">
        {/* 메인 영역 */}
        <div className="h-full overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* 주식 정보 & 차트 - 모바일에서 더 큰 영역 */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden mb-4 lg:mb-6">
              <StockHeader
                stockInfo={stockInfo}
                symbol={symbol}
                onSymbolChange={handleSymbolChange}
              />
              <div className="p-4 lg:p-6">
                <div className="h-80 lg:h-96">
                  <StockChart
                    data={stockInfo.data}
                    onDateSelect={handleDateSelect}
                    selectedDate={selectedDate}
                  />
                </div>
              </div>
            </div>

            {/* 후회 계산기 - 스크롤로 내려감 */}
            <div className="space-y-4 lg:space-y-6">
              <RegretCalculator
                stockInfo={stockInfo}
                selectedDate={selectedDate}
                selectedPrice={selectedPrice}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800"
              />
            </div>
          </div>
        </div>

        {/* 사이드바 - 채팅 */}
        <ChatSidebar symbol={stockInfo.symbol} />
      </div>

      {/* 인증 모달 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </main>
  );
}
