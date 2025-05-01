// app/api/portfolio/holdings/route.js
import { NextResponse } from 'next/server';
import { getAllHoldings } from '../../../../lib/database';

export async function GET() {
	try {
		// Fetch all holdings from the database
		const holdings = await getAllHoldings();

		// Return the holdings as JSON
		return NextResponse.json(holdings);
	} catch (error) {
		console.error('Error fetching holdings:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch holdings' },
			{ status: 500 }
		);
	}
}