import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getUserCredentialsById, verifyPassword, updateUserPassword } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';
import bcrypt from 'bcrypt';

async function changePasswordHandler(request: Request, session: Session): Promise<NextResponse> {
	const { currentPassword, newPassword } = await request.json();
	if (!currentPassword || !newPassword) {
		return NextResponse.json(
			{ error: 'Current password and new password are required' },
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

	const isPasswordCorrect = await verifyPassword(currentPassword, user.password);
	if (!isPasswordCorrect) {
		return NextResponse.json(
			{ error: 'Invalid credentials' },
			{ status: 400 }
		);
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(newPassword, salt);

	const success = await updateUserPassword(session.user.id, hashedPassword);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to update password' },
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{ message: 'Password updated successfully' },
		{ status: 200 }
	);
}

export const POST = withAuth(changePasswordHandler);