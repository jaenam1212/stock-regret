import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter, getClientIP, getSecurityHeaders } from '@/lib/security';

// 상수
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const FETCH_TIMEOUT = 8000;

// 암호화폐 심볼을 Yahoo Finance 형식으로 변환 (COIN-USD)
const CRYPTO_TO_YAHOO_SYMBOL: Record<string, string> = {
  // 영어 심볼
  btc: 'BTC-USD',
  eth: 'ETH-USD',
  bnb: 'BNB-USD',
  ada: 'ADA-USD',
  sol: 'SOL-USD',
  dot: 'DOT-USD',
  doge: 'DOGE-USD',
  avax: 'AVAX-USD',
  matic: 'MATIC-USD',
  link: 'LINK-USD',
  atom: 'ATOM-USD',
  ftm: 'FTM-USD',
  near: 'NEAR-USD',
  algo: 'ALGO-USD',
  flow: 'FLOW-USD',
  ape: 'APE-USD',
  xtz: 'XTZ-USD',
  egld: 'EGLD-USD',
  axs: 'AXS-USD',
  mana: 'MANA-USD',
  sand: 'SAND-USD',
  enj: 'ENJ-USD',
  gala: 'GALA-USD',
  chr: 'CHR-USD',
  ltc: 'LTC-USD',
  xrp: 'XRP-USD',
  usdt: 'USDT-USD',
  usdc: 'USDC-USD',
  
  // 영어 이름
  bitcoin: 'BTC-USD',
  ethereum: 'ETH-USD',
  binancecoin: 'BNB-USD',
  cardano: 'ADA-USD',
  solana: 'SOL-USD',
  polkadot: 'DOT-USD',
  dogecoin: 'DOGE-USD',
  avalanche: 'AVAX-USD',
  'avalanche-2': 'AVAX-USD',
  polygon: 'MATIC-USD',
  chainlink: 'LINK-USD',
  cosmos: 'ATOM-USD',
  fantom: 'FTM-USD',
  algorand: 'ALGO-USD',
  apecoin: 'APE-USD',
  tezos: 'XTZ-USD',
  'elrond-erd-2': 'EGLD-USD',
  'axie-infinity': 'AXS-USD',
  decentraland: 'MANA-USD',
  'the-sandbox': 'SAND-USD',
  enjincoin: 'ENJ-USD',
  chromaway: 'CHR-USD',
  litecoin: 'LTC-USD',
  ripple: 'XRP-USD',
  tether: 'USDT-USD',
  'usd-coin': 'USDC-USD',
  
  // 한글 이름
  비트코인: 'BTC-USD',
  이더리움: 'ETH-USD',
  바이낸스코인: 'BNB-USD',
  에이다: 'ADA-USD',
  솔라나: 'SOL-USD',
  폴카닷: 'DOT-USD',
  도지코인: 'DOGE-USD',
  아발란체: 'AVAX-USD',
  폴리곤: 'MATIC-USD',
  체인링크: 'LINK-USD',
  코스모스: 'ATOM-USD',
  팬텀: 'FTM-USD',
  알고랜드: 'ALGO-USD',
  플로우: 'FLOW-USD',
  에이프코인: 'APE-USD',
  테조스: 'XTZ-USD',
  디센트럴랜드: 'MANA-USD',
  샌드박스: 'SAND-USD',
  엔진코인: 'ENJ-USD',
  갈라: 'GALA-USD',
  라이트코인: 'LTC-USD',
  리플: 'XRP-USD',
  테더: 'USDT-USD',
};

// 심볼을 Yahoo Finance 형식으로 변환
function getYahooSymbol(symbol: string): string {
  const normalizedSymbol = symbol.toLowerCase().trim();
  
  // 이미 -USD 형식이면 그대로 반환
  if (normalizedSymbol.includes('-usd')) {
    return symbol.toUpperCase();
  }
  
  // 매핑 테이블에서 찾기
  const yahooSymbol = CRYPTO_TO_YAHOO_SYMBOL[normalizedSymbol];
  if (yahooSymbol) {
    return yahooSymbol;
  }
  
  // 매핑이 없으면 심볼에 -USD 붙여서 반환
  return `${symbol.toUpperCase()}-USD`;
}

// 기본 데이터 생성 함수
function generateFallbackData(symbol: string) {
  const now = Math.floor(Date.now() / 1000);
  const days = 365;
  const data = Array.from({ length: days + 1 }, (_, i) => {
    const timestamp = now - (days - i) * 86400;
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
  const symbol = searchParams.get('symbol') || 'BTC';
  
  try {
    const yahooSymbol = getYahooSymbol(symbol);
    
    // Yahoo Finance API 호출
    try {
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?period1=0&period2=9999999999&interval=1d`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      
      const yahooRes = await fetch(yahooUrl, {
        headers: {
          'User-Agent': DEFAULT_USER_AGENT,
        },
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (yahooRes.ok) {
        const yahooData = await yahooRes.json();
        
        if (yahooData.chart?.result?.[0]) {
          const result = yahooData.chart.result[0];
          const timestamps = result.timestamp || [];
          const quotes = result.indicators?.quote?.[0] || {};
          const adjclose = result.indicators?.adjclose?.[0]?.adjclose || [];
          
          const data = timestamps
            .map((timestamp: number, index: number) => ({
              time: String(timestamp),
              open: Number((quotes.open?.[index] || 0).toFixed(2)),
              high: Number((quotes.high?.[index] || 0).toFixed(2)),
              low: Number((quotes.low?.[index] || 0).toFixed(2)),
              close: Number((adjclose[index] || quotes.close?.[index] || 0).toFixed(2)),
              volume: quotes.volume?.[index] || 0,
            }))
            .filter((item: any) => item.open > 0 && item.high > 0 && item.low > 0 && item.close > 0);
          
          const latest = data[data.length - 1];
          const prev = data[data.length - 2] || latest;
          
          const companyName = result.meta?.longName || result.meta?.shortName || symbol.toUpperCase();
          
          console.log(`Yahoo Finance crypto success for ${symbol} (${yahooSymbol}): ${data.length} data points`);
          
          return NextResponse.json(
            {
              symbol: symbol.toUpperCase(),
              currentPrice: latest.close,
              change: latest.close - prev.close,
              changePercent: prev.close > 0 ? ((latest.close - prev.close) / prev.close) * 100 : 0,
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
        }
      }
      
      console.warn(`Yahoo Finance failed for ${symbol} (${yahooSymbol}) - status:`, yahooRes.status);
    } catch (yahooError) {
      const isTimeout = yahooError instanceof Error && yahooError.name === 'AbortError';
      console.warn(
        `Yahoo Finance ${isTimeout ? 'timeout' : 'error'} for ${symbol} (${getYahooSymbol(symbol)}):`,
        yahooError
      );
    }
    
    // Yahoo Finance 실패 시 폴백 데이터 반환
    return NextResponse.json(
      generateFallbackData(symbol),
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Crypto data error:', error);
    return NextResponse.json(
      {
        error: '암호화폐 데이터를 가져올 수 없습니다',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: '지원하는 암호화폐인지 확인하세요 (예: BTC, ETH, 비트코인)',
      },
      { 
        status: 500,
        headers: getSecurityHeaders()
      }
    );
  }
}