import * as dotenv from 'dotenv';
dotenv.config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

async function queryFinnhub(url) {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(`Error fetching data for ${ticker}:`, error);
		return null;
	}
}

export async function getStockQuote(ticker) {
	const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`
	return queryFinnhub(url);
}

export async function getStockInfo(ticker) {
	const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${FINNHUB_API_KEY}`
	return queryFinnhub(url);
}