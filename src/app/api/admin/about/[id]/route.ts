import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import {
	getAboutSectionById,
	updateAboutSection,
	deleteAboutSection
} from '@/lib/api/db';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const section = await getAboutSectionById(id);
		if (!section) {
			return NextResponse.json(
				{ error: 'Section not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(section);
	} catch (error) {
		console.error('Error getting about section:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching the section' },
			{ status: 500 }
		);
	}
}

export async function PUT(
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
	} catch (error) {
		console.error('Error updating about section:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the section' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
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

		const success = await deleteAboutSection(id);
		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete section' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ message: 'Section deleted successfully' });
	} catch (error) {
		console.error('Error deleting about section:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the section' },
			{ status: 500 }
		);
	}
}