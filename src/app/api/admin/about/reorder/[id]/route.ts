import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import {
	getAboutSectionById,
	reorderAboutSection,
} from '@/lib/api/db';

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

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

		return NextResponse.json({ message: 'Section reordered successfully' });
	} catch (error) {
		console.error('Error reordering about section:', error);
		return NextResponse.json(
			{ error: 'An error occurred while reordering the section' },
			{ status: 500 }
		);
	}
}