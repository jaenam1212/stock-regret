import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || '005930';

  try {
    // Yahoo Finance API를 사용하여 한국 주식 데이터 가져오기
    const yahooSymbol = `${symbol}.KS`; // KS는 한국거래소
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?period1=0&period2=9999999999&interval=1d`;
    
    const res = await fetch(yahooUrl, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }
    
    const yahooData = await res.json();
    
    if (!yahooData.chart?.result?.[0]) {
      throw new Error('No data found for symbol');
    }

    const result = yahooData.chart.result[0];
    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};
    const adjclose = result.indicators?.adjclose?.[0]?.adjclose || [];

    const data = timestamps
      .map((timestamp: number, index: number) => ({
        time: String(timestamp),
        open: Number((quotes.open?.[index] || 0).toFixed(0)),
        high: Number((quotes.high?.[index] || 0).toFixed(0)),
        low: Number((quotes.low?.[index] || 0).toFixed(0)),
        close: Number((adjclose[index] || quotes.close?.[index] || 0).toFixed(0)),
        volume: quotes.volume?.[index] || 0,
      }))
      .filter(item => item.open > 0 && item.high > 0 && item.low > 0 && item.close > 0);

    const latest = data[data.length - 1];
    const prev = data[data.length - 2] || latest;

    // 회사명 가져오기
    const companyName = result.meta?.longName || result.meta?.shortName || `${symbol} Corp.`;

    return NextResponse.json({
      symbol,
      currentPrice: latest.close,
      change: latest.close - prev.close,
      changePercent: ((latest.close - prev.close) / prev.close) * 100,
      data,
      meta: {
        companyName,
        currency: 'KRW',
        exchangeName: 'KRX',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('KR stock data error:', error);
    return NextResponse.json(
      {
        error: '한국 주식 데이터를 가져올 수 없습니다',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: '주식 코드가 올바른지 확인하세요 (예: 005930)',
      },
      { status: 500 }
    );
  }
}
