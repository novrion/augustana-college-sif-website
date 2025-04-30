// app/api/gallery/images/route.js
import { NextResponse } from 'next/server';
import { getAllGalleryImages } from '../../../../lib/database';

export async function GET() {
	try {
		// Fetch all gallery images
		const images = await getAllGalleryImages();

		return NextResponse.json(images);
	} catch (error) {
		console.error('Error fetching gallery images:', error);
		return NextResponse.json(
			{ error: 'An error occurred while fetching gallery images' },
			{ status: 500 }
		);
	}
}