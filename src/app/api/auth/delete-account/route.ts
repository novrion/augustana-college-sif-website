import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getUserCredentialsById, verifyPassword, deleteUser } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function deleteAccountHandler(request: Request, session: Session): Promise<NextResponse> {
	const { password } = await request.json();

	if (!password) {
		return NextResponse.json(
			{ error: 'Password is required' },
			{ status: 400 }
		);
	}

	const user = await getUserCredentialsById(session.user.id);
	if (!user) {
		return NextResponse.json(
			{ error: 'User not found' },
			{ status: 404 }
		);
	}

	const isPasswordCorrect = await verifyPassword(password, user.password);
	if (!isPasswordCorrect) {
		return NextResponse.json(
			{ error: 'Invalid password' },
			{ status: 401 }
		);
	}

	const success = await deleteUser(session.user.id);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete account' },
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{ message: 'Account deleted successfully' },
		{ status: 200 }
	);
}

export const DELETE = withAuth(deleteAccountHandler);