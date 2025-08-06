
'use client';

import { CalculationResult } from '@/types/stock';
import { formatCurrency, formatUSD } from '@/lib/utils';

interface CalculationResultsProps {
    calculation: CalculationResult;
  }
  
  export default function CalculationResults({ calculation }: CalculationResultsProps) {
    const isProfit = calculation.profit >= 0;
    
    // 배수 계산 (몇 배가 되었는지)
    const multiple = calculation.currentValue / calculation.investAmount;
    
    return (
      <div className="border-t border-gray-800 pt-6 space-y-6">
        {/* 감정 헤더 */}
        <div className="text-center">
          <h4 className="text-2xl lg:text-3xl font-bold">
            {isProfit ? (
              <>
                {multiple >= 100 ? (
                  <span className="text-red-500">🤯 미쳤다... {multiple.toFixed(0)}배...</span>
                ) : multiple >= 10 ? (
                  <span className="text-orange-500">😱 헐... {multiple.toFixed(1)}배나...</span>
                ) : multiple >= 2 ? (
                  <span className="text-yellow-500">😭 아... 진짜 살걸...</span>
                ) : (
                  <span className="text-green-500">😢 그래도 이득이긴 한데...</span>
                )}
              </>
            ) : (
              <span className="text-blue-500">😅 휴... 안 사길 잘했네</span>
            )}
          </h4>
        </div>
        
        {/* 결과 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResultCard
            label="투자 금액"
            value={formatCurrency(calculation.investAmount)}
            subtext={`${calculation.investDate}`}
          />
          
          <ResultCard
            label="구매 가능했던 주식"
            value={`${calculation.shares.toFixed(2)}주`}
            subtext={`@${formatUSD(calculation.pastPrice)}`}
          />
          
          <ResultCard
            label="현재 가치"
            value={formatCurrency(calculation.currentValue)}
            valueColor="text-white"
            subtext={`@${formatUSD(calculation.currentPrice)}`}
            isBold
          />
          
          <ResultCard
            label="손익"
            value={`${calculation.profit >= 0 ? '+' : ''}${formatCurrency(calculation.profit)}`}
            valueColor={isProfit ? 'text-green-500' : 'text-red-500'}
            subtext={`${calculation.profitPercent >= 0 ? '+' : ''}${calculation.profitPercent.toFixed(2)}%`}
            isBold
          />
        </div>
  
        {/* 추가 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">투자 배수</span>
              <span className={`text-xl font-bold ${multiple >= 2 ? 'text-yellow-500' : 'text-gray-300'}`}>
                {multiple.toFixed(2)}배
              </span>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">연환산 수익률</span>
              <span className={`text-xl font-bold ${calculation.yearlyReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {calculation.yearlyReturn >= 0 ? '+' : ''}{calculation.yearlyReturn.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">주가 상승률</span>
              <span className={`text-xl font-bold ${calculation.currentPrice >= calculation.pastPrice ? 'text-green-500' : 'text-red-500'}`}>
                {((calculation.currentPrice / calculation.pastPrice - 1) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
  
        {/* 후회 메시지 */}
        {isProfit && (
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 
                        border border-yellow-500/30 p-4 lg:p-6">
            <div className="relative z-10">
              {multiple >= 100 ? (
                <>
                  <p className="text-red-500 font-bold text-center text-2xl mb-2">
                    {multiple.toFixed(0)}배 수익!!!
                  </p>
                  <p className="text-yellow-500 font-medium text-center text-lg">
                    {formatCurrency(calculation.investAmount)}만 투자했으면...
                  </p>
                  <p className="text-white text-center text-2xl lg:text-3xl font-bold mt-2">
                    {formatCurrency(calculation.currentValue)} 됐을텐데!
                  </p>
                  <p className="text-gray-400 text-center text-sm mt-3">
                    순수익: {formatCurrency(calculation.profit)}
                  </p>
                </>
              ) : multiple >= 10 ? (
                <>
                  <p className="text-orange-500 font-bold text-center text-xl mb-2">
                    {multiple.toFixed(1)}배 수익!
                  </p>
                  <p className="text-yellow-500 font-medium text-center text-lg">
                    {formatCurrency(calculation.investAmount)}만 투자했으면...
                  </p>
                  <p className="text-white text-center text-2xl lg:text-3xl font-bold mt-2">
                    {formatCurrency(calculation.profit)} 벌었을텐데!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-yellow-500 font-medium text-center text-lg">
                    {formatCurrency(calculation.investAmount)}만 투자했으면...
                  </p>
                  <p className="text-white text-center text-2xl lg:text-3xl font-bold mt-2">
                    {formatCurrency(calculation.profit)} 벌었을텐데!
                  </p>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 animate-pulse" />
          </div>
        )}
  
        {!isProfit && (
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <p className="text-blue-400 text-center">
              {formatCurrency(Math.abs(calculation.profit))} 손실을 피했습니다!
            </p>
          </div>
        )}
      </div>
    );
  }
  
  interface ResultCardProps {
    label: string;
    value: string;
    subtext?: string;
    valueColor?: string;
    isBold?: boolean;
  }
  
  function ResultCard({ label, value, subtext, valueColor = 'text-gray-100', isBold = false }: ResultCardProps) {
    return (
      <div className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
        <p className="text-sm text-gray-400 mb-2">{label}</p>
        <p className={`${valueColor} ${isBold ? 'font-bold text-lg lg:text-xl' : 'font-medium'}`}>
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-gray-500 mt-1">{subtext}</p>
        )}
      </div>
    );
  }
  