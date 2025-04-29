// app/api/admin/portfolio/update-price/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { updateHolding, getHoldingById } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const { holdingId, currentPrice } = await request.json();

		// Validate inputs
		if (!holdingId) {
			return NextResponse.json(
				{ error: 'Missing holding ID' },
				{ status: 400 }
			);
		}

		if (currentPrice === undefined || isNaN(currentPrice)) {
			return NextResponse.json(
				{ error: 'Invalid price' },
				{ status: 400 }
			);
		}

		// Verify the holding exists
		const existingHolding = await getHoldingById(holdingId);
		if (!existingHolding) {
			return NextResponse.json(
				{ error: 'Holding not found' },
				{ status: 404 }
			);
		}

		// Update just the price
		const success = await updateHolding(holdingId, { current_price: currentPrice });

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update price' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Price updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating price:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the price' },
			{ status: 500 }
		);
	}
}