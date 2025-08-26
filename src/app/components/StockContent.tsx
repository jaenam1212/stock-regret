'use client';

import { getMarketType, getStockData } from '@/app/api';
import UnifiedSearch from '@/app/components/MarketTabs';
import AuthModal from '@/app/components/auth/AuthModal';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import { useAuth } from '@/app/hooks/useAuth';
import StockHeader from '@/components/StockHeader';
import DualChartComparison from '@/components/calculator/DualChartComparison';
import RegretCalculator from '@/components/calculator/RegretCalculator';
import StockChart from '@/components/chart/StockChart';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MarketType, StockInfo } from '@/types/stock';
import { useEffect, useState } from 'react';

interface StockContentProps {
  initialStockInfo: StockInfo;
}

export default function StockContent({ initialStockInfo }: StockContentProps) {
  const [stockInfo, setStockInfo] = useState<StockInfo>(initialStockInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState(initialStockInfo.symbol);
  const [marketType, setMarketType] = useState<MarketType>(
    getMarketType(initialStockInfo.symbol)
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'compare'>('single');

  // 이전 상태 저장 (에러 발생 전의 마지막 성공 상태)
  const [lastValidState, setLastValidState] = useState({
    stockInfo: initialStockInfo,
    symbol: initialStockInfo.symbol,
    marketType: getMarketType(initialStockInfo.symbol),
  });

  const { user, signOut } = useAuth();

  // 컴포넌트 마운트 시 초기 데이터 가져오기
  useEffect(() => {
    const loadInitialData = async () => {
      // 초기 데이터가 비어있으면 API에서 최신 데이터 가져오기
      if (initialStockInfo.data.length === 0) {
        try {
          const data = await getStockData('NVDA', 'us');
          setStockInfo(data);
          setLastValidState({
            stockInfo: data,
            symbol: data.symbol,
            marketType: getMarketType(data.symbol),
          });
        } catch (err) {
          console.error('Failed to load initial data:', err);
          // 이미 page.tsx에서 기본 데이터를 제공하므로 추가 처리 불필요
        }
      } else {
        // 초기 데이터가 있으면 백그라운드에서 최신 데이터 가져오기 시도 (목 데이터 확인)
        const isMockData = initialStockInfo.meta.lastUpdated === new Date(0).toISOString();
        
        if (isMockData) {
          try {
            const data = await getStockData('NVDA', 'us');
            // 실제 데이터를 받았을 때만 업데이트 (목 데이터가 아닌 경우)
            if (data.meta.lastUpdated !== new Date(0).toISOString()) {
              setStockInfo(data);
              setLastValidState({
                stockInfo: data,
                symbol: data.symbol,
                marketType: getMarketType(data.symbol),
              });
            }
          } catch (err) {
            console.warn('Failed to update initial data, using static data:', err);
            // 실패해도 이미 차트 데이터가 있으므로 문제없음
          }
        }
      }
    };

    loadInitialData();
  }, [initialStockInfo.data.length]);

  const handleSymbolChange = async (
    newSymbol: string,
    newMarketType?: MarketType
  ) => {
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
    // 개발 환경에서만 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`선택된 날짜: ${date}, 가격: ${price}`);
    }
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
      {/* 헤더 - 컴팩트하게 수정 */}
      <header className="flex-shrink-0 bg-black/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-3 py-2 border-b border-gray-800">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="아! 살껄 계산기 로고"
                className="w-6 h-6"
              />
              <h1 className="text-lg font-bold text-white">
                아! 살껄 계산기
              </h1>
            </div>
          </div>
          
          {/* 로그인 버튼을 우측 상단으로 */}
          <div className="absolute top-2 right-3 z-10">
            {user ? (
              <button
                onClick={() => signOut()}
                className="px-2 py-1 bg-gray-700/80 hover:bg-gray-600 rounded text-xs font-medium transition-colors backdrop-blur-sm"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-2 py-1 bg-blue-600/80 hover:bg-blue-700 rounded text-xs font-medium transition-colors backdrop-blur-sm"
              >
                로그인
              </button>
            )}
          </div>
        </div>

        {/* 통합 검색 */}
        <UnifiedSearch onSearch={handleSearch} />
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-hidden relative">
        {/* 메인 영역 */}
        <div className="h-full overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* 탭 메뉴 */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-800 overflow-hidden mb-3 sm:mb-4 lg:mb-6">
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setActiveTab('single')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'single'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  단일 종목 분석
                </button>
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'compare'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  듀얼 차트 비교
                </button>
              </div>

              {activeTab === 'single' && (
                <>
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
                </>
              )}
            </div>

            {/* 계산기 영역 */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {activeTab === 'single' ? (
                <RegretCalculator
                  stockInfo={stockInfo}
                  selectedDate={selectedDate}
                  selectedPrice={selectedPrice}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-800"
                />
              ) : (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-800 p-3 sm:p-4 lg:p-6">
                  <DualChartComparison />
                </div>
              )}
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
