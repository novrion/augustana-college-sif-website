import { NextResponse } from 'next/server';
import { getNewsletterYears } from '@/lib/api/db';

export async function GET() {
	try {
		const years = await getNewsletterYears();
		return NextResponse.json(years);
	} catch (error) {
		console.error('Error fetching newsletter years:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch newsletter years' },
			{ status: 500 }
		);
	}
}