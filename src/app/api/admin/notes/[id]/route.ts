import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import {
	getNoteById,
	updateNote,
	deleteNote
} from '@/lib/api/db';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const note = await getNoteById(id);
		if (!note) {
			return NextResponse.json(
				{ error: 'Note not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(note);
	} catch (error) {
		console.error('Error getting note:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching the note' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

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
	} catch (error) {
		console.error('Error updating note:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the note' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

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
	} catch (error) {
		console.error('Error deleting note:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the note' },
			{ status: 500 }
		);
	}
}