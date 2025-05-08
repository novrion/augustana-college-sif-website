import { Note } from '@/lib/types/note';
import { getAll, getById, create, update, remove, getPaginated, getYears } from './common';

const table = 'notes';

export async function getAllNotes(): Promise<Note[]> {
	const result = await getAll(table, 'date', false);
	return result.data as Note[];
}

export async function getNoteById(id: string): Promise<Note | null> {
	return (await getById(table, id)) as Note | null;
}

export async function createNote(note: Record<string, unknown>): Promise<Note | null> {
	return (await create(table, note)) as Note | null;
}

export async function updateNote(id: string, note: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, note);
}

export async function deleteNote(id: string): Promise<boolean> {
	return await remove(table, id);
}

export async function getPaginatedNotes(params: {
	page?: number;
	pageSize?: number;
	year?: string | null;
	search?: string | null;
}): Promise<{ data: Note[]; total: number; totalPages: number }> {
	const result = await getPaginated<Record<string, unknown>>({
		table,
		...params
	});

	return {
		data: result.data as unknown as Note[],
		total: result.total,
		totalPages: result.totalPages
	};
}

export async function getNotesYears(): Promise<number[]> {
	const notes = await getAllNotes();
	return getYears({
		items: notes as unknown as Record<string, unknown>[]
	});
}