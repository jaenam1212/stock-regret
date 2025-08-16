'use client';

import { formatCurrency, formatPrice } from '@/app/lib/utils';
import { StockInfo } from '@/types/stock';
import { useEffect, useState } from 'react';
import SearchAutocomplete from '../SearchAutocomplete';
import StockChart from '../chart/StockChart';

interface ComparisonItem {
  symbol: string;
  stockInfo: StockInfo | null;
  selectedDate: string;
  selectedPrice: number;
  investAmount: number;
  loading: boolean;
  error: string | null;
}

interface ComparisonResult {
  investAmount: number;
  investDate: string;
  pastPrice: number;
  currentPrice: number;
  shares: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  yearlyReturn: number;
}

export default function DualChartComparison() {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  const [leftItem, setLeftItem] = useState<ComparisonItem>({
    symbol: '',
    stockInfo: null,
    selectedDate: '',
    selectedPrice: 0,
    investAmount: 1000000,
    loading: false,
    error: null,
  });

  const [rightItem, setRightItem] = useState<ComparisonItem>({
    symbol: '',
    stockInfo: null,
    selectedDate: '',
    selectedPrice: 0,
    investAmount: 1000000,
    loading: false,
    error: null,
  });

  const [leftResult, setLeftResult] = useState<ComparisonResult | null>(null);
  const [rightResult, setRightResult] = useState<ComparisonResult | null>(null);
  // 환율 고정값 사용 (안정성을 위해)
  const exchangeRate = 1350;

  // 주식/코인 데이터 가져오기 (적절한 API 선택)
  const fetchStockData = async (symbol: string, isLeft: boolean) => {
    if (!symbol) return;

    console.log(
      `[DualChart] Fetching data for ${symbol} (${isLeft ? 'left' : 'right'})`
    );

    const setItem = isLeft ? setLeftItem : setRightItem;

    setItem((prev) => ({ ...prev, symbol, loading: true, error: null }));

    try {
      let response: Response;
      let endpoint: string;

      // 심볼 타입에 따라 적절한 API 선택
      const normalizedSymbol = symbol.toLowerCase().trim();

      // 암호화폐 키워드 목록
      const cryptoKeywords = [
        'bitcoin',
        'ethereum',
        'binancecoin',
        'cardano',
        'solana',
        'polkadot',
        'dogecoin',
        'avalanche',
        'polygon',
        'chainlink',
        'cosmos',
        'fantom',
        'near',
        'algorand',
        'flow',
        'apecoin',
        'tezos',
        'elrond',
        'axie-infinity',
        'decentraland',
        'sandbox',
        'enjincoin',
        'gala',
        'chromaway',
        'litecoin',
        'ripple',
        'tether',
        'btc',
        'eth',
        'bnb',
        'ada',
        'sol',
        'dot',
        'doge',
        'avax',
        'matic',
        'link',
        'atom',
        'ftm',
        'near',
        'algo',
        'flow',
        'ape',
        'xtz',
        'egld',
        'axs',
        'mana',
        'sand',
        'enj',
        'gala',
        'chr',
        'ltc',
        'xrp',
        'usdt',
        'usdc',
        '비트코인',
        '이더리움',
        '바이낸스코인',
        '에이다',
        '솔라나',
        '폴카닷',
        '도지코인',
        '아발란체',
        '폴리곤',
        '체인링크',
        '코스모스',
        '팬텀',
        '니어',
        '알고랜드',
        '플로우',
        '에이프코인',
        '테조스',
        '디센트럴랜드',
        '샌드박스',
        '엔진코인',
        '갈라',
        '라이트코인',
        '리플',
        '테더',
      ];

      if (/^\d{6}$/.test(symbol)) {
        // 한국 주식 (6자리 숫자)
        endpoint = `/api/kr-stock-data?symbol=${symbol}`;
      } else if (cryptoKeywords.includes(normalizedSymbol)) {
        // 암호화폐
        endpoint = `/api/crypto-data?symbol=${symbol}`;
      } else {
        // 미국 주식 (기본값)
        endpoint = `/api/stock-data?symbol=${symbol}`;
      }

      response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(
          `${symbol} 데이터를 찾을 수 없습니다 (${response.status})`
        );
      }

      const stockInfo: StockInfo = await response.json();

      console.log(`[DualChart] Received data for ${symbol}:`, {
        dataLength: stockInfo?.data?.length,
        symbol: stockInfo?.symbol,
        currentPrice: stockInfo?.currentPrice,
      });

      // 데이터 유효성 검사
      if (!stockInfo || !stockInfo.data || stockInfo.data.length === 0) {
        throw new Error(`${symbol} 데이터가 비어있습니다`);
      }

      setItem((prev) => ({
        ...prev,
        stockInfo,
        loading: false,
        error: null,
      }));

      console.log(`[DualChart] Successfully set data for ${symbol}`);
    } catch (error) {
      console.error(`[DualChart] Error fetching data for ${symbol}:`, error);
      setItem((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '데이터 로딩 실패',
      }));
    }
  };

  // 수익률 계산
  const calculateProfit = (item: ComparisonItem): ComparisonResult | null => {
    if (!item.stockInfo || !item.selectedDate || !item.selectedPrice) {
      return null;
    }

    const targetDate = new Date(item.selectedDate);
    const targetTimestamp = targetDate.getTime() / 1000;

    // 선택한 날짜의 데이터 찾기
    const validData = item.stockInfo.data.filter(
      (dataItem) => Number(dataItem.time) <= targetTimestamp
    );

    if (validData.length === 0) return null;

    const pastPrice = item.selectedPrice;
    const currentPrice = item.stockInfo.currentPrice;

    const isUSD = item.stockInfo.meta.currency === 'USD';
    const rate = isUSD ? exchangeRate : 1;

    const investBase = isUSD ? item.investAmount / rate : item.investAmount;
    const shares = investBase / pastPrice;
    const currentValueBase = shares * currentPrice;
    const currentValue = isUSD ? currentValueBase * rate : currentValueBase;

    const profit = currentValue - item.investAmount;
    const profitPercent = (profit / item.investAmount) * 100;

    // 연환산 수익률 계산
    const investDateObj = new Date(item.selectedDate);
    const currentDate = new Date();
    const daysDiff =
      (currentDate.getTime() - investDateObj.getTime()) / (1000 * 60 * 60 * 24);
    const yearsDiff = daysDiff / 365;

    let yearlyReturn = 0;
    if (yearsDiff > 0) {
      yearlyReturn =
        (Math.pow(currentValue / item.investAmount, 1 / yearsDiff) - 1) * 100;
    }

    return {
      investAmount: item.investAmount,
      investDate: investDateObj.toLocaleDateString('ko-KR'),
      pastPrice,
      currentPrice,
      shares,
      currentValue,
      profit,
      profitPercent,
      yearlyReturn,
    };
  };

  // 결과 업데이트
  useEffect(() => {
    if (leftItem.stockInfo && leftItem.selectedDate && leftItem.selectedPrice) {
      setLeftResult(calculateProfit(leftItem));
    } else {
      setLeftResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    leftItem.stockInfo,
    leftItem.selectedDate,
    leftItem.selectedPrice,
    leftItem.investAmount,
    exchangeRate,
  ]);

  useEffect(() => {
    if (
      rightItem.stockInfo &&
      rightItem.selectedDate &&
      rightItem.selectedPrice
    ) {
      setRightResult(calculateProfit(rightItem));
    } else {
      setRightResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rightItem.stockInfo,
    rightItem.selectedDate,
    rightItem.selectedPrice,
    rightItem.investAmount,
    exchangeRate,
  ]);

  const handleChartSelect = (date: string, price: number, isLeft: boolean) => {
    const setItem = isLeft ? setLeftItem : setRightItem;
    setItem((prev) => ({
      ...prev,
      selectedDate: date,
      selectedPrice: price,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2">듀얼 차트 비교</h2>
        <p className="text-gray-400">
          두 개의 주식이나 코인을 비교해서 어느 쪽이 더 수익이 좋았을지
          확인해보세요
        </p>
      </div>

      {/* 검색 및 설정 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽 검색 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              첫 번째 종목 (주식/코인)
            </label>
            <SearchAutocomplete
              value={leftSearch}
              onChange={setLeftSearch}
              onSelect={(symbol) => fetchStockData(symbol, true)}
              placeholder="예: AAPL, NVDA, bitcoin, ethereum..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              투자 금액 (원)
            </label>
            <input
              type="number"
              value={leftItem.investAmount}
              onChange={(e) =>
                setLeftItem((prev) => ({
                  ...prev,
                  investAmount: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                         text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* 오른쪽 검색 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              두 번째 종목 (주식/코인)
            </label>
            <SearchAutocomplete
              value={rightSearch}
              onChange={setRightSearch}
              onSelect={(symbol) => fetchStockData(symbol, false)}
              placeholder="예: TSLA, bitcoin, SOL, ethereum..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              투자 금액 (원)
            </label>
            <input
              type="number"
              value={rightItem.investAmount}
              onChange={(e) =>
                setRightItem((prev) => ({
                  ...prev,
                  investAmount: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                         text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 왼쪽 차트 */}
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {leftItem.stockInfo
                ? `${leftItem.stockInfo.symbol} - ${leftItem.stockInfo.meta.companyName}`
                : '종목을 선택하세요'}
            </h3>
            {leftItem.selectedDate && leftItem.selectedPrice && (
              <div className="text-sm text-blue-400">
                선택: {leftItem.selectedDate} -{' '}
                {formatPrice(
                  leftItem.selectedPrice,
                  leftItem.stockInfo?.meta.currency || 'USD'
                )}
              </div>
            )}
          </div>

          {leftItem.loading && (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {leftItem.error && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-red-400">{leftItem.error}</div>
            </div>
          )}

          {leftItem.stockInfo && !leftItem.loading && !leftItem.error && (
            <div style={{ height: '300px' }}>
              <StockChart
                data={leftItem.stockInfo.data}
                onDateSelect={(date, price) =>
                  handleChartSelect(date, price, true)
                }
                selectedDate={leftItem.selectedDate}
              />
            </div>
          )}
        </div>

        {/* 오른쪽 차트 */}
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {rightItem.stockInfo
                ? `${rightItem.stockInfo.symbol} - ${rightItem.stockInfo.meta.companyName}`
                : '종목을 선택하세요'}
            </h3>
            {rightItem.selectedDate && rightItem.selectedPrice && (
              <div className="text-sm text-blue-400">
                선택: {rightItem.selectedDate} -{' '}
                {formatPrice(
                  rightItem.selectedPrice,
                  rightItem.stockInfo?.meta.currency || 'USD'
                )}
              </div>
            )}
          </div>

          {rightItem.loading && (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {rightItem.error && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-red-400">{rightItem.error}</div>
            </div>
          )}

          {rightItem.stockInfo && !rightItem.loading && !rightItem.error && (
            <div style={{ height: '300px' }}>
              <StockChart
                data={rightItem.stockInfo.data}
                onDateSelect={(date, price) =>
                  handleChartSelect(date, price, false)
                }
                selectedDate={rightItem.selectedDate}
              />
            </div>
          )}
        </div>
      </div>

      {/* 비교 결과 */}
      {leftResult && rightResult && (
        <div className="bg-gray-900/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-6 text-center">
            💰 투자 수익률 비교
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽 결과 */}
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">
                  {leftItem.stockInfo?.symbol} (
                  {leftItem.stockInfo?.meta.companyName})
                </h4>
                <div className="text-sm text-gray-400 mb-4">
                  {leftResult.investDate}에{' '}
                  {formatCurrency(leftResult.investAmount)}원 투자
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">구매 가격</div>
                  <div className="font-semibold">
                    {formatPrice(
                      leftResult.pastPrice,
                      leftItem.stockInfo?.meta.currency || 'USD'
                    )}
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">현재 가격</div>
                  <div className="font-semibold">
                    {formatPrice(
                      leftResult.currentPrice,
                      leftItem.stockInfo?.meta.currency || 'USD'
                    )}
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">현재 가치</div>
                  <div className="font-semibold text-white">
                    {formatCurrency(leftResult.currentValue)}
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">손익</div>
                  <div
                    className={`font-semibold ${leftResult.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {leftResult.profit >= 0 ? '+' : ''}
                    {formatCurrency(leftResult.profit)}
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  <span
                    className={
                      leftResult.profitPercent >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {leftResult.profitPercent >= 0 ? '+' : ''}
                    {leftResult.profitPercent.toFixed(2)}%
                  </span>
                </div>
                <div className="text-sm text-gray-400">총 수익률</div>
                <div className="text-sm text-gray-500 mt-1">
                  연환산: {leftResult.yearlyReturn >= 0 ? '+' : ''}
                  {leftResult.yearlyReturn.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* 오른쪽 결과 */}
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-purple-400 mb-2">
                  {rightItem.stockInfo?.symbol} (
                  {rightItem.stockInfo?.meta.companyName})
                </h4>
                <div className="text-sm text-gray-400 mb-4">
                  {rightResult.investDate}에{' '}
                  {formatCurrency(rightResult.investAmount)}원 투자
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">구매 가격</div>
                  <div className="font-semibold">
                    {formatPrice(
                      rightResult.pastPrice,
                      rightItem.stockInfo?.meta.currency || 'USD'
                    )}
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">현재 가격</div>
                  <div className="font-semibold">
                    {formatPrice(
                      rightResult.currentPrice,
                      rightItem.stockInfo?.meta.currency || 'USD'
                    )}
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">현재 가치</div>
                  <div className="font-semibold text-white">
                    {formatCurrency(rightResult.currentValue)}
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">손익</div>
                  <div
                    className={`font-semibold ${rightResult.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {rightResult.profit >= 0 ? '+' : ''}
                    {formatCurrency(rightResult.profit)}
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  <span
                    className={
                      rightResult.profitPercent >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {rightResult.profitPercent >= 0 ? '+' : ''}
                    {rightResult.profitPercent.toFixed(2)}%
                  </span>
                </div>
                <div className="text-sm text-gray-400">총 수익률</div>
                <div className="text-sm text-gray-500 mt-1">
                  연환산: {rightResult.yearlyReturn >= 0 ? '+' : ''}
                  {rightResult.yearlyReturn.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* 비교 결론 */}
          <div className="mt-6 text-center">
            {(() => {
              const leftBetter =
                leftResult.profitPercent > rightResult.profitPercent;
              const difference = Math.abs(
                leftResult.profitPercent - rightResult.profitPercent
              );

              if (difference < 1) {
                return (
                  <div className="p-4 bg-gray-600/20 rounded-lg">
                    <p className="text-lg font-semibold text-gray-300">
                      🤝 거의 비슷한 수익률입니다!
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      차이: {difference.toFixed(2)}%
                    </p>
                  </div>
                );
              }

              const winnerSymbol = leftBetter
                ? leftItem.stockInfo?.symbol
                : rightItem.stockInfo?.symbol;
              const winnerProfit = leftBetter
                ? leftResult.profitPercent
                : rightResult.profitPercent;

              return (
                <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-lg font-semibold text-yellow-400">
                    🏆 {winnerSymbol}이 {difference.toFixed(2)}% 더 좋았습니다!
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {winnerSymbol} 수익률: {winnerProfit >= 0 ? '+' : ''}
                    {winnerProfit.toFixed(2)}%
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
