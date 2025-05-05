import { NextResponse } from 'next/server';
import { getPaginatedNotes } from '@/lib/api/db';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const pageSize = parseInt(searchParams.get('pageSize') || '10');
		const year = searchParams.get('year') || null;
		const search = searchParams.get('search') || null;

		const result = await getPaginatedNotes({
			page,
			pageSize,
			year,
			search
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Error fetching notes:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch notes' },
			{ status: 500 }
		);
	}
}