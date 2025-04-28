import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { createMeetingMinute } from '../../../../../lib/database';

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
		let meetingData;
		try {
			meetingData = await request.json();
		} catch (error) {
			console.error('Error parsing request body:', error);
			return NextResponse.json(
				{ error: 'Invalid request body format' },
				{ status: 400 }
			);
		}

		// Basic validation
		if (!meetingData) {
			return NextResponse.json(
				{ error: 'No data provided' },
				{ status: 400 }
			);
		}

		// Validate required fields
		const requiredFields = ['title', 'date', 'author', 'content'];
		for (const field of requiredFields) {
			if (!meetingData[field]) {
				return NextResponse.json(
					{ error: `Missing required field: ${field}` },
					{ status: 400 }
				);
			}
		}

		// Create the meeting minute
		const meeting = await createMeetingMinute(meetingData);

		if (!meeting) {
			return NextResponse.json(
				{ error: 'Failed to create meeting minute' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ meeting, message: 'Meeting minute created successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating meeting minute:', error);
		return NextResponse.json(
			{ error: 'An error occurred while creating the meeting minute' },
			{ status: 500 }
		);
	}
}