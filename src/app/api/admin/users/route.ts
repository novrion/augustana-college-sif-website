import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getAllUsers } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function getUsersHandler(_request: Request, _session: Session): Promise<NextResponse> {
	const users = await getAllUsers();
	return NextResponse.json(users);
}

export const GET = withAuth(getUsersHandler, 'ADMIN');