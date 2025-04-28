import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { updateUser, getUserByEmail } from '../../../../lib/database';

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

		const userData = await request.json();

		// Basic validation
		if (!userData.name || !userData.email) {
			return NextResponse.json(
				{ error: 'Name and email are required' },
				{ status: 400 }
			);
		}

		// Check if the email is being changed and if it's already in use
		if (userData.email !== session.user.email) {
			const existingUser = await getUserByEmail(userData.email);
			if (existingUser && existingUser.id !== session.user.id) {
				return NextResponse.json(
					{ error: 'Email already in use' },
					{ status: 400 }
				);
			}
		}

		// Update the user
		const success = await updateUser(session.user.id, {
			name: userData.name,
			email: userData.email,
			description: userData.description || ''
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
	} catch (error) {
		console.error('Error updating profile:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the profile' },
			{ status: 500 }
		);
	}
}