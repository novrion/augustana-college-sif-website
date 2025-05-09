import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { createEvent } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function createEventHandler(request: Request, _session: Session): Promise<NextResponse> {
	const data = await request.json();
	if (!data.speaker_name || !data.date || !data.location || !data.time || !data.description) {
		return NextResponse.json(
			{ error: 'Required fields missing' },
			{ status: 400 }
		);
	}

	const event = await createEvent({
		title: data.title || '',
		speaker_name: data.speaker_name,
		role: data.role || '',
		company: data.company || '',
		date: data.date,
		time: data.time,
		location: data.location,
		description: data.description,
		contact: data.contact || ''
	});

	revalidatePages('event');
	return NextResponse.json(event, { status: 201 });
}

export const POST = withAuth(createEventHandler, 'ADMIN');