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

export default function HoldingQueryForm() {
	const [results, setResults] = useState<SearchResult[]>([]);
	const [query, setQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

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

	return (
		<Form
			onSubmit={handleSubmit}
			title="Symbol Lookup"
			error={error}
			className="mt-8"
		>
			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="query">
						Search for a company or symbol
					</label>
					<input
						id="query"
						name="query"
						type="text"
						value={query}
						onChange={handleChange}
						placeholder="e.g., Apple, AAPL"
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="flex justify-end">
					<FilledButton
						type="submit"
						text="Search"
						loadingText="Searching..."
						isLoading={isLoading}
					/>
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