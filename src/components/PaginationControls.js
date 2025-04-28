'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PaginationControls({ currentPage, totalPages, year, search }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Create query string with current filters
	const createQueryString = (page) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());

		// The year and search are already in the searchParams if they exist
		// No need to manually add them

		return params.toString();
	};

	// Generate page numbers to show
	const getPageNumbers = () => {
		const pageNumbers = [];
		const maxPagesToShow = 5; // Show at most 5 page numbers

		if (totalPages <= maxPagesToShow) {
			// If we have fewer pages than maxPagesToShow, show all pages
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			// Always include first and last page
			pageNumbers.push(1);

			// Calculate middle pages to show
			let startPage = Math.max(2, currentPage - 1);
			let endPage = Math.min(totalPages - 1, currentPage + 1);

			// Adjust if we're at the start or end
			if (currentPage <= 2) {
				endPage = Math.min(totalPages - 1, 4);
			} else if (currentPage >= totalPages - 1) {
				startPage = Math.max(2, totalPages - 3);
			}

			// Add ellipsis if needed
			if (startPage > 2) {
				pageNumbers.push('...');
			}

			// Add middle pages
			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(i);
			}

			// Add ellipsis if needed
			if (endPage < totalPages - 1) {
				pageNumbers.push('...');
			}

			// Add last page if not already included
			if (totalPages > 1) {
				pageNumbers.push(totalPages);
			}
		}

		return pageNumbers;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="flex justify-center items-center gap-2">
			{/* Previous page button */}
			<Link
				href={`${pathname}?${createQueryString(Math.max(1, currentPage - 1))}`}
				className={`rounded-full border border-solid p-2 ${currentPage <= 1
					? 'border-gray-200 text-gray-400 cursor-not-allowed'
					: 'border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
					}`}
				aria-disabled={currentPage <= 1}
				tabIndex={currentPage <= 1 ? -1 : 0}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="15 18 9 12 15 6"></polyline>
				</svg>
			</Link>

			{/* Page numbers */}
			{pageNumbers.map((page, index) => (
				page === '...' ? (
					<span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
				) : (
					<Link
						key={page}
						href={`${pathname}?${createQueryString(page)}`}
						className={`px-3 py-1 rounded-md ${currentPage === page
							? 'bg-foreground text-background'
							: 'hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
							}`}
						aria-current={currentPage === page ? 'page' : undefined}
					>
						{page}
					</Link>
				)
			))}

			{/* Next page button */}
			<Link
				href={`${pathname}?${createQueryString(Math.min(totalPages, currentPage + 1))}`}
				className={`rounded-full border border-solid p-2 ${currentPage >= totalPages
					? 'border-gray-200 text-gray-400 cursor-not-allowed'
					: 'border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
					}`}
				aria-disabled={currentPage >= totalPages}
				tabIndex={currentPage >= totalPages ? -1 : 0}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</Link>
		</div>
	);
}