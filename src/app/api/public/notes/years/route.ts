import { NextResponse } from 'next/server';
import { getNotesYears } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';

async function getNotesYearsHandler(_request: Request): Promise<NextResponse> {
	const years = await getNotesYears();
	return NextResponse.json(years);
}

export const GET = withError(getNotesYearsHandler);