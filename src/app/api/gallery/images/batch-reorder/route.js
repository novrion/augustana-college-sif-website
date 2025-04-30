// app/api/gallery/images/batch-reorder/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { updateGalleryImageOrder } from '../../../../../lib/database';

export async function POST(request) {
	try {
		// Check admin access
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const { imageOrder } = await request.json();

		// Validate input
		if (!imageOrder || !Array.isArray(imageOrder)) {
			return NextResponse.json(
				{ error: 'Invalid image order data' },
				{ status: 400 }
			);
		}

		// Update all image orders in a transaction-like manner
		const updatePromises = imageOrder.map((item, index) =>
			updateGalleryImageOrder(item.id, index + 1)
		);

		// Wait for all updates to complete
		const results = await Promise.all(updatePromises);

		// Check if all updates were successful
		const allSuccessful = results.every(result => result === true);

		if (!allSuccessful) {
			return NextResponse.json(
				{ error: 'Failed to update some image orders' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Image order updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error updating gallery image order:', error);
		return NextResponse.json(
			{ error: 'An error occurred while updating the image order' },
			{ status: 500 }
		);
	}
}