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
	const currentSection = await getAboutSectionById(id);
	if (!currentSection) {
		return false;
	}

	const ordering = direction === 'up' ? false : true;
	const result = await getAll(
		table,
		'order_index',
		ordering,
		direction === 'up' ? undefined : { column: 'order_index', cmp: currentSection.order_index },
		direction === 'up' ? { column: 'order_index', cmp: currentSection.order_index } : undefined
	);

	const adjacentSections = result.data as AboutSection[];
	if (!adjacentSections || adjacentSections.length === 0) {
		return true; // Already at the boundary
	}

	const adjacentSection = adjacentSections[0];
	const tempOrderIndex = currentSection.order_index;
	const updates = [
		updateAboutSectionOrder(currentSection.id, adjacentSection.order_index),
		updateAboutSectionOrder(adjacentSection.id, tempOrderIndex)
	];

	// Wait for both updates to complete and return true only if both succeed
	const results = await Promise.all(updates);
	return results.every(result => result === true);
}