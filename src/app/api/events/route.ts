import { NextResponse } from 'next/server';
import { getUpcomingEvents, getPastEvents, getAllEvents } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';
import { Event } from '@/lib/types';

async function getEventsHandler(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);
	const type = searchParams.get('type') || 'upcoming';

	if (type === 'upcoming') {
		const upcomingEvents = await getUpcomingEvents();
		return NextResponse.json(upcomingEvents);
	} else if (type === 'month') {
		// Get events for a specific month
		const month = searchParams.get('month');
		if (!month) {
			return NextResponse.json(
				{ error: 'Month parameter required in YYYY-MM format' },
				{ status: 400 }
			);
		}

		// Parse month string (e.g., "2024-11")
		const [year, monthNum] = month.split('-').map(Number);

		// Get all events and filter by month
		const allEvents = await getAllEvents();
		const monthEvents = allEvents.filter((event: Event) => {
			const eventDate = new Date(`${event.date}T12:00:00Z`);
			return eventDate.getUTCFullYear() === year && eventDate.getUTCMonth() === monthNum - 1;
		});

		return NextResponse.json(monthEvents);
	} else {
		const page = parseInt(searchParams.get('page') || '1');
		const pageSize = parseInt(searchParams.get('pageSize') || '10');

		const pastEvents = await getPastEvents(page, pageSize);
		return NextResponse.json(pastEvents);
	}
}

export const GET = withError(getEventsHandler);