'use client';

import { useState, useEffect } from 'react';
import NoteBox from '@/components/notes/NoteBox';
import YearFilter from '@/components/common/YearFilter';
import PaginationControls from '@/components/common/PaginationControls';
import { useSearchParams } from 'next/navigation';
import { Note } from '@/lib/types/note';

export default function NotesPage() {
	const searchParams = useSearchParams();
	const [notes, setNotes] = useState<Note[]>([]);
	const [years, setYears] = useState<number[]>([]);
	const [currentYear, setCurrentYear] = useState<string | null>(searchParams.get('year'));
	const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
	const [totalPages, setTotalPages] = useState(1);
	const [totalNotes, setTotalNotes] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch('/api/notes/years')
			.then(res => res.json())
			.then(yearsData => setYears(yearsData))
			.catch(err => console.error('Error fetching years:', err));
	}, []);

	useEffect(() => {
		const fetchNotes = async () => {
			setIsLoading(true);
			try {
				const params = new URLSearchParams({
					page: currentPage.toString(),
					pageSize: '10'
				});

				if (currentYear) params.set('year', currentYear);

				const response = await fetch(`/api/notes?${params.toString()}`);
				if (!response.ok) throw new Error('Failed to fetch notes');

				const data = await response.json();
				setNotes(data.data || []);
				setTotalPages(data.totalPages || 1);
				setTotalNotes(data.total || 0);
				setError(null);
			} catch (_error) {
				setError('Failed to load meeting minutes');
			} finally {
				setIsLoading(false);
			}
		};

		fetchNotes();
	}, [currentYear, currentPage]);

	const handleYearChange = (year: string | null) => {
		setCurrentYear(year);
		setCurrentPage(1);
		updateUrl(year, 1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		updateUrl(currentYear, page);
	};

	const updateUrl = (year: string | null, page: number) => {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());

		if (year) {
			url.searchParams.set('year', year);
		} else {
			url.searchParams.delete('year');
		}

		window.history.pushState({}, '', url.toString());
	};

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Meeting Minutes</h1>

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
					<div className="text-center p-4 rounded-md text-red-700 mb-6">{error}</div>
				)}

				{!isLoading && !error && (
					<>
						{notes.length > 0 ? (
							<div className="flex flex-col gap-4">
								{notes.map((note) => <NoteBox key={note.id} note={note} />)}
							</div>
						) : (
							<div className="text-center py-8 text-gray-400">
								No meeting minutes available for the selected criteria.
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
									Showing {notes.length} of {totalNotes} meeting minutes
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}