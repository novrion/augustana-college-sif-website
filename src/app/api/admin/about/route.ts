import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { createAboutSection, getAllAboutSections } from '@/lib/api/db';

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const data = await request.json();
		if (!data.title || !data.content) {
			return NextResponse.json(
				{ error: 'Title and content are required' },
				{ status: 400 }
			);
		}

		if (!data.order_index) {
			const aboutSections = await getAllAboutSections();
			data.order_index = aboutSections.length > 0
				? Math.max(...aboutSections.map(section => section.order_index)) + 1
				: 1;
		}

		const section = await createAboutSection({
			title: data.title,
			content: data.content,
			order_index: data.order_index
		});

		return NextResponse.json(section, { status: 201 });
	} catch (error) {
		console.error('Error creating about section:', error);
		return NextResponse.json(
			{ error: 'An error occurred while creating the section' },
			{ status: 500 }
		);
	}
}