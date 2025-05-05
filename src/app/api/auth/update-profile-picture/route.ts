// app/api/auth/upload-profile-picture/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { uploadProfilePicture, updateUserProfilePicture, getUserById } from '@/lib/api/db';

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const formData = await request.formData();

		const file = formData.get('file');
		if (!file) {
			return NextResponse.json(
				{ error: 'No file provided' },
				{ status: 400 }
			);
		}

		const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!validTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: 'Invalid file type. Only JPEG, PNG, and GIF are supported.' },
				{ status: 400 }
			);
		}

		const maxSize = 3 * 1024 * 1024;
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: 'File size exceeds 3MB limit.' },
				{ status: 400 }
			);
		}

		const user = await getUserById(session.user.id);
		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		const profilePicture = await uploadProfilePicture(
			file,
			session.user.id,
			user.profile_picture
		);

		if (!profilePicture) {
			return NextResponse.json(
				{ error: 'Failed to upload profile picture' },
				{ status: 500 }
			);
		}

		const success = await updateUserProfilePicture(session.user.id, profilePicture.url);
		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update profile with new picture' },
				{ status: 500 }
			);
		}

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