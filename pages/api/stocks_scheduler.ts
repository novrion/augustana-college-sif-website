import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchStockPrice(ticker: string): Promise<number | null> {
	const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

	if (!API_KEY) {
		console.error('Alpha Vantage API key not found');
		return null;
	}

	try {
		const response = await fetch(
			`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`
		);

		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();

		if (data['Error Message']) {
			console.error('Alpha Vantage API error:', data['Error Message']);
			return null;
		}

		if (data['Note'] && data['Note'].includes('call frequency')) {
			console.warn('Alpha Vantage rate limit reached:', data['Note']);
			return null;
		}

		if (data['Global Quote'] && data['Global Quote']['05. price']) {
			return parseFloat(data['Global Quote']['05. price']);
		}

		console.error('Unexpected API response structure:', data);
		return null;
	} catch (error) {
		console.error(`Error fetching price for ${ticker}:`, error);
		return null;
	}
}

async function getLeastRecentlyUpdatedHolding() {
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

async function updateHoldingPrice(id: string, currentPrice: number): Promise<boolean> {
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

async function updateNextStockPrice() {
	try {
		const holding = await getLeastRecentlyUpdatedHolding();

		if (!holding) {
			return { success: false, message: 'No holdings found to update' };
		}

		console.log(`Updating price for ${holding.ticker} (${holding.company_name || ''})`);

		const currentPrice = await fetchStockPrice(holding.ticker);

		if (currentPrice === null) {
			return {
				success: false,
				message: `Failed to fetch price for ${holding.ticker}`,
				ticker: holding.ticker
			};
		}

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
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('Error in updateNextStockPrice:', errorMessage);
		return { success: false, message: errorMessage };
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const result = await updateNextStockPrice();
		return res.status(result.success ? 200 : 500).json(result);
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : 'Unknown error'
		});
	}
}