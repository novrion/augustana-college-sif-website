// app/api/admin/portfolio/update-holding/route.js
import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { updateHolding, getHoldingById } from '../../../../../lib/database';

export async function POST(request) {
	try {
		// Verify user is admin
		const isAdminUser = await isAdmin();

		if (!isAdminUser) {
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