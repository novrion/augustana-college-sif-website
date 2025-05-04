// app/api/admin/portfolio/query-holding/route.js
import { NextResponse } from 'next/server';
import { hasAdminAccess } from '../../../../../lib/auth';
import { symbolLookup } from '@/lib/finnhub.js';

export async function GET(request) {
	try {
		const hasAccess = await hasAdminAccess();

		if (!hasAccess) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		// Get the query parameter from the URL
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('query');

		// Basic validation
		if (!query) {
			return NextResponse.json(
				{ error: 'No query provided' },
				{ status: 400 }
			);
		}

		// Query the Finnhub API
		const info = await symbolLookup(query);
		if (!info) {
			return NextResponse.json(
				{ error: 'Failed to query symbol' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ result: info.result, count: info.count || 0, message: 'Query executed successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error querying the holding:', error);
		return NextResponse.json(
			{ error: 'An error occurred while querying the holding' },
			{ status: 500 }
		);
	}
}