// app/api/gallery/images/update-file/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import {
	uploadGalleryImage,
	updateGalleryImage,
	getGalleryImageById,
	deleteFileFromStorage
} from '../../../../../lib/database';

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

		// Get multipart form data
		const formData = await request.formData();
		const file = formData.get('file');
		const imageId = formData.get('imageId');

		// Basic validation
		if (!file || !imageId) {
			return NextResponse.json(
				{ error: 'Missing file or image ID' },
				{ status: 400 }
			);
		}

		// Verify the image exists
		const existingImage = await getGalleryImageById(imageId);
		if (!existingImage) {
			return NextResponse.json(
				{ error: 'Image not found' },
				{ status: 404 }
			);
		}

		// Store the old image URL for cleanup
		const oldImageUrl = existingImage.src;

		// Upload the new image file
		const imageData = await uploadGalleryImage(file);

		if (!imageData) {
			return NextResponse.json(
				{ error: 'Failed to upload new image file' },
				{ status: 500 }
			);
		}

		// Update the image record with the new file URL
		const success = await updateGalleryImage(imageId, {
			src: imageData.url,
			alt: existingImage.title // Use the title as alt text
		});

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update image record' },
				{ status: 500 }
			);
		}

		// Delete the old image file if it exists
		if (oldImageUrl) {
			await deleteFileFromStorage(oldImageUrl);
		}

		return NextResponse.json(
			{
				src: imageData.url,
				message: 'Image file updated successfully'
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating image file:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the image file' },
			{ status: 500 }
		);
	}
}