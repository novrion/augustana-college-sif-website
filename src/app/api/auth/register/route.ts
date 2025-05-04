import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/api/db';

export async function POST(request) {
	try {
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
		const { password: _, ...userWithoutPassword } = user;

		return NextResponse.json(
			{ user: userWithoutPassword, message: 'User registered successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Registration error:', error);
		return NextResponse.json(
			{ error: 'An error occurred during registration' },
			{ status: 500 }
		);
	}
}