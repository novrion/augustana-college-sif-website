import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { createHolding } from '@/lib/api/db';
import { getStockInfo, getStockQuote } from '@/lib/api/stocks';

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const data = await request.json();
		if (!data.ticker || !data.share_count || !data.cost_basis || !data.purchase_date) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const stockInfo = await getStockInfo(data.ticker);
		const stockQuote = await getStockQuote(data.ticker);

		if (!stockQuote) {
			return NextResponse.json(
				{ error: 'Could not fetch stock data. Please check the ticker symbol.' },
				{ status: 400 }
			);
		}

		// Create holding with data from Finnhub
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

		return NextResponse.json({
			message: 'Holding created successfully',
			holding
		});
	} catch (error) {
		console.error('Error creating holding:', error);
		return NextResponse.json(
			{ error: 'An error occurred while creating the holding' },
			{ status: 500 }
		);
	}
}