'use client';

import { useState } from 'react';
import Form from "@/components/Form";
import { FilledButton } from "@/components/Buttons";

interface SearchResult {
	symbol: string;
	displaySymbol: string;
	description: string;
	type: string;
}

export interface StockInfo {
	name: string;
	industry: string;
	country: string;
	marketCap: number;
}

interface StockQueryFormProps {
	title?: string;
	className?: string;
}

export default function StockQueryForm({ title = "Symbol Lookup", className = "mt-8" }: StockQueryFormProps) {
	const [results, setResults] = useState<SearchResult[]>([]);
	const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
	const [query, setQuery] = useState('');
	const [symbol, setSymbol] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingInfo, setIsLoadingInfo] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		setStockInfo(null); // Clear previous stock info

		if (!query) {
			setError('Please enter a search term');
			setIsLoading(false);
			return;
		}

		try {
			const url = `/api/admin/holdings/query?query=${encodeURIComponent(query)}`;
			const response = await fetch(url);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to query symbols');
			}

			const data = await response.json();

			// Limit results to first 10 if more are returned
			const count = data.count || 0;
			setResults(count > 10 ? data.result.slice(0, 10) : data.result || []);
		} catch (err) {
			console.error("Search error:", err);
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSymbolClick = async (symbolStr: string) => {
		// Prevent duplicate fetches if clicking the same symbol
		if (symbolStr === symbol && isLoadingInfo) {
			return;
		}

		setSymbol(symbolStr);
		setIsLoadingInfo(true);

		try {
			const response = await fetch(`/api/admin/holdings/stock-info?symbol=${symbolStr}`);
			if (response.ok) {
				const data = await response.json();
				setStockInfo(data);
			} else {
				throw new Error('Failed to fetch stock information');
			}
		} catch (error) {
			console.error('Error fetching stock info:', error);
		} finally {
			setIsLoadingInfo(false);
		}
	};

	const formatMarketCap = (marketCap: number): string => {
		if (marketCap >= 1e12) {
			return `$${(marketCap / 1e12).toFixed(2)}T`;
		} else if (marketCap >= 1e9) {
			return `$${(marketCap / 1e9).toFixed(2)}B`;
		} else if (marketCap >= 1e6) {
			return `$${(marketCap / 1e6).toFixed(2)}M`;
		} else {
			return `$${marketCap.toLocaleString()}`;
		}
	};

	return (
		<Form
			onSubmit={handleSubmit}
			title={title}
			error={error}
			className={className}
		>
			<div className="space-y-6">
				{stockInfo && (
					<div className="border border-white/[.145] rounded-lg p-4 bg-[#1a1a1a]">
						<h3 className="text-lg font-semibold mb-2">{symbol} Information</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm text-gray-400">Company Name</label>
								<p className="font-medium">{stockInfo.name}</p>
							</div>
							<div>
								<label className="text-sm text-gray-400">Industry</label>
								<p className="font-medium">{stockInfo.industry || 'N/A'}</p>
							</div>
							<div>
								<label className="text-sm text-gray-400">Country</label>
								<p className="font-medium">{stockInfo.country || 'N/A'}</p>
							</div>
							<div>
								<label className="text-sm text-gray-400">Market Cap</label>
								<p className="font-medium">{stockInfo.marketCap ? formatMarketCap(stockInfo.marketCap) : 'N/A'}</p>
							</div>
						</div>
					</div>
				)}

				{isLoadingInfo && (
					<div className="flex items-center justify-center p-4 border border-white/[.145] rounded-lg">
						<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
						<span className="ml-2">Loading stock information...</span>
					</div>
				)}

				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="query">
						Search for a company or symbol
					</label>
					<div className="flex gap-2">
						<input
							id="query"
							name="query"
							type="text"
							value={query}
							onChange={handleChange}
							placeholder="e.g., Apple, AAPL"
							className="flex-1 px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
						<FilledButton
							type="submit"
							text="Search"
							loadingText="Searching..."
							isLoading={isLoading}
						/>
					</div>
				</div>

				{results.length > 0 && (
					<div className="mt-6">
						<h3 className="text-lg font-semibold mb-4">Search Results</h3>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-white/[.145]">
								<thead className="bg-gray-900">
									<tr>
										<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											Symbol
										</th>
										<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											Display Symbol
										</th>
										<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											Description
										</th>
										<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											Type
										</th>
										<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-white/[.145]">
									{results.map((result, index) => (
										<tr key={index} className="hover:bg-[#1a1a1a]">
											<td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
												{result.symbol}
											</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm">
												{result.displaySymbol}
											</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm">
												{result.description}
											</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm">
												{result.type}
											</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm">
												<button
													onClick={(e) => {
														e.preventDefault();
														handleSymbolClick(result.symbol);
													}}
													className="text-blue-500 hover:text-blue-700"
												>
													Get Info
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</Form>
	);
}