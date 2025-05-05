import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { createNewsletter } from '@/lib/api/db';

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
		if (!data.title || !data.author || !data.date || !data.content) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			);
		}

		const newsletter = await createNewsletter({
			title: data.title,
			author: data.author,
			date: data.date,
			content: data.content,
			attachments: data.attachments || []
		});

		return NextResponse.json(newsletter, { status: 201 });
	} catch (error) {
		console.error('Error creating newsletter:', error);
		return NextResponse.json(
			{ error: 'An error occurred while creating the newsletter' },
			{ status: 500 }
		);
	}
}