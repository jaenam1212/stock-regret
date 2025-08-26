'use client';

import { useState, useEffect } from 'react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

export default function DatePicker({ 
  value, 
  onChange, 
  minDate = '2020-01-01', 
  maxDate = new Date().toISOString().split('T')[0],
  className = ''
}: DatePickerProps) {
  // 날짜를 년/월/일로 분리
  const parseDate = (dateStr: string) => {
    if (!dateStr) return { year: '', month: '', day: '' };
    const [year, month, day] = dateStr.split('-');
    return { year, month, day };
  };

  const formatDate = (year: string, month: string, day: string) => {
    if (!year || !month || !day) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const { year, month, day } = parseDate(value);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedDay, setSelectedDay] = useState(day);

  // 년도 범위 생성
  const minYear = parseInt(minDate.split('-')[0]);
  const maxYear = parseInt(maxDate.split('-')[0]);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  // 월 배열
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 해당 년월의 일 수 계산
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const days = selectedYear && selectedMonth 
    ? Array.from({ length: getDaysInMonth(parseInt(selectedYear), parseInt(selectedMonth)) }, (_, i) => i + 1)
    : [];

  // 값 변경 시 상위 컴포넌트에 전달
  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const newDate = formatDate(selectedYear, selectedMonth, selectedDay);
      if (newDate !== value) {
        onChange(newDate);
      }
    }
  }, [selectedYear, selectedMonth, selectedDay, value, onChange]);

  // 외부에서 값이 변경되었을 때 상태 업데이트
  useEffect(() => {
    const { year, month, day } = parseDate(value);
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(day);
  }, [value]);

  const selectStyle = "px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* 년도 선택 */}
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1">년도</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={selectStyle}
        >
          <option value="">년도</option>
          {years.map(y => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>
      </div>

      {/* 월 선택 */}
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1">월</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className={selectStyle}
          disabled={!selectedYear}
        >
          <option value="">월</option>
          {months.map(m => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </select>
      </div>

      {/* 일 선택 */}
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1">일</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className={selectStyle}
          disabled={!selectedYear || !selectedMonth}
        >
          <option value="">일</option>
          {days.map(d => (
            <option key={d} value={d}>{d}일</option>
          ))}
        </select>
      </div>
    </div>
  );
}