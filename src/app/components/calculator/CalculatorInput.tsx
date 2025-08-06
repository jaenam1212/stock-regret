
'use client';

import { formatUSD } from '@/lib/utils';

interface CalculatorInputProps {
    investDate: string;
    investAmount: number;
    currentPrice: number;
    minDate: string;
    maxDate: string;
    exchangeRate?: number;
    exchangeRateLoading?: boolean;
    onDateChange: (date: string) => void;
    onAmountChange: (amount: number) => void;
    onCalculate: () => void;
  }
  
  export default function CalculatorInput({
    investDate,
    investAmount,
    currentPrice,
    minDate,
    maxDate,
    exchangeRate,
    exchangeRateLoading,
    onDateChange,
    onAmountChange,
    onCalculate
  }: CalculatorInputProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            투자 날짜
          </label>
          <input
            type="date"
            value={investDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={minDate}
            max={maxDate}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            투자 금액 (원)
          </label>
          <input
            type="number"
            value={investAmount}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            placeholder="1000000"
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
            value={formatUSD(currentPrice)}
            readOnly
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg 
                     text-gray-400 cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            환율 (KRW/USD)
          </label>
          <div className="relative">
            <input
              type="text"
              value={exchangeRateLoading ? '로딩 중...' : `₩${exchangeRate?.toLocaleString() || '1,350'}`}
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
        
        <div className="flex items-end">
          <button 
            onClick={onCalculate}
            className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 
                     hover:from-green-500 hover:to-green-400 rounded-lg font-semibold 
                     transition-all transform hover:scale-105 focus:outline-none 
                     focus:ring-2 focus:ring-green-500"
          >
            계산하기
          </button>
        </div>
      </div>
    );
  }