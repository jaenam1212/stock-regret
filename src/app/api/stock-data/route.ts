// src/app/api/stock-data/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'NVDA';
  //const period = searchParams.get('period') || '1y'; // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
  const externalApiBase = (process.env.NEXT_PUBLIC_API_URL || '').trim();

  try {
    // 외부 Nest API가 설정되어 있으면 우선 프록시로 시도하고, 실패해도 폴백
    if (externalApiBase) {
      try {
        const proxyUrl = `${externalApiBase.replace(/\/$/, '')}/api/stock/data?symbol=${symbol}`;
        const proxyRes = await fetch(proxyUrl, { cache: 'no-store' });
        if (proxyRes.ok) {
          const json = await proxyRes.json();
          return NextResponse.json(json);
        }
        console.warn(
          'External stock-data proxy failed, falling back to direct API'
        );
      } catch (e) {
        console.warn('External stock-data proxy error, falling back:', e);
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
    console.error('Stock data proxy error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stock data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
