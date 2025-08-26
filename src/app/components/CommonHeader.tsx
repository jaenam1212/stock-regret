'use client';

import UnifiedSearch from '@/app/components/MarketTabs';
import AuthModal from '@/app/components/auth/AuthModal';
import { useAuth } from '@/app/hooks/useAuth';
import { MarketType } from '@/types/stock';
import Image from 'next/image';
import { useState } from 'react';

interface CommonHeaderProps {
  onSearch: (symbol: string, marketType: MarketType) => void;
}

export default function CommonHeader({ onSearch }: CommonHeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="flex-shrink-0 bg-black/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-3 py-2 border-b border-gray-800">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="아! 살껄 계산기 로고"
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <h1 className="text-lg font-bold text-white">아! 살껄 계산기</h1>
            </div>
          </div>

          {/* 로그인 버튼을 우측 상단으로 */}
          <div className="absolute top-2 right-3 z-10">
            {user ? (
              <button
                onClick={() => signOut()}
                className="px-2 py-1 bg-gray-700/80 hover:bg-gray-600 rounded text-xs font-medium transition-colors backdrop-blur-sm"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-2 py-1 bg-blue-600/80 hover:bg-blue-700 rounded text-xs font-medium transition-colors backdrop-blur-sm"
              >
                로그인
              </button>
            )}
          </div>
        </div>

        {/* 통합 검색 */}
        <UnifiedSearch onSearch={onSearch} />
      </header>

      {/* 인증 모달 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}