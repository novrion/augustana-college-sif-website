import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { createHolding } from '@/lib/api/db';
import { getStockInfo, getStockQuote } from '@/lib/api/stocks';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function createHoldingHandler(request: Request, _session: Session): Promise<NextResponse> {
	const data = await request.json();
	if (!data.ticker || !data.share_count || !data.cost_basis || !data.purchase_date) {
		return NextResponse.json(
			{ error: 'Missing required fields' },
			{ status: 400 }
		);
	}

	const stockInfo = await getStockInfo(data.ticker);
	const stockQuote = await getStockQuote(data.ticker);
	if (!stockQuote || !stockInfo) {
		return NextResponse.json(
			{ error: 'Could not fetch stock data. Please check the symbol.' },
			{ status: 400 }
		);
	}

	const holdingData = {
		ticker: data.ticker.toUpperCase(),
		company_name: stockInfo?.name || data.ticker.toUpperCase(),
		sector: stockInfo?.finnhubIndustry || '',
		share_count: data.share_count,
		cost_basis: data.cost_basis,
		current_price: stockQuote.c,
		purchase_date: data.purchase_date,
		last_updated: new Date().toISOString()
	};

	const holding = await createHolding(holdingData);
	if (!holding) {
		return NextResponse.json(
			{ error: 'Failed to create holding' },
			{ status: 500 }
		);
	}

	revalidatePages('holding');
	return NextResponse.json({
		message: 'Holding created successfully',
		holding
	});
}

export const POST = withAuth(createHoldingHandler, 'HOLDINGS_WRITE');