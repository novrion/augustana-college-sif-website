import { NextResponse } from 'next/server';
import { getPaginatedNewsletters } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';

async function getNewslettersHandler(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get('page') || '1');
	const pageSize = parseInt(searchParams.get('pageSize') || '10');
	const year = searchParams.get('year') || null;
	const search = searchParams.get('search') || null;

	const result = await getPaginatedNewsletters({
		page,
		pageSize,
		year,
		search
	});

	return NextResponse.json(result);
}

export const GET = withError(getNewslettersHandler);