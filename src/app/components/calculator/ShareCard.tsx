'use client';

import { formatCurrency, formatPrice } from '@/app/lib/utils';
import { CalculationResult } from '@/types/stock';
import { useRef } from 'react';
import MiniStockChart from '../chart/MiniStockChart';

interface ShareCardProps {
  calculation: CalculationResult;
  currency: string;
  stockSymbol: string;
  companyName: string;
  onCapture?: (canvas: HTMLCanvasElement) => void;
  hideShareButton?: boolean;
  stockData?: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
}

export default function ShareCard({
  calculation,
  currency,
  stockSymbol,
  companyName,
  onCapture,
  hideShareButton = false,
  stockData,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isProfit = calculation.profit >= 0;
  const multiple = calculation.currentValue / calculation.investAmount;
  const today = new Date().toLocaleDateString('ko-KR');

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      // html2canvas 동적 import
      const { default: html2canvas } = await import('html2canvas');

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1f2937',
        scale: 2,
        width: 400,
        height: stockData ? 750 : 600, // 차트 있으면 높이 증가
      });

      if (onCapture) {
        onCapture(canvas);
      } else {
        // Web Share API 또는 다운로드
        if (navigator.share && navigator.canShare()) {
          canvas.toBlob(async (blob: Blob | null) => {
            if (blob) {
              const file = new File(
                [blob],
                `${stockSymbol}-regret-${Date.now()}.png`,
                {
                  type: 'image/png',
                }
              );
              await navigator.share({
                title: `${companyName} 후회 계산 결과`,
                files: [file],
              });
            }
          });
        } else {
          // 다운로드
          const link = document.createElement('a');
          link.download = `${stockSymbol}-regret-${Date.now()}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="space-y-4 z-9999">
      {/* 공유용 카드 */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-sm mx-auto shadow-2xl border border-gray-700"
      >
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-xs text-gray-400 mb-1">
            Stock Regret Calculator
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{companyName}</h3>
          <div className="text-sm text-gray-400">{stockSymbol}</div>
        </div>

        {/* 감정 아이콘 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">
            {isProfit
              ? multiple >= 100
                ? '🤯'
                : multiple >= 10
                  ? '😱'
                  : multiple >= 2
                    ? '😭'
                    : '😢'
              : '😅'}
          </div>
          <div className="text-lg font-bold">
            {isProfit ? (
              multiple >= 100 ? (
                <span className="text-red-500">
                  {multiple.toFixed(0)}배 미쳤다...
                </span>
              ) : multiple >= 10 ? (
                <span className="text-orange-500">
                  {multiple.toFixed(1)}배나...
                </span>
              ) : multiple >= 2 ? (
                <span className="text-yellow-500">진짜 살걸...</span>
              ) : (
                <span className="text-green-500">그래도 이득</span>
              )
            ) : (
              <span className="text-blue-500">안 사길 잘했네</span>
            )}
          </div>
        </div>

        {/* 미니 차트 */}
        {stockData && stockData.length > 0 && (
          <div className="mb-6">
            <MiniStockChart
              data={stockData}
              selectedDate={calculation.investDate
                .split('.')
                .join('-')
                .replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, '$1-$2-$3')}
              width={350}
              height={140}
            />
          </div>
        )}

        {/* 투자 정보 */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center bg-gray-700/50 rounded-lg p-3 min-h-[4rem]">
            <div>
              <div className="text-xs text-gray-400">투자 날짜</div>
              <div className="text-sm font-medium text-white">
                {calculation.investDate}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">그때 가격</div>
              <div className="text-sm font-medium text-white">
                {formatPrice(calculation.pastPrice, currency)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-700/50 rounded-lg p-3 min-h-[4rem]">
            <div>
              <div className="text-xs text-gray-400">오늘 날짜</div>
              <div className="text-sm font-medium text-white">{today}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">현재 가격</div>
              <div className="text-sm font-medium text-white">
                {formatPrice(calculation.currentPrice, currency)}
              </div>
            </div>
          </div>
        </div>

        {/* 핵심 결과 */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
          <div className="text-center">
            <div className="text-xs text-gray-300 mb-1">투자금액</div>
            <div className="text-lg font-bold text-white mb-3">
              {formatCurrency(calculation.investAmount)}
            </div>

            {isProfit ? (
              <>
                <div className="text-xs text-gray-300 mb-1">현재 가치</div>
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {formatCurrency(calculation.currentValue)}
                </div>
                <div className="text-lg font-bold text-yellow-400">
                  +{formatCurrency(calculation.profit)}
                </div>
                <div className="text-xs text-gray-300">
                  +{calculation.profitPercent.toFixed(1)}% (
                  {multiple.toFixed(1)}배)
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-gray-300 mb-1">손실 회피</div>
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(Math.abs(calculation.profit))}
                </div>
                <div className="text-xs text-gray-300">피했네요!</div>
              </>
            )}
          </div>
        </div>

        {/* 워터마크 */}
        <div className="text-center mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-500">stock-regret.com</div>
        </div>
      </div>

      {/* 공유 버튼 */}
      {!hideShareButton && (
        <div className="text-center mb-8 pb-4">
          <button
            onClick={handleShare}
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
            결과 공유하기
          </button>
        </div>
      )}
    </div>
  );
}
