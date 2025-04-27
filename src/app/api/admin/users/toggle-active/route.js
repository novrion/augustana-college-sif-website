import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { updateUserStatus } from '../../../../../lib/database';

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

		const { userId, isActive } = await request.json();

		// Validate inputs
		if (!userId || isActive === undefined) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Update user status
		const success = await updateUserStatus(userId, isActive);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update user status' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'User status updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating user status:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the user status' },
			{ status: 500 }
		);
	}
}