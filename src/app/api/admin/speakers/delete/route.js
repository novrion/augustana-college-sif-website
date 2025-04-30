// app/api/admin/speakers/delete/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { deleteSpeaker, getSpeakerById } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const { speakerId } = await request.json();

		// Validate ID
		if (!speakerId) {
			return NextResponse.json(
				{ error: 'Missing speaker ID' },
				{ status: 400 }
			);
		}

		// Verify the speaker exists
		const existingSpeaker = await getSpeakerById(speakerId);
		if (!existingSpeaker) {
			return NextResponse.json(
				{ error: 'Speaker not found' },
				{ status: 404 }
			);
		}

		// Delete the speaker
		const success = await deleteSpeaker(speakerId);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete speaker' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Speaker deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting speaker:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the speaker' },
			{ status: 500 }
		);
	}
}