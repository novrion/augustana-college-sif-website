// app/api/admin/users/toggle-active/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { updateUserStatus, getUserById } from '../../../../../lib/database';

export async function POST(request) {
	try {
		// Get the current session
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const userRole = session.user.role;

		// Define role hierarchy
		const roleHierarchy = {
			'admin': 3,
			'president': 2,
			'vice_president': 1,
			'portfolio-access': 0,
			'user': 0
		};

		// Get current user's hierarchy level
		const currentUserLevel = roleHierarchy[userRole] || 0;

		// Check if user has admin-level access
		if (currentUserLevel < 1) {
			return NextResponse.json(
				{ error: 'Unauthorized: Only admins, presidents, and vice presidents can manage user status' },
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

		// Get the user being modified
		const targetUser = await getUserById(userId);
		if (!targetUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Get target user's current role level
		const targetUserLevel = roleHierarchy[targetUser.role] || 0;

		// Check if current user has permission to modify target user
		if (targetUserLevel >= currentUserLevel) {
			return NextResponse.json(
				{ error: 'You cannot modify users with equal or higher roles' },
				{ status: 403 }
			);
		}

		// Users cannot deactivate themselves
		if (userId === session.user.id && !isActive) {
			return NextResponse.json(
				{ error: 'You cannot deactivate your own account' },
				{ status: 403 }
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