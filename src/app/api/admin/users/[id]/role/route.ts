import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getUserById, updateUserRole } from '@/lib/api/db';
import { UserRole } from '@/lib/types/user';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function updateRoleHandler(request: Request, session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

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

	revalidatePages('user');
	return NextResponse.json({
		message: 'User role updated successfully',
		role: newRole
	});
}

export const PUT = withAuthParam(updateRoleHandler, 'ADMIN');