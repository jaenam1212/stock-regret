import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || '005930';

  try {
    const stooqUrl = `https://stooq.com/q/d/l/?s=${symbol}.kr&i=d`;
    const res = await fetch(stooqUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch CSV: ${res.status}`);
    }
    const text = await res.text();
    const lines = text.trim().split('\n');
    lines.shift();
    const data = lines.map((line) => {
      const [date, open, high, low, close, volume] = line.split(',');
      return {
        time: Math.floor(new Date(date).getTime() / 1000).toString(),
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume),
      };
    });
    const latest = data[data.length - 1];
    const prev = data[data.length - 2] || latest;

    let companyName = symbol;
    try {
      const summaryRes = await fetch(
        `https://api.finance.naver.com/service/itemSummary.nhn?itemcode=${symbol}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' }
      );
      if (summaryRes.ok) {
        const summary = await summaryRes.json();
        companyName = summary?.name || summary?.nm || companyName;
      }
    } catch (e) {
      console.warn('Failed to fetch company name from Naver:', e);
    }

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
        error: 'Failed to fetch Korean stock data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
