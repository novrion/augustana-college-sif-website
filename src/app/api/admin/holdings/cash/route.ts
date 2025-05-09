import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { updateCashBalance } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function updateCashHandler(request: Request, _session: Session): Promise<NextResponse> {
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

	revalidatePages('cash');
	return NextResponse.json({
		message: 'Cash balance updated successfully'
	});
}

export const PUT = withAuth(updateCashHandler, 'HOLDINGS_WRITE');