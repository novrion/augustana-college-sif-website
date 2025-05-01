import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_KEY
);

/**
 * Update price for a single holding
 * @param {string} id - Holding ID
 * @param {number} currentPrice - Current stock price
 * @returns {Promise<boolean>} Success status
 */
export async function updateHoldingPrice(id, currentPrice) {
	const { error } = await supabase
		.from('holdings')
		.update({
			current_price: currentPrice,
			last_updated: new Date().toISOString()
		})
		.eq('id', id);

	if (error) {
		console.error('Error updating holding price:', error);
		return false;
	}

	return true;
}

/**
 * Get holding that was least recently updated
 * @returns {Promise<Object|null>} Holding object or null
 */
export async function getLeastRecentlyUpdatedHolding() {
	const { data, error } = await supabase
		.from('holdings')
		.select('*')
		.order('last_updated', { ascending: true })
		.limit(1)
		.single();

	if (error) {
		console.error('Error fetching least recently updated holding:', error);
		return null;
	}

	return data;
}

