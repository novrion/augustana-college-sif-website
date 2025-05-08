import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { createPitch } from '@/lib/api/db';
import { withAuth } from '@/lib/api/server/routeHandlers';

async function createPitchHandler(request: Request, _session: Session): Promise<NextResponse> {
	const data = await request.json();

	if (!data.title || !data.analyst || !data.date || !data.company ||
		!data.symbol || data.is_buy === undefined || !data.amount) {
		return NextResponse.json(
			{ error: 'All required fields must be provided' },
			{ status: 400 }
		);
	}

	const pitch = await createPitch({
		title: data.title,
		analyst: data.analyst,
		date: data.date,
		description: data.description || '',
		is_buy: data.is_buy,
		amount: parseFloat(data.amount),
		company: data.company,
		symbol: data.symbol.toUpperCase()
	});

	if (!pitch) {
		return NextResponse.json(
			{ error: 'Failed to create pitch' },
			{ status: 500 }
		);
	}

	return NextResponse.json(pitch, { status: 201 });
}

export const POST = withAuth(createPitchHandler, 'HOLDINGS_WRITE');