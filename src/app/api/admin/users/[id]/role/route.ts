import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getUserById, updateUserRole } from '@/lib/api/db';
import { UserRole } from '@/lib/types/user';

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		// Check if user has admin permission
		const currentUserRole = session.user.role as UserRole;
		if (!['admin', 'president', 'vice_president'].includes(currentUserRole)) {
			return NextResponse.json(
				{ error: 'You do not have permission to change user roles' },
				{ status: 403 }
			);
		}

		const { id } = params;

		// Can't change own role
		if (id === session.user.id) {
			return NextResponse.json(
				{ error: 'You cannot change your own role' },
				{ status: 403 }
			);
		}

		const targetUser = await getUserById(id);
		if (!targetUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Role hierarchy check
		const roleRanks: { [key in UserRole]: number } = {
			'admin': 4,
			'president': 3,
			'vice_president': 2,
			'secretary': 1,
			'holdings_write': 1,
			'holdings_read': 1,
			'user': 0
		};

		const currentUserRank = roleRanks[currentUserRole];
		const targetUserRank = roleRanks[targetUser.role as UserRole];

		// Can only edit roles of users with lower rank
		if (targetUserRank >= currentUserRank) {
			return NextResponse.json(
				{ error: 'You cannot change the role of users with equal or higher rank' },
				{ status: 403 }
			);
		}

		const data = await request.json();
		const newRole = data.role as UserRole;

		if (!newRole || !Object.keys(roleRanks).includes(newRole)) {
			return NextResponse.json(
				{ error: 'Invalid role specified' },
				{ status: 400 }
			);
		}

		// Can't assign a role higher than or equal to current user's role
		const newRoleRank = roleRanks[newRole];
		if (newRoleRank >= currentUserRank) {
			return NextResponse.json(
				{ error: 'You cannot assign a role equal to or higher than your own' },
				{ status: 403 }
			);
		}

		const success = await updateUserRole(id, newRole);
		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update user role' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'User role updated successfully',
			role: newRole
		});
	} catch (error) {
		console.error('Error updating user role:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the user role' },
			{ status: 500 }
		);
	}
}