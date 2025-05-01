import { getLeastRecentlyUpdatedHolding, updateHoldingPrice } from './supabase.mjs';
import { fetchStockPrice } from './stockPrices.mjs';

/**
 * Update a single holding price
 * @returns {Promise<Object>} Result of the update operation
 */
export async function updateNextStockPrice() {
	try {
		// Get the holding that was least recently updated
		const holding = await getLeastRecentlyUpdatedHolding();

		if (!holding) {
			return { success: false, message: 'No holdings found to update' };
		}

		console.log(`Updating price for ${holding.ticker} (${holding.company_name || ''})`);

		// Fetch current price
		const currentPrice = await fetchStockPrice(holding.ticker);

		if (currentPrice === null) {
			return {
				success: false,
				message: `Failed to fetch price for ${holding.ticker}`,
				ticker: holding.ticker
			};
		}

		// Update the holding in the database
		const success = await updateHoldingPrice(holding.id, currentPrice);

		if (!success) {
			return {
				success: false,
				message: `Failed to update ${holding.ticker} in database`,
				ticker: holding.ticker
			};
		}

		return {
			success: true,
			message: `Updated ${holding.ticker} to ${currentPrice}`,
			ticker: holding.ticker,
			price: currentPrice,
			timestamp: new Date().toISOString()
		};
	} catch (error) {
		console.error('Error in updateNextStockPrice:', error);
		return { success: false, message: error.message };
	}
}