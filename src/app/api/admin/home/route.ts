import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { createHomeSection, getAllHomeSections } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function createHomeSectionHandler(request: Request, _session: Session): Promise<NextResponse> {
	const data = await request.json();
	if (!data.title || !data.content || !data.image_url) {
		return NextResponse.json(
			{ error: 'Title, content, and image URL are required' },
			{ status: 400 }
		);
	}

	if (!data.order_index) {
		const homeSections = await getAllHomeSections();
		if (!homeSections) {
			return NextResponse.json(
				{ error: 'Could not calculate max order index for home section' },
				{ status: 500 }
			);
		}

		data.order_index = homeSections.length > 0
			? Math.max(...homeSections.map(section => section.order_index)) + 1
			: 1;
	}

	const section = await createHomeSection({
		title: data.title,
		content: data.content,
		image_url: data.image_url,
		order_index: data.order_index
	});

	if (!section) {
		return NextResponse.json(
			{ error: 'Failed to create home section' },
			{ status: 500 }
		);
	}

	revalidatePages('home');
	return NextResponse.json(section, { status: 201 });
}

export const POST = withAuth(createHomeSectionHandler, 'ADMIN');