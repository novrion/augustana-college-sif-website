import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { uploadProfilePicture, updateUserProfilePicture, getUserById } from '../../../../lib/database';

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

		// Get multipart form data
		const formData = await request.formData();
		const file = formData.get('file');

		// Basic validation
		if (!file) {
			return NextResponse.json(
				{ error: 'No file provided' },
				{ status: 400 }
			);
		}

		// Validate file type
		const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!validTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: 'Invalid file type. Only JPEG, PNG, and GIF are supported.' },
				{ status: 400 }
			);
		}

		// Validate file size (limit to 3MB)
		const maxSize = 3 * 1024 * 1024;
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: 'File size exceeds 3MB limit.' },
				{ status: 400 }
			);
		}

		// Upload the profile picture
		const profilePicture = await uploadProfilePicture(file, session.user.id);

		if (!profilePicture) {
			return NextResponse.json(
				{ error: 'Failed to upload profile picture' },
				{ status: 500 }
			);
		}

		// Update the user's profile picture URL in the database
		const success = await updateUserProfilePicture(session.user.id, profilePicture.url);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update profile with new picture' },
				{ status: 500 }
			);
		}

		// Get the updated user to confirm the profile picture is properly set
		const updatedUser = await getUserById(session.user.id);

		// Debug log
		console.log("Updated user profile picture:", updatedUser.profile_picture);

		return NextResponse.json(
			{
				profilePicture: profilePicture.url,
				message: 'Profile picture uploaded successfully'
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error uploading profile picture:', error);
		return NextResponse.json(
			{ error: 'An error occurred while uploading the profile picture' },
			{ status: 500 }
		);
	}
}