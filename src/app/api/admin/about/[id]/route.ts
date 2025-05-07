import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getAboutSectionById, updateAboutSection, deleteAboutSection } from '@/lib/api/db';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function getAboutSectionHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const section = await getAboutSectionById(id);
	if (!section) {
		return NextResponse.json(
			{ error: 'Section not found' },
			{ status: 404 }
		);
	}

	return NextResponse.json(section);
}

async function updateAboutSectionHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingSection = await getAboutSectionById(id);
	if (!existingSection) {
		return NextResponse.json(
			{ error: 'Section not found' },
			{ status: 404 }
		);
	}

	const data = await request.json();
	if (!data.title || !data.content) {
		return NextResponse.json(
			{ error: 'Title and content are required' },
			{ status: 400 }
		);
	}

	if (!data.order_index) {
		data.order_index = existingSection.order_index;
	}

	const success = await updateAboutSection(id, {
		title: data.title,
		content: data.content,
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

async function deleteAboutSectionHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingSection = await getAboutSectionById(id);
	if (!existingSection) {
		return NextResponse.json(
			{ error: 'Section not found' },
			{ status: 404 }
		);
	}

	const success = await deleteAboutSection(id);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete section' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ message: 'Section deleted successfully' });
}

export const GET = withAuthParam(getAboutSectionHandler, 'ADMIN');
export const PUT = withAuthParam(updateAboutSectionHandler, 'ADMIN');
export const DELETE = withAuthParam(deleteAboutSectionHandler, 'ADMIN');