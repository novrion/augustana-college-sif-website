import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getUserById, deleteUser } from '@/lib/api/db';
import { UserRole } from '@/lib/types/user';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		// Check if user has permission
		const currentUserRole = session.user.role;
		if (!['admin', 'president', 'vice_president'].includes(currentUserRole)) {
			return NextResponse.json(
				{ error: 'You do not have permission to access user data' },
				{ status: 403 }
			);
		}

		const { id } = await params;
		const user = await getUserById(id);

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error('Error getting user:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching the user' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		// Check if user has permission
		const currentUserRole = session.user.role as UserRole;
		if (!['admin', 'president', 'vice_president'].includes(currentUserRole)) {
			return NextResponse.json(
				{ error: 'You do not have permission to delete users' },
				{ status: 403 }
			);
		}

		const { id } = await params;

		// Cannot delete self
		if (id === session.user.id) {
			return NextResponse.json(
				{ error: 'You cannot delete your own account' },
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

		// Can only delete users with lower rank
		if (targetUserRank >= currentUserRank) {
			return NextResponse.json(
				{ error: 'You cannot delete users with equal or higher rank' },
				{ status: 403 }
			);
		}

		const success = await deleteUser(id);
		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete user' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'User deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting user:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the user' },
			{ status: 500 }
		);
	}
}