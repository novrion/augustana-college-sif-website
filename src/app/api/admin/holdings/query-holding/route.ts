import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { symbolLookup } from '@/lib/api/stocks';

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const query = searchParams.get('query');

		if (!query) {
			return NextResponse.json(
				{ error: 'Query parameter is required' },
				{ status: 400 }
			);
		}

		const result = await symbolLookup(query);

		if (!result) {
			return NextResponse.json(
				{ error: 'Failed to lookup symbols' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			count: result.count,
			result: result.result
		});
	} catch (error) {
		console.error('Error querying holding:', error);
		return NextResponse.json(
			{ error: 'An error occurred while querying the symbol' },
			{ status: 500 }
		);
	}
}