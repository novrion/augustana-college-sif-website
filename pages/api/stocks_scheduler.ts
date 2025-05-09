import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Holding {
	id: string;
	ticker: string;
	company_name?: string;
	current_price: number;
	last_updated: string;
	percent_change?: number;
}

interface FinnhubQuoteData {
	c: number; // Current price
	dp: number; // Daily percent change
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const MAX_API_CALLS_PER_MINUTE = 45;

// Basic check if market is currently open (Eastern Time)
function isMarketOpen(): boolean {
	const now = new Date();
	const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

	if (day === 0 || day === 6) return false; // Weekend

	let etHour = (now.getUTCHours() - 4) % 24; // Approximate ET
	if (etHour < 0) etHour += 24;
	const etMinute = now.getUTCMinutes();


	// Market hours: 9:30 AM - 4:00 PM ET
	const marketOpenHour = 9;
	const marketOpenMinute = 30;
	const marketCloseHour = 16; // 4:00 PM

	const nowInMinutesET = etHour * 60 + etMinute;
	const marketOpenInMinutesET = marketOpenHour * 60 + marketOpenMinute;
	const marketCloseInMinutesET = marketCloseHour * 60;


	return (day >= 1 && day <= 5) && // Monday to Friday
		(nowInMinutesET >= marketOpenInMinutesET && nowInMinutesET < marketCloseInMinutesET);
}

async function fetchStockQuote(ticker: string): Promise<FinnhubQuoteData | null> {
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

		const data: FinnhubQuoteData = await response.json();

		// Finnhub returns the current price in 'c' and daily percent change in 'dp'
		if (data && typeof data.c === 'number' && typeof data.dp === 'number') {
			return data;
		}

		console.error('Unexpected API response structure for quote:', data);
		return null;
	} catch (error) {
		console.error(`Error fetching quote for ${ticker}:`, error);
		return null;
	}
}

async function getStocksToUpdate(limit: number): Promise<Holding[]> {
	const { data, error } = await supabase
		.from('holdings')
		.select('*') // Select all fields as requested
		.order('last_updated', { ascending: true })
		.limit(limit);

	if (error) {
		console.error('Error fetching holdings to update:', error);
		return [];
	}

	return data as Holding[] || [];
}

async function updateHoldingData(id: string, currentPrice: number, percentChange: number): Promise<boolean> {
	const { error } = await supabase
		.from('holdings')
		.update({
			current_price: currentPrice,
			percent_change: percentChange,
			last_updated: new Date().toISOString()
		})
		.eq('id', id);

	if (error) {
		console.error('Error updating holding data:', error);
		return false;
	}

	return true;
}

async function updateStockPrices() {
	const batchSize = isMarketOpen() ? MAX_API_CALLS_PER_MINUTE : 10;
	console.log(`Market ${isMarketOpen() ? 'open' : 'closed'}, attempting to update ${batchSize} stocks`);

	const holdings = await getStocksToUpdate(batchSize);

	if (holdings.length === 0) {
		return {
			success: true,
			message: 'No holdings found to update',
			updatedCount: 0
		};
	}

	const results = {
		success: 0,
		failed: 0,
		skipped: 0,
		details: [] as Array<{
			ticker: string,
			success: boolean,
			price?: number,
			percentChange?: number,
			message?: string
		}>
	};

	for (const holding of holdings) {
		// Add a small delay between API calls (100ms minimum for Finnhub free tier)
		if (results.success > 0 || results.failed > 0) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		if (!isMarketOpen()) {
			const lastUpdated = holding.last_updated ? new Date(holding.last_updated) : new Date(0); // Treat undefined as very old
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
			const quote = await fetchStockQuote(holding.ticker);

			if (quote === null) {
				results.failed++;
				results.details.push({
					ticker: holding.ticker,
					success: false,
					message: 'Failed to fetch quote'
				});
				continue;
			}

			const success = await updateHoldingData(holding.id, quote.c, quote.dp);

			if (success) {
				results.success++;
				results.details.push({
					ticker: holding.ticker,
					success: true,
					price: quote.c,
					percentChange: quote.dp
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