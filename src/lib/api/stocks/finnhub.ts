import * as dotenv from 'dotenv';
dotenv.config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

interface StockQuote {
	c: number;  // Current price
	h: number;  // High price of the day
	l: number;  // Low price of the day
	o: number;  // Open price of the day
	pc: number; // Previous close price
	t: number;  // Timestamp
}

interface StockProfile {
	country: string;
	currency: string;
	exchange: string;
	ipo: string;
	marketCapitalization: number;
	name: string;
	phone: string;
	shareOutstanding: number;
	ticker: string;
	weburl: string;
	logo: string;
	finnhubIndustry: string;
}

interface SymbolLookup {
	count: number;
	result: Array<{
		description: string;
		displaySymbol: string;
		symbol: string;
		type: string;
	}>;
}

async function queryFinnhub<T>(url: string): Promise<T | null> {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();
		return data as T;
	} catch (error) {
		console.error(`Error fetching data from Finnhub:`, error);
		return null;
	}
}

export async function getStockQuote(ticker: string): Promise<StockQuote | null> {
	const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
	return queryFinnhub<StockQuote>(url);
}

export async function getStockInfo(ticker: string): Promise<StockProfile | null> {
	const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
	return queryFinnhub<StockProfile>(url);
}

export async function symbolLookup(query: string): Promise<SymbolLookup | null> {
	const url = `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`;
	return queryFinnhub<SymbolLookup>(url);
}