import { Note } from '@/lib/types';
import { apiFetch } from './fetch';

interface NoteResponse {
	message: string;
}

interface PaginatedNotesResponse {
	data: Note[];
	total: number;
	totalPages: number;
}

export const notesApi = {
	getPaginatedNotes: (page = 1, pageSize = 10, year?: string | null, search?: string | null) => {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('pageSize', pageSize.toString());
		if (year) params.set('year', year);
		if (search) params.set('search', search);

		return apiFetch<PaginatedNotesResponse>(`notes?${params.toString()}`);
	},

	getNotesYears: () =>
		apiFetch<number[]>('notes/years'),

	getNoteById: (id: string) =>
		apiFetch<Note>(`admin/notes/${id}`),

	createNote: (noteData: Partial<Note>) =>
		apiFetch<Note>('admin/notes', {
			method: 'POST',
			body: noteData
		}),

	updateNote: (id: string, noteData: Partial<Note>) =>
		apiFetch<NoteResponse>(`admin/notes/${id}`, {
			method: 'PUT',
			body: noteData
		}),

	deleteNote: (id: string) =>
		apiFetch<NoteResponse>(`admin/notes/${id}`, {
			method: 'DELETE'
		}),

	getAllNotes: () =>
		apiFetch<Note[]>('admin/notes')
};