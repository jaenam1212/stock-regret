import { StockData } from '@/types/stock';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPrice(value: number, currency: string): string {
  const isKRW = currency === 'KRW';
  return new Intl.NumberFormat(isKRW ? 'ko-KR' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: isKRW ? 0 : 2,
    maximumFractionDigits: isKRW ? 0 : 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function calculateYearlyReturn(
  initialValue: number,
  finalValue: number,
  years: number
): number {
  if (years <= 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
}

export function findClosestData(
  data: StockData[],
  targetDate: Date
): StockData | null {
  if (!data.length) return null;

  const targetTimestamp = targetDate.getTime() / 1000;
  const sortedData = [...data].sort(
    (a, b) =>
      Math.abs(Number(a.time) - targetTimestamp) -
      Math.abs(Number(b.time) - targetTimestamp)
  );

  return sortedData[0];
}

// API 통합 유틸리티
export function getApiBaseUrl(): string {
  // 클라이언트에서도 접근 가능한 공개 환경변수 사용
  return (process.env.NEXT_PUBLIC_API_URL || '').trim();
}

export function getApiEndpoint(path: string): string {
  const base = getApiBaseUrl();
  if (!base) {
    // 로컬(또는 Vercel 프리뷰)에서는 Next API 라우트로 폴백 매핑
    if (path.startsWith('/api/stock/data')) return '/api/stock-data';
    if (path.startsWith('/api/stock/exchange-rate'))
      return '/api/exchange-rate';
    // 헬스체크는 외부 API 전용이므로 폴백 없음
    return path;
  }
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}
