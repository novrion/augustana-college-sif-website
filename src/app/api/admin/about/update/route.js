import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { updateAboutSection, getAboutSectionById } from '../../../../../lib/database';

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
		if (!aboutSectionData || !aboutSectionData.id) {
			return NextResponse.json(
				{ error: 'No data or ID provided' },
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

		// Verify the about section exists
		const existingAboutSection = await getAboutSectionById(aboutSectionData.id);
		if (!existingAboutSection) {
			return NextResponse.json(
				{ error: 'About section not found' },
				{ status: 404 }
			);
		}

		// Update the about section
		const success = await updateAboutSection(aboutSectionData.id, {
			title: aboutSectionData.title,
			content: aboutSectionData.content,
			order_index: aboutSectionData.order_index
		});

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update about section' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'About section updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating about section:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the about section' },
			{ status: 500 }
		);
	}
}