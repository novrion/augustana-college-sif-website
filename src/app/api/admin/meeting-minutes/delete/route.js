import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { deleteMeetingMinute, getMeetingMinuteById } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const { meetingId } = await request.json();

		// Validate ID
		if (!meetingId) {
			return NextResponse.json(
				{ error: 'Missing meeting ID' },
				{ status: 400 }
			);
		}

		// Verify the meeting exists
		const existingMeeting = await getMeetingMinuteById(meetingId);
		if (!existingMeeting) {
			return NextResponse.json(
				{ error: 'Meeting minute not found' },
				{ status: 404 }
			);
		}

		// Delete the meeting
		const success = await deleteMeetingMinute(meetingId);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete meeting minute' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Meeting minute deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting meeting minute:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the meeting minute' },
			{ status: 500 }
		);
	}
}