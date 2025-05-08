import { NextResponse } from 'next/server';
import { getPitchesYears } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';

async function getPitchesYearsHandler(_request: Request): Promise<NextResponse> {
	const years = await getPitchesYears();
	return NextResponse.json(years);
}

export const GET = withError(getPitchesYearsHandler);