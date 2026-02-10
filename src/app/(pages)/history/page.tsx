'use client';

import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">현재 이용할 수 없습니다</h1>
        <p className="text-gray-400">
          히스토리 기능이 일시적으로 비활성화되었습니다.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
