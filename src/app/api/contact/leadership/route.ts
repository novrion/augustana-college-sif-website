import { NextResponse } from 'next/server';
import { getUserByRole } from '@/lib/api/db';

export async function GET() {
	try {
		const president = await getUserByRole('president');
		const vicePresident = await getUserByRole('vice_president');

		return NextResponse.json({
			president,
			vicePresident
		});
	} catch (error) {
		console.error('Error fetching leadership:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch leadership data' },
			{ status: 500 }
		);
	}
}