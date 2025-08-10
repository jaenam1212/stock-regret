'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useCalculationHistory } from '@/app/hooks/useCalculationHistory';
import { useExchangeRate } from '@/app/hooks/useExchangeRate';
import { CalculationResult, StockInfo } from '@/types/stock';
import { useEffect, useState } from 'react';
import CalculationResults from './CalculationResults';
import CalculatorInput from './CalculatorInput';

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
  const [calculation, setCalculation] = useState<CalculationResult | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
    if (!investDate || !investAmount) {
      alert('모든 항목을 입력해주세요');
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

    // 환율 적용 (한국 원화 -> 달러 주식)
    const investAmountUSD = investAmount / exchangeRate;

    // 주식 수 계산
    const shares = investAmountUSD / pastPrice;

    // 현재 가치 계산 (달러 -> 원화)
    const currentValueUSD = shares * currentPrice;
    const currentValue = currentValueUSD * exchangeRate;

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
      investAmountUSD,
      shares,
      currentValueUSD,
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

    // 로그인된 사용자인 경우 계산 내역 저장
    if (user && saveCalculation) {
      setSaving(true);
      try {
        await saveCalculation(stockInfo.symbol, result);
        setSaved(true);
      } catch (err) {
        console.error('Failed to save calculation:', err);
      } finally {
        setSaving(false);
      }
    }
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
              {selectedDate} - ${selectedPrice.toFixed(2)}
            </div>
          </div>
        )}

        <CalculatorInput
          investDate={investDate}
          investAmount={investAmount}
          currentPrice={stockInfo.currentPrice}
          minDate={minDate}
          maxDate={maxDate}
          exchangeRate={exchangeRate}
          exchangeRateLoading={exchangeRateLoading}
          onDateChange={setInvestDate}
          onAmountChange={setInvestAmount}
          onCalculate={calculateRegret}
        />

        {calculation && (
          <div>
            <CalculationResults calculation={calculation} />
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
          </div>
        )}
      </div>
    </div>
  );
}
