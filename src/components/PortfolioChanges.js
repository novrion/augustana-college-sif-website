'use client';

import { useEffect, useState } from 'react';

export default function PortfolioChanges({ holdings }) {
	const [sortedHoldings, setSortedHoldings] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: 'percentChange',
		direction: 'descending'
	});

	useEffect(() => {
		if (!holdings || holdings.length === 0) return;

		// Create a mutable copy for sorting
		const holdingsWithData = holdings.map(holding => ({
			...holding,
			percentChange: holding.percent_change || 0
		}));

		// Sort holdings based on sortConfig
		const sorted = [...holdingsWithData].sort((a, b) => {
			if (a[sortConfig.key] < b[sortConfig.key]) {
				return sortConfig.direction === 'ascending' ? -1 : 1;
			}
			if (a[sortConfig.key] > b[sortConfig.key]) {
				return sortConfig.direction === 'ascending' ? 1 : -1;
			}
			return 0;
		});

		setSortedHoldings(sorted);
	}, [holdings, sortConfig]);

	const requestSort = (key) => {
		let direction = 'ascending';
		// Toggle direction if sorting the same key
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	const getSortIndicator = (key) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === 'ascending' ? '↑' : '↓';
	};

	if (!holdings || holdings.length === 0) {
		return <div>No holdings data available</div>;
	}

	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] overflow-hidden mt-6">
			<h2 className="text-xl font-semibold p-4 border-b border-black/[.08] dark:border-white/[.145]">
				Daily Performance
			</h2>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
					<thead className="bg-gray-50 dark:bg-gray-800">
						<tr>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('ticker')}
							>
								Ticker {getSortIndicator('ticker')}
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('company_name')}
							>
								Company {getSortIndicator('company_name')}
							</th>
							<th
								className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('current_price')}
							>
								Current Price {getSortIndicator('current_price')}
							</th>
							<th
								className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
								onClick={() => requestSort('percentChange')}
							>
								Today&apos;s Change {getSortIndicator('percentChange')}
							</th>
						</tr>
					</thead>
					<tbody className="bg-white dark:bg-gray-900 divide-y divide-black/[.08] dark:divide-white/[.145]">
						{sortedHoldings.map((holding) => (
							<tr key={holding.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
									{holding.ticker}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm">
									{holding.company_name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
									${holding.current_price?.toFixed(2) || '0.00'}
								</td>
								<td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${holding.percentChange > 0
									? 'text-green-600 dark:text-green-400'
									: holding.percentChange < 0
										? 'text-red-600 dark:text-red-400'
										: ''
									}`}>
									{holding.percentChange > 0 ? '+' : ''}
									{holding.percentChange?.toFixed(2) || '0.00'}%
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}