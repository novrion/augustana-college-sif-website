import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Types
interface Holding {
	id: string;
	ticker: string;
	company_name?: string;
	current_price: number;
	last_updated: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Finnhub API constants
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const MAX_API_CALLS_PER_MINUTE = 45; // Safety margin below the 60 limit

// Check if market is currently open (Eastern Time)
function isMarketOpen(): boolean {
	const now = new Date();
	const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

	// If weekend, market is closed
	if (day === 0 || day === 6) return false;

	// Convert to Eastern Time (approximation)
	let etHour = (now.getUTCHours() - 4) % 24; // Adjust for daylight saving as needed
	if (etHour < 0) etHour += 24;

	// Market hours: 9:30 AM - 4:00 PM ET
	return (day >= 1 && day <= 5) && // Monday to Friday
		(etHour >= 9 && etHour < 16); // 9 AM to 4 PM ET
}

async function fetchStockPrice(ticker: string): Promise<number | null> {
	if (!FINNHUB_API_KEY) {
		console.error('Finnhub API key not found');
		return null;
	}

	try {
		const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
		const response = await fetch(url);

		if (!response.ok) {
			if (response.status === 429) {
				console.warn('Finnhub rate limit reached');
				return null;
			}
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();

		// Finnhub returns the current price in the 'c' field
		if (data && typeof data.c === 'number') {
			return data.c;
		}

		console.error('Unexpected API response structure:', data);
		return null;
	} catch (error) {
		console.error(`Error fetching price for ${ticker}:`, error);
		return null;
	}
}

async function getStocksToUpdate(limit: number): Promise<Holding[]> {
	const { data, error } = await supabase
		.from('holdings')
		.select('*')
		.order('last_updated', { ascending: true })
		.limit(limit);

	if (error) {
		console.error('Error fetching holdings to update:', error);
		return [];
	}

	return data || [];
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

async function updateStockPrices() {
	// Determine how many stocks to update
	const batchSize = isMarketOpen() ? MAX_API_CALLS_PER_MINUTE : 10;
	console.log(`Market ${isMarketOpen() ? 'open' : 'closed'}, updating ${batchSize} stocks`);

	const holdings = await getStocksToUpdate(batchSize);

	if (holdings.length === 0) {
		return {
			success: true,
			message: 'No holdings found to update',
			updatedCount: 0
		};
	}

	// Track results
	const results = {
		success: 0,
		failed: 0,
		skipped: 0,
		details: [] as Array<{
			ticker: string,
			success: boolean,
			price?: number,
			message?: string
		}>
	};

	// Process each holding
	for (const holding of holdings) {
		// Add a small delay between API calls
		if (results.success > 0 || results.failed > 0) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		// Skip if market is closed and stock was updated recently (last 2 hours)
		if (!isMarketOpen()) {
			const lastUpdated = new Date(holding.last_updated);
			const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

			if (lastUpdated > twoHoursAgo) {
				results.skipped++;
				results.details.push({
					ticker: holding.ticker,
					success: true,
					message: 'Skipped - market closed and recently updated'
				});
				continue;
			}
		}

		try {
			const currentPrice = await fetchStockPrice(holding.ticker);

			if (currentPrice === null) {
				results.failed++;
				results.details.push({
					ticker: holding.ticker,
					success: false,
					message: 'Failed to fetch price'
				});
				continue;
			}

			const success = await updateHoldingPrice(holding.id, currentPrice);

			if (success) {
				results.success++;
				results.details.push({
					ticker: holding.ticker,
					success: true,
					price: currentPrice
				});
			} else {
				results.failed++;
				results.details.push({
					ticker: holding.ticker,
					success: false,
					message: 'Failed to update in database'
				});
			}
		} catch (error) {
			results.failed++;
			results.details.push({
				ticker: holding.ticker,
				success: false,
				message: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	}

	return {
		success: true,
		message: `Updated ${results.success} stocks, failed ${results.failed}, skipped ${results.skipped}`,
		updatedCount: results.success,
		failedCount: results.failed,
		skippedCount: results.skipped,
		details: results.details
	};
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Check authorization
	const authHeader = req.headers.authorization;
	if (!authHeader || authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const startTime = Date.now();
		const result = await updateStockPrices();
		const duration = Date.now() - startTime;

		return res.status(200).json({
			...result,
			duration: `${duration}ms`
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : 'Unknown error'
		});
	}
}