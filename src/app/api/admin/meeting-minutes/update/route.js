import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { updateMeetingMinute, getMeetingMinuteById } from '../../../../../lib/database';

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
		if (!meetingData || !meetingData.id) {
			return NextResponse.json(
				{ error: 'No data or ID provided' },
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

		// Verify the meeting exists
		const existingMeeting = await getMeetingMinuteById(meetingData.id);
		if (!existingMeeting) {
			return NextResponse.json(
				{ error: 'Meeting minute not found' },
				{ status: 404 }
			);
		}

		// Update the meeting
		const success = await updateMeetingMinute(meetingData.id, {
			title: meetingData.title,
			date: meetingData.date,
			author: meetingData.author,
			content: meetingData.content
		});

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update meeting minute' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Meeting minute updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating meeting minute:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the meeting minute' },
			{ status: 500 }
		);
	}
}