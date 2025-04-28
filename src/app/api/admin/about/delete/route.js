import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../../lib/auth';
import { deleteAboutSection, getAboutSectionById } from '../../../../../lib/database';

export async function POST(request) {
	try {
		const isAdminUser = await isAdmin();

		if (!isAdminUser) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const { aboutSectionId } = await request.json()

		if (!aboutSectionId) {
			return NextResponse.json(
				{ error: 'Missing about section ID' },
				{ status: 400 }
			);
		}

		const existingAboutSection = await getAboutSectionById(aboutSectionId);
		if (!existingAboutSection) {
			return NextResponse.json(
				{ error: 'About section not found' },
				{ status: 404 }
			);
		}

		const success = await deleteAboutSection(aboutSectionId);

		if (!success) {
			return NextResponse.json(
				{ error: 'Failed to delete' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'About section deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting about section:', error);
		return NextResponse.json(
			{ error: 'An error occurred while deleting the about section' },
			{ status: 500 }
		);
	}
}