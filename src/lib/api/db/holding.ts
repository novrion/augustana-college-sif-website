import { Holding } from '@/lib/types/holding';
import { getAll, getById, create, update, remove } from './common';

const table = 'holdings';

export async function getAllHoldings(): Promise<Holding[]> {
	const result = await getAll(table, 'ticker');
	return result.data as Holding[];
}

export async function getHoldingById(id: string): Promise<Holding | null> {
	return (await getById(table, id)) as Holding | null;
}

export async function createHolding(holding: Record<string, unknown>): Promise<Holding | null> {
	return (await create(table, holding)) as Holding | null;
}

export async function updateHolding(id: string, holding: Record<string, unknown>): Promise<boolean> {
	return await update(table, id, holding);
}

export async function deleteHolding(id: string): Promise<boolean> {
	return await remove(table, id);
}

export async function getLeastRecentlyUpdatedHolding(): Promise<Holding | null> {
	const result = await getAll(table, 'last_updated', true);
	const holdings = result.data as Holding[];
	if (!holdings || holdings.length === 0) { return null; }
	return holdings[0];
}