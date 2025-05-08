import { NextResponse } from 'next/server';
import { getPaginatedPitches } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';

async function getPitchesHandler(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get('page') || '1');
	const pageSize = parseInt(searchParams.get('pageSize') || '10');
	const year = searchParams.get('year') || null;
	const search = searchParams.get('search') || null;
	const symbol = searchParams.get('symbol') || null;

	const result = await getPaginatedPitches({
		page,
		pageSize,
		year,
		search,
		symbol
	});

	return NextResponse.json(result);
}

export const GET = withError(getPitchesHandler);