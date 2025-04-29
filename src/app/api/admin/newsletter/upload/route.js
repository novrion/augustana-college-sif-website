import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { uploadNewsletterAttachment, getNewsletterById, updateNewsletter } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		// Get multipart form data
		const formData = await request.formData();
		const file = formData.get('file');
		const newsletterId = formData.get('newsletterId');

		// Basic validation
		if (!file || !newsletterId) {
			return NextResponse.json(
				{ error: 'Missing file or newsletter ID' },
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

		// Upload the file
		const fileData = await uploadNewsletterAttachment(file, newsletterId);

		if (!fileData) {
			return NextResponse.json(
				{ error: 'Failed to upload file' },
				{ status: 500 }
			);
		}

		// Update the newsletter with the new attachment
		const attachments = existingNewsletter.attachments || [];
		attachments.push(fileData);

		const success = await updateNewsletter(newsletterId, {
			attachments: attachments
		});

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to update newsletter with attachment' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				attachment: fileData,
				message: 'File uploaded successfully'
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error uploading file:', error);
		return NextResponse.json(
			{ error: 'An error occurred while uploading the file' },
			{ status: 500 }
		);
	}
}