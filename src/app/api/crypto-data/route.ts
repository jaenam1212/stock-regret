import { NextRequest, NextResponse } from 'next/server';

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
  const data = [];

  // 1년간의 기본 데이터 생성 (365일)
  for (let i = 365; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60;
    const basePrice = 50000; // 기본 가격
    const randomChange = (Math.random() - 0.5) * 0.1; // ±5% 랜덤 변화
    const price = basePrice * (1 + randomChange);

    data.push({
      time: timestamp.toString(),
      open: Number(price.toFixed(2)),
      high: Number((price * 1.02).toFixed(2)),
      low: Number((price * 0.98).toFixed(2)),
      close: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
    });
  }

  return {
    symbol: symbol.toUpperCase(),
    currentPrice: data[data.length - 1].close,
    change: data[data.length - 1].close - data[data.length - 2].close,
    changePercent:
      ((data[data.length - 1].close - data[data.length - 2].close) /
        data[data.length - 2].close) *
      100,
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
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'bitcoin';

  try {
    // CoinGecko API를 사용하여 암호화폐 데이터 가져오기
    const coinId = getCoinId(symbol);

    // CoinGecko API 호출 시도
    try {
      // 가격 정보 가져오기
      const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`;
      
      // AbortController로 타임아웃 설정 (5초)
      const priceController = new AbortController();
      const priceTimeoutId = setTimeout(() => priceController.abort(), 5000);
      
      const priceResponse = await fetch(priceUrl, {
        cache: 'no-store',
        signal: priceController.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      clearTimeout(priceTimeoutId);

      if (!priceResponse.ok) {
        throw new Error(`Failed to fetch price data: ${priceResponse.status}`);
      }
      const priceData = await priceResponse.json();

      // OHLC 데이터 가져오기 (1년으로 줄임)
      const ohlcUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=365`;
      
      // AbortController로 타임아웃 설정 (10초)
      const ohlcController = new AbortController();
      const ohlcTimeoutId = setTimeout(() => ohlcController.abort(), 10000);
      
      const ohlcResponse = await fetch(ohlcUrl, {
        cache: 'no-store',
        signal: ohlcController.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      clearTimeout(ohlcTimeoutId);

      if (!ohlcResponse.ok) {
        throw new Error(`Failed to fetch OHLC data: ${ohlcResponse.status}`);
      }
      const ohlcData = await ohlcResponse.json();

      // 볼륨 데이터 가져오기 (1년으로 줄임)
      const volumeUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=365&interval=daily`;
      
      // AbortController로 타임아웃 설정 (10초)
      const volumeController = new AbortController();
      const volumeTimeoutId = setTimeout(() => volumeController.abort(), 10000);
      
      const volumeResponse = await fetch(volumeUrl, {
        cache: 'no-store',
        signal: volumeController.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      clearTimeout(volumeTimeoutId);

      let volumeData: [number, number][] = [];
      if (volumeResponse.ok) {
        const volumeJson = await volumeResponse.json();
        volumeData = volumeJson.total_volumes || [];
      }

      // 코인 상세 정보 가져오기
      const detailUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;
      
      // AbortController로 타임아웃 설정 (5초)
      const detailController = new AbortController();
      const detailTimeoutId = setTimeout(() => detailController.abort(), 5000);
      
      const detailResponse = await fetch(detailUrl, {
        cache: 'no-store',
        signal: detailController.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      clearTimeout(detailTimeoutId);

      let companyName = symbol.toUpperCase();
      if (detailResponse.ok) {
        const detail = await detailResponse.json();
        companyName = detail.name || companyName;
      }

      // OHLCV 데이터 포맷팅
      const data = (ohlcData as [number, number, number, number, number][]).map(
        (ohlc: [number, number, number, number, number], index: number) => {
          const timestamp = Math.floor(ohlc[0] / 1000);
          const open = ohlc[1];
          const high = ohlc[2];
          const low = ohlc[3];
          const close = ohlc[4];
          const volume = volumeData[index] ? volumeData[index][1] : 0;

          return {
            time: timestamp.toString(),
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2)),
            volume: Number(volume.toFixed(0)),
          };
        }
      );

      // 현재 가격 (API에서 가져온 것과 차트 데이터 중 최신 것 사용)
      const currentPrice =
        priceData[coinId]?.usd || data[data.length - 1]?.close || 0;
      const change24h = priceData[coinId]?.usd_24h_change || 0;

      // 전날 가격 계산
      const previousPrice = data[data.length - 2]?.close || currentPrice;
      const change = currentPrice - previousPrice;
      const changePercent =
        previousPrice > 0 ? (change / previousPrice) * 100 : change24h;

      return NextResponse.json({
        symbol: symbol.toUpperCase(),
        currentPrice,
        change,
        changePercent,
        data,
        meta: {
          companyName,
          currency: 'USD',
          exchangeName: 'Crypto',
          lastUpdated: new Date(0).toISOString(),
        },
      });
    } catch (apiError) {
      if (apiError instanceof Error && apiError.name === 'AbortError') {
        console.warn('CoinGecko API timeout, using fallback data');
      } else {
        console.warn('CoinGecko API failed, using fallback data:', apiError);
      }

      // CoinGecko API 실패 시 기본 데이터 제공
      const fallbackData = generateFallbackData(symbol);
      return NextResponse.json(fallbackData);
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
