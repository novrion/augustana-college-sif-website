import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getEventById, updateEvent, deleteEvent } from '@/lib/api/db';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function getEventHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const event = await getEventById(id);
	if (!event) {
		return NextResponse.json(
			{ error: 'Event not found' },
			{ status: 404 }
		);
	}

	return NextResponse.json(event);
}

async function updateEventHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingEvent = await getEventById(id);
	if (!existingEvent) {
		return NextResponse.json(
			{ error: 'Event not found' },
			{ status: 404 }
		);
	}

	const data = await request.json();
	if (!data.speaker_name || !data.date || !data.location || !data.time || !data.description) {
		return NextResponse.json(
			{ error: 'Required fields missing' },
			{ status: 400 }
		);
	}

	const success = await updateEvent(id, {
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

	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to update event' },
			{ status: 500 }
		);
	}

	revalidatePages('event', id);
	return NextResponse.json({ message: 'Event updated successfully' });
}

async function deleteEventHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingEvent = await getEventById(id);
	if (!existingEvent) {
		return NextResponse.json(
			{ error: 'Event not found' },
			{ status: 404 }
		);
	}

	const success = await deleteEvent(id);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete event' },
			{ status: 500 }
		);
	}

	revalidatePages('event', id);
	return NextResponse.json({ message: 'Event deleted successfully' });
}

export const GET = withAuthParam(getEventHandler, 'ADMIN');
export const PUT = withAuthParam(updateEventHandler, 'ADMIN');
export const DELETE = withAuthParam(deleteEventHandler, 'ADMIN');