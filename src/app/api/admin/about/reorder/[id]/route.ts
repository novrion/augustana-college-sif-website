import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getAboutSectionById, reorderAboutSection, getAllAboutSections } from '@/lib/api/db';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function reorderAboutSectionHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingSection = await getAboutSectionById(id);
	if (!existingSection) {
		return NextResponse.json(
			{ error: 'Section not found' },
			{ status: 404 }
		);
	}

	const data = await request.json();
	if (!data.direction || !['up', 'down'].includes(data.direction)) {
		return NextResponse.json(
			{ error: 'Valid direction (up or down) is required' },
			{ status: 400 }
		);
	}

	const success = await reorderAboutSection(id, data.direction);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to reorder section - may be at the boundary already' },
			{ status: 400 }
		);
	}

	const updatedSections = await getAllAboutSections();

	return NextResponse.json({
		message: 'Section reordered successfully',
		sections: updatedSections
	});
}

export const POST = withAuthParam(reorderAboutSectionHandler, 'ADMIN');