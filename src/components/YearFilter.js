'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function YearFilter({ years, currentYear }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [searchTerm, setSearchTerm] = useState('');

	// Set initial search term from URL on component mount
	useEffect(() => {
		const urlSearchTerm = searchParams.get('search');
		if (urlSearchTerm) {
			setSearchTerm(urlSearchTerm);
		}
	}, [searchParams]);

	const handleYearChange = (e) => {
		const year = e.target.value;
		const params = new URLSearchParams(searchParams.toString());

		// Reset to page 1 when changing filters
		params.set('page', '1');

		if (year && year !== 'all') {
			params.set('year', year);
		} else {
			params.delete('year');
		}

		router.push(`${pathname}?${params.toString()}`);
	};

	const handleSearch = (e) => {
		e.preventDefault();

		const params = new URLSearchParams(searchParams.toString());
		params.set('page', '1');

		if (searchTerm.trim()) {
			params.set('search', searchTerm.trim());
		} else {
			params.delete('search');
		}

		router.push(`${pathname}?${params.toString()}`);
	};

	const clearSearch = () => {
		setSearchTerm('');

		const params = new URLSearchParams(searchParams.toString());
		params.delete('search');

		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="flex flex-col sm:flex-row gap-4 sm:items-center">
			<div className="flex-1">
				<label htmlFor="year-filter" className="block text-sm font-medium mb-1">
					Filter by Year
				</label>
				<select
					id="year-filter"
					value={currentYear || 'all'}
					onChange={handleYearChange}
					className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="all">All Years</option>
					{years && years.map((yearItem, index) => {
						// Handle both string years and object years
						const yearValue = typeof yearItem === 'object' ? yearItem.year : yearItem;
						return (
							<option key={index} value={yearValue}>
								{yearValue}
							</option>
						);
					})}
				</select>
			</div>

			<div className="flex-1">
				<form onSubmit={handleSearch}>
					<label htmlFor="search-minutes" className="block text-sm font-medium mb-1">
						Search Minutes
					</label>
					<div className="relative">
						<input
							type="text"
							id="search-minutes"
							placeholder="Search by title or content..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-3 py-2 pr-12 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{searchTerm && (
							<button
								type="button"
								onClick={clearSearch}
								className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
						)}
						<button
							type="submit"
							className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<circle cx="11" cy="11" r="8"></circle>
								<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
							</svg>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}