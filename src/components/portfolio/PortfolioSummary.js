'use client';

export default function PortfolioSummary({ holdings, cashBalance, totalPortfolioValue }) {
	// Calculate summary metrics
	const totalInvested = holdings.reduce((sum, holding) => sum + holding.cost_basis, 0);
	const totalMarketValue = holdings.reduce((sum, holding) => sum + (holding.current_price * holding.share_count), 0);
	const totalGainLoss = totalMarketValue - totalInvested;
	const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

	// Cash percentage of portfolio
	const cashPercentage = totalPortfolioValue > 0 ? (cashBalance / totalPortfolioValue) * 100 : 0;

	// Format currency values
	const formatCurrency = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{/* Total Portfolio Value */}
			<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
				<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Portfolio Value</span>
				<span className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</span>
			</div>

			{/* Cash Balance */}
			<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
				<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Cash Balance</span>
				<span className="text-2xl font-bold">{formatCurrency(cashBalance)}</span>
				<span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
					{cashPercentage.toFixed(2)}% of Portfolio
				</span>
			</div>

			{/* Total Gain/Loss */}
			<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
				<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Gain/Loss</span>
				<span className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
					{formatCurrency(totalGainLoss)}
				</span>
				<span className={`text-sm ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
					{totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
				</span>
			</div>

			{/* Number of Holdings */}
			<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
				<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Number of Holdings</span>
				<span className="text-2xl font-bold">{holdings.length}</span>
			</div>

			{/* Total Invested */}
			<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
				<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Invested</span>
				<span className="text-2xl font-bold">{formatCurrency(totalInvested)}</span>
			</div>

			{/* Equity */}
			<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
				<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Equity</span>
				<span className="text-2xl font-bold">{formatCurrency(totalMarketValue)}</span>
				<span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
					{(totalMarketValue / totalPortfolioValue * 100).toFixed(2)}% of Portfolio
				</span>
			</div>
		</div>
	);
}