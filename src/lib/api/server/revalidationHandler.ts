import { revalidatePath } from 'next/cache';

const pathsToRevalidate: Record<string, string[]> = {
	'about': ['/about'],
	'home': ['/'],
	'event': ['/events'],
	'gallery': ['/gallery'],
	'note': ['/notes'],
	'newsletter': ['/newsletter'],
	'holding': ['/holdings'],
	'pitch': ['/pitches', '/holdings'],
	'user': ['/contact'],
	'cash': ['/holdings'],
};

export function revalidatePages(
	entityType: 'about' | 'home' | 'event' | 'gallery' | 'note' | 'newsletter' | 'holding' | 'pitch' | 'user' | 'cash',
	id?: string
): void {
	const paths = pathsToRevalidate[entityType] || [];

	paths.forEach(path => {
		revalidatePath(path);

		if (id) {
			revalidatePath(`${path}/${id}`);
		}
	});
}