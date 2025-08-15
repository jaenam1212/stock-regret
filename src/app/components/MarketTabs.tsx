'use client';

import SearchAutocomplete from '@/app/components/SearchAutocomplete';
import { MarketType } from '@/types/stock';
import { searchItems } from '@/app/data/stockSearchData';
import { useState } from 'react';

interface UnifiedSearchProps {
  onSearch: (symbol: string, marketType: MarketType) => void;
  className?: string;
}

export default function UnifiedSearch({
  onSearch,
  className = '',
}: UnifiedSearchProps) {
  const [searchValue, setSearchValue] = useState('');

  // 디버깅용 - 검색값 변경 감지
  const handleSearchValueChange = (value: string) => {
    console.log('검색값 변경:', value);
    setSearchValue(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // 자동완성에서 선택하지 않고 직접 입력한 경우, 검색 데이터에서 찾아서 처리
      const searchResults = searchItems(searchValue.trim());
      if (searchResults.length > 0) {
        const bestMatch = searchResults[0];
        onSearch(bestMatch.symbol, bestMatch.marketType);
      } else {
        // 검색 결과가 없으면 입력값 그대로 사용 (getMarketType으로 타입 추론)
        onSearch(searchValue.trim(), 'us'); // 기본값은 미국 주식
      }
      setSearchValue('');
    }
  };

  const handleAutocompleteSelect = (symbol: string, marketType: MarketType) => {
    onSearch(symbol, marketType);
    setSearchValue('');
  };

  return (
    <div className={`bg-black/50 backdrop-blur-sm border-b border-gray-800 ${className}`}>
      <div className="container mx-auto px-4 py-3">
        {/* 통합 검색 */}
        <div className="flex flex-col gap-3">
          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl mx-auto">
            <SearchAutocomplete
              value={searchValue}
              onChange={handleSearchValueChange}
              onSelect={handleAutocompleteSelect}
              placeholder="회사명이나 심볼로 검색하세요 (예: 삼성전자, Apple, 비트코인)"
              className="flex-1"
            />
            <button
              type="submit"
              className="
                px-3 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                font-medium transition-colors focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                text-sm sm:text-base flex-shrink-0
              "
            >
              검색
            </button>
          </form>

          {/* 통합 검색 설명 */}
          <div className="text-center text-xs sm:text-sm text-gray-400">
            미국 주식, 한국 주식, 암호화폐를 한번에 검색하세요 • 예시: 삼성전자, Apple, 비트코인
          </div>
        </div>
      </div>
    </div>
  );
}