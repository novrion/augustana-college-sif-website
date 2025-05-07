import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getNoteById, updateNote, deleteNote } from '@/lib/api/db';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function getNoteHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;
	const note = await getNoteById(id);

	if (!note) {
		return NextResponse.json(
			{ error: 'Note not found' },
			{ status: 404 }
		);
	}

	return NextResponse.json(note);
}

async function updateNoteHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingNote = await getNoteById(id);
	if (!existingNote) {
		return NextResponse.json(
			{ error: 'Note not found' },
			{ status: 404 }
		);
	}

	const data = await request.json();
	if (!data.title || !data.author || !data.date || !data.content) {
		return NextResponse.json(
			{ error: 'All fields are required' },
			{ status: 400 }
		);
	}

	const success = await updateNote(id, {
		title: data.title,
		author: data.author,
		date: data.date,
		content: data.content
	});

	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to update note' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ message: 'Note updated successfully' });
}

async function deleteNoteHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingNote = await getNoteById(id);
	if (!existingNote) {
		return NextResponse.json(
			{ error: 'Note not found' },
			{ status: 404 }
		);
	}

	const success = await deleteNote(id);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete note' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ message: 'Note deleted successfully' });
}

export const GET = withAuthParam(getNoteHandler, 'SECRETARY');
export const PUT = withAuthParam(updateNoteHandler, 'SECRETARY');
export const DELETE = withAuthParam(deleteNoteHandler, 'SECRETARY');