// app/api/admin/speakers/add/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { createSpeaker } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const speakerData = await request.json();

		// Validate required fields
		const requiredFields = ['speaker_name', 'event_date', 'description', 'location', 'time'];
		for (const field of requiredFields) {
			if (!speakerData[field]) {
				return NextResponse.json(
					{ error: `Missing required field: ${field}` },
					{ status: 400 }
				);
			}
		}

		// Create the speaker
		const speaker = await createSpeaker(speakerData);

		if (!speaker) {
			return NextResponse.json(
				{ error: 'Failed to create speaker' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ speaker, message: 'Speaker created successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating speaker:', error);
		return NextResponse.json(
			{ error: 'An error occurred while creating the speaker' },
			{ status: 500 }
		);
	}
}