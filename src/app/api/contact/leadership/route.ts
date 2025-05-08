import { NextResponse } from 'next/server';
import { getUserByRole } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';

async function getLeadershipHandler(_request: Request): Promise<NextResponse> {
	const president = await getUserByRole('president');
	const vicePresident = await getUserByRole('vice_president');
	return NextResponse.json({
		president,
		vicePresident
	});
}

export const GET = withError(getLeadershipHandler);