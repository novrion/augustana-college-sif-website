// app/api/gallery/images/reorder/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { reorderGalleryImage, getGalleryImageById } from '../../../../../lib/database';

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

		const { imageId, direction } = await request.json();

		// Validate inputs
		if (!imageId || !direction || (direction !== 'up' && direction !== 'down')) {
			return NextResponse.json(
				{ error: 'Invalid parameters' },
				{ status: 400 }
			);
		}

		// Verify the image exists
		const image = await getGalleryImageById(imageId);
		if (!image) {
			return NextResponse.json(
				{ error: 'Image not found' },
				{ status: 404 }
			);
		}

		// Reorder the image
		const success = await reorderGalleryImage(imageId, direction);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to reorder image' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Image reordered successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error reordering gallery image:', error);
		return NextResponse.json(
			{ error: 'An error occurred while reordering the image' },
			{ status: 500 }
		);
	}
}