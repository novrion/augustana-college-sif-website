import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { deleteGalleryImage } from '@/lib/api/db';

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const { id } = params;
		if (!id) {
			return NextResponse.json(
				{ error: 'Image ID is required' },
				{ status: 400 }
			);
		}

		const success = await deleteGalleryImage(id);
		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete image' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'Image deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting gallery image:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the image' },
			{ status: 500 }
		);
	}
}