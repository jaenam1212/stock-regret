// src/app/api/stock-data/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'AAPL';
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

    // Yahoo Finance 비공식 API 엔드포인트
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=0&period2=9999999999&interval=1d`;

    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.chart?.result?.[0]) {
      throw new Error('No data found for symbol');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};
    const adjclose = result.indicators?.adjclose?.[0]?.adjclose || [];

    // 데이터 변환 (lightweight-charts 형식으로)
    const formattedData = timestamps
      .map((timestamp: number, index: number) => ({
        time: String(timestamp), // 타임스탬프를 문자열로
        open: Number((quotes.open?.[index] || 0).toFixed(2)),
        high: Number((quotes.high?.[index] || 0).toFixed(2)),
        low: Number((quotes.low?.[index] || 0).toFixed(2)),
        close: Number(
          (adjclose[index] || quotes.close?.[index] || 0).toFixed(2)
        ),
        volume: quotes.volume?.[index] || 0,
      }))
      .filter(
        (item: { open: number; high: number; low: number; close: number }) =>
          // 유효하지 않은 데이터 필터링
          item.open > 0 && item.high > 0 && item.low > 0 && item.close > 0
      );

    // 현재 주가 정보
    const currentPrice = formattedData[formattedData.length - 1]?.close || 0;
    const previousPrice = formattedData[formattedData.length - 2]?.close || 0;
    const change = currentPrice - previousPrice;
    const changePercent =
      previousPrice > 0 ? (change / previousPrice) * 100 : 0;

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      currentPrice,
      change,
      changePercent,
      data: formattedData,
      meta: {
        companyName: result.meta?.longName || `${symbol.toUpperCase()} Inc.`,
        currency: result.meta?.currency || 'USD',
        exchangeName: result.meta?.exchangeName || 'NASDAQ',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Yahoo Finance API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stock data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
