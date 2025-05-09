import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getHomeSectionById, updateHomeSection, deleteHomeSection } from '@/lib/api/db';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function getHomeSectionHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const section = await getHomeSectionById(id);
	if (!section) {
		return NextResponse.json(
			{ error: 'Section not found' },
			{ status: 404 }
		);
	}

	return NextResponse.json(section);
}

async function updateHomeSectionHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingSection = await getHomeSectionById(id);
	if (!existingSection) {
		return NextResponse.json(
			{ error: 'Section not found' },
			{ status: 404 }
		);
	}

	const data = await request.json();
	if (!data.title || !data.content || !data.image_url) {
		return NextResponse.json(
			{ error: 'Title, content, and image URL are required' },
			{ status: 400 }
		);
	}

	if (!data.order_index) {
		data.order_index = existingSection.order_index;
	}

	const success = await updateHomeSection(id, {
		title: data.title,
		content: data.content,
		image_url: data.image_url,
		order_index: data.order_index
	});

	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to update section' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ message: 'Section updated successfully' });
}

async function deleteHomeSectionHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingSection = await getHomeSectionById(id);
	if (!existingSection) {
		return NextResponse.json(
			{ error: 'Section not found' },
			{ status: 404 }
		);
	}

	const success = await deleteHomeSection(id);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete section' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ message: 'Section deleted successfully' });
}

export const GET = withAuthParam(getHomeSectionHandler, 'ADMIN');
export const PUT = withAuthParam(updateHomeSectionHandler, 'ADMIN');
export const DELETE = withAuthParam(deleteHomeSectionHandler, 'ADMIN');