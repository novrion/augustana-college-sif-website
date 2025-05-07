import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { symbolLookup } from '@/lib/api/stocks';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function queryHoldingHandler(request: Request, _session: Session): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get('query');
	if (!query) {
		return NextResponse.json(
			{ error: 'Query parameter is required' },
			{ status: 400 }
		);
	}

	const result = await symbolLookup(query);
	if (!result) {
		return NextResponse.json(
			{ error: 'Failed to lookup symbols' },
			{ status: 500 }
		);
	}

	return NextResponse.json({
		count: result.count,
		result: result.result
	});
}

export const GET = withAuth(queryHoldingHandler, 'HOLDINGS_WRITE');