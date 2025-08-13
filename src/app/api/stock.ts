import { StockInfo } from '@/types/stock';
import apiClient from './client';

// 주식 데이터 조회
export const getStockData = async (symbol: string): Promise<StockInfo> => {
  try {
    const isKorean = /^\d{6}$/.test(symbol);
    const endpoint = isKorean ? '/api/kr-stock-data' : '/api/stock-data';

    // SSR에서는 직접 Next.js API route 호출
    if (typeof window === 'undefined') {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const url = `${baseUrl}${endpoint}?symbol=${symbol}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }

    // 클라이언트에서는 axios 사용
    const response = await apiClient.get(endpoint, {
      params: { symbol },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    throw new Error('주식 데이터를 가져오는데 실패했습니다.');
  }
};

// 주식 데이터 조회 (여러 심볼)
export const getMultipleStockData = async (
  symbols: string[]
): Promise<StockInfo[]> => {
  try {
    const promises = symbols.map((symbol) => getStockData(symbol));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Failed to fetch multiple stock data:', error);
    throw new Error('주식 데이터를 가져오는데 실패했습니다.');
  }
};
