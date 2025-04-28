import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { createNewsletter } from '../../../../../lib/database';

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
		if (!newsletterData) {
			return NextResponse.json(
				{ error: 'No data provided' },
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

		// Create the newsletter
		const newsletter = await createNewsletter(newsletterData);

		if (!newsletter) {
			return NextResponse.json(
				{ error: 'Failed to create newsletter' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ newsletter, message: 'Newsletter created successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating newsletter:', error);
		return NextResponse.json(
			{ error: 'An error occurred while creating the newsletter' },
			{ status: 500 }
		);
	}
}