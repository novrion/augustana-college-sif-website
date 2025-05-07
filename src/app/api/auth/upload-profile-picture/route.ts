import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { uploadProfilePicture, updateUserProfilePicture, getUserById } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function uploadProfilePictureHandler(request: Request, session: Session): Promise<NextResponse> {
	const formData = await request.formData();
	const file = formData.get('file');

	if (!file || !(file instanceof File)) {
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

	const maxSize = 5 * 1024 * 1024;
	if (file.size > maxSize) {
		return NextResponse.json(
			{ error: 'File size exceeds 5MB limit.' },
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

	const profilePicture = await uploadProfilePicture(session.user.id, file, user.profile_picture);
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

	return NextResponse.json({
		profilePicture: profilePicture.url,
		message: 'Profile picture uploaded successfully'
	});
}

export const POST = withAuth(uploadProfilePictureHandler);