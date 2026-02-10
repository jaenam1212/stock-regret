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
        
        // AbortController로 타임아웃 설정 (5초로 단축)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const proxyRes = await fetch(proxyUrl, { 
          cache: 'no-store',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (proxyRes.ok) {
          const json = await proxyRes.json();
          return NextResponse.json(json);
        }
        console.warn(
          'External stock-data proxy failed, falling back to direct API'
        );
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          console.warn('External stock-data proxy timeout, falling back to mock data');
        } else {
          console.warn('External stock-data proxy error, falling back:', e);
        }
      }
    }

    // Yahoo Finance 직접 호출 시도
    try {
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=0&period2=9999999999&interval=1d`;
      
      // AbortController로 타임아웃 설정 (8초)
      const yahooController = new AbortController();
      const yahooTimeoutId = setTimeout(() => yahooController.abort(), 8000);
      
      const yahooRes = await fetch(yahooUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        cache: 'no-store',
        signal: yahooController.signal,
      });
      
      clearTimeout(yahooTimeoutId);
      
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
          
          const companyName = result.meta?.longName || result.meta?.shortName || `${symbol} Corp.`;
          
          console.log(`Yahoo Finance success for ${symbol}: ${data.length} data points`);
          
          return NextResponse.json({
            symbol,
            currentPrice: latest.close,
            change: latest.close - prev.close,
            changePercent: ((latest.close - prev.close) / prev.close) * 100,
            data,
            meta: {
              companyName,
              currency: 'USD',
              exchangeName: 'NASDAQ',
              lastUpdated: new Date().toISOString(),
            },
          });
        }
      }
      
      console.warn('Yahoo Finance failed for', symbol, '- status:', yahooRes.status);
    } catch (yahooError) {
      if (yahooError instanceof Error && yahooError.name === 'AbortError') {
        console.warn('Yahoo Finance timeout for', symbol);
      } else {
        console.warn('Yahoo Finance error for', symbol, ':', yahooError);
      }
    }

    return NextResponse.json(
      {
        error: '주식 데이터를 가져올 수 없습니다',
        symbol,
        suggestion: '잠시 후 다시 시도해주세요.',
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
