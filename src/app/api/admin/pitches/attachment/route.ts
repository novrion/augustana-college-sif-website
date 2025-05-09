import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { uploadPitchAttachment, deletePitchAttachment } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function uploadPitchAttachmentHandler(request: Request, _session: Session): Promise<NextResponse> {
	const formData = await request.formData();
	const file = formData.get('file');
	const pitchId = formData.get('pitchId') as string || 'temp'; // Use 'temp' if no ID provided

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

	const attachment = await uploadPitchAttachment(pitchId, file);
	if (!attachment) {
		return NextResponse.json(
			{ error: 'Failed to upload attachment' },
			{ status: 500 }
		);
	}

	revalidatePages('pitch');
	return NextResponse.json(attachment, { status: 201 });
}

async function deletePitchAttachmentHandler(request: Request, _session: Session): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);
	const path = searchParams.get('path');

	if (!path) {
		return NextResponse.json(
			{ error: 'No path provided' },
			{ status: 400 }
		);
	}

	const success = await deletePitchAttachment(path);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete attachment' },
			{ status: 500 }
		);
	}

	revalidatePages('pitch');
	return NextResponse.json(
		{ message: 'Attachment deleted successfully' },
		{ status: 200 }
	);
}

export const POST = withAuth(uploadPitchAttachmentHandler, 'HOLDINGS_WRITE');
export const DELETE = withAuth(deletePitchAttachmentHandler, 'HOLDINGS_WRITE');