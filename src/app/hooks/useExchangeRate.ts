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
        setError(null); // 폴백 데이터는 에러가 아님
      } else {
        setError(null); // 성공시 에러 클리어
      }
    } catch (err) {
      // getExchangeRate에서 이미 폴백 데이터를 반환하므로 
      // 여기서 에러가 발생하는 경우는 거의 없음
      console.warn('Unexpected error in useExchangeRate:', err);
      setError(null); // 환율은 중요하지 않으므로 에러 표시하지 않음
      // 기본값(1350) 유지
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
