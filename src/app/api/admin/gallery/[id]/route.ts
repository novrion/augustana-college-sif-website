import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getGalleryImageById, uploadGalleryImage, updateGalleryImage, deleteGalleryImage } from '@/lib/api/db';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function updateGalleryImageHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;
	const formData = await request.formData();
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

	const existingImage = await getGalleryImageById(id);
	if (!existingImage) {
		return NextResponse.json(
			{ error: 'Image not found' },
			{ status: 404 }
		);
	}

	// Upload new file if provided
	let imageUrl = existingImage.src;
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

	revalidatePages('gallery', id);
	return NextResponse.json({
		message: 'Image updated successfully'
	});
}

async function deleteGalleryImageHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;
	if (!id) {
		return NextResponse.json(
			{ error: 'Image ID is required' },
			{ status: 400 }
		);
	}

	const success = await deleteGalleryImage(id);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete image' },
			{ status: 500 }
		);
	}

	revalidatePages('gallery', id);
	return NextResponse.json({
		message: 'Image deleted successfully'
	});
}

export const PUT = withAuthParam(updateGalleryImageHandler, 'SECRETARY');
export const DELETE = withAuthParam(deleteGalleryImageHandler, 'SECRETARY');