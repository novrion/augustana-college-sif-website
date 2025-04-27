import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { updateUserRole } from '../../../../../lib/database';

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

		const { userId, role } = await request.json();

		// Validate inputs
		if (!userId || !role) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Validate role
		const validRoles = ['user', 'portfolio-access', 'admin'];
		if (!validRoles.includes(role)) {
			return NextResponse.json(
				{ error: 'Invalid role' },
				{ status: 400 }
			);
		}

		// Update user role
		const success = await updateUserRole(userId, role);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update role' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Role updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating role:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the role' },
			{ status: 500 }
		);
	}
}