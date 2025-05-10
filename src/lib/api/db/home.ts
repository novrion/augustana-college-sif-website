import { HomeSection } from '@/lib/types';
import { getAll, getById, create, update, remove, uploadFileToBucket } from './common';

const table = 'home_sections';

export async function getAllHomeSections(): Promise<HomeSection[]> {
	const result = await getAll(table, 'order_index');
	return result.data as HomeSection[];
}

export async function getHomeSectionById(id: string): Promise<HomeSection | null> {
	return (await getById(table, id)) as HomeSection | null;
}

export async function createHomeSection(section: Record<string, unknown>): Promise<HomeSection | null> {
	return (await create(table, section)) as HomeSection | null;
}

export async function updateHomeSection(id: string, section: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, section);
}

export async function deleteHomeSection(id: string): Promise<boolean> {
	return await remove(table, id);
}

export async function updateHomeSectionOrder(id: string, orderIndex: number): Promise<boolean> {
	return await update(table, id, { order_index: orderIndex });
}

export async function reorderHomeSection(id: string, direction: 'up' | 'down'): Promise<boolean> {
	try {
		// Get the current section
		const currentSection = await getHomeSectionById(id);
		if (!currentSection) {
			return false;
		}

		// Get all sections to find the one to swap with
		const allSections = await getAllHomeSections();
		if (!allSections || allSections.length <= 1) {
			return false; // Nothing to reorder
		}

		// Sort sections by order_index
		const sortedSections = [...allSections].sort((a, b) => a.order_index - b.order_index);

		// Find the index of the current section in the sorted array
		const currentIndex = sortedSections.findIndex(section => section.id === id);
		if (currentIndex === -1) {
			return false;
		}

		// Determine the index of the section to swap with
		const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

		// Check if the target index is valid
		if (targetIndex < 0 || targetIndex >= sortedSections.length) {
			return false; // Already at the boundary
		}

		// Get the section to swap with
		const targetSection = sortedSections[targetIndex];

		// Swap the order indices
		const currentOrderIndex = currentSection.order_index;
		const targetOrderIndex = targetSection.order_index;

		// Update both sections with their new order indices
		const updates = [
			updateHomeSectionOrder(currentSection.id, targetOrderIndex),
			updateHomeSectionOrder(targetSection.id, currentOrderIndex)
		];

		// Wait for both updates to complete and return true only if both succeed
		const results = await Promise.all(updates);
		return results.every(result => result === true);
	} catch (error) {
		console.error('Error in reorderHomeSection:', error);
		return false;
	}
}

export async function uploadHomeImage(file: File): Promise<{ url: string } | null> {
	const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
	const path = `home_images/${fileName}`;
	return await uploadFileToBucket('home-images', path, file, fileName);
}