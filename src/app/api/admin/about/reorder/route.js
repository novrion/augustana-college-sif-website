// app/api/admin/about/reorder/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { getAboutSectionById, getAllAboutSections, updateAboutSection } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const { sectionId, direction } = await request.json();

		// Validate inputs
		if (!sectionId || !direction || (direction !== 'up' && direction !== 'down')) {
			return NextResponse.json(
				{ error: 'Invalid parameters' },
				{ status: 400 }
			);
		}

		// Get the section to reorder
		const currentSection = await getAboutSectionById(sectionId);
		if (!currentSection) {
			return NextResponse.json(
				{ error: 'Section not found' },
				{ status: 404 }
			);
		}

		// Get all sections to determine new order
		const allSections = await getAllAboutSections();

		// Sort by order_index
		const sortedSections = allSections.sort((a, b) => a.order_index - b.order_index);

		// Find the index of the current section
		const currentIndex = sortedSections.findIndex(s => s.id === sectionId);

		// Determine the target index based on direction
		const targetIndex = direction === 'up'
			? Math.max(0, currentIndex - 1)
			: Math.min(sortedSections.length - 1, currentIndex + 1);

		// If already at the boundary, nothing to do
		if (currentIndex === targetIndex) {
			return NextResponse.json(
				{ message: 'No change in order needed' },
				{ status: 200 }
			);
		}

		// Swap order_index values with the adjacent section
		const targetSection = sortedSections[targetIndex];
		const tempOrderIndex = currentSection.order_index;

		// Update both sections
		await updateAboutSection(currentSection.id, { order_index: targetSection.order_index });
		await updateAboutSection(targetSection.id, { order_index: tempOrderIndex });

		return NextResponse.json(
			{ message: 'Sections reordered successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error reordering sections:', error);
		return NextResponse.json(
			{ error: 'An error occurred while reordering the sections' },
			{ status: 500 }
		);
	}
}