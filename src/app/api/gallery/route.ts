import { NextResponse } from 'next/server';
import { getPaginatedGalleryImages } from '@/lib/api/db';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const pageSize = parseInt(searchParams.get('pageSize') || '12');

		const result = await getPaginatedGalleryImages({
			page,
			pageSize
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Error fetching gallery images:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch gallery images' },
			{ status: 500 }
		);
	}
}