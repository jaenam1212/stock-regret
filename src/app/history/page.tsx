'use client';

// 빌드 타임 정적 생성 방지
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useAuth } from '@/app/hooks/useAuth';
import { useCalculationHistory } from '@/app/hooks/useCalculationHistory';
import { formatCurrency, formatPrice } from '@/app/lib/utils';
import { CalculationHistory } from '@/lib/supabase';
import { useState } from 'react';

export default function HistoryPage() {
  const { user } = useAuth();
  const { history, loading, error, deleteCalculation } = useCalculationHistory(
    user?.id
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setDeletingId(id);
    try {
      await deleteCalculation(id);
    } catch (err) {
      console.error('Failed to delete calculation:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-400">계산 내역을 보려면 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">계산 내역</h1>
            <a
              href="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition-colors"
            >
              홈으로
            </a>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400">에러: {error}</div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400">아직 계산 내역이 없습니다.</div>
            <a
              href="/"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
            >
              계산해보기
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onDelete={() => handleDelete(item.id)}
                isDeleting={deletingId === item.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface HistoryCardProps {
  item: CalculationHistory;
  onDelete: () => void;
  isDeleting: boolean;
}

function HistoryCard({ item, onDelete, isDeleting }: HistoryCardProps) {
  const isProfit = item.profit >= 0;
  const multiple = item.current_value / item.invest_amount;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-blue-400">{item.symbol}</h3>
          <p className="text-sm text-gray-400">{item.invest_date}</p>
        </div>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded text-sm transition-colors"
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400">투자 금액</p>
          <p className="font-semibold">{formatCurrency(item.invest_amount)}</p>
        </div>
        {(() => {
          const isKorean = /^\d{6}$/.test(item.symbol);
          const currency = isKorean ? 'KRW' : 'USD';
          return (
            <>
              <div>
                <p className="text-sm text-gray-400">구매 가격</p>
                <p className="font-semibold">{formatPrice(item.past_price, currency)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">현재 가격</p>
                <p className="font-semibold">{formatPrice(item.current_price, currency)}</p>
              </div>
            </>
          );
        })()}
        <div>
          <p className="text-sm text-gray-400">손익</p>
          <p
            className={`font-semibold ${isProfit ? 'text-green-500' : 'text-red-500'}`}
          >
            {isProfit ? '+' : ''}
            {formatCurrency(item.profit)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-400">수익률</p>
          <p
            className={`font-semibold ${isProfit ? 'text-green-500' : 'text-red-500'}`}
          >
            {isProfit ? '+' : ''}
            {item.profit_percent.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">배수</p>
          <p className="font-semibold">{multiple.toFixed(2)}배</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">연환산 수익률</p>
          <p
            className={`font-semibold ${item.yearly_return >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {item.yearly_return >= 0 ? '+' : ''}
            {item.yearly_return.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
