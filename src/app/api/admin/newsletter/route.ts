import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { createNewsletter } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function createNewsletterHandler(request: Request, _session: Session): Promise<NextResponse> {
	const data = await request.json();
	if (!data.title || !data.author || !data.date || !data.content) {
		return NextResponse.json(
			{ error: 'All fields are required' },
			{ status: 400 }
		);
	}

	const newsletter = await createNewsletter({
		title: data.title,
		author: data.author,
		date: data.date,
		content: data.content,
		attachments: data.attachments || []
	});

	if (!newsletter) {
		return NextResponse.json(
			{ error: 'Failed to create newsletter' },
			{ status: 500 }
		);
	}

	revalidatePages('newsletter');
	return NextResponse.json(newsletter, { status: 201 });
}

export const POST = withAuth(createNewsletterHandler, 'ADMIN');