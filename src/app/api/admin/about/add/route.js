import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { createAboutSection } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		// Parse the request body
		let aboutSectionData;
		try {
			aboutSectionData = await request.json();
		} catch (error) {
			console.error('Error parsing request body:', error);
			return NextResponse.json(
				{ error: 'Invalid request body format' },
				{ status: 400 }
			);
		}

		// Basic validation
		if (!aboutSectionData) {
			return NextResponse.json(
				{ error: 'No data provided' },
				{ status: 400 }
			);
		}

		// Validate required fields
		const requiredFields = ['title', 'content', 'order_index'];
		for (const field of requiredFields) {
			if (!aboutSectionData[field]) {
				return NextResponse.json(
					{ error: `Missing required field: ${field}` },
					{ status: 400 }
				);
			}
		}

		const aboutSection = await createAboutSection(aboutSectionData);

		if (!aboutSection) {
			return NextResponse.json(
				{ error: 'Failed to create about section' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ aboutSection, message: 'About section created successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating about section:', error);
		return NextResponse.json(
			{ error: 'An error occurred while creating the about section' },
			{ status: 500 }
		);
	}
}