
'use client';

import { useState } from 'react';
import { StockInfo, CalculationResult } from '@/types/stock';
import { useExchangeRate } from '@/app/hooks/useExchangeRate';
import CalculatorInput from './CalculatorInput';
import CalculationResults from './CalculationResults';

interface RegretCalculatorProps {
  stockInfo: StockInfo;
  className?: string;
}

export default function RegretCalculator({ stockInfo, className = '' }: RegretCalculatorProps) {
  const [investDate, setInvestDate] = useState<string>('');
  const [investAmount, setInvestAmount] = useState<number>(1000000);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const { exchangeRate, loading: exchangeRateLoading } = useExchangeRate();

  const minDate = stockInfo?.data[0] 
    ? new Date(Number(stockInfo.data[0].time) * 1000).toISOString().split('T')[0]
    : '';
  const maxDate = new Date().toISOString().split('T')[0];

  const calculateRegret = () => {
    if (!investDate || !investAmount) {
      alert('모든 항목을 입력해주세요');
      return;
    }

    const targetDate = new Date(investDate);
    const targetTimestamp = targetDate.getTime() / 1000;
    
    // 선택한 날짜 이전의 데이터만 필터링 (미래 데이터 제외)
    const validData = stockInfo.data.filter(item => 
      Number(item.time) <= targetTimestamp
    );
    
    if (validData.length === 0) {
      alert('선택한 날짜에 거래 데이터가 없습니다. 더 최근 날짜를 선택해주세요.');
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
    const daysDiff = (currentDate.getTime() - investDateObj.getTime()) / (1000 * 60 * 60 * 24);
    const yearsDiff = daysDiff / 365;
    
    let yearlyReturn = 0;
    if (yearsDiff > 0) {
      // CAGR (연평균 성장률) 공식
      yearlyReturn = (Math.pow(currentValue / investAmount, 1 / yearsDiff) - 1) * 100;
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
      yearlyReturn
    });

    setCalculation({
      investAmount,
      investDate: investDateObj.toLocaleDateString('ko-KR'),
      pastPrice,
      currentPrice,
      shares,
      currentValue,
      profit,
      profitPercent,
      yearlyReturn
    });
  };

  return (
    <div className={className}>
      <div className="p-4 lg:p-6">
        <h3 className="text-xl lg:text-2xl font-bold mb-6">
          아! 살껄 계산기
        </h3>
        
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
          <CalculationResults calculation={calculation} />
        )}
      </div>
    </div>
  );
}