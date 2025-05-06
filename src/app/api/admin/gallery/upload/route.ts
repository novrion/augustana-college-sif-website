import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { uploadGalleryImage, createGalleryImage } from '@/lib/api/db';

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
		const file = formData.get('file') as File;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const date = formData.get('date') as string;

		if (!file || !title || !date) {
			return NextResponse.json(
				{ error: 'File, title, and date are required' },
				{ status: 400 }
			);
		}

		// Upload image to storage
		const uploadedImage = await uploadGalleryImage(file);
		if (!uploadedImage) {
			return NextResponse.json(
				{ error: 'Failed to upload image' },
				{ status: 500 }
			);
		}

		// Create gallery image record
		const galleryImage = await createGalleryImage({
			title,
			description: description || '',
			src: uploadedImage.url,
			alt: title,
			date: date
		});

		return NextResponse.json(galleryImage, { status: 201 });
	} catch (error) {
		console.error('Error uploading gallery image:', error);
		return NextResponse.json(
			{ error: 'An error occurred while uploading the image' },
			{ status: 500 }
		);
	}
}