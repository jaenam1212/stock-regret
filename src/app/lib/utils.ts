import { StockData } from '@/types/stock';

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(value);
  }
  
  export function formatUSD(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
    const sortedData = [...data].sort((a, b) => 
      Math.abs(Number(a.time) - targetTimestamp) - 
      Math.abs(Number(b.time) - targetTimestamp)
    );
    
    return sortedData[0];
  }
  