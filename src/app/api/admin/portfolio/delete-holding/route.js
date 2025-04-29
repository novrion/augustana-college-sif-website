// app/api/admin/portfolio/delete-holding/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { deleteHolding, getHoldingById } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const { holdingId } = await request.json();

		// Validate ID
		if (!holdingId) {
			return NextResponse.json(
				{ error: 'Missing holding ID' },
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

		// Delete the holding
		const success = await deleteHolding(holdingId);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete holding' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Holding deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting holding:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the holding' },
			{ status: 500 }
		);
	}
}