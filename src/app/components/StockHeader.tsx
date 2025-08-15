'use client';

import { checkBackendHealth } from '@/app/api';
import { formatPrice } from '@/app/lib/utils';
import { StockInfo } from '@/types/stock';
import { useEffect, useState } from 'react';

interface StockHeaderProps {
  stockInfo: StockInfo;
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export default function StockHeader({
  stockInfo,
  symbol,
  onSymbolChange,
}: StockHeaderProps) {
  const [inputSymbol, setInputSymbol] = useState(symbol);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const isHealthy = await checkBackendHealth();
        if (!isMounted) return;
        setApiHealthy(isHealthy);
      } catch {
        if (!isMounted) return;
        setApiHealthy(false);
      }
    };
    checkHealth();
    const id = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSymbol.trim()) {
      onSymbolChange(inputSymbol.toUpperCase());
    }
  };

  return (
    <div className="p-4 lg:p-6 border-b border-gray-800">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-xl lg:text-2xl font-bold">
              {stockInfo.symbol}
            </h2>
            <span className="text-sm lg:text-base text-gray-400">
              {stockInfo.meta.companyName}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <span className="text-2xl lg:text-3xl font-semibold">
              {formatPrice(stockInfo.currentPrice, stockInfo.meta.currency)}
            </span>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                stockInfo.change >= 0
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }`}
            >
              <span className="text-sm lg:text-base font-medium">
                {stockInfo.change >= 0 ? '↑' : '↓'}
                {Math.abs(stockInfo.change).toFixed(
                  stockInfo.meta.currency === 'KRW' ? 0 : 2
                )}
              </span>
              <span className="text-sm lg:text-base">
                ({stockInfo.changePercent >= 0 ? '+' : ''}
                {stockInfo.changePercent.toFixed(2)}%)
              </span>
            </div>

            {/* 백엔드 연결 상태 배지 */}
            <span
              className={`text-xs px-2 py-1 rounded border ${
                apiHealthy === null
                  ? 'bg-gray-500/10 text-gray-300 border-gray-700/40'
                  : apiHealthy
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-700/40'
                    : 'bg-red-500/10 text-red-400 border-red-700/40'
              }`}
              title="백엔드 연결 상태"
            >
              API{' '}
              {apiHealthy === null
                ? '(checking...)'
                : apiHealthy
                  ? '(online)'
                  : '(offline)'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
            placeholder="NVDA"
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white
                     focus:border-blue-500 focus:outline-none transition-colors w-24"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium
                     transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            검색
          </button>
        </form>
      </div>
    </div>
  );
}
