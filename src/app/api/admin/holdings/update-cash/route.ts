import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { updateCashBalance } from '@/lib/api/db';

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const { amount } = await request.json();
		if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
			return NextResponse.json(
				{ error: 'Amount must be a positive number' },
				{ status: 400 }
			);
		}

		const success = await updateCashBalance(amount);
		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update cash balance' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'Cash balance updated successfully'
		});
	} catch (error) {
		console.error('Error updating cash balance:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the cash balance' },
			{ status: 500 }
		);
	}
}