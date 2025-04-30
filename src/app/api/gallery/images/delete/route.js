// app/api/gallery/images/delete/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { deleteGalleryImage, getGalleryImageById } from '../../../../../lib/database';

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

		const { imageId } = await request.json();

		// Validate input
		if (!imageId) {
			return NextResponse.json(
				{ error: 'Missing image ID' },
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

		// Delete the image
		const success = await deleteGalleryImage(imageId);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete image' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Image deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting gallery image:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the image' },
			{ status: 500 }
		);
	}
}