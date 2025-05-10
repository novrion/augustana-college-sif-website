import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { uploadGalleryImage, createGalleryImage } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function uploadGalleryImageHandler(request: Request, _session: Session): Promise<NextResponse> {
	const formData = await request.formData();
	const file = formData.get('file') as File;
	const title = formData.get('title') as string;
	const description = formData.get('description') as string;
	const date = formData.get('date') as string;
	const previousImageUrl = formData.get('previousImageUrl') as string;

	if (!file || !title || !date) {
		return NextResponse.json(
			{ error: 'File, title, and date are required' },
			{ status: 400 }
		);
	}

	const uploadedImage = await uploadGalleryImage(file, previousImageUrl);
	if (!uploadedImage) {
		return NextResponse.json(
			{ error: 'Failed to upload image' },
			{ status: 500 }
		);
	}

	const galleryImage = await createGalleryImage({
		title,
		description: description || '',
		src: uploadedImage.url,
		alt: title,
		date: date
	});

	if (!galleryImage) {
		return NextResponse.json(
			{ error: 'Failed to create image' },
			{ status: 500 }
		);
	}

	revalidatePages('gallery');
	return NextResponse.json(galleryImage, { status: 201 });
}

export const POST = withAuth(uploadGalleryImageHandler, 'SECRETARY');