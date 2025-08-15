import { MarketType } from '@/types/stock';

export interface SearchItem {
  symbol: string;
  name: string;
  marketType: MarketType;
  keywords: string[];
}

// 한국 주식 데이터
export const KR_STOCKS: SearchItem[] = [
  // 대기업
  { symbol: '005930', name: '삼성전자', marketType: 'kr', keywords: ['삼성전자', '삼성', 'samsung', 'electronics'] },
  { symbol: '000660', name: 'SK하이닉스', marketType: 'kr', keywords: ['SK하이닉스', 'SK', '하이닉스', 'hynix'] },
  { symbol: '035420', name: 'NAVER', marketType: 'kr', keywords: ['네이버', 'NAVER', '네이버corp'] },
  { symbol: '035720', name: '카카오', marketType: 'kr', keywords: ['카카오', 'kakao', '다음카카오'] },
  { symbol: '207940', name: '삼성바이오로직스', marketType: 'kr', keywords: ['삼성바이오로직스', '삼성바이오', '바이오로직스'] },
  { symbol: '006400', name: '삼성SDI', marketType: 'kr', keywords: ['삼성SDI', 'SDI', '삼성에스디아이'] },
  { symbol: '051910', name: 'LG화학', marketType: 'kr', keywords: ['LG화학', 'LG', '화학'] },
  { symbol: '096770', name: 'SK이노베이션', marketType: 'kr', keywords: ['SK이노베이션', 'SK', '이노베이션'] },
  { symbol: '028260', name: '삼성물산', marketType: 'kr', keywords: ['삼성물산', '물산'] },
  { symbol: '000270', name: '기아', marketType: 'kr', keywords: ['기아', 'KIA', '기아자동차'] },
  
  // 금융
  { symbol: '105560', name: 'KB금융', marketType: 'kr', keywords: ['KB금융', 'KB', '국민은행'] },
  { symbol: '055550', name: '신한지주', marketType: 'kr', keywords: ['신한지주', '신한', '신한은행'] },
  { symbol: '086790', name: '하나금융지주', marketType: 'kr', keywords: ['하나금융지주', '하나', '하나은행'] },
  { symbol: '032830', name: '삼성생명', marketType: 'kr', keywords: ['삼성생명', '삼성', '생명보험'] },
  { symbol: '018260', name: '삼성에스디에스', marketType: 'kr', keywords: ['삼성에스디에스', '삼성SDS', 'SDS'] },
  
  // 통신/IT
  { symbol: '030200', name: 'KT', marketType: 'kr', keywords: ['KT', '케이티', '한국통신'] },
  { symbol: '017670', name: 'SK텔레콤', marketType: 'kr', keywords: ['SK텔레콤', 'SKT', '에스케이텔레콤'] },
  { symbol: '036570', name: '엔씨소프트', marketType: 'kr', keywords: ['엔씨소프트', 'NC', 'NCSOFT'] },
  { symbol: '251270', name: '넷마블', marketType: 'kr', keywords: ['넷마블', 'netmarble'] },
  { symbol: '078930', name: 'GS', marketType: 'kr', keywords: ['GS', '지에스'] },
  
  // 제조업
  { symbol: '005380', name: '현대차', marketType: 'kr', keywords: ['현대차', '현대자동차', 'hyundai'] },
  { symbol: '012330', name: '현대모비스', marketType: 'kr', keywords: ['현대모비스', '모비스'] },
  { symbol: '003550', name: 'LG', marketType: 'kr', keywords: ['LG', '엘지'] },
  { symbol: '066570', name: 'LG전자', marketType: 'kr', keywords: ['LG전자', 'LG', '엘지전자'] },
  { symbol: '034020', name: '두산에너빌리티', marketType: 'kr', keywords: ['두산에너빌리티', '두산', '에너빌리티'] },
  
  // 바이오/제약
  { symbol: '068270', name: '셀트리온', marketType: 'kr', keywords: ['셀트리온', 'celltrion'] },
  { symbol: '091990', name: '셀트리온헬스케어', marketType: 'kr', keywords: ['셀트리온헬스케어', '셀트리온', '헬스케어'] },
  { symbol: '128940', name: '한미약품', marketType: 'kr', keywords: ['한미약품', '한미', '약품'] },
  
  // 유통/서비스
  { symbol: '282330', name: 'BGF리테일', marketType: 'kr', keywords: ['BGF리테일', 'BGF', '편의점'] },
  { symbol: '004170', name: '신세계', marketType: 'kr', keywords: ['신세계', '백화점'] },
  { symbol: '007070', name: 'GS리테일', marketType: 'kr', keywords: ['GS리테일', 'GS', '편의점'] },
];

// 미국 주식 데이터
export const US_STOCKS: SearchItem[] = [
  // 기술주
  { symbol: 'AAPL', name: 'Apple Inc.', marketType: 'us', keywords: ['애플', 'apple', '아이폰', 'iphone'] },
  { symbol: 'MSFT', name: 'Microsoft Corporation', marketType: 'us', keywords: ['마이크로소프트', 'microsoft', '윈도우'] },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', marketType: 'us', keywords: ['구글', 'google', 'alphabet', '알파벳'] },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', marketType: 'us', keywords: ['아마존', 'amazon'] },
  { symbol: 'TSLA', name: 'Tesla Inc.', marketType: 'us', keywords: ['테슬라', 'tesla', '일론머스크'] },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', marketType: 'us', keywords: ['엔비디아', 'nvidia', 'AI', '인공지능'] },
  { symbol: 'META', name: 'Meta Platforms Inc.', marketType: 'us', keywords: ['메타', 'meta', '페이스북', 'facebook'] },
  { symbol: 'NFLX', name: 'Netflix Inc.', marketType: 'us', keywords: ['넷플릭스', 'netflix'] },
  { symbol: 'CRM', name: 'Salesforce Inc.', marketType: 'us', keywords: ['세일즈포스', 'salesforce'] },
  { symbol: 'ORCL', name: 'Oracle Corporation', marketType: 'us', keywords: ['오라클', 'oracle'] },
  
  // 금융
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', marketType: 'us', keywords: ['JP모건', 'jpmorgan', '제이피모건'] },
  { symbol: 'BAC', name: 'Bank of America Corporation', marketType: 'us', keywords: ['뱅크오브아메리카', 'bank of america'] },
  { symbol: 'WFC', name: 'Wells Fargo & Company', marketType: 'us', keywords: ['웰스파고', 'wells fargo'] },
  { symbol: 'GS', name: 'Goldman Sachs Group Inc.', marketType: 'us', keywords: ['골드만삭스', 'goldman sachs'] },
  { symbol: 'MS', name: 'Morgan Stanley', marketType: 'us', keywords: ['모건스탠리', 'morgan stanley'] },
  
  // 소비재
  { symbol: 'AMZN', name: 'Amazon.com Inc.', marketType: 'us', keywords: ['아마존', 'amazon'] },
  { symbol: 'HD', name: 'Home Depot Inc.', marketType: 'us', keywords: ['홈디포', 'home depot'] },
  { symbol: 'MCD', name: 'McDonald\'s Corporation', marketType: 'us', keywords: ['맥도날드', 'mcdonalds'] },
  { symbol: 'NKE', name: 'Nike Inc.', marketType: 'us', keywords: ['나이키', 'nike'] },
  { symbol: 'SBUX', name: 'Starbucks Corporation', marketType: 'us', keywords: ['스타벅스', 'starbucks'] },
  
  // 헬스케어
  { symbol: 'JNJ', name: 'Johnson & Johnson', marketType: 'us', keywords: ['존슨앤존슨', 'johnson johnson'] },
  { symbol: 'PFE', name: 'Pfizer Inc.', marketType: 'us', keywords: ['화이자', 'pfizer'] },
  { symbol: 'UNH', name: 'UnitedHealth Group Incorporated', marketType: 'us', keywords: ['유나이티드헬스', 'unitedhealth'] },
  
  // 산업
  { symbol: 'BA', name: 'Boeing Company', marketType: 'us', keywords: ['보잉', 'boeing'] },
  { symbol: 'CAT', name: 'Caterpillar Inc.', marketType: 'us', keywords: ['캐터필러', 'caterpillar'] },
  { symbol: 'GE', name: 'General Electric Company', marketType: 'us', keywords: ['제너럴일렉트릭', 'general electric'] },
];

// 암호화폐 데이터 (기존 확장)
export const CRYPTO_CURRENCIES: SearchItem[] = [
  // 주요 암호화폐
  { symbol: 'bitcoin', name: 'Bitcoin', marketType: 'crypto', keywords: ['비트코인', 'bitcoin', 'btc'] },
  { symbol: 'ethereum', name: 'Ethereum', marketType: 'crypto', keywords: ['이더리움', 'ethereum', 'eth'] },
  { symbol: 'binancecoin', name: 'BNB', marketType: 'crypto', keywords: ['바이낸스코인', 'binance', 'bnb'] },
  { symbol: 'cardano', name: 'Cardano', marketType: 'crypto', keywords: ['카르다노', 'cardano', 'ada'] },
  { symbol: 'solana', name: 'Solana', marketType: 'crypto', keywords: ['솔라나', 'solana', 'sol'] },
  { symbol: 'polkadot', name: 'Polkadot', marketType: 'crypto', keywords: ['폴카닷', 'polkadot', 'dot'] },
  { symbol: 'dogecoin', name: 'Dogecoin', marketType: 'crypto', keywords: ['도지코인', 'dogecoin', 'doge'] },
  { symbol: 'avalanche-2', name: 'Avalanche', marketType: 'crypto', keywords: ['아발란체', 'avalanche', 'avax'] },
  { symbol: 'polygon', name: 'Polygon', marketType: 'crypto', keywords: ['폴리곤', 'polygon', 'matic'] },
  { symbol: 'chainlink', name: 'Chainlink', marketType: 'crypto', keywords: ['체인링크', 'chainlink', 'link'] },
  
  // 인기 알트코인
  { symbol: 'litecoin', name: 'Litecoin', marketType: 'crypto', keywords: ['라이트코인', 'litecoin', 'ltc'] },
  { symbol: 'ripple', name: 'XRP', marketType: 'crypto', keywords: ['리플', 'ripple', 'xrp'] },
  { symbol: 'cosmos', name: 'Cosmos', marketType: 'crypto', keywords: ['코스모스', 'cosmos', 'atom'] },
  { symbol: 'fantom', name: 'Fantom', marketType: 'crypto', keywords: ['팬텀', 'fantom', 'ftm'] },
  { symbol: 'near', name: 'NEAR Protocol', marketType: 'crypto', keywords: ['니어', 'near', 'near protocol'] },
  { symbol: 'algorand', name: 'Algorand', marketType: 'crypto', keywords: ['알고랜드', 'algorand', 'algo'] },
  { symbol: 'flow', name: 'Flow', marketType: 'crypto', keywords: ['플로우', 'flow'] },
  { symbol: 'apecoin', name: 'ApeCoin', marketType: 'crypto', keywords: ['에이프코인', 'apecoin', 'ape'] },
  { symbol: 'tezos', name: 'Tezos', marketType: 'crypto', keywords: ['테조스', 'tezos', 'xtz'] },
  { symbol: 'decentraland', name: 'Decentraland', marketType: 'crypto', keywords: ['디센트럴랜드', 'decentraland', 'mana'] },
  { symbol: 'the-sandbox', name: 'The Sandbox', marketType: 'crypto', keywords: ['샌드박스', 'sandbox', 'sand'] },
  { symbol: 'enjincoin', name: 'Enjin Coin', marketType: 'crypto', keywords: ['엔진코인', 'enjin', 'enj'] },
  { symbol: 'gala', name: 'Gala', marketType: 'crypto', keywords: ['갈라', 'gala'] },
  
  // 스테이블코인
  { symbol: 'tether', name: 'Tether', marketType: 'crypto', keywords: ['테더', 'tether', 'usdt'] },
  { symbol: 'usd-coin', name: 'USD Coin', marketType: 'crypto', keywords: ['USD코인', 'usd coin', 'usdc'] },
];

// 전체 검색 데이터
export const ALL_SEARCH_DATA: SearchItem[] = [
  ...KR_STOCKS,
  ...US_STOCKS,
  ...CRYPTO_CURRENCIES,
];

// 마켓별 검색 함수
export function searchItems(query: string, marketType?: MarketType): SearchItem[] {
  const searchData = marketType 
    ? ALL_SEARCH_DATA.filter(item => item.marketType === marketType)
    : ALL_SEARCH_DATA;
    
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return [];
  
  return searchData
    .filter(item => 
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.symbol.toLowerCase().includes(normalizedQuery) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery))
    )
    .slice(0, 10); // 최대 10개 결과
}

// 심볼로 검색 아이템 찾기
export function findItemBySymbol(symbol: string): SearchItem | undefined {
  return ALL_SEARCH_DATA.find(item => 
    item.symbol.toLowerCase() === symbol.toLowerCase()
  );
}