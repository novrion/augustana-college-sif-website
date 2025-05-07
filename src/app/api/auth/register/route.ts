import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';

async function registerHandler(request: Request): Promise<NextResponse> {
	const { name, email, password } = await request.json();
	if (!name || !email || !password) {
		return NextResponse.json(
			{ error: 'Missing required fields' },
			{ status: 400 }
		);
	}

	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		return NextResponse.json(
			{ error: 'Email already in use' },
			{ status: 400 }
		);
	}

	const user = await createUser({ name, email, password, });
	if (!user) {
		return NextResponse.json(
			{ error: 'Failed to create user' },
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{ user: user, message: 'User registered successfully' },
		{ status: 201 }
	);
}

export const POST = withError(registerHandler);