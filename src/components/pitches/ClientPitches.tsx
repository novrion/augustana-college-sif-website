'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PitchBox from '@/components/pitches/PitchBox';
import YearFilter from '@/components/common/YearFilter';
import PaginationControls from '@/components/common/PaginationControls';
import { Pitch } from '@/lib/types/pitch';
import StatusMessage from '@/components/common/StatusMessage';

interface ClientPitchesProps {
	initialPage: number;
	initialYear: string | null;
	symbol?: string | null;
}

export default function ClientPitches({ initialPage, initialYear, symbol }: ClientPitchesProps) {
	const router = useRouter();
	const [pitches, setPitches] = useState<Pitch[]>([]);
	const [years, setYears] = useState<number[]>([]);
	const [currentYear, setCurrentYear] = useState<string | null>(initialYear);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(1);
	const [totalPitches, setTotalPitches] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch years only once on mount
	useEffect(() => {
		if (!symbol) {
			fetch('/api/pitches/years')
				.then(res => res.json())
				.then(yearsData => setYears(yearsData))
				.catch(err => console.error('Error fetching years:', err));
		}
	}, [symbol]);

	useEffect(() => {
		const fetchPitches = async () => {
			setIsLoading(true);
			try {
				const params = new URLSearchParams({
					page: currentPage.toString(),
					pageSize: '10'
				});

				if (currentYear) params.set('year', currentYear);
				if (symbol) params.set('symbol', symbol);

				const response = await fetch(`/api/pitches?${params.toString()}`);
				if (!response.ok) throw new Error('Failed to fetch pitches');

				const data = await response.json();
				setPitches(data.data || []);
				setTotalPages(data.totalPages || 1);
				setTotalPitches(data.total || 0);
				setError(null);
			} catch (_error) {
				setError('Failed to load stock pitches');
			} finally {
				setIsLoading(false);
			}
		};

		fetchPitches();
	}, [currentYear, currentPage, symbol]);

	const handleYearChange = (year: string | null) => {
		setCurrentYear(year);
		setCurrentPage(1);

		// Update URL with new parameters
		const params = new URLSearchParams();
		if (year) params.set('year', year);
		params.set('page', '1');
		if (symbol) params.set('symbol', symbol);

		const queryString = params.toString();
		const url = symbol ? `/holdings/${symbol}${queryString ? `?${queryString}` : ''}` : `/pitches${queryString ? `?${queryString}` : ''}`;
		router.push(url, { scroll: false });
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);

		// Update URL with new parameters
		const params = new URLSearchParams();
		if (currentYear) params.set('year', currentYear);
		params.set('page', page.toString());
		if (symbol) params.set('symbol', symbol);

		const queryString = params.toString();
		const url = symbol ? `/holdings/${symbol}${queryString ? `?${queryString}` : ''}` : `/pitches${queryString ? `?${queryString}` : ''}`;
		router.push(url, { scroll: false });
	};

	return (
		<>
			{!symbol && (
				<div className="mb-6">
					<YearFilter
						years={years}
						currentYear={currentYear}
						onChange={handleYearChange}
					/>
				</div>
			)}

			{isLoading && (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			)}

			{error && !isLoading && (<StatusMessage type="error" message={error} />)}

			{!isLoading && !error && (
				<>
					{pitches.length > 0 ? (
						<div className="flex flex-col gap-4">
							{pitches.map((pitch) => <PitchBox key={pitch.id} pitch={pitch} />)}
						</div>
					) : (
						<div className="text-center py-8 text-gray-400">
							{symbol
								? `No stock pitches available for ${symbol}.`
								: 'No stock pitches available for the selected criteria.'
							}
						</div>
					)}

					{totalPages > 1 && (
						<div className="mt-8">
							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
							<div className="mt-4 text-sm text-gray-400 text-center">
								Showing {pitches.length} of {totalPitches} stock pitches
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}