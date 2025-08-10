// src/app/hooks/useExchangeRate.ts
import { getExchangeRate } from '@/app/api';
import { useEffect, useState } from 'react';

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<number>(1350);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getExchangeRate('KRW', 'USD');
      setExchangeRate(data.rate);
      setLastUpdated(data.lastUpdated);

      if (data.isFallback) {
        console.warn('Using fallback exchange rate');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching exchange rate:', err);
      // 에러 시에도 기본값 유지
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();

    // 1시간마다 환율 업데이트
    const interval = setInterval(fetchExchangeRate, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    exchangeRate,
    loading,
    error,
    lastUpdated,
    refetch: fetchExchangeRate,
  };
}
