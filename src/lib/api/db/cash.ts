import { db } from './supabase';

const table = 'cash';

export async function getCashBalance(): Promise<number> {
	const { data, error } = await db
		.from(table)
		.select('amount')
		.maybeSingle();

	if (error) {
		console.error('Error fetching cash balance:', error);
		return 0;
	}

	if (!data) { return 0; }
	return data.amount || 0;
}

export async function updateCashBalance(amount: number): Promise<boolean> {
	const { data: existingRecord } = await db
		.from(table)
		.select('id')
		.maybeSingle();

	const id = existingRecord?.id;

	if (!id) {
		const { error: insertError } = await db
			.from(table)
			.insert([{ amount }])
			.select('id')
			.single();

		if (insertError) {
			console.error('Error creating cash balance:', insertError);
			return false;
		}

		return true;
	}

	const { error } = await db
		.from(table)
		.update([{ amount }])
		.eq('id', id);

	if (error) {
		console.error('Error updating cash balance:', error);
		return false;
	}

	return true;
}