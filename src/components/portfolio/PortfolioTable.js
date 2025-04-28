'use client';

import { useState, useMemo } from 'react'; // Import useMemo
import { useRouter } from 'next/navigation';

export default function PortfolioTable({ holdings, cashBalance, totalPortfolioValue }) {
	const [sortConfig, setSortConfig] = useState({
		key: 'ticker',       // Default sort key
		direction: 'ascending' // Default sort direction
	});
	const router = useRouter();

	// --- Pre-calculate values and memoize ---
	// Calculate total equity value once
	const totalEquityValue = totalPortfolioValue - cashBalance;

	// Create an augmented array with calculated values for sorting and display
	// useMemo ensures this calculation only re-runs if dependencies change
	const holdingsWithCalculatedValues = useMemo(() => {
		return holdings.map(holding => {
			const currentPrice = holding.current_price ?? 0;
			const shareCount = holding.share_count ?? 0;
			const costBasis = holding.cost_basis ?? 0;

			const marketValue = currentPrice * shareCount;
			const gainLoss = marketValue - costBasis;
			// Prevent division by zero for gainLossPercent
			const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
			// Prevent division by zero for equityWeight
			const equityWeight = totalEquityValue > 0 ? (marketValue / totalEquityValue) * 100 : 0;

			return {
				...holding, // Include all original holding properties
				// Add calculated properties
				marketValue,
				gainLoss,
				gainLossPercent, // Also add percent for potential direct sorting later if needed
				equityWeight
			};
		});
	}, [holdings, totalEquityValue]); // Dependencies for useMemo


	// --- Sorting Logic ---
	const requestSort = (key) => {
		let direction = 'ascending';
		// Toggle direction if sorting the same key
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	// Sort the augmented array
	// useMemo ensures sorting only re-runs if data or sort config changes
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

	// --- Formatting Functions (remain the same) ---
	const formatCurrency = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value ?? 0);
	};

	const formatPercentage = (value) => {
		// Note: The equityWeight is already calculated as a percentage (e.g., 25),
		// so we don't divide by 100 here again for formatting.
		return new Intl.NumberFormat('en-US', {
			style: 'percent',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
			// Assuming input 'value' is already in percentage points (e.g., 25 for 25%)
		}).format((value ?? 0) / 100); // Divide by 100 because Intl expects a decimal (0.25 for 25%)
	};

	const formatGainLossPercent = (value) => {
		return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
	};


	// --- Click Handler for Rows (remains the same) ---
	const handleRowClick = (holdingId) => {
		router.push(`/portfolio/holdings/${holdingId}`);
	};


	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] overflow-hidden">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
					<thead className="bg-gray-50 dark:bg-gray-800">
						<tr>
							{/* --- Headers: Make calculated columns sortable --- */}
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
								onClick={() => requestSort('share_count')}>
								Shares {getSortIndicator('share_count')}
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('current_price')}>
								Current Price {getSortIndicator('current_price')}
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('cost_basis')}>
								Cost Basis {getSortIndicator('cost_basis')}
							</th>
							{/* Make Market Value header sortable */}
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('marketValue')}>
								Market Value {getSortIndicator('marketValue')}
							</th>
							{/* Make Gain/Loss header sortable */}
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('gainLoss')}>
								Gain/Loss {getSortIndicator('gainLoss')}
							</th>
							{/* Make % of Equity header sortable */}
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('equityWeight')}>
								% of Equity {getSortIndicator('equityWeight')}
							</th>
						</tr>
					</thead>
					<tbody className="bg-white dark:bg-gray-900 divide-y divide-black/[.08] dark:divide-white/[.145]">
						{/* Iterate over the sorted, augmented array */}
						{sortedHoldings.length > 0 ? sortedHoldings.map((holding) => {
							// Values are now pre-calculated on the holding object
							return (
								<tr
									key={holding.id} // Use a unique ID from the original data
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
										{(holding.share_count ?? 0).toLocaleString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
										{formatCurrency(holding.current_price)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
										{formatCurrency(holding.cost_basis)}
									</td>
									{/* Display pre-calculated values */}
									<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
										{formatCurrency(holding.marketValue)}
									</td>
									<td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${holding.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
										{formatCurrency(holding.gainLoss)} ({formatGainLossPercent(holding.gainLossPercent)})
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
			</div>
		</div>
	);
}