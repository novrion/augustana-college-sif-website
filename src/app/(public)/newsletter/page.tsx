'use client';

import { useState, useEffect } from 'react';
import NewsletterBox from '@/components/newsletter/NewsletterBox';
import YearFilter from '@/components/common/YearFilter';
import PaginationControls from '@/components/common/PaginationControls';
import { Newsletter } from '@/lib/types/newsletter';
import { useSearchParams } from 'next/navigation';

export default function NewsletterPage() {
	const searchParams = useSearchParams();
	const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
	const [years, setYears] = useState<number[]>([]);
	const [currentYear, setCurrentYear] = useState<string | null>(searchParams.get('year'));
	const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
	const [totalPages, setTotalPages] = useState(1);
	const [totalNewsletters, setTotalNewsletters] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchYears = async () => {
			try {
				const response = await fetch('/api/newsletters/years');
				if (!response.ok) throw new Error('Failed to fetch years');
				const data = await response.json();
				setYears(data);
			} catch (error) {
				console.error('Error fetching years:', error);
			}
		};

		fetchYears();
	}, []);

	useEffect(() => {
		const fetchNewsletters = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// Build query string
				const params = new URLSearchParams();
				params.set('page', currentPage.toString());
				params.set('pageSize', '10');
				if (currentYear) params.set('year', currentYear);

				const response = await fetch(`/api/newsletters?${params.toString()}`);

				if (!response.ok) throw new Error('Failed to fetch newsletters');

				const data = await response.json();
				setNewsletters(data.data || []);
				setTotalPages(data.totalPages || 1);
				setTotalNewsletters(data.total || 0);
			} catch (error) {
				console.error('Error fetching newsletters:', error);
				setError('Failed to load newsletters. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchNewsletters();
	}, [currentYear, currentPage]);

	const handleYearChange = (year: string | null) => {
		setCurrentYear(year);
		setCurrentPage(1); // Reset to first page when changing year

		// Update URL without page reload
		const url = new URL(window.location.href);
		url.searchParams.set('page', '1');
		if (year) url.searchParams.set('year', year);
		else url.searchParams.delete('year');
		window.history.pushState({}, '', url.toString());
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);

		// Update URL without page reload
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		if (currentYear) url.searchParams.set('year', currentYear);
		window.history.pushState({}, '', url.toString());
	};

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					Newsletter
				</h1>

				<div className="mb-6">
					<YearFilter
						years={years}
						currentYear={currentYear}
						onChange={handleYearChange}
					/>
				</div>

				{isLoading && (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				)}

				{error && !isLoading && (
					<div className="text-center p-4 rounded-md text-red-700 mb-6">
						{error}
					</div>
				)}

				{!isLoading && !error && (
					<>
						{newsletters.length > 0 ? (
							<div className="flex flex-col gap-4">
								{newsletters.map((newsletter) => (
									<NewsletterBox key={newsletter.id} newsletter={newsletter} />
								))}
							</div>
						) : (
							<div className="text-center py-8 text-gray-400">
								No newsletters available for the selected criteria.
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
									Showing {newsletters.length} of {totalNewsletters} newsletters
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}