import { NextResponse } from 'next/server';
import { getNewsletterYears } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';

async function getNewsletterYearsHandler(_request: Request): Promise<NextResponse> {
	const years = await getNewsletterYears();
	return NextResponse.json(years);
}

export const GET = withError(getNewsletterYearsHandler);