'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabNavigation() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-800 overflow-hidden mb-3 sm:mb-4 lg:mb-6">
      <div className="flex border-b border-gray-800">
        <Link
          href="/"
          className={`flex-1 px-3 py-3 text-sm font-medium transition-colors text-center ${
            pathname === '/'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          단일 차트
        </Link>
        <Link
          href="/double-chart"
          className={`flex-1 px-3 py-3 text-sm font-medium transition-colors text-center ${
            pathname === '/double-chart'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          듀얼 차트
        </Link>
        <Link
          href="/simulation"
          className={`flex-1 px-3 py-3 text-sm font-medium transition-colors text-center ${
            pathname === '/simulation'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          시뮬레이션
        </Link>
      </div>
    </div>
  );
}