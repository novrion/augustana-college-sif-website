'use client';

import { useState, useEffect } from 'react';
import NoteBox from '@/components/notes/NoteBox';
import PaginationControls from '@/components/common/PaginationControls';
import { Note } from '@/lib/types/note';
import { useSearchParams } from 'next/navigation';

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
		const fetchYears = async () => {
			try {
				const response = await fetch('/api/notes/years');
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
		const fetchNotes = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// Build query string
				const params = new URLSearchParams();
				params.set('page', currentPage.toString());
				params.set('pageSize', '10');
				if (currentYear) params.set('year', currentYear);

				const response = await fetch(`/api/notes?${params.toString()}`);

				if (!response.ok) throw new Error('Failed to fetch notes');

				const data = await response.json();
				setNotes(data.data || []);
				setTotalPages(data.totalPages || 1);
				setTotalNotes(data.total || 0);
			} catch (error) {
				console.error('Error fetching notes:', error);
				setError('Failed to load meeting minutes. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchNotes();
	}, [currentYear, currentPage]);

	// Handle year filter changes
	const handleYearChange = (year: string | null) => {
		setCurrentYear(year);
		setCurrentPage(1); // Reset to first page when changing year

		// Update URL without page reload
		const url = new URL(window.location.href);
		if (year) {
			url.searchParams.set('year', year);
		} else {
			url.searchParams.delete('year');
		}
		url.searchParams.set('page', '1');
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
					Meeting Minutes
				</h1>

				<div className="mb-6">
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => handleYearChange(null)}
							className={`px-3 py-1 rounded-md text-sm ${!currentYear
								? 'bg-foreground text-background'
								: 'border border-white/[.145] hover:bg-[#1a1a1a]'
								}`}
						>
							All
						</button>

						{years.map((year) => (
							<button
								key={year}
								onClick={() => handleYearChange(year.toString())}
								className={`px-3 py-1 rounded-md text-sm ${currentYear === year.toString()
									? 'bg-foreground text-background'
									: 'border border-white/[.145] hover:bg-[#1a1a1a]'
									}`}
							>
								{year}
							</button>
						))}
					</div>
				</div>

				{isLoading && (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				)}

				{error && (
					<div className="bg-red-900 p-4 rounded-md text-red-100 mb-6">
						{error}
					</div>
				)}

				{!isLoading && !error && (
					<div className="flex flex-col gap-4">
						{notes.length > 0 ? (
							notes.map((note) => (
								<NoteBox key={note.id} note={note} />
							))
						) : (
							<div className="text-center py-8 text-gray-400">
								No meeting minutes available for the selected criteria.
							</div>
						)}
					</div>
				)}

				{totalPages > 1 && !isLoading && (
					<div className="mt-8">
						<PaginationControls
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
				)}

				{!isLoading && (
					<div className="mt-4 text-sm text-gray-400 text-center">
						Showing {notes.length} of {totalNotes} meeting minutes
					</div>
				)}
			</div>
		</div>
	);
}