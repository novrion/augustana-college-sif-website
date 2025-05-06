import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import {
	getEventById,
	updateEvent,
	deleteEvent
} from '@/lib/api/db';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const event = await getEventById(id);
		if (!event) {
			return NextResponse.json(
				{ error: 'Event not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(event);
	} catch (error) {
		console.error('Error getting event:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching the event' },
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

		return NextResponse.json({ message: 'Event updated successfully' });
	} catch (error) {
		console.error('Error updating event:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the event' },
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

		return NextResponse.json({ message: 'Event deleted successfully' });
	} catch (error) {
		console.error('Error deleting event:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the event' },
			{ status: 500 }
		);
	}
}