import { NextResponse } from 'next/server';
import { getStockInfo } from '@/lib/api/stocks';
import { withError } from '@/lib/api/server/routeHandlers';

async function getStockInfoHandler(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);
	const symbol = searchParams.get('symbol');

	if (!symbol) {
		return NextResponse.json(
			{ error: 'Symbol parameter is required' },
			{ status: 400 }
		);
	}

	const stockInfo = await getStockInfo(symbol);
	if (!stockInfo) {
		return NextResponse.json(
			{ error: 'Failed to fetch stock information' },
			{ status: 500 }
		);
	}

	return NextResponse.json({
		name: stockInfo.name,
		industry: stockInfo.finnhubIndustry,
		country: stockInfo.country,
		marketCap: stockInfo.marketCapitalization * 1000000
	});
}

export const GET = withError(getStockInfoHandler);