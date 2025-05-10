import { Pitch, Attachment } from '@/lib/types';
import { getAll, getById, create, update, remove, getPaginated, getYears, uploadFileToBucket, deleteFileFromBucket, getAllAttachments } from './common';

const table = 'pitches';

export async function getAllPitches(): Promise<Pitch[]> {
	const result = await getAll(table, 'date', false);
	return result.data as Pitch[];
}

export async function getPitchById(id: string): Promise<Pitch | null> {
	const pitch = (await getById(table, id)) as Pitch | null;
	if (pitch) {
		pitch.attachments = await getAllAttachments('attachments', `pitch_attachments/${id}`);
	}
	return pitch;
}

export async function createPitch(pitch: Record<string, unknown>): Promise<Pitch | null> {
	return (await create(table, pitch)) as Pitch | null;
}

export async function updatePitch(id: string, pitch: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, pitch);
}

export async function deletePitch(id: string): Promise<boolean> {
	try {
		const attachments = await getAllAttachments('attachments', `pitch_attachments/${id}`);
		for (const attachment of attachments) {
			await deletePitchAttachment(attachment.path);
		}

		return await remove(table, id);
	} catch (error) {
		console.error('Error deleting pitch and attachments:', error);
		return false;
	}
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

	const pitchesWithAttachments = await Promise.all(
		(result.data as unknown as Pitch[]).map(async (pitch) => {
			pitch.attachments = await getAllAttachments('attachments', `pitch_attachments/${pitch.id}`);
			return pitch;
		})
	);

	return {
		data: pitchesWithAttachments,
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

export async function getPitchAttachments(id: string): Promise<Attachment[]> {
	return await getAllAttachments('attachments', `pitch_attachments/${id}`);
}

export async function uploadPitchAttachment(id: string, file: File): Promise<Attachment | null> {
	const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
	const path = `pitch_attachments/${id}/${fileName}`;
	return await uploadFileToBucket('attachments', path, file, fileName);
}

export async function deletePitchAttachment(path: string): Promise<boolean> {
	return await deleteFileFromBucket('attachments', path);
}