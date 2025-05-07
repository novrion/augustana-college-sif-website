import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getHoldingById, updateHolding, deleteHolding } from '@/lib/api/db';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function updateHoldingHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;
	const data = await request.json();
	if (!id || !data.share_count || !data.cost_basis || !data.purchase_date) {
		return NextResponse.json(
			{ error: 'Missing required fields' },
			{ status: 400 }
		);
	}

	const existingHolding = await getHoldingById(id);
	if (!existingHolding) {
		return NextResponse.json(
			{ error: 'Holding not found' },
			{ status: 404 }
		);
	}

	const updateData = {
		share_count: data.share_count,
		cost_basis: data.cost_basis,
		purchase_date: data.purchase_date,
	};

	const success = await updateHolding(id, updateData);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to update holding' },
			{ status: 500 }
		);
	}

	return NextResponse.json({
		message: 'Holding updated successfully'
	});
}

async function deleteHoldingHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;
	if (!id) {
		return NextResponse.json(
			{ error: 'Holding ID is required' },
			{ status: 400 }
		);
	}

	const existingHolding = await getHoldingById(id);
	if (!existingHolding) {
		return NextResponse.json(
			{ error: 'Holding not found' },
			{ status: 404 }
		);
	}

	const success = await deleteHolding(id);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete holding' },
			{ status: 500 }
		);
	}

	return NextResponse.json({
		message: 'Holding deleted successfully'
	});
}

export const PUT = withAuthParam(updateHoldingHandler, 'HOLDINGS_WRITE', true);
export const DELETE = withAuthParam(deleteHoldingHandler, 'HOLDINGS_WRITE', true);