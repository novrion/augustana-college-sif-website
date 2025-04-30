// app/api/speakers/[id]/route.js
import { NextResponse } from 'next/server';
import { getSpeakerById } from '../../../../lib/database';

export async function GET(request, { params }) {
	try {
		const id = params.id;
		const speaker = await getSpeakerById(id);

		if (!speaker) {
			return NextResponse.json(
				{ error: 'Speaker not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(speaker);
	} catch (error) {
		console.error('Error fetching speaker:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching the speaker' },
			{ status: 500 }
		);
	}
}