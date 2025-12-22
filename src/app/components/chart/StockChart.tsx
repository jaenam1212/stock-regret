'use client';

import {
  CandlestickData,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  createChart,
} from 'lightweight-charts';
import { useCallback, useEffect, useRef } from 'react';

interface StockChartProps {
  data: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  onDateSelect?: (date: string, price: number) => void;
  selectedDate?: string;
  onLoadMoreHistory?: (oldestDate: number) => void;
}

export default function StockChart({
  data,
  onDateSelect,
  selectedDate,
  onLoadMoreHistory,
}: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const loadingMoreRef = useRef(false);
  const oldestDataTimeRef = useRef<number | null>(null);
  const isFirstLoadRef = useRef(true);
  const previousDataLengthRef = useRef(0); // 이전 데이터 길이 추적 (SSR 임시 데이터 -> 실제 데이터 감지용)

  // 차트 클릭 핸들러를 안정화
  const handleChartClick = useCallback((param: any) => {
    if (onDateSelect && param.time && param.seriesData && seriesRef.current) {
      const candlestickData = param.seriesData.get(seriesRef.current);
      if (candlestickData && 'close' in candlestickData) {
        const timestamp = Number(param.time);
        const date = new Date(timestamp * 1000).toISOString().split('T')[0];
        onDateSelect(date, candlestickData.close);
      }
    }
  }, [onDateSelect]);

  // 차트 생성 (한 번만 실행)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: '#e5e7eb',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: 'rgba(156, 163, 175, 0.5)',
          style: 0,
        },
        horzLine: {
          visible: true,
          labelVisible: true,
          color: 'rgba(156, 163, 175, 0.5)',
        },
      },
      rightPriceScale: {
        borderColor: '#4b5563',
        visible: true,
        textColor: '#d1d5db',
      },
      timeScale: {
        borderColor: '#4b5563',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4ade80',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#4ade80',
      wickDownColor: '#ef4444',
      wickUpColor: '#4ade80',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // 스크롤 이벤트 감지하여 과거 데이터 로드
    if (onLoadMoreHistory) {
      const checkLoadMore = () => {
        if (loadingMoreRef.current) return;
        
        const visibleRange = chart.timeScale().getVisibleRange();
        if (!visibleRange || !oldestDataTimeRef.current) return;

        // 현재 표시된 가장 오래된 시간이 데이터의 가장 오래된 시간보다 30일 이내면 추가 로드
        const fromTime = typeof visibleRange.from === 'number' ? visibleRange.from : Number(visibleRange.from);
        const daysDiff = (oldestDataTimeRef.current - fromTime) / (24 * 60 * 60);
        
        if (daysDiff < 30 && daysDiff > 0) {
          loadingMoreRef.current = true;
          onLoadMoreHistory(oldestDataTimeRef.current);
          
          // 로딩이 완료되면 다시 체크 가능하도록
          setTimeout(() => {
            loadingMoreRef.current = false;
          }, 2000);
        }
      };

      chart.timeScale().subscribeVisibleTimeRangeChange(checkLoadMore);
    }

    // 반응형 처리
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          chart.applyOptions({ width, height });
        }
      }
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []); // 의존성을 빈 배열로 변경

  // 클릭 이벤트 핸들러 등록 (별도로 관리)
  useEffect(() => {
    if (chartRef.current && onDateSelect) {
      chartRef.current.subscribeClick(handleChartClick);
      
      return () => {
        if (chartRef.current) {
          chartRef.current.unsubscribeClick(handleChartClick);
        }
      };
    }
  }, [handleChartClick, onDateSelect]);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      const formattedData: CandlestickData[] = data.map((item) => ({
        time: Number(item.time) as UTCTimestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      // 가장 오래된 데이터 시간 저장 (점진적 로딩용)
      if (formattedData.length > 0 && onLoadMoreHistory) {
        const sortedData = [...formattedData].sort((a, b) => {
          const timeA = typeof a.time === 'number' ? a.time : Number(a.time);
          const timeB = typeof b.time === 'number' ? b.time : Number(b.time);
          return timeA - timeB;
        });
        const oldestTime = sortedData[0].time;
        oldestDataTimeRef.current = typeof oldestTime === 'number' ? oldestTime : Number(oldestTime);
      }

      // 데이터가 확장되었는지 확인 (SSR 임시 데이터 -> 실제 데이터)
      const isDataExpanded = data.length > previousDataLengthRef.current && previousDataLengthRef.current > 0 && previousDataLengthRef.current < 10;

      seriesRef.current.setData(formattedData);

      // 차트 자동 스케일 조정
      if (chartRef.current) {
        // 첫 로드이거나 SSR 임시 데이터에서 실제 데이터로 확장된 경우
        if (isFirstLoadRef.current || isDataExpanded) {
          chartRef.current.timeScale().fitContent();
          isFirstLoadRef.current = false;
        }
      }

      previousDataLengthRef.current = data.length;
    }
  }, [data, onLoadMoreHistory]);

  // 데이터가 없을 때 로딩 상태 표시
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-lg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">차트 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={chartContainerRef} className="w-full h-full" />
      {/* 차트 컨트롤 힌트 */}
      <div className="absolute top-2 right-2 bg-gray-900/80 px-2 py-1 rounded text-xs text-gray-400">
        마우스 드래그: 이동 | 스크롤: 확대/축소
      </div>
      {/* 날짜 선택 힌트 */}
      {onDateSelect && (
        <div className="absolute top-2 left-2 bg-blue-600/80 px-2 py-1 rounded text-xs text-white">
          날짜 클릭: 선택
        </div>
      )}
      {/* 선택된 날짜 표시 */}
      {selectedDate && (
        <div className="absolute bottom-2 left-2 bg-green-600/80 px-2 py-1 rounded text-xs text-white">
          선택: {selectedDate}
        </div>
      )}
    </div>
  );
}
