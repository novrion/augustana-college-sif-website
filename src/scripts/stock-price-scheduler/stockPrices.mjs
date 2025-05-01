import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Fetch current stock price from Alpha Vantage
 * @param {string} ticker - Stock ticker symbol
 * @returns {Promise<number|null>} Current price or null if error
 */
export async function fetchStockPrice(ticker) {
	const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

	if (!API_KEY) {
		console.error('Alpha Vantage API key not found in environment variables');
		return null;
	}

	try {
		// Add a minor delay to avoid hitting rate limits
		await new Promise(resolve => setTimeout(resolve, 200));

		const response = await fetch(
			`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`
		);

		// Handle non-200 responses
		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();

		// Check for API error responses
		if (data['Error Message']) {
			console.error('Alpha Vantage API error:', data['Error Message']);
			return null;
		}

		// Check for rate limit messages
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