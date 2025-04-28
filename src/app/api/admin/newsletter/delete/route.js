import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { deleteNewsletter, getNewsletterById } from '../../../../../lib/database';

export async function POST(request) {
	try {
		// Verify user is admin
		const isAdminUser = await isAdmin();

		if (!isAdminUser) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const { newsletterId } = await request.json();

		// Validate ID
		if (!newsletterId) {
			return NextResponse.json(
				{ error: 'Missing newsletter ID' },
				{ status: 400 }
			);
		}

		// Verify the newsletter exists
		const existingNewsletter = await getNewsletterById(newsletterId);
		if (!existingNewsletter) {
			return NextResponse.json(
				{ error: 'Newsletter not found' },
				{ status: 404 }
			);
		}

		// Delete the newsletter
		const success = await deleteNewsletter(newsletterId);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete newsletter' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Newsletter deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting newsletter:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the newsletter' },
			{ status: 500 }
		);
	}
}