import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { updateUser, getUserByEmail } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function updateProfileHandler(request: Request, session: Session): Promise<NextResponse> {
	const userData = await request.json();
	if (!userData.name || !userData.email) {
		return NextResponse.json(
			{ error: 'Name and email are required' },
			{ status: 400 }
		);
	}

	if (userData.email !== session.user.email) {
		const existingUser = await getUserByEmail(userData.email);
		if (existingUser && existingUser.id !== session.user.id) {
			return NextResponse.json(
				{ error: 'Email already in use' },
				{ status: 400 }
			);
		}
	}

	const success = await updateUser(session.user.id, {
		name: userData.name,
		email: userData.email,
		description: userData.description || '',
		phone: userData.phone || null
	});
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to update profile' },
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{ message: 'Profile updated successfully' },
		{ status: 200 }
	);
}

export const PUT = withAuth(updateProfileHandler);