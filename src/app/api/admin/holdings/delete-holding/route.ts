import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { deleteHolding, getHoldingById } from '@/lib/api/db';

export async function DELETE(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const data = await request.json();
		if (!data.holdingId) {
			return NextResponse.json(
				{ error: 'Holding ID is required' },
				{ status: 400 }
			);
		}

		// Check if holding exists
		const existingHolding = await getHoldingById(data.holdingId);
		if (!existingHolding) {
			return NextResponse.json(
				{ error: 'Holding not found' },
				{ status: 404 }
			);
		}

		// Delete the holding
		const success = await deleteHolding(data.holdingId);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete holding' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'Holding deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting holding:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the holding' },
			{ status: 500 }
		);
	}
}