import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getAllHoldings } from '@/lib/api/db';
import { Holding } from '@/lib/types/';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function getHoldingsHandler(_request: Request, _session: Session): Promise<NextResponse> {
	const holdings: Holding[] = await getAllHoldings();
	return NextResponse.json(holdings);
}

export const GET = withAuth(getHoldingsHandler, 'HOLDINGS_READ');