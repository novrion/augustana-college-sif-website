'use client'

import { useState } from 'react';
import { symbolLookup } from '@/lib/finnhub.js'

export default function HoldingQueryForm() {
	const [results, setResults] = useState([]);
	const [resultCount, setResultCount] = useState(0)
	const [query, setQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setQuery(value);
	};

	// Updated handleSubmit function for HoldingQueryForm.js
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate form
		if (!query) {
			setError('Please fill in all required fields');
			setIsLoading(false);
			return;
		}

		try {
			// Fix the URL and use proper query parameter
			const url = `/api/admin/portfolio/query-holding?query=${encodeURIComponent(query)}`;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const contentType = response.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				throw new Error(`Server responded with non-JSON content: ${await response.text()}`);
			}

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || `Failed to query holding`);
			}

			setResults(data.result);
			setResultCount(data.count);
		} catch (error) {
			console.error("Submission error:", error);
			setError(error.message || 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
			<h2 className="text-xl font-semibold mb-6">
				Query Holding
			</h2>

			{error && (
				<div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="query">
							Query *
						</label>
						<input
							id="query"
							name="query"
							type="text"
							value={query}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
				</div>

				{results && results.length > 0 ? (
					<div>
						<h2 className="text-xl font-semibold mb-6">
							Response
						</h2>
						<table className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
							<thead>
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
										Ticker
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
										Display Symbol
									</th>
									<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
										Description
									</th>
									<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
										Type
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
								{resultCount === 0 ? (
									<tr>
										<td colSpan="3" className="px-4 py-4 text-center">
											Query found no symbols.
										</td>
									</tr>
								) : (
									results.map((holding, index) => (
										<tr key={index}>
											<td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
												{holding.symbol}
											</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm">
												{holding.displaySymbol}
											</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
												{holding.description}
											</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
												{holding.type}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				) : null}

				<button
					type="submit"
					disabled={isLoading}
					className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
				>
					{isLoading ? 'Querying...' : 'Query'}
				</button>
			</form >
		</div>
	);
}