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

    // 백엔드가 없으면 기본 에러 응답
    return NextResponse.json(
      {
        error: 'Backend service not available',
        details: 'External API not configured',
      },
      { status: 503 }
    );
  } catch (error) {
    console.error('Exchange rate proxy error:', error);

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
