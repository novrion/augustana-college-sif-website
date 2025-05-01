// app/api/admin/portfolio/update-holding/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { updateHolding, getHoldingById } from '../../../../../lib/database';
import { getStockQuote, getStockInfo } from '@/lib/finnhub.js'

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const holdingData = await request.json();

		// Validate ID
		if (!holdingData.id) {
			return NextResponse.json(
				{ error: 'Missing holding ID' },
				{ status: 400 }
			);
		}

		// Verify the holding exists
		const existingHolding = await getHoldingById(holdingData.id);
		if (!existingHolding) {
			return NextResponse.json(
				{ error: 'Holding not found' },
				{ status: 404 }
			);
		}

		// Get holding information from stock API provider
		const holdingInfo = await getStockInfo(holdingData?.ticker);
		if (!holdingInfo) {
			return NextResponse.json(
				{ error: 'Failed to get holding info' },
				{ status: 500 }
			);
		}

		// Populate with company data
		holdingData.company_name = holdingInfo.name;
		holdingData.sector = holdingInfo.finnhubIndustry;

		const holdingQuote = await getStockQuote(holdingData?.ticker);
		if (!holdingQuote) {
			return NextResponse.json(
				{ error: 'Failed to get holding quote' },
				{ status: 500 }
			);
		}

		holdingData.current_price = holdingQuote.c;

		// Update the holding
		const success = await updateHolding(holdingData.id, holdingData);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update holding' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Holding updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating holding:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the holding' },
			{ status: 500 }
		);
	}
}