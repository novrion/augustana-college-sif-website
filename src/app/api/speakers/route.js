// app/api/speakers/route.js
import { NextResponse } from 'next/server';
import { getAllSpeakers, getUpcomingSpeakers, getPastSpeakers } from '../../../lib/database';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const type = searchParams.get('type');
		const page = parseInt(searchParams.get('page') || '1');
		const pageSize = parseInt(searchParams.get('pageSize') || '10');

		let response;
		if (type === 'upcoming') {
			const speakers = await getUpcomingSpeakers();
			response = speakers;
		} else if (type === 'past') {
			const paginatedSpeakers = await getPastSpeakers(page, pageSize);
			response = paginatedSpeakers;
		} else {
			const speakers = await getAllSpeakers();
			response = speakers;
		}

		return NextResponse.json(response);
	} catch (error) {
		console.error('Error fetching speakers:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching speakers' },
			{ status: 500 }
		);
	}
}