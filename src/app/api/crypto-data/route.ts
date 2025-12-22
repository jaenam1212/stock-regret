import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter, getClientIP, getSecurityHeaders } from '@/lib/security';

// 상수
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const FETCH_TIMEOUTS = {
  price: 5000,
  chart: 15000,
  detail: 5000,
} as const;
const SECONDS_PER_DAY = 86400;

// 타입 정의
interface DailyOHLC {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CoinGeckoChartData {
  prices?: [number, number][];
  total_volumes?: [number, number][];
}

// fetch 헬퍼 함수 (타임아웃 처리 포함)
async function fetchWithTimeout(
  url: string,
  timeout: number,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// 암호화폐 심볼/이름 매핑 테이블
const CRYPTO_MAPPING: Record<string, string> = {
  // 영어 심볼
  btc: 'bitcoin',
  eth: 'ethereum',
  bnb: 'binancecoin',
  ada: 'cardano',
  sol: 'solana',
  dot: 'polkadot',
  doge: 'dogecoin',
  avax: 'avalanche-2',
  matic: 'polygon',
  link: 'chainlink',
  atom: 'cosmos',
  ftm: 'fantom',
  near: 'near',
  algo: 'algorand',
  flow: 'flow',
  ape: 'apecoin',
  xtz: 'tezos',
  egld: 'elrond-erd-2',
  axs: 'axie-infinity',
  mana: 'decentraland',
  sand: 'the-sandbox',
  enj: 'enjincoin',
  gala: 'gala',
  chr: 'chromaway',
  ltc: 'litecoin',
  xrp: 'ripple',
  usdt: 'tether',
  usdc: 'usd-coin',

  // 한글 이름
  비트코인: 'bitcoin',
  이더리움: 'ethereum',
  바이낸스코인: 'binancecoin',
  에이다: 'cardano',
  솔라나: 'solana',
  폴카닷: 'polkadot',
  도지코인: 'dogecoin',
  아발란체: 'avalanche-2',
  폴리곤: 'polygon',
  체인링크: 'chainlink',
  코스모스: 'cosmos',
  팬텀: 'fantom',
  니어: 'near',
  알고랜드: 'algorand',
  플로우: 'flow',
  에이프코인: 'apecoin',
  테조스: 'tezos',
  디센트럴랜드: 'decentraland',
  샌드박스: 'the-sandbox',
  엔진코인: 'enjincoin',
  갈라: 'gala',
  라이트코인: 'litecoin',
  리플: 'ripple',
  테더: 'tether',
};

// 심볼을 CoinGecko ID로 변환
function getCoinId(symbol: string): string {
  const normalizedSymbol = symbol.toLowerCase().trim();
  return CRYPTO_MAPPING[normalizedSymbol] || normalizedSymbol;
}


// 기본 데이터 생성 함수
function generateFallbackData(symbol: string) {
  const now = Math.floor(Date.now() / 1000);
  const days = 365;
  const data = Array.from({ length: days + 1 }, (_, i) => {
    const timestamp = now - (days - i) * SECONDS_PER_DAY;
    const basePrice = 50000;
    const randomChange = (Math.random() - 0.5) * 0.1;
    const price = basePrice * (1 + randomChange);

    return {
      time: timestamp.toString(),
      open: Number(price.toFixed(2)),
      high: Number((price * 1.02).toFixed(2)),
      low: Number((price * 0.98).toFixed(2)),
      close: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
    };
  });

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];

  return {
    symbol: symbol.toUpperCase(),
    currentPrice: latest.close,
    change: latest.close - previous.close,
    changePercent: ((latest.close - previous.close) / previous.close) * 100,
    data,
    meta: {
      companyName: symbol.toUpperCase(),
      currency: 'USD',
      exchangeName: 'Crypto',
      lastUpdated: new Date(0).toISOString(),
    },
  };
}

export async function GET(request: NextRequest) {
  // Rate limiting 체크
  const clientIP = getClientIP(request);
  if (!apiRateLimiter.isAllowed(clientIP)) {
    return NextResponse.json(
      { error: 'Too many requests', message: 'Rate limit exceeded' },
      { 
        status: 429,
        headers: getSecurityHeaders()
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'bitcoin';
  const days = searchParams.get('days') ? parseInt(searchParams.get('days')!, 10) : 365;

  try {
    const coinId = getCoinId(symbol);

    try {
      // OHLC 데이터 가져오기 (days 파라미터 사용, 기본 365일)
      const ohlcDays = Math.min(days, 365); // CoinGecko 무료 플랜 제한
      const ohlcUrl = `${COINGECKO_BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${ohlcDays}`;
      const ohlcResponse = await fetchWithTimeout(ohlcUrl, FETCH_TIMEOUTS.chart);

      if (!ohlcResponse.ok) {
        throw new Error(`Failed to fetch OHLC data: ${ohlcResponse.status}`);
      }

      const ohlcData = await ohlcResponse.json() as [number, number, number, number, number][];

      // 볼륨 데이터 가져오기 (OHLC와 동일한 기간으로 맞춤)
      const volumeUrl = `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${ohlcDays}&interval=daily`;
      const volumeResponse = await fetchWithTimeout(volumeUrl, FETCH_TIMEOUTS.chart);
      
      let volumeData: [number, number][] = [];
      if (volumeResponse.ok) {
        const volumeJson = await volumeResponse.json() as CoinGeckoChartData;
        volumeData = volumeJson.total_volumes || [];
      }

      // 코인 이름 가져오기 (선택적, 실패해도 계속 진행)
      let companyName = symbol.toUpperCase();
      try {
        const detailUrl = `${COINGECKO_BASE_URL}/coins/${coinId}`;
        const detailResponse = await fetchWithTimeout(detailUrl, FETCH_TIMEOUTS.detail);
        if (detailResponse.ok) {
          const detail = await detailResponse.json();
          companyName = detail.name || companyName;
        }
      } catch {
        // detail API 실패는 무시 (기본 이름 사용)
      }

      // OHLC 데이터 포맷팅
      const data = ohlcData.map((ohlc, index) => {
        const timestamp = Math.floor(ohlc[0] / 1000);
        const volume = volumeData[index] ? volumeData[index][1] : 0;
        
        return {
          time: timestamp.toString(),
          open: Number(ohlc[1].toFixed(2)),
          high: Number(ohlc[2].toFixed(2)),
          low: Number(ohlc[3].toFixed(2)),
          close: Number(ohlc[4].toFixed(2)),
          volume: Number(volume.toFixed(0)),
        };
      });

      // 현재 가격 및 변화율 계산
      const latest = data[data.length - 1];
      const previous = data[data.length - 2] || latest;
      const currentPrice = latest.close;
      const change = currentPrice - previous.close;
      const changePercent = previous.close > 0 ? (change / previous.close) * 100 : 0;

      return NextResponse.json(
        {
          symbol: symbol.toUpperCase(),
          currentPrice,
          change,
          changePercent,
          data,
          meta: {
            companyName,
            currency: 'USD',
            exchangeName: 'Crypto',
            lastUpdated: new Date().toISOString(),
          },
        },
        { headers: getSecurityHeaders() }
      );
    } catch (apiError) {
      const isTimeout = apiError instanceof Error && apiError.name === 'AbortError';
      console.warn(
        `CoinGecko API ${isTimeout ? 'timeout' : 'failed'}, using fallback data:`,
        apiError
      );
      return NextResponse.json(
        generateFallbackData(symbol),
        { headers: getSecurityHeaders() }
      );
    }
  } catch (error) {
    console.error('Crypto data error:', error);
    return NextResponse.json(
      {
        error: '암호화폐 데이터를 가져올 수 없습니다',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion:
          '지원하는 암호화폐인지 확인하세요 (예: bitcoin, BTC, 비트코인)',
      },
      { status: 500 }
    );
  }
}
