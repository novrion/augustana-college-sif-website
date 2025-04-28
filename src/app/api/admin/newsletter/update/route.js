import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { updateNewsletter, getNewsletterById } from '../../../../../lib/database';

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

		// Parse the request body
		let newsletterData;
		try {
			newsletterData = await request.json();
		} catch (error) {
			console.error('Error parsing request body:', error);
			return NextResponse.json(
				{ error: 'Invalid request body format' },
				{ status: 400 }
			);
		}

		// Basic validation
		if (!newsletterData || !newsletterData.id) {
			return NextResponse.json(
				{ error: 'No data or ID provided' },
				{ status: 400 }
			);
		}

		// Validate required fields
		const requiredFields = ['title', 'date', 'author', 'content'];
		for (const field of requiredFields) {
			if (!newsletterData[field]) {
				return NextResponse.json(
					{ error: `Missing required field: ${field}` },
					{ status: 400 }
				);
			}
		}

		// Verify the newsletter exists
		const existingNewsletter = await getNewsletterById(newsletterData.id);
		if (!existingNewsletter) {
			return NextResponse.json(
				{ error: 'Newsletter not found' },
				{ status: 404 }
			);
		}

		// Update the newsletter
		const success = await updateNewsletter(newsletterData.id, {
			title: newsletterData.title,
			date: newsletterData.date,
			author: newsletterData.author,
			content: newsletterData.content,
			attachments: newsletterData.attachments || existingNewsletter.attachments
		});

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update newsletter' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Newsletter updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating newsletter:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the newsletter' },
			{ status: 500 }
		);
	}
}