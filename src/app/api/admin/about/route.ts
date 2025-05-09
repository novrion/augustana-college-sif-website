import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { createAboutSection, getAllAboutSections } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function createAboutSectionHandler(request: Request, _session: Session): Promise<NextResponse> {
	const data = await request.json();
	if (!data.title || !data.content) {
		return NextResponse.json(
			{ error: 'Title and content are required' },
			{ status: 400 }
		);
	}

	if (!data.order_index) {
		const aboutSections = await getAllAboutSections();
		if (!aboutSections) {
			return NextResponse.json(
				{ error: 'Could not calculate max order index for about section' },
				{ status: 500 }
			);
		}

		data.order_index = aboutSections.length > 0
			? Math.max(...aboutSections.map(section => section.order_index)) + 1
			: 1;
	}

	const section = await createAboutSection({
		title: data.title,
		content: data.content,
		order_index: data.order_index
	});

	if (!section) {
		return NextResponse.json(
			{ error: 'Failed to create about section' },
			{ status: 500 }
		);
	}

	revalidatePages('about');
	return NextResponse.json(section, { status: 201 });
}

export const POST = withAuth(createAboutSectionHandler, 'ADMIN');