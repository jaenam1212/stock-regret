import { useQuery } from '@tanstack/react-query';
import { StockInfo } from '@/types/stock';

interface UseCryptoDataOptions {
  symbol: string;
  enabled?: boolean;
}

export function useCryptoData({ symbol, enabled = true }: UseCryptoDataOptions) {
  return useQuery<StockInfo>({
    queryKey: ['crypto-data', symbol.toLowerCase()],
    queryFn: async () => {
      const response = await fetch(`/api/crypto-data?symbol=${encodeURIComponent(symbol)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch crypto data: ${response.status}`);
      }
      return response.json();
    },
    enabled: enabled && !!symbol,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 30 * 60 * 1000, // 30분간 메모리에 유지 (이전 데이터 재사용 가능)
    // 이전 데이터를 표시하면서 백그라운드에서 새 데이터 가져오기
    placeholderData: (previousData) => previousData,
  });
}

