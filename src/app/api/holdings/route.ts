import { NextResponse } from 'next/server';
import { getAllHoldings } from '@/lib/api/db';
import { Holding } from '@/lib/types/holding';

export async function GET(): Promise<NextResponse> {
	try {
		const holdings: Holding[] = await getAllHoldings();
		return NextResponse.json(holdings);
	} catch (error) {
		console.error('Error fetching holdings:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch holdings' },
			{ status: 500 }
		);
	}
}