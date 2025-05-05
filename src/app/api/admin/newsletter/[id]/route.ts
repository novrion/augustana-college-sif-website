import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import {
	getNewsletterById,
	updateNewsletter,
	deleteNewsletter,
	getNewsletterAttachments
} from '@/lib/api/db';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
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
	} catch (error) {
		console.error('Error getting newsletter:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching the newsletter' },
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
	} catch (error) {
		console.error('Error updating newsletter:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the newsletter' },
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
	} catch (error) {
		console.error('Error deleting newsletter:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the newsletter' },
			{ status: 500 }
		);
	}
}