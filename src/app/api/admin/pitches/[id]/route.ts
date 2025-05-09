import { revalidatePages } from '@/lib/api/server/revalidationHandler';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { getPitchById, updatePitch, deletePitch } from '@/lib/api/db';
import { withAuthParam } from '@/lib/api/server/routeHandlers';

async function getPitchHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;
	const pitch = await getPitchById(id);

	if (!pitch) {
		return NextResponse.json(
			{ error: 'Pitch not found' },
			{ status: 404 }
		);
	}

	return NextResponse.json(pitch);
}

async function updatePitchHandler(request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingPitch = await getPitchById(id);
	if (!existingPitch) {
		return NextResponse.json(
			{ error: 'Pitch not found' },
			{ status: 404 }
		);
	}

	const data = await request.json();

	if (!data.title || !data.analyst || !data.date || !data.company ||
		!data.symbol || data.is_buy === undefined || !data.amount) {
		return NextResponse.json(
			{ error: 'All required fields must be provided' },
			{ status: 400 }
		);
	}

	const success = await updatePitch(id, {
		title: data.title,
		analyst: data.analyst,
		date: data.date,
		description: data.description || '',
		is_buy: data.is_buy,
		amount: parseFloat(data.amount),
		company: data.company,
		symbol: data.symbol.toUpperCase(),
		attachments: data.attachments || []  // Save attachments reference
	});

	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to update pitch' },
			{ status: 500 }
		);
	}

	revalidatePages('pitch', id);
	return NextResponse.json({ message: 'Pitch updated successfully' });
}

async function deletePitchHandler(_request: Request, _session: Session, params: Promise<{ id: string }>): Promise<NextResponse> {
	const { id } = await params;

	const existingPitch = await getPitchById(id);
	if (!existingPitch) {
		return NextResponse.json(
			{ error: 'Pitch not found' },
			{ status: 404 }
		);
	}

	const success = await deletePitch(id);
	if (!success) {
		return NextResponse.json(
			{ error: 'Failed to delete pitch' },
			{ status: 500 }
		);
	}

	revalidatePages('pitch', id);
	return NextResponse.json({ message: 'Pitch deleted successfully' });
}

export const GET = withAuthParam(getPitchHandler, 'HOLDINGS_WRITE');
export const PUT = withAuthParam(updatePitchHandler, 'HOLDINGS_WRITE');
export const DELETE = withAuthParam(deletePitchHandler, 'HOLDINGS_WRITE');