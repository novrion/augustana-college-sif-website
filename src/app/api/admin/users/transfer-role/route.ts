import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getUserById, updateUserRole } from '@/lib/api/db';
import { UserRole } from '@/lib/types/user';

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		// Check if user has president or vice president role
		const currentUserRole = session.user.role as UserRole;
		if (currentUserRole !== 'president' && currentUserRole !== 'vice_president') {
			return NextResponse.json(
				{ error: 'Only the president or vice president can transfer their role' },
				{ status: 403 }
			);
		}

		const data = await request.json();
		const { newUserId, role } = data;

		if (!newUserId || !role) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Verify the role matches the current user's role
		if (role !== currentUserRole) {
			return NextResponse.json(
				{ error: 'You can only transfer your current role' },
				{ status: 403 }
			);
		}

		// Check if the new user exists
		const newUser = await getUserById(newUserId);
		if (!newUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Check if the new user is eligible
		if (!newUser.is_active) {
			return NextResponse.json(
				{ error: 'The selected user account is not active' },
				{ status: 400 }
			);
		}

		// Check if the new user already has a special role
		if (['admin', 'president', 'vice_president'].includes(newUser.role)) {
			return NextResponse.json(
				{ error: 'Cannot transfer role to a user who already has a special role' },
				{ status: 400 }
			);
		}

		// Perform the role transfer
		// 1. Update the current user's role
		await updateUserRole(session.user.id, 'holdings_read' as UserRole);

		// 2. Update the new user's role
		await updateUserRole(newUserId, role);

		return NextResponse.json(
			{ message: 'Role transferred successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error transferring role:', error);
		return NextResponse.json(
			{ error: 'An error occurred while transferring the role' },
			{ status: 500 }
		);
	}
}