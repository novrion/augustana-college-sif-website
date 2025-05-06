import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { createEvent } from '@/lib/api/db';

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

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

		return NextResponse.json(event, { status: 201 });
	} catch (error) {
		console.error('Error creating event:', error);
		return NextResponse.json(
			{ error: 'An error occurred while creating the event' },
			{ status: 500 }
		);
	}
}