'use client';

import { getStockData, getMarketType } from '@/app/api';
import AuthModal from '@/app/components/auth/AuthModal';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import UnifiedSearch from '@/app/components/MarketTabs';
import { useAuth } from '@/app/hooks/useAuth';
import StockHeader from '@/components/StockHeader';
import RegretCalculator from '@/components/calculator/RegretCalculator';
import StockChart from '@/components/chart/StockChart';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { StockInfo, MarketType } from '@/types/stock';
import { useState } from 'react';

interface StockContentProps {
  initialStockInfo: StockInfo;
}

export default function StockContent({ initialStockInfo }: StockContentProps) {
  const [stockInfo, setStockInfo] = useState<StockInfo>(initialStockInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState(initialStockInfo.symbol);
  const [marketType, setMarketType] = useState<MarketType>(getMarketType(initialStockInfo.symbol));
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // 이전 상태 저장 (에러 발생 전의 마지막 성공 상태)
  const [lastValidState, setLastValidState] = useState({
    stockInfo: initialStockInfo,
    symbol: initialStockInfo.symbol,
    marketType: getMarketType(initialStockInfo.symbol),
  });

  const { user, signOut } = useAuth();

  const handleSymbolChange = async (newSymbol: string, newMarketType?: MarketType) => {
    setSymbol(newSymbol);
    setLoading(true);
    setError(null);

    const market = newMarketType || getMarketType(newSymbol);
    setMarketType(market);

    try {
      const data = await getStockData(newSymbol, market);
      setStockInfo(data);
      
      // 성공 시 마지막 유효 상태 업데이트
      setLastValidState({
        stockInfo: data,
        symbol: newSymbol,
        marketType: market,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 이전 상태로 돌아가기
  const handleGoBack = () => {
    setStockInfo(lastValidState.stockInfo);
    setSymbol(lastValidState.symbol);
    setMarketType(lastValidState.marketType);
    setError(null);
    setSelectedDate('');
    setSelectedPrice(0);
  };


  const handleSearch = (newSymbol: string, searchMarketType: MarketType) => {
    handleSymbolChange(newSymbol, searchMarketType);
  };

  const handleDateSelect = (date: string, price: number) => {
    setSelectedDate(date);
    setSelectedPrice(price);
    console.log(`선택된 날짜: ${date}, 가격: ${price}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        onRetry={() => handleSymbolChange(symbol, marketType)}
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <main className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
      {/* 헤더 */}
      <header className="flex-shrink-0 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent text-center sm:text-left">
              아! 살껄 계산기
            </h1>
            <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">
              <a
                href="/history"
                className="px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs sm:text-sm font-medium transition-colors"
              >
                계산 내역
              </a>
              {user ? (
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                  <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">{user.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-xs sm:text-sm font-medium transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs sm:text-sm font-medium transition-colors"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* 통합 검색 */}
        <UnifiedSearch
          onSearch={handleSearch}
        />
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-hidden relative">
        {/* 메인 영역 */}
        <div className="h-full overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* 주식 정보 & 차트 - 모바일에서 더 큰 영역 */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-800 overflow-hidden mb-3 sm:mb-4 lg:mb-6">
              <StockHeader
                stockInfo={stockInfo}
                symbol={symbol}
                marketType={marketType}
                onSymbolChange={handleSymbolChange}
              />
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="h-64 sm:h-80 lg:h-96">
                  <StockChart
                    data={stockInfo.data}
                    onDateSelect={handleDateSelect}
                    selectedDate={selectedDate}
                  />
                </div>
              </div>
            </div>

            {/* 후회 계산기 - 스크롤로 내려감 */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <RegretCalculator
                stockInfo={stockInfo}
                selectedDate={selectedDate}
                selectedPrice={selectedPrice}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-800"
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
