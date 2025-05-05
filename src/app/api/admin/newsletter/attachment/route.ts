import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { uploadNewsletterAttachment, deleteNewsletterAttachment } from '@/lib/api/db';

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const formData = await request.formData();
		const file = formData.get('file');
		const newsletterId = formData.get('newsletterId') as string || 'temp'; // Use 'temp' if no ID provided

		if (!file || !(file instanceof File)) {
			return NextResponse.json(
				{ error: 'No file provided' },
				{ status: 400 }
			);
		}

		// Max file size: 10MB
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: 'File size exceeds maximum allowed (10MB)' },
				{ status: 400 }
			);
		}

		const attachment = await uploadNewsletterAttachment(newsletterId, file);
		if (!attachment) {
			return NextResponse.json(
				{ error: 'Failed to upload attachment' },
				{ status: 500 }
			);
		}

		return NextResponse.json(attachment, { status: 201 });
	} catch (error) {
		console.error('Error uploading attachment:', error);
		return NextResponse.json(
			{ error: 'An error occurred while uploading the attachment' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const path = searchParams.get('path');

		if (!path) {
			return NextResponse.json(
				{ error: 'No path provided' },
				{ status: 400 }
			);
		}

		const success = await deleteNewsletterAttachment(path);
		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete attachment' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Attachment deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting attachment:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the attachment' },
			{ status: 500 }
		);
	}
}