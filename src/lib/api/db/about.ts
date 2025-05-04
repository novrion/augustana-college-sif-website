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