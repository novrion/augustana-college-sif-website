import { NextResponse } from 'next/server';
import { getPaginatedGalleryImages } from '@/lib/api/db';
import { withError } from '@/lib/api/server/routeHandlers';

async function getGalleryImagesHandler(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get('page') || '1');
	const pageSize = parseInt(searchParams.get('pageSize') || '10');
	const orderBy = searchParams.get('orderBy') || 'date';
	const ascending = searchParams.get('ascending') === 'true';

	const images = await getPaginatedGalleryImages({
		page,
		pageSize,
		orderBy,
		ascending
	});

	return NextResponse.json(images);
}

export const GET = withError(getGalleryImagesHandler);	