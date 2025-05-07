import { NextResponse } from 'next/server';
import { getUpcomingEvents, getPastEvents } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';

async function getEventsHandler(request: Request): Promise<NextResponse> {
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
}

export const GET = withError(getEventsHandler);