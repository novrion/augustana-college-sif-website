// app/api/gallery/images/upload/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { uploadGalleryImage, createGalleryImage } from '../../../../../lib/database';

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
		const title = formData.get('title');
		const description = formData.get('description');

		// Basic validation
		if (!file || !title) {
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

		// Upload the image
		const imageData = await uploadGalleryImage(file);

		if (!imageData) {
			return NextResponse.json(
				{ error: 'Failed to upload image' },
				{ status: 500 }
			);
		}

		// Create gallery image record
		const galleryImage = await createGalleryImage({
			title,
			description: description || '',
			src: imageData.url,
			alt: title
		});

		if (!galleryImage) {
			return NextResponse.json(
				{ error: 'Failed to create gallery image record' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ image: galleryImage, message: 'Image uploaded successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error uploading gallery image:', error);
		return NextResponse.json(
			{ error: 'An error occurred while uploading the image' },
			{ status: 500 }
		);
	}
}