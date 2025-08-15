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
        error: '미국 주식 데이터 서비스를 사용할 수 없습니다',
        details: 'External API not configured',
        suggestion: '백엔드 서버가 실행 중인지 확인하거나 관리자에게 문의하세요',
      },
      { status: 503 }
    );
  } catch (error) {
    console.error('Stock data proxy error:', error);
    return NextResponse.json(
      {
        error: '미국 주식 데이터를 가져올 수 없습니다',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: '주식 심볼이 올바른지 확인하세요 (예: AAPL, NVDA)',
      },
      { status: 500 }
    );
  }
}
