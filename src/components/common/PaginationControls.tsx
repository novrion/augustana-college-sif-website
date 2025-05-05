'use client';

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function PaginationControls({
	currentPage,
	totalPages,
	onPageChange
}: PaginationControlsProps) {
	const getPageNumbers = () => {
		const pageNumbers: (number | string)[] = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			pageNumbers.push(1);

			let startPage = Math.max(2, currentPage - 1);
			let endPage = Math.min(totalPages - 1, currentPage + 1);

			if (currentPage <= 2) {
				endPage = Math.min(totalPages - 1, 4);
			} else if (currentPage >= totalPages - 1) {
				startPage = Math.max(2, totalPages - 3);
			}

			if (startPage > 2) {
				pageNumbers.push('...');
			}

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(i);
			}

			if (endPage < totalPages - 1) {
				pageNumbers.push('...');
			}

			if (totalPages > 1) {
				pageNumbers.push(totalPages);
			}
		}

		return pageNumbers;
	};

	return (
		<div className="flex justify-center items-center gap-2">
			<button
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage <= 1}
				className={`rounded-full border border-solid p-2 ${currentPage <= 1
					? 'border-gray-200 text-gray-400 cursor-not-allowed'
					: 'border-white/[.145] hover:bg-[#1a1a1a]'
					}`}
				aria-disabled={currentPage <= 1}
				tabIndex={currentPage <= 1 ? -1 : 0}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="15 18 9 12 15 6"></polyline>
				</svg>
			</button>

			{getPageNumbers().map((page, index) => (
				page === '...' ? (
					<span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
				) : (
					<button
						key={page}
						onClick={() => onPageChange(page as number)}
						className={`px-3 py-1 rounded-md ${currentPage === page
							? 'bg-foreground text-background'
							: 'hover:bg-[#1a1a1a]'
							}`}
						aria-current={currentPage === page ? 'page' : undefined}
					>
						{page}
					</button>
				)
			))}

			<button
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage >= totalPages}
				className={`rounded-full border border-solid p-2 ${currentPage >= totalPages
					? 'border-gray-200 text-gray-400 cursor-not-allowed'
					: 'border-white/[.145] hover:bg-[#1a1a1a]'
					}`}
				aria-disabled={currentPage >= totalPages}
				tabIndex={currentPage >= totalPages ? -1 : 0}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</button>
		</div>
	);
}