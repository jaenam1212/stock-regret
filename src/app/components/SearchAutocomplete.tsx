'use client';

import { searchItems, SearchItem } from '@/app/data/stockSearchData';
import { MarketType } from '@/types/stock';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (symbol: string, marketType: MarketType) => void;
  marketType?: MarketType;
  placeholder?: string;
  className?: string;
}

export default function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  marketType,
  placeholder = '검색...',
  className = '',
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 드롭다운 위치 계산
  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // 검색 결과 업데이트
  useEffect(() => {
    if (value.trim()) {
      const results = searchItems(value, marketType);
      setSuggestions(results);
      if (results.length > 0) {
        updateDropdownPosition();
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [value, marketType]);

  // 외부 클릭 감지 및 스크롤/리사이즈 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectItem(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 아이템 선택 처리
  const handleSelectItem = (item: SearchItem) => {
    // 개발 환경에서만 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log('선택된 아이템:', item.name, '심볼:', item.symbol);
    }
    onChange(item.name); // 인풋창에 회사명 표시
    setIsOpen(false);
    setSelectedIndex(-1);
    // 실제 검색은 심볼로 실행
    onSelect(item.symbol, item.marketType);
  };

  // 마켓 타입별 배지 색상
  const getMarketBadgeClass = (type: MarketType) => {
    switch (type) {
      case 'us': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'kr': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'crypto': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // 마켓 타입 라벨
  const getMarketLabel = (type: MarketType) => {
    switch (type) {
      case 'us': return '미국';
      case 'kr': return '한국';
      case 'crypto': return '코인';
      default: return '';
    }
  };

  return (
    <div ref={containerRef} className={`relative z-[10000] ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.trim()) {
              const results = searchItems(value, marketType);
              setSuggestions(results);
              if (results.length > 0) {
                updateDropdownPosition();
                setIsOpen(true);
              }
            }
          }}
          placeholder={placeholder}
          className="
            w-full px-3 sm:px-4 py-2 pl-9 sm:pl-10 bg-gray-800/50 border border-gray-700 rounded-lg 
            text-white placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base
          "
        />
        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Portal을 사용한 자동완성 드롭다운 */}
      {isOpen && suggestions.length > 0 && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl z-[99999] max-h-60 overflow-y-auto"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
          }}
        >
          {suggestions.map((item, index) => (
            <div
              key={`${item.marketType}-${item.symbol}`}
              onMouseDown={(e) => {
                e.preventDefault(); // 인풋 blur 방지
                handleSelectItem(item);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectItem(item);
              }}
              className={`
                px-4 py-3 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0
                ${selectedIndex === index 
                  ? 'bg-blue-600/20 text-blue-300' 
                  : 'text-gray-200 hover:bg-gray-700'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{item.name}</span>
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded border ${getMarketBadgeClass(item.marketType)}
                    `}>
                      {getMarketLabel(item.marketType)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.symbol} • {item.keywords.slice(0, 3).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}