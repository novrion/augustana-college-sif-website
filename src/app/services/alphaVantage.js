// services/alphaVantage.js

// Alpha Vantage free tier limitations:
// - 5 API calls per minute
// - 25 API calls per day (as shown in search results)
// - No access to REALTIME_BULK_QUOTES endpoint (premium only)

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Cache management to reduce API calls
const cache = {
	quotes: new Map(),
	company: new Map(),
	lastFetch: null
};

// Utility to check if cache needs refresh (older than 24 hours)
function isCacheExpired() {
	if (!cache.lastFetch) return true;
	const cacheAge = Date.now() - cache.lastFetch;
	const oneDayMs = 24 * 60 * 60 * 1000;
	return cacheAge > oneDayMs;
}

// Delay function to respect rate limits (5 calls per minute)
function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch single stock quote (GLOBAL_QUOTE endpoint)
export async function fetchStockQuote(symbol) {
	// Check cache first
	if (cache.quotes.has(symbol) && !isCacheExpired()) {
		console.log(`Using cached data for ${symbol}`);
		return cache.quotes.get(symbol);
	}

	// Handle special symbols (like BRK.B -> BRK-B)
	const apiSymbol = symbol.replace('.', '-');

	const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${apiSymbol}&apikey=${API_KEY}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		// Check if we hit API limits
		if (data.Note && data.Note.includes('API call frequency')) {
			console.warn('Alpha Vantage API limit reached. Try again later.');
			return null;
		}

		const quoteData = data['Global Quote'];

		// If successful, cache the result
		if (quoteData && Object.keys(quoteData).length > 0) {
			cache.quotes.set(symbol, quoteData);
			cache.lastFetch = Date.now();
			return quoteData;
		}

		return null;
	} catch (error) {
		console.error(`Error fetching quote for ${symbol}:`, error);
		return null;
	}
}

// Fetch company overview (OVERVIEW endpoint)
export async function fetchCompanyOverview(symbol) {
	// Check cache first
	if (cache.company.has(symbol) && !isCacheExpired()) {
		console.log(`Using cached company data for ${symbol}`);
		return cache.company.get(symbol);
	}

	// Handle special symbols
	const apiSymbol = symbol.replace('.', '-');

	const url = `${BASE_URL}?function=OVERVIEW&symbol=${apiSymbol}&apikey=${API_KEY}`;

	try {
		// Add delay to respect API limits if we've made a request recently
		await delay(12000); // 12 seconds to stay under 5 calls per minute

		const response = await fetch(url);
		const data = await response.json();

		// Check if we hit API limits
		if (data.Note && data.Note.includes('API call frequency')) {
			console.warn('Alpha Vantage API limit reached. Try again later.');
			return null;
		}

		// If successful, cache the result
		if (data && data.Symbol) {
			cache.company.set(symbol, data);
			return data;
		}

		return null;
	} catch (error) {
		console.error(`Error fetching company overview for ${symbol}:`, error);
		return null;
	}
}

// Save cache to localStorage to persist between sessions
export function saveCache() {
	try {
		if (typeof window !== 'undefined') {
			const serializedCache = {
				quotes: Object.fromEntries(cache.quotes),
				company: Object.fromEntries(cache.company),
				lastFetch: cache.lastFetch
			};
			localStorage.setItem('alphaVantageCache', JSON.stringify(serializedCache));
		}
	} catch (error) {
		console.error('Error saving cache:', error);
	}
}

// Load cache from localStorage
export function loadCache() {
	try {
		if (typeof window !== 'undefined') {
			const serializedCache = localStorage.getItem('alphaVantageCache');
			if (serializedCache) {
				const parsedCache = JSON.parse(serializedCache);
				cache.quotes = new Map(Object.entries(parsedCache.quotes || {}));
				cache.company = new Map(Object.entries(parsedCache.company || {}));
				cache.lastFetch = parsedCache.lastFetch;
				console.log('Cache loaded from localStorage');
			}
		}
	} catch (error) {
		console.error('Error loading cache:', error);
	}
}

// Clear the cache
export function clearCache() {
	cache.quotes.clear();
	cache.company.clear();
	cache.lastFetch = null;
	if (typeof window !== 'undefined') {
		localStorage.removeItem('alphaVantageCache');
	}
	console.log('Cache cleared');
}