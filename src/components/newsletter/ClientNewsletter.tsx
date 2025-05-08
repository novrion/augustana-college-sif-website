'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NewsletterBox from '@/components/newsletter/NewsletterBox';
import YearFilter from '@/components/common/YearFilter';
import PaginationControls from '@/components/common/PaginationControls';
import { Newsletter } from '@/lib/types/newsletter';
import StatusMessage from '@/components/common/StatusMessage';

interface ClientNewsletterProps {
	initialPage: number;
	initialYear: string | null;
}

export default function ClientNewsletter({ initialPage, initialYear }: ClientNewsletterProps) {
	const router = useRouter();
	const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
	const [years, setYears] = useState<number[]>([]);
	const [currentYear, setCurrentYear] = useState<string | null>(initialYear);
	const [currentPage, setCurrentPage] = useState(initialPage);
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

		// Update URL with new parameters
		const params = new URLSearchParams();
		if (year) params.set('year', year);
		params.set('page', '1');
		router.push(`/newsletter?${params.toString()}`, { scroll: false });
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);

		// Update URL with new parameters
		const params = new URLSearchParams();
		if (currentYear) params.set('year', currentYear);
		params.set('page', page.toString());
		router.push(`/newsletter?${params.toString()}`, { scroll: false });
	};

	return (
		<>
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

			{error && !isLoading && (<StatusMessage type="error" message={error} />)}

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
		</>
	);
}