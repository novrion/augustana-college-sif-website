// app/api/gallery/images/update/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { updateGalleryImage, getGalleryImageById } from '../../../../../lib/database';

export async function POST(request) {
	try {
		// Check admin access
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const { id, title, description } = await request.json();

		// Validate inputs
		if (!id || !title) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Validate description length (300 characters max)
		if (description && description.length > 300) {
			return NextResponse.json(
				{ error: 'Description exceeds maximum length of 300 characters' },
				{ status: 400 }
			);
		}

		// Verify the image exists
		const existingImage = await getGalleryImageById(id);
		if (!existingImage) {
			return NextResponse.json(
				{ error: 'Image not found' },
				{ status: 404 }
			);
		}

		// Update the image metadata
		const success = await updateGalleryImage(id, {
			title,
			description: description || '',
		});

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update image' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Image updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating gallery image:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the image' },
			{ status: 500 }
		);
	}
}