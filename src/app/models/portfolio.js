// models/portfolio.js

// Initial portfolio data (replace with your actual holdings)
export const portfolioData = {
	initialValue: 1000000, // $1,000,000 initial investment
	cash: 150000, // Cash on hand
	holdings: [
		{
			symbol: 'AAPL',
			shares: 500,
			purchasePrice: 170.25,
			dateAdded: '2024-01-15'
		},
		{
			symbol: 'MSFT',
			shares: 300,
			purchasePrice: 310.75,
			dateAdded: '2024-02-10'
		},
		{
			symbol: 'GOOGL',
			shares: 200,
			purchasePrice: 142.30,
			dateAdded: '2024-01-22'
		},
		{
			symbol: 'AMZN',
			shares: 250,
			purchasePrice: 155.50,
			dateAdded: '2024-03-05'
		},
		{
			symbol: 'BRK.B',
			shares: 150,
			purchasePrice: 352.80,
			dateAdded: '2024-02-18'
		}
	]
};

// Calculate cost basis (purchase price * shares)
export function calculateCostBasis(holding) {
	return holding.shares * holding.purchasePrice;
}

// Format currency values
export function formatCurrency(value) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value);
}

// Format percentage values
export function formatPercentage(value) {
	return new Intl.NumberFormat('en-US', {
		style: 'percent',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value / 100);
}