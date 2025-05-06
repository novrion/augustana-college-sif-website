import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getAllUsers } from '@/lib/api/db';

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const currentUserRole = session.user.role;
		if (!['admin', 'president', 'vice_president'].includes(currentUserRole)) {
			return NextResponse.json(
				{ error: 'You do not have permission to access user data' },
				{ status: 403 }
			);
		}

		const users = await getAllUsers();
		return NextResponse.json(users);
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching users' },
			{ status: 500 }
		);
	}
}