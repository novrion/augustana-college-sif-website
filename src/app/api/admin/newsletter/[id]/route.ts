import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getNewsletterById, updateNewsletter, deleteNewsletter, getNewsletterAttachments } from '@/lib/api/db';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function getNewsletterHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const newsletter = await getNewsletterById(id);
	if (!newsletter) {
		return NextResponse.json(
			{ error: 'Newsletter not found' },
			{ status: 404 }
		);
	}

	// Get attachments if they exist
	newsletter.attachments = await getNewsletterAttachments(id);

	return NextResponse.json(newsletter);
}

async function updateNewsletterHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingNewsletter = await getNewsletterById(id);
	if (!existingNewsletter) {
		return NextResponse.json(
			{ error: 'Newsletter not found' },
			{ status: 404 }
		);
	}

	const data = await request.json();
	if (!data.title || !data.author || !data.date || !data.content) {
		return NextResponse.json(
			{ error: 'All fields are required' },
			{ status: 400 }
		);
	}

	const success = await updateNewsletter(id, {
		title: data.title,
		author: data.author,
		date: data.date,
		content: data.content,
		attachments: data.attachments || []
	});

	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to update newsletter' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ message: 'Newsletter updated successfully' });
}

async function deleteNewsletterHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingNewsletter = await getNewsletterById(id);
	if (!existingNewsletter) {
		return NextResponse.json(
			{ error: 'Newsletter not found' },
			{ status: 404 }
		);
	}

	const success = await deleteNewsletter(id);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete newsletter' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ message: 'Newsletter deleted successfully' });
}

export const GET = withAuthParam(getNewsletterHandler, 'ADMIN');
export const PUT = withAuthParam(updateNewsletterHandler, 'ADMIN');
export const DELETE = withAuthParam(deleteNewsletterHandler, 'ADMIN');