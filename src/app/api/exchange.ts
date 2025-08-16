import apiClient from './client';

export interface ExchangeRateData {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
  isFallback?: boolean;
}

// 환율 조회
export const getExchangeRate = async (
  from: string = 'KRW',
  to: string = 'USD'
): Promise<ExchangeRateData> => {
  try {
    const response = await apiClient.get(`/api/exchange-rate`, {
      params: { from, to },
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch exchange rate:', error);
    
    // axios 타임아웃 에러 처리
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.warn('Exchange rate API timeout, returning fallback rate');
      return {
        fromCurrency: from,
        toCurrency: to,
        rate: 1350, // 기본 환율
        lastUpdated: new Date().toISOString(),
        isFallback: true,
      };
    }
    
    // 다른 에러의 경우도 기본값 반환 (환율은 중요하지 않음)
    console.warn('Exchange rate API error, returning fallback rate');
    return {
      fromCurrency: from,
      toCurrency: to,
      rate: 1350, // 기본 환율
      lastUpdated: new Date().toISOString(),
      isFallback: true,
    };
  }
};

// 여러 환율 조회
export const getMultipleExchangeRates = async (
  pairs: Array<{ from: string; to: string }>
): Promise<ExchangeRateData[]> => {
  try {
    const promises = pairs.map(({ from, to }) => getExchangeRate(from, to));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Failed to fetch multiple exchange rates:', error);
    throw new Error('환율 정보를 가져오는데 실패했습니다.');
  }
};
