import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '../../../../lib/database';

export async function POST(request) {
	try {
		const { name, email, password } = await request.json();

		// Validate required fields
		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Check if user with the same email already exists
		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Email already in use' },
				{ status: 400 }
			);
		}

		// Create a new user
		const user = await createUser({
			name,
			email,
			password,
		});

		// Remove password from the response
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