import { GalleryImage } from '@/lib/types/gallery';
import { getAll, getById, create, update, remove, uploadFileToBucket, extractUrl, deleteFileFromBucket } from './common';

const table = 'gallery_images';

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
	const result = await getAll(table, 'order_index', true);
	return result.data as GalleryImage[];
}

export async function getGalleryImageById(id: string): Promise<GalleryImage | null> {
	return (await getById(table, id)) as GalleryImage | null;
}

export async function createGalleryImage(imageData: Record<string, unknown>): Promise<GalleryImage | null> {
	const maxOrderIndex = await getMaxGalleryImageOrderIndex();

	const imageWithOrder = {
		...imageData,
		order_index: maxOrderIndex + 1
	};

	return (await create(table, imageWithOrder)) as GalleryImage | null;
}

export async function updateGalleryImage(id: string, imageData: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, imageData);
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

export async function getMaxGalleryImageOrderIndex(): Promise<number> {
	const result = await getAll(table, 'order_index', false);
	const images = result.data as GalleryImage[];

	if (!images || images.length === 0) {
		return 0;
	}

	return images[0].order_index || 0;
}

export async function updateGalleryImageOrder(id: string, orderIndex: number): Promise<boolean> {
	return await update(table, id, { order_index: orderIndex });
}

export async function reorderGalleryImage(id: string, direction: 'up' | 'down'): Promise<boolean> {
	const currentImage = await getGalleryImageById(id);
	if (!currentImage) {
		return false;
	}

	const ordering = direction === 'up' ? false : true;
	const result = await getAll(
		table,
		'order_index',
		ordering,
		direction === 'up' ? undefined : { column: 'order_index', cmp: currentImage.order_index },
		direction === 'up' ? { column: 'order_index', cmp: currentImage.order_index } : undefined
	);

	const adjacentImages = result.data as GalleryImage[];
	if (!adjacentImages || adjacentImages.length === 0) {
		return true;
	}

	const adjacentImage = adjacentImages[0];
	const tempOrderIndex = currentImage.order_index;
	const updates = [
		updateGalleryImageOrder(currentImage.id, adjacentImage.order_index),
		updateGalleryImageOrder(adjacentImage.id, tempOrderIndex)
	];

	// Wait for both updates to complete and return true only if both succeed
	const results = await Promise.all(updates);
	return results.every(result => result === true);
}

export async function uploadGalleryImage(file: File): Promise<object | null> {
	const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
	const path = `gallery_images/${fileName}`;

	return await uploadFileToBucket('gallery', path, file, fileName);
}