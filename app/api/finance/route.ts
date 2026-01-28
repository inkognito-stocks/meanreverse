// API route för att hämta finansdata (hanterar CORS)
import { NextResponse } from 'next/server';
import { fetchStockHistory, fetchStockInfo } from '../../../lib/googleFinance';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const type = searchParams.get('type') || 'history'; // 'history' eller 'info'

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  try {
    if (type === 'info') {
      const info = await fetchStockInfo(symbol);
      return NextResponse.json(info);
    } else {
      const history = await fetchStockHistory(symbol);
      return NextResponse.json(history);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch finance data' },
      { status: 500 }
    );
  }
}
