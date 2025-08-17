import { searchItems } from '@/app/data/stockSearchData';
import { MarketType, StockInfo } from '@/types/stock';
import apiClient from './client';

// 암호화폐 키워드 목록
const CRYPTO_KEYWORDS = [
  // 영어 이름
  'bitcoin',
  'ethereum',
  'binancecoin',
  'cardano',
  'solana',
  'polkadot',
  'dogecoin',
  'avalanche',
  'polygon',
  'chainlink',
  'cosmos',
  'fantom',
  'near',
  'algorand',
  'flow',
  'apecoin',
  'tezos',
  'elrond',
  'axie-infinity',
  'decentraland',
  'sandbox',
  'enjincoin',
  'gala',
  'chromaway',
  'litecoin',
  'ripple',
  'tether',
  // 영어 심볼
  'btc',
  'eth',
  'bnb',
  'ada',
  'sol',
  'dot',
  'doge',
  'avax',
  'matic',
  'link',
  'atom',
  'ftm',
  'near',
  'algo',
  'flow',
  'ape',
  'xtz',
  'egld',
  'axs',
  'mana',
  'sand',
  'enj',
  'gala',
  'chr',
  'ltc',
  'xrp',
  'usdt',
  'usdc',
  // 한글 이름
  '비트코인',
  '이더리움',
  '바이낸스코인',
  '에이다',
  '솔라나',
  '폴카닷',
  '도지코인',
  '아발란체',
  '폴리곤',
  '체인링크',
  '코스모스',
  '팬텀',
  '니어',
  '알고랜드',
  '플로우',
  '에이프코인',
  '테조스',
  '디센트럴랜드',
  '샌드박스',
  '엔진코인',
  '갈라',
  '라이트코인',
  '리플',
  '테더',
];

// 심볼로 마켓 타입 추론
export const getMarketType = (symbol: string): MarketType => {
  const normalizedSymbol = symbol.toLowerCase().trim();

  if (/^\d{6}$/.test(symbol)) return 'kr'; // 한국 주식 (6자리 숫자)
  if (CRYPTO_KEYWORDS.includes(normalizedSymbol)) return 'crypto'; // 암호화폐
  return 'us'; // 기본값은 미국 주식
};

// 심볼 또는 회사명으로 실제 심볼 찾기
function resolveSymbol(
  input: string,
  marketType?: MarketType
): { symbol: string; resolvedMarketType: MarketType } {
  // 먼저 검색 데이터에서 찾기
  const searchResults = searchItems(input, marketType);
  if (searchResults.length > 0) {
    const bestMatch = searchResults[0];
    return {
      symbol: bestMatch.symbol,
      resolvedMarketType: bestMatch.marketType,
    };
  }

  // 검색 결과가 없으면 원본 입력 사용
  const resolvedMarketType = marketType || getMarketType(input);
  return { symbol: input, resolvedMarketType };
}

// 주식 데이터 조회
export const getStockData = async (
  input: string,
  marketType?: MarketType
): Promise<StockInfo> => {
  try {
    const { symbol, resolvedMarketType } = resolveSymbol(input, marketType);
    let endpoint: string;

    switch (resolvedMarketType) {
      case 'kr':
        endpoint = '/api/kr-stock-data';
        break;
      case 'crypto':
        endpoint = '/api/crypto-data';
        break;
      default:
        endpoint = '/api/stock/data';
    }

    // SSR에서는 기본 데이터 반환 (빌드 시점 안정성)
    if (typeof window === 'undefined') {
      return {
        symbol: symbol,
        currentPrice: 0,
        change: 0,
        changePercent: 0,
        data: [],
        meta: {
          companyName: 'Loading...',
          currency: 'USD',
          exchangeName: 'NASDAQ',
          lastUpdated: new Date(0).toISOString(),
        },
      };
    }

    // 클라이언트에서는 axios 사용
    const response = await apiClient.get(endpoint, {
      params: { symbol },
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch stock data:', error);

    // axios 에러 처리
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error(
        '데이터 로딩 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.'
      );
    }

    // HTTP 상태 코드별 에러 처리
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error(
          '요청한 주식 심볼을 찾을 수 없습니다. 심볼을 확인해 주세요.'
        );
      } else if (status === 408) {
        throw new Error(
          '데이터 요청 시간이 초과되었습니다. 다시 시도해 주세요.'
        );
      } else if (status >= 500) {
        throw new Error(
          '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
        );
      }
    }

    // 네트워크 에러
    if (error.message?.includes('Network')) {
      throw new Error(
        '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해 주세요.'
      );
    }

    throw new Error(
      '주식 데이터를 가져오는데 실패했습니다. 심볼을 다시 확인해 주세요.'
    );
  }
};

// 주식 데이터 조회 (여러 심볼)
export const getMultipleStockData = async (
  symbols: string[],
  marketType?: MarketType
): Promise<StockInfo[]> => {
  try {
    const promises = symbols.map((symbol) => getStockData(symbol, marketType));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Failed to fetch multiple stock data:', error);
    throw new Error('주식 데이터를 가져오는데 실패했습니다.');
  }
};
