'use client';

import { useEffect, useRef } from 'react';
import { 
  createChart, 
  IChartApi,
  CandlestickData,
  UTCTimestamp,
  ISeriesApi,
  CandlestickSeries
} from 'lightweight-charts';

interface StockChartProps {
  data: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
}

export default function StockChart({ data }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
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

    // 반응형 처리
    window.addEventListener('resize', handleResize);
    
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length > 0) {
        const { width } = entries[0].contentRect;
        chart.applyOptions({ width });
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
      const formattedData: CandlestickData[] = data.map(item => ({
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
    <div className="relative w-full">
      <div ref={chartContainerRef} className="w-full h-[300px] sm:h-[400px] lg:h-[500px]" />
      {/* 차트 컨트롤 힌트 */}
      <div className="absolute top-2 right-2 bg-gray-900/80 px-2 py-1 rounded text-xs text-gray-400">
        마우스 드래그: 이동 | 스크롤: 확대/축소
      </div>
    </div>
  );
}