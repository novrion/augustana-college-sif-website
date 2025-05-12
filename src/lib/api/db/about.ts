import { AboutSection } from '@/lib/types/about';
import { getAll, getById, create, update, remove } from './common';

const table = 'about_sections';

export async function getAllAboutSections(): Promise<AboutSection[]> {
	const result = await getAll(table, 'order_index');
	return result.data as AboutSection[];
}

export async function getAboutSectionById(id: string): Promise<AboutSection | null> {
	return (await getById(table, id)) as AboutSection | null;
}

export async function createAboutSection(section: Record<string, unknown>): Promise<AboutSection | null> {
	return (await create(table, section)) as AboutSection | null;
}

export async function updateAboutSection(id: string, section: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, section);
}

export async function deleteAboutSection(id: string): Promise<boolean> {
	return await remove(table, id);
}

export async function updateAboutSectionOrder(id: string, orderIndex: number): Promise<boolean> {
	return await update(table, id, { order_index: orderIndex });
}

export async function reorderAboutSection(id: string, direction: 'up' | 'down'): Promise<boolean> {
	try {
		const currentSection = await getAboutSectionById(id);
		if (!currentSection) { return false; }

		const allSections = await getAllAboutSections();
		if (!allSections || allSections.length <= 1) { return false; }

		const sortedSections = [...allSections].sort((a, b) => a.order_index - b.order_index);

		const currentIndex = sortedSections.findIndex(section => section.id === id);
		if (currentIndex === -1) { return false; }

		const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

		if (targetIndex < 0 || targetIndex >= sortedSections.length) { return false; }

		const targetSection = sortedSections[targetIndex];
		const currentOrderIndex = currentSection.order_index;
		const targetOrderIndex = targetSection.order_index;

		const updates = [
			updateAboutSectionOrder(currentSection.id, targetOrderIndex),
			updateAboutSectionOrder(targetSection.id, currentOrderIndex)
		];

		const results = await Promise.all(updates);
		return results.every(result => result === true);
	} catch (error) {
		console.error('Error in reorderAboutSection:', error);
		return false;
	}
}