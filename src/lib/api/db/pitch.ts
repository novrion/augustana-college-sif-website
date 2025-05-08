import { Pitch } from '@/lib/types/pitch';
import { getAll, getById, create, update, remove, getPaginated, getYears } from './common';

const table = 'pitches';

export async function getAllPitches(): Promise<Pitch[]> {
	const result = await getAll(table, 'date', false);
	return result.data as Pitch[];
}

export async function getPitchById(id: string): Promise<Pitch | null> {
	return (await getById(table, id)) as Pitch | null;
}

export async function createPitch(pitch: Record<string, unknown>): Promise<Pitch | null> {
	return (await create(table, pitch)) as Pitch | null;
}

export async function updatePitch(id: string, pitch: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, pitch);
}

export async function deletePitch(id: string): Promise<boolean> {
	return await remove(table, id);
}

export async function getPaginatedPitches(params: {
	page?: number;
	pageSize?: number;
	year?: string | null;
	search?: string | null;
	symbol?: string | null;
}): Promise<{ data: Pitch[]; total: number; totalPages: number }> {
	// If filtering by symbol, we need a different approach
	if (params.symbol) {
		const result = await getAll(table, 'date', false);
		const allPitches = result.data as Pitch[];
		const filteredPitches = allPitches.filter(pitch =>
			pitch.symbol === (typeof params.symbol === 'string' ? params.symbol.toUpperCase() : null)
		);

		const total = filteredPitches.length;
		const totalPages = Math.ceil(total / (params.pageSize || 10));
		const start = ((params.page || 1) - 1) * (params.pageSize || 10);
		const end = start + (params.pageSize || 10);

		return {
			data: filteredPitches.slice(start, end),
			total,
			totalPages
		};
	}

	const result = await getPaginated<Record<string, unknown>>({
		table,
		...params,
		searchFields: ['title', 'analyst', 'company', 'symbol', 'description']
	});

	return {
		data: result.data as unknown as Pitch[],
		total: result.total,
		totalPages: result.totalPages
	};
}

export async function getPitchesYears(): Promise<number[]> {
	const pitches = await getAllPitches();
	return getYears({
		items: pitches as unknown as Record<string, unknown>[]
	});
}