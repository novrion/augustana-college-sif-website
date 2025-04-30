// app/api/admin/speakers/update/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { updateSpeaker, getSpeakerById } from '../../../../../lib/database';

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

		// Validate ID
		if (!speakerData.id) {
			return NextResponse.json(
				{ error: 'Missing speaker ID' },
				{ status: 400 }
			);
		}

		// Verify the speaker exists
		const existingSpeaker = await getSpeakerById(speakerData.id);
		if (!existingSpeaker) {
			return NextResponse.json(
				{ error: 'Speaker not found' },
				{ status: 404 }
			);
		}

		// Update the speaker
		const success = await updateSpeaker(speakerData.id, speakerData);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update speaker' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Speaker updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating speaker:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the speaker' },
			{ status: 500 }
		);
	}
}