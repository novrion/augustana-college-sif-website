// app/api/admin/portfolio/update-cash/route.js
import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { updateCashBalance } from '../../../../../lib/database';

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

		const { amount } = await request.json();

		// Validate amount
		if (amount === undefined || isNaN(amount) || amount < 0) {
			return NextResponse.json(
				{ error: 'Invalid cash amount' },
				{ status: 400 }
			);
		}

		// Update cash balance
		const success = await updateCashBalance(amount);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update cash balance' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Cash balance updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating cash balance:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the cash balance' },
			{ status: 500 }
		);
	}
}