import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getUserById, deleteUser } from '@/lib/api/db';
import { UserRole } from '@/lib/types/user';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function getUserHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;
	const user = await getUserById(id);

	if (!user) {
		return NextResponse.json(
			{ error: 'User not found' },
			{ status: 404 }
		);
	}

	return NextResponse.json(user);
}

async function deleteUserHandler(_request: Request, session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

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

	const roleRanks: { [key in UserRole]: number } = {
		'admin': 4,
		'president': 3,
		'vice_president': 2,
		'secretary': 1,
		'holdings_write': 1,
		'holdings_read': 1,
		'user': 0
	};

	const currentUserRank = roleRanks[session.user.role as UserRole];
	const targetUserRank = roleRanks[targetUser.role as UserRole];
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
}

export const GET = withAuthParam(getUserHandler, 'ADMIN');
export const DELETE = withAuthParam(deleteUserHandler, 'ADMIN');