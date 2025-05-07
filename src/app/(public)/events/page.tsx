'use client';

import { useState, useEffect } from 'react';
import EventBox from '@/components/events/EventBox';
import EventCalendar from '@/components/events/EventCalendar';
import PaginationControls from '@/components/common/PaginationControls';
import { Event } from '@/lib/types/event';

export default function EventsPage() {
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
	const [pastEvents, setPastEvents] = useState<Event[]>([]);
	const [activeTab, setActiveTab] = useState('upcoming');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalEvents, setTotalEvents] = useState(0);

	useEffect(() => {
		const fetchEvents = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const upcomingResponse = await fetch('/api/events?type=upcoming');
				if (!upcomingResponse.ok) { throw new Error('Failed to fetch upcoming events'); }
				const upcomingData = await upcomingResponse.json();
				setUpcomingEvents(upcomingData || []);

				if (activeTab === 'past') {
					const pastResponse = await fetch(`/api/events?type=past&page=${currentPage}`);
					if (!pastResponse.ok) { throw new Error('Failed to fetch past events'); }
					const pastData = await pastResponse.json();
					setPastEvents(pastData.data || []);
					setTotalPages(pastData.totalPages || 1);
					setTotalEvents(pastData.total || 0);
				}
			} catch (error) {
				console.error('Error fetching events:', error);
				setError('Failed to load events. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvents();
	}, [activeTab, currentPage]);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
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

				{/* Calendar */}
				<div className="mb-10">
					<EventCalendar
						upcomingEvents={upcomingEvents}
						pastEvents={pastEvents}
					/>
				</div>

				{/* List view */}
				<div className="mt-12">
					<div className="flex border-b border-white/[.145] font-[family-name:var(--font-geist-mono)] mb-6">
						<button
							className={`py-2 px-4 font-medium ${activeTab === 'upcoming'
								? 'border-b-2 border-blue-500'
								: 'text-gray-400'
								}`}
							onClick={() => handleTabChange('upcoming')}
						>
							Upcoming Speakers
						</button>
						<button
							className={`py-2 px-4 font-medium ${activeTab === 'past'
								? 'border-b-2 border-blue-500'
								: 'text-gray-400'
								}`}
							onClick={() => handleTabChange('past')}
						>
							Past Speakers
						</button>
					</div>

					{isLoading && (
						<div className="flex justify-center py-8">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
						</div>
					)}

					{error && !isLoading && (
						<div className="text-center p-4 rounded-md text-red-700 mb-6 font-[family-name:var(--font-geist-mono)]">
							{error}
						</div>
					)}

					{!isLoading && !error && (
						<>
							{eventsToShow.length > 0 ? (
								<div className="space-y-6">
									{eventsToShow.map((event) => (
										<EventBox key={event.id} event={event} />
									))}
								</div>
							) : (
								<div className="text-center py-8 text-gray-400 font-[family-name:var(--font-geist-mono)]">
									No {activeTab} speaker events found.
								</div>
							)}

							{/* Pagination for past events only */}
							{activeTab === 'past' && totalPages > 1 && (
								<div className="mt-8">
									<PaginationControls
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={handlePageChange}
									/>
									<div className="mt-4 text-sm text-gray-400 text-center font-[family-name:var(--font-geist-mono)]">
										Showing {pastEvents.length} of {totalEvents} past events
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}