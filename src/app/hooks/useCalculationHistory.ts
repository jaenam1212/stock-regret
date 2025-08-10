'use client';

import { CalculationHistory, supabase } from '@/lib/supabase';
import { CalculationResult } from '@/types/stock';
import { useEffect, useState } from 'react';

export function useCalculationHistory(userId?: string) {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 계산 내역 가져오기
  const fetchHistory = async () => {
    if (!userId || !supabase) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('calculation_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
      console.error('Error fetching calculation history:', err);
    } finally {
      setLoading(false);
    }
  };

  // 계산 내역 저장
  const saveCalculation = async (
    symbol: string,
    calculation: CalculationResult
  ) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('calculation_history')
        .insert({
          user_id: userId,
          symbol,
          invest_date: calculation.investDate,
          invest_amount: calculation.investAmount,
          past_price: calculation.pastPrice,
          current_price: calculation.currentPrice,
          shares: calculation.shares,
          current_value: calculation.currentValue,
          profit: calculation.profit,
          profit_percent: calculation.profitPercent,
          yearly_return: calculation.yearlyReturn,
        })
        .select()
        .single();

      if (error) throw error;

      // 로컬 상태 업데이트
      setHistory((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save calculation'
      );
      console.error('Error saving calculation:', err);
      throw err;
    }
  };

  // 계산 내역 삭제
  const deleteCalculation = async (id: string) => {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { error } = await supabase
        .from('calculation_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete calculation'
      );
      console.error('Error deleting calculation:', err);
      throw err;
    }
  };

  // 사용자 ID가 변경될 때마다 내역 다시 가져오기
  useEffect(() => {
    if (userId) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [userId]);

  return {
    history,
    loading,
    error,
    saveCalculation,
    deleteCalculation,
    refetch: fetchHistory,
  };
}
