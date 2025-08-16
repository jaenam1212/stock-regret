'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DailyStats {
  date: string;
  uniqueUsers: number;
  totalVisits: number;
  popularSymbols: string[];
  chatMessages: number;
}

type TabType = 'daily' | 'weekly' | 'monthly';

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'daily':
          const dailyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stats/daily`);
          const daily = await dailyResponse.json();
          setDailyStats(daily);
          break;
        case 'weekly':
          const weeklyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stats/weekly`);
          const weekly = await weeklyResponse.json();
          setWeeklyStats(weekly);
          break;
        case 'monthly':
          const now = new Date();
          const monthlyResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stats/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
          );
          const monthly = await monthlyResponse.json();
          setMonthlyStats(monthly);
          break;
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  const renderDailyStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">오늘 고유 사용자</h3>
        <p className="text-3xl font-bold text-green-500">{dailyStats?.uniqueUsers || 0}</p>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">오늘 총 방문</h3>
        <p className="text-3xl font-bold text-blue-500">{dailyStats?.totalVisits || 0}</p>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">오늘 채팅 메시지</h3>
        <p className="text-3xl font-bold text-purple-500">{dailyStats?.chatMessages || 0}</p>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">인기 주식</h3>
        <div className="space-y-1">
          {dailyStats?.popularSymbols.slice(0, 3).map((symbol, index) => (
            <p key={symbol} className="text-sm">
              {index + 1}. {symbol}
            </p>
          )) || <p className="text-gray-500 text-sm">데이터 없음</p>}
        </div>
      </div>
    </div>
  );

  const renderWeeklyStats = () => (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-2">날짜</th>
              <th className="text-left p-2">고유 사용자</th>
              <th className="text-left p-2">총 방문</th>
              <th className="text-left p-2">채팅 메시지</th>
            </tr>
          </thead>
          <tbody>
            {weeklyStats.map((stat) => (
              <tr key={stat.date} className="border-b border-gray-800">
                <td className="p-2">{formatDate(stat.date)}</td>
                <td className="p-2">{stat.uniqueUsers}</td>
                <td className="p-2">{stat.totalVisits}</td>
                <td className="p-2">{stat.chatMessages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMonthlyStats = () => (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-2">날짜</th>
              <th className="text-left p-2">고유 사용자</th>
              <th className="text-left p-2">총 방문</th>
              <th className="text-left p-2">채팅 메시지</th>
            </tr>
          </thead>
          <tbody>
            {monthlyStats.map((stat) => (
              <tr key={stat.date} className="border-b border-gray-800">
                <td className="p-2">{formatDate(stat.date)}</td>
                <td className="p-2">{stat.uniqueUsers}</td>
                <td className="p-2">{stat.totalVisits}</td>
                <td className="p-2">{stat.chatMessages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">통계 데이터 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold">사용자 통계</h1>
            </div>
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'daily', label: '일별' },
              { id: 'weekly', label: '주별' },
              { id: 'monthly', label: '월별' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'daily' && renderDailyStats()}
        {activeTab === 'weekly' && renderWeeklyStats()}
        {activeTab === 'monthly' && renderMonthlyStats()}
      </main>
    </div>
  );
} 