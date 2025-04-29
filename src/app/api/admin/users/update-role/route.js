// app/api/admin/users/update-role/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { updateUserRole, getUserById } from '../../../../../lib/database';

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
				{ error: 'Unauthorized: Only admins, presidents, and vice presidents can manage roles' },
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
		const validRoles = ['user', 'portfolio-access', 'admin', 'president', 'vice_president'];
		if (!validRoles.includes(role)) {
			return NextResponse.json(
				{ error: 'Invalid role' },
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

		// Check if the new role level is higher than current user's level
		const newRoleLevel = roleHierarchy[role] || 0;
		if (newRoleLevel >= currentUserLevel) {
			return NextResponse.json(
				{ error: 'You cannot assign a role equal to or higher than your own' },
				{ status: 403 }
			);
		}

		// Users cannot change their own role
		if (userId === session.user.id) {
			return NextResponse.json(
				{ error: 'You cannot change your own role' },
				{ status: 403 }
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