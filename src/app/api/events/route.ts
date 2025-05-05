import { NextResponse } from 'next/server';
import { getUpcomingEvents, getPastEvents } from '@/lib/api/db';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const type = searchParams.get('type') || 'upcoming';

		if (type === 'upcoming') {
			const upcomingEvents = await getUpcomingEvents();
			return NextResponse.json(upcomingEvents);
		} else {
			const page = parseInt(searchParams.get('page') || '1');
			const pageSize = parseInt(searchParams.get('pageSize') || '10');

			const pastEvents = await getPastEvents(page, pageSize);
			return NextResponse.json(pastEvents);
		}
	} catch (error) {
		console.error('Error fetching events:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch events' },
			{ status: 500 }
		);
	}
}