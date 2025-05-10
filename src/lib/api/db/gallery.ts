import { GalleryImage, Attachment } from '@/lib/types';
import { getAll, getById, create, update, remove, uploadFileToBucket, extractUrl, deleteFileFromBucket, getPaginated } from './common';

const table = 'gallery_images';

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
	const result = await getAll(table, 'date', false);
	return result.data as GalleryImage[];
}

export async function getGalleryImageById(id: string): Promise<GalleryImage | null> {
	return (await getById(table, id)) as GalleryImage | null;
}

export async function createGalleryImage(imageData: Record<string, unknown>): Promise<GalleryImage | null> {
	return (await create(table, imageData)) as GalleryImage | null;
}

export async function updateGalleryImage(id: string, imageData: Record<string, unknown>): Promise<boolean> {
	try {
		const existingImage = await getGalleryImageById(id);
		if (!existingImage) return false;

		if (existingImage.src !== imageData.src && existingImage.src) {
			const fileInfo = await extractUrl(existingImage.src);
			if (fileInfo) {
				await deleteFileFromBucket(fileInfo.bucket, fileInfo.path);
			}
		}

		return await update(table, id, imageData);
	} catch (error) {
		console.error('Error updating gallery image:', error);
		return false;
	}
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
	const image = await getGalleryImageById(id);
	if (!image || !image.src) {
		return false;
	}

	const fileInfo = await extractUrl(image.src);
	if (fileInfo) {
		await deleteFileFromBucket(fileInfo.bucket, fileInfo.path);
	}

	return await remove(table, id);
}

export async function uploadGalleryImage(file: File, oldUrl?: string): Promise<Attachment | null> {
	try {
		// Clean up old image if it exists
		if (oldUrl) {
			const fileInfo = await extractUrl(oldUrl);
			if (fileInfo) {
				await deleteFileFromBucket(fileInfo.bucket, fileInfo.path);
			}
		}

		// Upload new image
		const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
		const path = `gallery_images/${fileName}`;

		return await uploadFileToBucket('gallery', path, file, fileName);
	} catch (error) {
		console.error('Error in uploadGalleryImage:', error);
		return null;
	}
}

export async function getPaginatedGalleryImages(params: {
	page?: number;
	pageSize?: number;
	orderBy?: string;
	ascending?: boolean;
}): Promise<{ data: GalleryImage[]; total: number; totalPages: number }> {
	const result = await getPaginated<Record<string, unknown>>({
		table,
		page: params.page || 1,
		pageSize: params.pageSize || 12,
		orderBy: params.orderBy || 'date',
		ascending: params.ascending !== undefined ? params.ascending : false
	});

	return {
		data: result.data as unknown as GalleryImage[],
		total: result.total,
		totalPages: result.totalPages
	};
}