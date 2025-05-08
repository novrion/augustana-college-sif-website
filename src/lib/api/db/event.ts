import { Event } from '@/lib/types/event';
import { getAll, getById, create, update, remove } from './common';
import { formatDateForInput } from '@/lib/utils';

const table = 'events';

export async function getAllEvents(): Promise<Event[]> {
	const result = await getAll(table, 'date');
	return result.data as Event[];
}

export async function getEventById(id: string): Promise<Event | null> {
	return (await getById(table, id)) as Event | null;
}

export async function createEvent(event: Record<string, unknown>): Promise<Event | null> {
	return (await create(table, event)) as Event | null;
}

export async function updateEvent(id: string, event: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, event);
}

export async function deleteEvent(id: string): Promise<boolean> {
	return await remove(table, id);
}

export async function getUpcomingEvents(): Promise<Event[]> {
	const todayString: string = formatDateForInput();

	const result = await getAll(
		table,
		'date',
		true,
		{ column: 'date', cmp: todayString },
		undefined
	);

	return result.data as Event[];
}

export async function getPastEvents(page: number = 1, pageSize: number = 10): Promise<{ data: Event[], total: number, totalPages: number }> {
	const todayString: string = formatDateForInput();
	const offset: number = (page - 1) * pageSize;

	const result = await getAll(
		table,
		'date',
		false,
		undefined,
		{ column: 'date', cmp: todayString },
		{ l: offset, r: offset + pageSize - 1 },
		'exact'
	);

	const totalPages: number = Math.ceil((result.count || 0) / pageSize);

	return {
		data: result.data as Event[],
		total: result.count || 0,
		totalPages: totalPages
	};
}