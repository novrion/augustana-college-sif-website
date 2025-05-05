import { NextResponse } from 'next/server';
import { getNotesYears } from '@/lib/api/db';

export async function GET() {
	try {
		const years = await getNotesYears();
		return NextResponse.json(years);
	} catch (error) {
		console.error('Error fetching note years:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch note years' },
			{ status: 500 }
		);
	}
}