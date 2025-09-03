'use client';

import { formatPrice } from '@/app/lib/utils';
import { useState } from 'react';

export type InvestmentType = 'lump-sum' | 'monthly';

interface CalculatorInputProps {
  investDate: string;
  investAmount: number;
  currentPrice: number;
  currency: string;
  minDate: string;
  maxDate: string;
  exchangeRate?: number;
  exchangeRateLoading?: boolean;
  onDateChange: (date: string) => void;
  onAmountChange: (amount: number) => void;
  onCalculate: () => void;
  onInvestmentTypeChange?: (type: InvestmentType) => void;
  onMonthlyAmountChange?: (amount: number) => void;
}

export default function CalculatorInput({
  investDate,
  investAmount,
  currentPrice,
  currency,
  minDate,
  maxDate,
  exchangeRate,
  exchangeRateLoading,
  onDateChange,
  onAmountChange,
  onCalculate,
  onInvestmentTypeChange,
  onMonthlyAmountChange,
}: CalculatorInputProps) {
  const [investmentType, setInvestmentType] =
    useState<InvestmentType>('lump-sum');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(100000);

  const handleInvestmentTypeChange = (type: InvestmentType) => {
    setInvestmentType(type);
    onInvestmentTypeChange?.(type);
  };

  const handleMonthlyAmountChange = (amount: number) => {
    setMonthlyAmount(amount);
    onMonthlyAmountChange?.(amount);
  };

  return (
    <div className="space-y-6">
      {/* 투자 방식 선택 */}
      <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
        <button
          onClick={() => handleInvestmentTypeChange('lump-sum')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            investmentType === 'lump-sum'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          일시불 투자
        </button>
        <button
          onClick={() => handleInvestmentTypeChange('monthly')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            investmentType === 'monthly'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          적립식 투자
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {investmentType === 'monthly' ? '투자 시작일' : '투자 날짜'}
          </label>
          <input
            type="date"
            value={investDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={minDate}
            max={maxDate}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                       text-white focus:border-blue-500 focus:outline-none transition-colors
                       date:text-gray-300 [&::-webkit-calendar-picker-indicator]:brightness-200
                       [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:scale-125
                       box-border max-w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {investmentType === 'monthly'
              ? '월 투자 금액 (원)'
              : '투자 금액 (원)'}
          </label>
          <input
            type="number"
            value={investmentType === 'monthly' ? monthlyAmount : investAmount}
            onChange={(e) =>
              investmentType === 'monthly'
                ? handleMonthlyAmountChange(Number(e.target.value))
                : onAmountChange(Number(e.target.value))
            }
            placeholder={investmentType === 'monthly' ? '100000' : '1000000'}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                       text-white focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            현재 주가
          </label>
          <input
            type="text"
            value={formatPrice(currentPrice, currency)}
            readOnly
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg
                     text-gray-400 cursor-not-allowed"
          />
        </div>

        {currency === 'USD' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              환율 (KRW/USD)
            </label>
            <div className="relative">
              <input
                type="text"
                value={
                  exchangeRateLoading
                    ? '로딩 중...'
                    : `₩${exchangeRate?.toLocaleString() || '1,350'}`
                }
                readOnly
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg
                         text-gray-400 cursor-not-allowed"
              />
              {exchangeRateLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={onCalculate}
            className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-500
                       hover:from-green-500 hover:to-green-400 rounded-lg font-semibold
                       transition-all transform hover:scale-105 focus:outline-none
                       focus:ring-2 focus:ring-green-500"
          >
            {investmentType === 'monthly' ? '적립식 계산하기' : '계산하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
