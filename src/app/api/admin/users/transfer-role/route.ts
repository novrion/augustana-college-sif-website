import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getUserById, updateUserRole } from '@/lib/api/db';
import { UserRole, PERMISSIONS } from '@/lib/types';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function transferRoleHandler(request: Request, session: Session): Promise<NextResponse> {
	const data = await request.json();
	if (!data.newUserId || !data.role) {
		return NextResponse.json(
			{ error: 'Missing required fields' },
			{ status: 400 }
		);
	}

	if (data.role !== session.user.role) {
		return NextResponse.json(
			{ error: 'You can only transfer your current role' },
			{ status: 403 }
		);
	}

	const newUser = await getUserById(data.newUserId);
	if (!newUser) {
		return NextResponse.json(
			{ error: 'User not found' },
			{ status: 404 }
		);
	}

	if (!newUser.is_active) {
		return NextResponse.json(
			{ error: 'The selected user account is not active' },
			{ status: 400 }
		);
	}

	if (PERMISSIONS['ADMIN'].includes(newUser.role)) {
		return NextResponse.json(
			{ error: 'Cannot transfer role to a user who already has a special role' },
			{ status: 400 }
		);
	}

	await updateUserRole(session.user.id, 'holdings_read' as UserRole);
	await updateUserRole(data.newUserId, data.role);
	return NextResponse.json(
		{ message: 'Role transferred successfully' },
		{ status: 200 }
	);
}

export const POST = withAuth(transferRoleHandler, 'LEADERSHIP');