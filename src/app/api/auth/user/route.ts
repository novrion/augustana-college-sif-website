import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/api/db';
import { User } from "@/lib/types/user";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');
		if (!id) {
			return NextResponse.json(
				{ error: 'Missing required field' },
				{ status: 400 }
			);
		}

		const user = await getUserById(id) as User;
		return NextResponse.json(
			{ user: user, message: 'User fetched successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('User fetch error:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching user' },
			{ status: 500 }
		);
	}
}