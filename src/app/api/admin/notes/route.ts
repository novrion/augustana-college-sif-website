import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { createNote } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function createNoteHandler(request: Request, _session: Session): Promise<NextResponse> {
	const data = await request.json();
	if (!data.title || !data.author || !data.date || !data.content) {
		return NextResponse.json(
			{ error: 'All fields are required' },
			{ status: 400 }
		);
	}

	const note = await createNote({
		title: data.title,
		author: data.author,
		date: data.date,
		content: data.content
	});

	if (!note) {
		return NextResponse.json(
			{ error: 'Failed to create note' },
			{ status: 500 }
		);
	}

	return NextResponse.json(note, { status: 201 });
}

export const POST = withAuth(createNoteHandler, 'SECRETARY');