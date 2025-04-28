import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { getUserById, verifyPassword, updateUserPassword } from '../../../../lib/database';
import bcrypt from 'bcrypt';

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

		const { currentPassword, newPassword } = await request.json();

		// Basic validation
		if (!currentPassword || !newPassword) {
			return NextResponse.json(
				{ error: 'Current password and new password are required' },
				{ status: 400 }
			);
		}

		// Get the user with the password hash
		const user = await getUserById(session.user.id);
		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Verify the current password
		const isPasswordCorrect = await verifyPassword(currentPassword, user.password);
		if (!isPasswordCorrect) {
			return NextResponse.json(
				{ error: 'Current password is incorrect' },
				{ status: 400 }
			);
		}

		// Hash the new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		// Update the password
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
	} catch (error) {
		console.error('Error changing password:', error);
		return NextResponse.json(
			{ error: 'An error occurred while changing the password' },
			{ status: 500 }
		);
	}
}