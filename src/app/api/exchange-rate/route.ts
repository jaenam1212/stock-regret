// src/app/api/exchange-rate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fromCurrency = searchParams.get('from') || 'KRW';
  const toCurrency = searchParams.get('to') || 'USD';
  const externalApiBase = (process.env.NEXT_PUBLIC_API_URL || '').trim();

  try {
    // 외부 Nest API가 설정되어 있으면 우선 프록시로 시도하고, 실패해도 폴백
    if (externalApiBase) {
      try {
        const proxyUrl = `${externalApiBase.replace(/\/$/, '')}/api/stock/exchange-rate?from=${fromCurrency}&to=${toCurrency}`;
        const proxyRes = await fetch(proxyUrl, { cache: 'no-store' });
        if (proxyRes.ok) {
          const json = await proxyRes.json();
          return NextResponse.json(json);
        }
        console.warn(
          'External exchange-rate proxy failed, falling back to direct API'
        );
      } catch (e) {
        console.warn('External exchange-rate proxy error, falling back:', e);
      }
    }

    // 무료 환율 API 사용 (API 키 불필요)
    const url = `https://open.er-api.com/v6/latest/${fromCurrency}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.result || data.result !== 'success') {
      throw new Error('Failed to fetch exchange rate');
    }

    const rate = data.rates[toCurrency];
    if (!rate) {
      throw new Error('Currency not found');
    }

    // 환율 변환: 1 USD = ? KRW 형태로 변환
    const convertedRate = 1 / rate;

    return NextResponse.json({
      fromCurrency,
      toCurrency,
      rate: convertedRate,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Exchange Rate API Error:', error);

    // API 실패 시 기본값 반환 (백업)
    return NextResponse.json({
      fromCurrency,
      toCurrency,
      rate: 1350, // 기본 환율
      lastUpdated: new Date().toISOString(),
      isFallback: true,
    });
  }
}
