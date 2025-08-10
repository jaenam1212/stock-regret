'use client';

import {
  CandlestickData,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  createChart,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';

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
}

export default function StockChart({
  data,
  onDateSelect,
  selectedDate,
}: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

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
        background: { color: '#0a0a0a' },
        textColor: '#ffffff',
      },
      grid: {
        vertLines: { color: '#1a1a1a' },
        horzLines: { color: '#1a1a1a' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: 'rgba(224, 227, 235, 0.1)',
          style: 0,
        },
        horzLine: {
          visible: true,
          labelVisible: true,
        },
      },
      rightPriceScale: {
        borderColor: '#333333',
        visible: true,
      },
      timeScale: {
        borderColor: '#333333',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    });

    // 최신 API에 맞게 수정 - CandlestickSeries 임포트해서 사용
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

    // 차트 클릭 이벤트 처리
    if (onDateSelect) {
      chart.subscribeClick((param) => {
        if (param.time && param.seriesData) {
          const candlestickData = param.seriesData.get(seriesRef.current!);
          if (candlestickData && 'close' in candlestickData) {
            const timestamp = Number(param.time);
            const date = new Date(timestamp * 1000).toISOString().split('T')[0];
            onDateSelect(date, candlestickData.close);
          }
        }
      });
    }

    // 반응형 처리
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const { width, height } = entries[0].contentRect;
        chart.applyOptions({ width, height });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      const formattedData: CandlestickData[] = data.map((item) => ({
        time: Number(item.time) as UTCTimestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      seriesRef.current.setData(formattedData);

      // 차트 자동 스케일 조정
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data]);

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
