'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function PortfolioTable({ holdings, cashBalance, totalPortfolioValue }) {
	const [sortConfig, setSortConfig] = useState({
		key: 'marketValue',
		direction: 'descending'
	});
	// Add state to track which view is active (all-time or daily)
	const [showDailyGainLoss, setShowDailyGainLoss] = useState(false);
	const router = useRouter();

	const totalEquityValue = totalPortfolioValue - cashBalance;

	const holdingsWithCalculatedValues = useMemo(() => {
		return holdings.map(holding => {
			const currentPrice = holding.current_price ?? 0;
			const shareCount = holding.share_count ?? 0;
			const costBasis = holding.cost_basis ?? 0;
			const percentChange = holding.percent_change ?? 0; // Daily percentage change

			const marketValue = currentPrice * shareCount;
			const gainLoss = marketValue - costBasis;
			// Prevent division by zero for gainLossPercent
			const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
			// Prevent division by zero for equityWeight
			const equityWeight = totalEquityValue > 0 ? (marketValue / totalEquityValue) * 100 : 0;

			// Calculate daily change in value based on percentage change
			const dailyChangeValue = (percentChange / 100) * marketValue;

			return {
				...holding, // Include all original holding properties
				// Add calculated properties
				marketValue,
				gainLoss,
				gainLossPercent,
				equityWeight,
				dailyChangeValue,
			};
		});
	}, [holdings, totalEquityValue]); // Dependencies for useMemo

	// Sorting Logic
	const requestSort = (key) => {
		let direction = 'ascending';
		// Toggle direction if sorting the same key
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	// Sort the augmented array
	const sortedHoldings = useMemo(() => {
		// Create a mutable copy before sorting
		const sortableItems = [...holdingsWithCalculatedValues];

		sortableItems.sort((a, b) => {
			// Use the key from sortConfig to access the correct property
			// This now works for both original and calculated properties
			const valA = a[sortConfig.key] ?? (typeof a[sortConfig.key] === 'string' ? '' : 0); // Default based on likely type
			const valB = b[sortConfig.key] ?? (typeof b[sortConfig.key] === 'string' ? '' : 0);

			if (valA < valB) {
				return sortConfig.direction === 'ascending' ? -1 : 1;
			}
			if (valA > valB) {
				return sortConfig.direction === 'ascending' ? 1 : -1;
			}
			return 0; // Items are equal
		});
		return sortableItems;
	}, [holdingsWithCalculatedValues, sortConfig]); // Dependencies for useMemo

	const getSortIndicator = (key) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === 'ascending' ? '↑' : '↓';
	};

	// Formatting Functions
	const formatCurrency = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value ?? 0);
	};

	const formatPercentage = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'percent',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format((value ?? 0) / 100); // Divide by 100 because Intl expects a decimal (0.25 for 25%)
	};

	const formatGainLossPercent = (value) => {
		return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
	};

	// Click Handler for Rows
	const handleRowClick = (holdingId) => {
		router.push(`/portfolio/holdings/${holdingId}`);
	};

	function formatLastUpdated(dateString) {
		if (!dateString) return 'Never updated';

		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / (1000 * 60));

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins} minutes ago`;

		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours} hours ago`;

		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	}

	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] overflow-hidden">
			{/* Toggle buttons for gain/loss view */}
			<div className="p-4 flex justify-end">
				<div className="inline-flex rounded-md shadow-sm" role="group">
					<button
						onClick={() => setShowDailyGainLoss(false)}
						className={`px-4 py-2 text-sm font-medium rounded-l-lg ${!showDailyGainLoss
							? 'bg-foreground text-background'
							: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
					>
						All-Time
					</button>
					<button
						onClick={() => setShowDailyGainLoss(true)}
						className={`px-4 py-2 text-sm font-medium rounded-r-lg ${showDailyGainLoss
							? 'bg-foreground text-background'
							: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
					>
						Daily
					</button>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
					<thead className="bg-gray-50 dark:bg-gray-800">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('ticker')}>
								Ticker {getSortIndicator('ticker')}
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('company_name')}>
								Company {getSortIndicator('company_name')}
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('sector')}>
								Sector {getSortIndicator('sector')}
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('current_price')}>
								Current Price {getSortIndicator('current_price')}
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('cost_basis')}>
								Cost Basis {getSortIndicator('cost_basis')}
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('marketValue')}>
								Market Value {getSortIndicator('marketValue')}
							</th>
							{/* Update the header based on the active view */}
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort(showDailyGainLoss ? 'percent_change' : 'gainLoss')}>
								{showDailyGainLoss ? "Today's Change" : "Gain/Loss"} {getSortIndicator(showDailyGainLoss ? 'percent_change' : 'gainLoss')}
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('equityWeight')}>
								% of Equity {getSortIndicator('equityWeight')}
							</th>
						</tr>
					</thead>
					<tbody className="bg-white dark:bg-gray-900 divide-y divide-black/[.08] dark:divide-white/[.145]">
						{sortedHoldings.length > 0 ? sortedHoldings.map((holding) => {
							// Determine which values to display based on the active view
							const displayValue = showDailyGainLoss ?
								holding.dailyChangeValue :
								holding.gainLoss;

							const displayPercent = showDailyGainLoss ?
								holding.percent_change :
								holding.gainLossPercent;

							return (
								<tr
									key={holding.id}
									onClick={() => handleRowClick(holding.id)}
									className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out"
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										{holding.ticker}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										{holding.company_name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										{holding.sector}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
										{formatCurrency(holding.current_price)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
										{formatCurrency(holding.cost_basis)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
										{formatCurrency(holding.marketValue)}
									</td>
									{/* Display either daily change or all-time gain/loss */}
									<td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${displayValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
										{formatCurrency(displayValue)} ({formatGainLossPercent(displayPercent)})
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
										{formatPercentage(holding.equityWeight)}
									</td>
								</tr>
							);
						}) : (
							<tr>
								<td colSpan="9" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
									No holdings found
								</td>
							</tr>
						)}
					</tbody>
				</table>

				<div className="text-xs text-gray-500 dark:text-gray-400 p-4">
					<div className="flex flex-wrap gap-x-8">
						{sortedHoldings.map(holding => (
							<div key={`update-${holding.id}`} className="whitespace-nowrap mb-1">
								<span className="font-medium">{holding.ticker}:</span> {formatLastUpdated(holding.last_updated)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}