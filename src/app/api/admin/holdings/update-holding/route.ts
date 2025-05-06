import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { updateHolding, getHoldingById } from '@/lib/api/db';

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

		if (!data.id || !data.share_count || !data.cost_basis || !data.purchase_date) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Check if holding exists
		const existingHolding = await getHoldingById(data.id);
		if (!existingHolding) {
			return NextResponse.json(
				{ error: 'Holding not found' },
				{ status: 404 }
			);
		}

		// Update the holding
		const updateData = {
			share_count: data.share_count,
			cost_basis: data.cost_basis,
			purchase_date: data.purchase_date,
		};

		const success = await updateHolding(data.id, updateData);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update holding' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'Holding updated successfully'
		});
	} catch (error) {
		console.error('Error updating holding:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the holding' },
			{ status: 500 }
		);
	}
}