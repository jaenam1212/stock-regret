'use client';

import {
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  createChart,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface MiniStockChartProps {
  data: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  selectedDate?: string;
  width?: number;
  height?: number;
}

export default function MiniStockChart({
  data,
  selectedDate,
  width = 350,
  height = 180,
}: MiniStockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#4b5563',
      },
      rightPriceScale: {
        borderColor: '#4b5563',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        vertLine: {
          color: '#6b7280',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: '#6b7280',
          width: 1,
          style: 2,
        },
      },
    });

    chartRef.current = chart;

    // 캔들스틱 시리즈 생성
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#f59e0b',
      borderUpColor: '#10b981',
      borderDownColor: '#f59e0b',
      wickUpColor: '#10b981',
      wickDownColor: '#f59e0b',
    });

    seriesRef.current = candlestickSeries;

    // 데이터 변환 및 설정
    const chartData = data
      .map((item) => {
        // time이 이미 timestamp인지 문자열인지 확인
        let timestamp: number;
        if (typeof item.time === 'string') {
          // ISO 문자열인 경우
          if (item.time.includes('-')) {
            timestamp = new Date(item.time).getTime() / 1000;
          } else {
            // 이미 timestamp string인 경우
            timestamp = Number(item.time);
          }
        } else {
          timestamp = Number(item.time);
        }
        
        return {
          time: timestamp as UTCTimestamp,
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
        };
      })
      .filter((item) => !isNaN(item.time) && item.time > 0) // NaN 제거
      .sort((a, b) => a.time - b.time); // 시간순 정렬

    // 데이터가 유효한 경우에만 설정
    if (chartData.length > 0) {
      candlestickSeries.setData(chartData);

      // 차트 크기에 맞게 조정
      chart.timeScale().fitContent();
    }

    // 정리
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [data, selectedDate, width, height]);

  return (
    <div className="bg-gray-800/30 rounded-lg p-2">
      <div ref={chartContainerRef} />
    </div>
  );
}