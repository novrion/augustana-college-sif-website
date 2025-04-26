// lib/portfolioData.js
import { fetchStockQuote, fetchCompanyOverview, loadCache, saveCache } from '../services/alphaVantage';
import { portfolioData, calculateCostBasis } from '../models/portfolio';

// Static data for symbols that might be problematic with the API
const fallbackData = {
	'BRK-B': {
		name: 'Berkshire Hathaway Inc. Class B',
		sector: 'Financials',
		price: 420.75
	},
	'SPY': {
		name: 'SPDR S&P 500 ETF Trust',
		sector: 'ETF',
		price: 510.25
	}
};

// Process a single holding with current market data
async function processHolding(holding) {
	const apiSymbol = holding.symbol.replace('.', '-');

	// Get quote data
	const quoteData = await fetchStockQuote(holding.symbol);

	// Get company data
	const companyData = await fetchCompanyOverview(holding.symbol);

	// Use fallback data if API calls failed
	let currentPrice, name, sector;

	if (quoteData && quoteData['05. price']) {
		currentPrice = parseFloat(quoteData['05. price']);
	} else if (fallbackData[apiSymbol]) {
		currentPrice = fallbackData[apiSymbol].price;
	} else {
		// Use purchase price as fallback
		currentPrice = holding.purchasePrice;
	}

	if (companyData && companyData.Name) {
		name = companyData.Name;
		sector = companyData.Sector || 'Unknown';
	} else if (fallbackData[apiSymbol]) {
		name = fallbackData[apiSymbol].name;
		sector = fallbackData[apiSymbol].sector;
	} else {
		name = holding.symbol;
		sector = 'Unknown';
	}

	// Calculate metrics
	const marketValue = holding.shares * currentPrice;
	const costBasis = calculateCostBasis(holding);
	const gain = marketValue - costBasis;
	const gainPercent = ((currentPrice / holding.purchasePrice) - 1) * 100;

	return {
		symbol: holding.symbol,
		name,
		sector,
		shares: holding.shares,
		purchasePrice: holding.purchasePrice,
		currentPrice,
		marketValue,
		costBasis,
		gain,
		gainPercent,
		lastUpdated: new Date().toISOString()
	};
}

// Get portfolio data with minimal API calls
export async function getPortfolioData() {
	// Load any cached data first
	loadCache();

	const { holdings, cash } = portfolioData;
	const enhancedHoldings = [];

	try {
		// Process top 5 holdings only to stay within daily limit
		// Free tier only allows 25 API calls per day, and we need 2 calls per symbol
		const topHoldings = holdings.slice(0, 5);

		for (const holding of topHoldings) {
			const enhancedHolding = await processHolding(holding);
			enhancedHoldings.push(enhancedHolding);
		}

		// For the rest of the holdings, use cached data or fallbacks
		for (let i = 5; i < holdings.length; i++) {
			const holding = holdings[i];
			// Use simpler calculation without fresh API calls
			const currentPrice = holding.purchasePrice; // Fallback to purchase price
			const marketValue = holding.shares * currentPrice;
			const costBasis = calculateCostBasis(holding);

			enhancedHoldings.push({
				symbol: holding.symbol,
				name: holding.symbol,
				sector: 'Unknown',
				shares: holding.shares,
				purchasePrice: holding.purchasePrice,
				currentPrice,
				marketValue,
				costBasis,
				gain: 0,
				gainPercent: 0
			});
		}

		// Save cache for future use
		saveCache();

		// Calculate portfolio totals
		const totalMarketValue = enhancedHoldings.reduce((sum, h) => sum + h.marketValue, 0) + cash;
		const totalCostBasis = enhancedHoldings.reduce((sum, h) => sum + h.costBasis, 0) + cash;
		const totalGain = totalMarketValue - totalCostBasis;
		const totalGainPercent = (totalGain / totalCostBasis) * 100;

		// Calculate S&P comparison (using SPY as proxy)
		// We're not making an API call, just using a static value instead
		const spyChangePercent = 5.5; // Placeholder value

		// Group by sector for allocation
		const sectors = {};
		enhancedHoldings.forEach(holding => {
			if (!sectors[holding.sector]) {
				sectors[holding.sector] = 0;
			}
			sectors[holding.sector] += holding.marketValue;
		});

		const sectorAllocation = Object.entries(sectors).map(([sector, value]) => ({
			sector,
			value,
			percentage: (value / (totalMarketValue - cash)) * 100
		}));

		return {
			holdings: enhancedHoldings,
			cash,
			totalMarketValue,
			totalCostBasis,
			totalGain,
			totalGainPercent,
			relativeToSP: totalGainPercent - spyChangePercent,
			sectorAllocation,
			lastUpdated: new Date().toISOString()
		};

	} catch (error) {
		console.error('Error processing portfolio data:', error);

		// Return basic portfolio data as fallback
		return {
			holdings: holdings.map(h => ({
				symbol: h.symbol,
				shares: h.shares,
				purchasePrice: h.purchasePrice,
				currentPrice: h.purchasePrice,
				marketValue: h.shares * h.purchasePrice,
				costBasis: h.shares * h.purchasePrice
			})),
			cash,
			totalMarketValue: holdings.reduce((sum, h) => sum + (h.shares * h.purchasePrice), 0) + cash,
			totalCostBasis: holdings.reduce((sum, h) => sum + (h.shares * h.purchasePrice), 0) + cash,
			lastUpdated: new Date().toISOString()
		};
	}
}