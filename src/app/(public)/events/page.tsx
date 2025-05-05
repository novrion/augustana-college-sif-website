'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventBox from '@/components/events/EventBox';
import EventCalendar from '@/components/events/EventCalendar';
import { Event } from '@/lib/types/event';

export default function EventsPage() {
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
	const [pastEvents, setpastEvents] = useState<Event[]>([]);
	const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
	const [activeTab, setActiveTab] = useState('upcoming');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalEvents, setTotalEvents] = useState(0);

	useEffect(() => {
		const fetchAllEvents = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const upcomingResponse = await fetch('/api/events?type=upcoming');
				if (!upcomingResponse.ok) {
					throw new Error('Failed to fetch upcoming events');
				}
				const upcomingData = await upcomingResponse.json();
				setUpcomingEvents(upcomingData || []);

				const pastResponse = await fetch(`/api/events?type=past&page=${currentPage}`);
				if (!pastResponse.ok) {
					throw new Error('Failed to fetch past events');
				}
				const pastData = await pastResponse.json();
				setpastEvents(pastData.data || []);
				setTotalPages(pastData.totalPages || 1);
				setTotalEvents(pastData.total || 0);
			} catch (error) {
				console.error('Error fetching events:', error);
				setError('Failed to load events. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllEvents();
	}, [currentPage]);

	// Only update past events when page changes for pagination
	useEffect(() => {
		const fetchPastEvents = async () => {
			if (activeTab !== 'past') return;

			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(`/api/events?type=past&page=${currentPage}`);
				if (!response.ok) {
					throw new Error('Failed to fetch past events');
				}
				const data = await response.json();
				setpastEvents(data.data || []);
				setTotalPages(data.totalPages || 1);
				setTotalEvents(data.total || 0);
			} catch (error) {
				console.error('Error fetching past events:', error);
				setError('Failed to load past events. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchPastEvents();
	}, [activeTab, currentPage]);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
		setCurrentPage(1);
	};

	const handleViewModeChange = (mode: 'list' | 'calendar') => {
		setViewMode(mode);
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const eventsToShow = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					Guest Speakers
				</h1>
				<p className="text-lg mb-8 font-[family-name:var(--font-geist-mono)]">
					Industry professionals sharing insights with our fund.
				</p>

				<div className="flex justify-between mb-8">
					<div className="flex border-b border-white/[.145] font-[family-name:var(--font-geist-mono)]">
						<button
							className={`cursor-pointer py-2 px-4 font-medium ${activeTab === 'upcoming'
								? 'border-b-2 border-blue-500'
								: 'text-gray-400'
								}`}
							onClick={() => handleTabChange('upcoming')}
						>
							Upcoming Speakers
						</button>
						<button
							className={`cursor-pointer py-2 px-4 font-medium ${activeTab === 'past'
								? 'border-b-2 border-blue-500'
								: 'text-gray-400'
								}`}
							onClick={() => handleTabChange('past')}
						>
							Past Speakers
						</button>
					</div>

					<div className="flex border border-white/[.145] rounded-md overflow-hidden">
						<button
							className={`px-3 py-1 ${viewMode === 'list'
								? 'bg-foreground text-background'
								: 'hover:bg-[#1a1a1a]'
								}`}
							onClick={() => handleViewModeChange('list')}
						>
							List
						</button>
						<button
							className={`px-3 py-1 ${viewMode === 'calendar'
								? 'bg-foreground text-background'
								: 'hover:bg-[#1a1a1a]'
								}`}
							onClick={() => handleViewModeChange('calendar')}
						>
							Calendar
						</button>
					</div>
				</div>

				{isLoading && (
					<div className="flex justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				)}

				{error && (
					<div className="bg-red-900 p-4 rounded-md text-red-100 mb-6">
						{error}
					</div>
				)}

				{!isLoading && !error && (
					<>
						{/* Show list view based on active tab */}
						{viewMode === 'list' && (
							<div className="space-y-6">
								{eventsToShow.length > 0 ? (
									eventsToShow.map((event) => (
										<EventBox key={event.id} event={event} />
									))
								) : (
									<div className="text-center py-8 text-gray-400">
										No {activeTab} speaker events found.
									</div>
								)}
							</div>
						)}

						{/* Show calendar view with all events */}
						{viewMode === 'calendar' && (
							<EventCalendar
								upcomingEvents={upcomingEvents}
								pastEvents={pastEvents}
							/>
						)}
					</>
				)}

				{/* Pagination controls - Only show for past events in list view */}
				{viewMode === 'list' && activeTab === 'past' && totalPages > 1 && !isLoading && (
					<div className="flex justify-center mt-8">
						<div className="flex items-center gap-2">
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className={`rounded-full border border-solid p-2 ${currentPage === 1
									? 'border-gray-200 text-gray-400 cursor-not-allowed'
									: 'border-white/[.145] hover:bg-[#1a1a1a]'
									}`}
								aria-label="Previous page"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="15 18 9 12 15 6"></polyline>
								</svg>
							</button>

							<span className="text-sm">
								Page {currentPage} of {totalPages}
							</span>

							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className={`rounded-full border border-solid p-2 ${currentPage === totalPages
									? 'border-gray-200 text-gray-400 cursor-not-allowed'
									: 'border-white/[.145] hover:bg-[#1a1a1a]'
									}`}
								aria-label="Next page"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</button>
						</div>
					</div>
				)}

				{viewMode === 'list' && activeTab === 'past' && totalEvents > 0 && !isLoading && (
					<div className="mt-4 text-sm text-gray-400 text-center">
						Showing {pastEvents.length} of {totalEvents} past speakers
					</div>
				)}

				<div className="mt-12 border-t border-white/[.145] pt-8">
					<h2 className="text-xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
						Interested in being a guest speaker?
					</h2>
					<p className="mb-6 font-[family-name:var(--font-geist-sans)]">
						We regularly invite industry professionals to share insights with our student fund members.
						If you&apos;re interested in speaking at one of our events, please contact us.
					</p>
					<Link
						href="/contact"
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] font-medium text-sm h-10 px-4 w-fit"
					>
						Contact Us
					</Link>
				</div>
			</div>
		</div>
	);
}