'use client';

import { formatPrice } from '@/app/lib/utils';
import { StockInfo } from '@/types/stock';
import {
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  createChart,
} from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import Picker from 'react-mobile-picker';

interface StockSimulationProps {
  stockInfo: StockInfo;
}

export default function StockSimulation({ stockInfo }: StockSimulationProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(speed);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedData, setSelectedData] = useState<typeof stockInfo.data>([]);

  // speedRef를 항상 최신 속도로 업데이트
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 날짜 범위 설정
  const minDate = stockInfo?.data[0]
    ? new Date(Number(stockInfo.data[0].time) * 1000)
    : new Date('2020-01-01');
  const maxDate = new Date();

  // 날짜 선택기용 데이터 생성
  const generateDateOptions = () => {
    const currentYear = maxDate.getFullYear();
    const minYear = minDate.getFullYear();

    const years = Array.from({ length: currentYear - minYear + 1 }, (_, i) =>
      (minYear + i).toString()
    );

    const months = Array.from({ length: 12 }, (_, i) =>
      (i + 1).toString().padStart(2, '0')
    );

    const days = Array.from({ length: 31 }, (_, i) =>
      (i + 1).toString().padStart(2, '0')
    );

    return { years, months, days };
  };

  const { years, months, days } = generateDateOptions();

  // 현재 선택된 날짜를 picker 포맷으로 변환
  const getPickerValue = () => {
    if (!startDate) {
      const today = new Date();
      return {
        year: today.getFullYear().toString(),
        month: (today.getMonth() + 1).toString().padStart(2, '0'),
        day: today.getDate().toString().padStart(2, '0'),
      };
    }

    const date = new Date(startDate);
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      day: date.getDate().toString().padStart(2, '0'),
    };
  };

  const [pickerValue, setPickerValue] = useState(getPickerValue());

  // pickerValue 변경시 startDate 업데이트
  useEffect(() => {
    const selectedDate = `${pickerValue.year}-${pickerValue.month}-${pickerValue.day}`;
    if (selectedDate !== startDate) {
      setStartDate(selectedDate);
    }
  }, [pickerValue, startDate]);

  // 차트 초기화 및 전체 데이터 표시
  useEffect(() => {
    if (!chartContainerRef.current || !stockInfo.data.length) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
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

    // 처음에는 전체 데이터 표시
    const chartData = stockInfo.data
      .map((item) => ({
        time: Number(item.time) as UTCTimestamp,
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
      }))
      .filter((item) => !isNaN(item.time) && item.time > 0)
      .sort((a, b) => a.time - b.time);

    if (chartData.length > 0) {
      candlestickSeries.setData(chartData);
      chart.timeScale().fitContent();
    }
    // 반응형 처리
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: 400,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [stockInfo.data]);

  // 시작 날짜 설정 시 데이터 필터링 (차트는 초기화하지 않음)
  useEffect(() => {
    if (!startDate || !stockInfo.data.length) return;

    const startTimestamp = new Date(startDate).getTime() / 1000;
    const filteredData = stockInfo.data
      .filter((item) => Number(item.time) >= startTimestamp)
      .sort((a, b) => Number(a.time) - Number(b.time));

    setSelectedData(filteredData);
    setCurrentIndex(0);

    // 재생 중이면 정지
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    }
  }, [startDate, stockInfo.data, isPlaying]);

  // 애니메이션 제어 - 실시간 속도 변경 지원
  const startAnimation = useCallback(() => {
    if (!selectedData.length || isPlaying) return;

    setIsPlaying(true);
    setCurrentIndex(0);

    // 재생 시작할 때만 차트 초기화
    if (seriesRef.current) {
      seriesRef.current.setData([]);
    }

    const animate = () => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;

        if (nextIndex >= selectedData.length) {
          setIsPlaying(false);
          if (intervalRef.current) {
            clearTimeout(intervalRef.current);
          }
          return prev;
        }

        // 차트에 데이터 점진적 추가
        if (seriesRef.current) {
          const dataSlice = selectedData
            .slice(0, nextIndex + 1)
            .map((item) => ({
              time: Number(item.time) as UTCTimestamp,
              open: Number(item.open),
              high: Number(item.high),
              low: Number(item.low),
              close: Number(item.close),
            }));

          seriesRef.current.setData(dataSlice);

          // 차트를 최신 데이터로 스크롤
          if (chartRef.current) {
            chartRef.current.timeScale().scrollToRealTime();
          }
        }

        // 다음 프레임 스케줄링 - 현재 속도 참조
        intervalRef.current = setTimeout(
          animate,
          Math.max(50, 1000 / speedRef.current)
        );

        return nextIndex;
      });
    };

    // 첫 번째 프레임 시작
    animate();
  }, [selectedData, isPlaying]);

  const pauseAnimation = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    if (seriesRef.current) {
      seriesRef.current.setData([]);
    }
  };

  // 날짜 선택 핸들러
  const handleDatePickerChange = (
    value: { year: string; month: string; day: string },
    key: string
  ) => {
    const newValue = { ...value };

    // 해당 월의 최대 일수 확인
    if (key === 'month' || key === 'year') {
      const year = parseInt(newValue.year);
      const month = parseInt(newValue.month);
      const maxDays = getDaysInMonth(year, month);

      if (parseInt(newValue.day) > maxDays) {
        newValue.day = maxDays.toString().padStart(2, '0');
      }
    }

    setPickerValue(newValue);
    // startDate 업데이트는 useEffect에서 처리
  };

  // 월별 일수 체크
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // 클린업
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  const currentPrice = selectedData[currentIndex]?.close || 0;
  const currentDate = selectedData[currentIndex]
    ? new Date(
        Number(selectedData[currentIndex].time) * 1000
      ).toLocaleDateString('ko-KR')
    : '';

  return (
    <div className="p-4 lg:p-6">
      {/* 헤더 - 주식 정보 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl lg:text-2xl font-bold">투자 시뮬레이션</h3>
          <div className="text-right">
            <div className="text-lg font-semibold">{stockInfo.symbol}</div>
            <div className="text-sm text-gray-400">
              {stockInfo.meta.companyName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-xl font-semibold">
              {formatPrice(stockInfo.currentPrice, stockInfo.meta.currency)}
            </span>
            <div
              className={`inline-flex items-center gap-2 px-2 py-1 rounded text-sm ml-2 ${
                stockInfo.change >= 0
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }`}
            >
              <span>
                {stockInfo.change >= 0 ? '↑' : '↓'}
                {Math.abs(stockInfo.change).toFixed(
                  stockInfo.meta.currency === 'KRW' ? 0 : 2
                )}
              </span>
              <span>
                ({stockInfo.changePercent >= 0 ? '+' : ''}
                {stockInfo.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 패널 */}
      <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
        {/* 시작 날짜 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            시작 날짜
          </label>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-center mb-2 text-white font-medium">
              {startDate
                ? new Date(startDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '날짜를 선택하세요'}
            </div>
            <Picker
              value={pickerValue}
              onChange={handleDatePickerChange}
              height={120}
              itemHeight={30}
              wheelMode="natural"
            >
              <Picker.Column name="year">
                {years.map((year) => (
                  <Picker.Item key={year} value={year}>
                    <div className="text-white text-center font-medium">
                      {year}년
                    </div>
                  </Picker.Item>
                ))}
              </Picker.Column>
              <Picker.Column name="month">
                {months.map((month) => (
                  <Picker.Item key={month} value={month}>
                    <div className="text-white text-center font-medium">
                      {parseInt(month)}월
                    </div>
                  </Picker.Item>
                ))}
              </Picker.Column>
              <Picker.Column name="day">
                {days
                  .slice(
                    0,
                    getDaysInMonth(
                      parseInt(pickerValue.year),
                      parseInt(pickerValue.month)
                    )
                  )
                  .map((day) => (
                    <Picker.Item key={day} value={day}>
                      <div className="text-white text-center font-medium">
                        {parseInt(day)}일
                      </div>
                    </Picker.Item>
                  ))}
              </Picker.Column>
            </Picker>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            📱 드래그하거나 터치해서 날짜를 선택하세요
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 속도 조절 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              재생 속도: {speed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={startAnimation}
              disabled={!startDate || isPlaying || !selectedData.length}
              className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isPlaying ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-6 h-6 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {isPlaying ? '재생중' : '시작'}
              </div>
            </button>

            <button
              onClick={pauseAnimation}
              disabled={!isPlaying}
              className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                일시정지
              </div>
            </button>

            <button
              onClick={resetAnimation}
              className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                리셋
              </div>
            </button>
          </div>
        </div>

        {/* 진행 상황 */}
        {selectedData.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>
                진행률: {Math.round((currentIndex / selectedData.length) * 100)}
                %
              </span>
              <span>
                {currentIndex + 1} / {selectedData.length} 일
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                style={{
                  width: `${(currentIndex / selectedData.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 현재 정보 */}
      {currentDate && (
        <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">현재 날짜</div>
              <div className="text-lg font-semibold text-white">
                {currentDate}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">현재 가격</div>
              <div className="text-lg font-semibold text-white">
                {formatPrice(currentPrice, stockInfo.meta.currency)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 차트 */}
      <div className="bg-gray-800/30 rounded-lg p-4">
        <div className="mb-2 text-sm text-gray-400">
          {startDate
            ? `시뮬레이션 시작: ${new Date(startDate).toLocaleDateString('ko-KR')}`
            : '상단에서 시뮬레이션 시작 날짜를 선택하세요'}
        </div>
        <div ref={chartContainerRef} className="w-full h-96" />
      </div>
    </div>
  );
}
