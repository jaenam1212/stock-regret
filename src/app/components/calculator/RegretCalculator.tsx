'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useCalculationHistory } from '@/app/hooks/useCalculationHistory';
import { useExchangeRate } from '@/app/hooks/useExchangeRate';
import { formatPrice } from '@/app/lib/utils';
import { CalculationResult, StockInfo } from '@/types/stock';
import { useEffect, useState } from 'react';
import CalculationResults from './CalculationResults';
import CalculatorInput, { InvestmentType } from './CalculatorInput';
import ShareCard from './ShareCard';

interface RegretCalculatorProps {
  stockInfo: StockInfo;
  selectedDate?: string;
  selectedPrice?: number;
  className?: string;
}

export default function RegretCalculator({
  stockInfo,
  selectedDate,
  selectedPrice,
  className = '',
}: RegretCalculatorProps) {
  const [investDate, setInvestDate] = useState<string>(selectedDate || '');
  const [investAmount, setInvestAmount] = useState<number>(1000000);
  const [investmentType, setInvestmentType] =
    useState<InvestmentType>('lump-sum');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(100000);
  const [calculation, setCalculation] = useState<CalculationResult | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const { exchangeRate, loading: exchangeRateLoading } = useExchangeRate();
  const { user } = useAuth();
  const { saveCalculation } = useCalculationHistory(user?.id);

  // 선택된 날짜가 변경되면 투자 날짜 업데이트
  useEffect(() => {
    if (selectedDate) {
      setInvestDate(selectedDate);
    }
  }, [selectedDate]);

  const minDate = stockInfo?.data[0]
    ? new Date(Number(stockInfo.data[0].time) * 1000)
        .toISOString()
        .split('T')[0]
    : '';
  const maxDate = new Date().toISOString().split('T')[0];

  const calculateRegret = async () => {
    if (
      !investDate ||
      (investmentType === 'lump-sum' ? !investAmount : !monthlyAmount)
    ) {
      alert('모든 항목을 입력해주세요');
      return;
    }

    if (investmentType === 'monthly') {
      calculateMonthlyInvestment();
      return;
    }

    const targetDate = new Date(investDate);
    const targetTimestamp = targetDate.getTime() / 1000;

    // 선택한 날짜 이전의 데이터만 필터링 (미래 데이터 제외)
    const validData = stockInfo.data.filter(
      (item) => Number(item.time) <= targetTimestamp
    );

    if (validData.length === 0) {
      alert(
        '선택한 날짜에 거래 데이터가 없습니다. 더 최근 날짜를 선택해주세요.'
      );
      return;
    }

    // 가장 가까운 과거 날짜 찾기
    const closestData = validData[validData.length - 1];

    const pastPrice = closestData.close;
    const currentPrice = stockInfo.currentPrice;

    const isUSD = stockInfo.meta.currency === 'USD';
    const rate = isUSD ? exchangeRate : 1;

    const investBase = isUSD ? investAmount / rate : investAmount;
    const shares = investBase / pastPrice;
    const currentValueBase = shares * currentPrice;
    const currentValue = isUSD ? currentValueBase * rate : currentValueBase;

    // 손익 계산
    const profit = currentValue - investAmount;
    const profitPercent = (profit / investAmount) * 100;

    // 연환산 수익률 계산
    const investDateObj = new Date(Number(closestData.time) * 1000);
    const currentDate = new Date();
    const daysDiff =
      (currentDate.getTime() - investDateObj.getTime()) / (1000 * 60 * 60 * 24);
    const yearsDiff = daysDiff / 365;

    let yearlyReturn = 0;
    if (yearsDiff > 0) {
      // CAGR (연평균 성장률) 공식
      yearlyReturn =
        (Math.pow(currentValue / investAmount, 1 / yearsDiff) - 1) * 100;
    }

    console.log('계산 디버깅:', {
      pastPrice,
      currentPrice,
      investBase,
      shares,
      currentValueBase,
      currentValue,
      profit,
      profitPercent,
      yearsDiff,
      yearlyReturn,
    });

    const result = {
      investAmount,
      investDate: investDateObj.toLocaleDateString('ko-KR'),
      pastPrice,
      currentPrice,
      shares,
      currentValue,
      profit,
      profitPercent,
      yearlyReturn,
    };

    setCalculation(result);
    setSaved(false);

    // 히스토리 저장 기능 비활성화됨
    // if (user && saveCalculation) {
    //   setSaving(true);
    //   try {
    //     await saveCalculation(stockInfo.symbol, result);
    //     setSaved(true);
    //   } catch (err) {
    //     console.error('Failed to save calculation:', err);
    //   } finally {
    //     setSaving(false);
    //   }
    // }
  };

  const calculateMonthlyInvestment = () => {
    const startDate = new Date(investDate);
    const currentDate = new Date();
    const isUSD = stockInfo.meta.currency === 'USD';
    const rate = isUSD ? exchangeRate : 1;

    let totalInvested = 0;
    let totalShares = 0;
    let investmentDate = new Date(startDate);

    // 매월 투자 시뮬레이션
    while (investmentDate <= currentDate) {
      const monthTimestamp = investmentDate.getTime() / 1000;

      // 해당 월에 가장 가까운 주식 데이터 찾기
      const monthData = stockInfo.data.find((item) => {
        const itemDate = new Date(Number(item.time) * 1000);
        return (
          Math.abs(itemDate.getTime() - investmentDate.getTime()) <=
          15 * 24 * 60 * 60 * 1000
        ); // 15일 이내
      });

      if (monthData) {
        const monthPrice = monthData.close;
        const investBase = isUSD ? monthlyAmount / rate : monthlyAmount;
        const sharesThisMonth = investBase / monthPrice;

        totalInvested += monthlyAmount;
        totalShares += sharesThisMonth;
      }

      // 다음 달로 이동
      investmentDate.setMonth(investmentDate.getMonth() + 1);
    }

    if (totalShares === 0) {
      alert('선택한 기간에 유효한 거래 데이터가 없습니다.');
      return;
    }

    const currentPrice = stockInfo.currentPrice;
    const currentValueBase = totalShares * currentPrice;
    const currentValue = isUSD ? currentValueBase * rate : currentValueBase;

    // 손익 계산
    const profit = currentValue - totalInvested;
    const profitPercent = (profit / totalInvested) * 100;

    // 연환산 수익률 계산
    const daysDiff =
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const yearsDiff = daysDiff / 365;

    let yearlyReturn = 0;
    if (yearsDiff > 0) {
      yearlyReturn =
        (Math.pow(currentValue / totalInvested, 1 / yearsDiff) - 1) * 100;
    }

    const result = {
      investAmount: totalInvested,
      investDate: startDate.toLocaleDateString('ko-KR'),
      pastPrice: totalInvested / totalShares, // 평균 매입가
      currentPrice,
      shares: totalShares,
      currentValue,
      profit,
      profitPercent,
      yearlyReturn,
      isMonthly: true,
      monthlyAmount,
      totalMonths: Math.floor(yearsDiff * 12),
    };

    setCalculation(result);
    setSaved(false);
  };

  return (
    <div className={className}>
      <div className="p-4 lg:p-6">
        <h3 className="text-xl lg:text-2xl font-bold mb-6">아! 살껄 계산기</h3>

        {/* 선택된 날짜 표시 */}
        {selectedDate && selectedPrice && (
          <div className="mb-4 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <div className="text-sm text-blue-400 mb-1">
              차트에서 선택된 날짜
            </div>
            <div className="text-lg font-semibold text-blue-300">
              {selectedDate} -
              {formatPrice(selectedPrice, stockInfo.meta.currency)}
            </div>
          </div>
        )}

        <CalculatorInput
          investDate={investDate}
          investAmount={investAmount}
          currentPrice={stockInfo.currentPrice}
          currency={stockInfo.meta.currency}
          minDate={minDate}
          maxDate={maxDate}
          exchangeRate={exchangeRate}
          exchangeRateLoading={exchangeRateLoading}
          onDateChange={setInvestDate}
          onAmountChange={setInvestAmount}
          onCalculate={calculateRegret}
          onInvestmentTypeChange={setInvestmentType}
          onMonthlyAmountChange={setMonthlyAmount}
        />

        {calculation && (
          <div>
            <CalculationResults
              calculation={calculation}
              currency={stockInfo.meta.currency}
            />

            {/* 공유 버튼 */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowShareCard(!showShareCard)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                           text-white px-6 py-3 rounded-lg font-medium transition-all duration-200
                           shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center mx-auto gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                {showShareCard ? '공유 카드 숨기기' : '결과 공유하기'}
              </button>
            </div>

            {/* 공유 카드 */}
            {showShareCard && (
              <div className="mt-6">
                <ShareCard
                  calculation={calculation}
                  currency={stockInfo.meta.currency}
                  stockSymbol={stockInfo.symbol}
                  companyName={stockInfo.meta.companyName}
                  hideShareButton={true}
                  stockData={stockInfo.data}
                />
              </div>
            )}

            {/* 히스토리 저장 표시 비활성화됨
            {user && (
              <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">계산 내역 저장</span>
                  {saving ? (
                    <span className="text-blue-400 text-sm">저장 중...</span>
                  ) : saved ? (
                    <span className="text-green-400 text-sm">✓ 저장됨</span>
                  ) : (
                    <span className="text-gray-500 text-sm">자동 저장</span>
                  )}
                </div>
              </div>
            )}
            */}
          </div>
        )}
      </div>
    </div>
  );
}
