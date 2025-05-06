import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import {
	uploadGalleryImage,
	updateGalleryImage,
	getGalleryImageById
} from '@/lib/api/db';

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const date = formData.get('date') as string;
		const file = formData.get('file') as File | null;

		if (!id || !title || !date) {
			return NextResponse.json(
				{ error: 'ID, title, and date are required' },
				{ status: 400 }
			);
		}

		// Get existing image
		const existingImage = await getGalleryImageById(id);
		if (!existingImage) {
			return NextResponse.json(
				{ error: 'Image not found' },
				{ status: 404 }
			);
		}

		let imageUrl = existingImage.src;

		// If a new file was provided, upload it
		if (file) {
			const uploadedImage = await uploadGalleryImage(file);
			if (!uploadedImage) {
				return NextResponse.json(
					{ error: 'Failed to upload new image' },
					{ status: 500 }
				);
			}
			imageUrl = uploadedImage.url;
		}

		// Update gallery image record
		const success = await updateGalleryImage(id, {
			title,
			description: description || '',
			src: imageUrl,
			alt: title,
			date: date
		});

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update image' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'Image updated successfully'
		});
	} catch (error) {
		console.error('Error updating gallery image:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the image' },
			{ status: 500 }
		);
	}
}