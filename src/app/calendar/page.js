// app/calendar/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Improved SpeakerEventBox component with proper date handling
function SpeakerEventBox({ event }) {
	const [isExpanded, setIsExpanded] = useState(false);

	// Function to check if an event is past
	const isPastEvent = (dateString) => {
		// Get the event date and set it to the end of the day (23:59:59)
		const eventDate = new Date(dateString + 'T23:59:59');

		// Get current date
		const now = new Date();

		// Compare - event is past only if the end of its day has passed
		return eventDate < now;
	};

	const isPast = isPastEvent(event.event_date);

	const formatDate = (dateString) => {
		// Create a date object with the date part only, using the local timezone
		const date = new Date(dateString + 'T00:00:00');
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	return (
		<div className={`rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 ${isPast ? "border-l-4 border-l-gray-400" : "border-l-4 border-l-blue-500"}`}>
			<div
				className="flex justify-between items-start cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div>
					<h2 className="text-xl font-semibold font-[family-name:var(--font-geist-mono)]">
						{event.title || `Speaker: ${event.speaker_name}`}
					</h2>
					<div className="mt-1">
						<p className="font-medium">
							{event.speaker_name}
							{event.role && event.company && (
								<span>, {event.role} at {event.company}</span>
							)}
							{event.role && !event.company && (
								<span>, {event.role}</span>
							)}
							{!event.role && event.company && (
								<span>, {event.company}</span>
							)}
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
							{formatDate(event.event_date)}
						</p>
						{!isPast && (
							<span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-semibold">
								Upcoming
							</span>
						)}
					</div>
				</div>
				<button
					className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
					aria-label={isExpanded ? "Collapse" : "Expand"}
				>
					{isExpanded ? (
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="18 15 12 9 6 15"></polyline>
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					)}
				</button>
			</div>

			{isExpanded && (
				<div className="mt-4 pt-4 border-t border-black/[.08] dark:border-white/[.145]">
					<div className="prose prose-sm max-w-none dark:prose-invert">
						<p className="mb-4">{event.description}</p>
						<div className="space-y-2">
							<div><strong>Location:</strong> {event.location}</div>
							<div><strong>Time:</strong> {event.time}</div>
							{event.contact && <div><strong>Contact:</strong> {event.contact}</div>}
						</div>
					</div>

					{!isPast && event.contact && (
						<div className="mt-4 pt-4 border-t border-black/[.08] dark:border-white/[.145]">
							<h3 className="text-md font-semibold mb-2">Have questions about this event?</h3>
							<p>Please contact: {event.contact}</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default function Calendar() {
	const [speakers, setSpeakers] = useState([]);
	const [activeTab, setActiveTab] = useState('upcoming');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalSpeakers, setTotalSpeakers] = useState(0);

	// Fetch speakers based on active tab
	useEffect(() => {
		const fetchSpeakers = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// Reset to page 1 when changing tabs
				if (activeTab === 'upcoming') {
					setCurrentPage(1);
				}

				const pageParam = activeTab === 'past' ? `&page=${currentPage}` : '';
				const response = await fetch(`/api/speakers?type=${activeTab}${pageParam}`);

				if (!response.ok) {
					throw new Error('Failed to fetch speakers');
				}

				const data = await response.json();

				if (activeTab === 'past') {
					setSpeakers(data.data || []);
					setTotalPages(data.totalPages || 1);
					setTotalSpeakers(data.total || 0);
				} else {
					setSpeakers(data || []);
				}
			} catch (error) {
				console.error('Error fetching speakers:', error);
				setError('Failed to load speaker events. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchSpeakers();
	}, [activeTab, currentPage]);

	// Function to handle page changes
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					Guest Speakers
				</h1>
				<p className="text-lg mb-8 font-[family-name:var(--font-geist-mono)]">
					Industry professionals sharing insights with our fund.
				</p>

				{/* Tabs for filtering */}
				<div className="flex border-b border-black/[.08] dark:border-white/[.145] mb-8 font-[family-name:var(--font-geist-mono)]">
					<button
						className={`cursor-pointer py-2 px-4 font-medium ${activeTab === 'upcoming'
							? 'border-b-2 border-blue-500'
							: 'text-gray-500 dark:text-gray-400'
							}`}
						onClick={() => {
							setActiveTab('upcoming');
							setCurrentPage(1);
						}}
					>
						Upcoming Speakers
					</button>
					<button
						className={`cursor-pointer py-2 px-4 font-medium ${activeTab === 'past'
							? 'border-b-2 border-blue-500'
							: 'text-gray-500 dark:text-gray-400'
							}`}
						onClick={() => {
							setActiveTab('past');
							setCurrentPage(1);
						}}
					>
						Past Speakers
					</button>
				</div>

				{/* Display loading state */}
				{isLoading && (
					<div className="flex justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				)}

				{/* Display error state */}
				{error && (
					<div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
						{error}
					</div>
				)}

				{/* Display filtered events */}
				{!isLoading && !error && (
					<div className="space-y-6">
						{speakers.length > 0 ? (
							speakers.map((event) => (
								<SpeakerEventBox key={event.id} event={event} />
							))
						) : (
							<div className="text-center py-8">
								<p className="text-gray-500 dark:text-gray-400">
									No {activeTab} speaker events found.
								</p>
							</div>
						)}
					</div>
				)}

				{/* Pagination controls - Only show for past events */}
				{activeTab === 'past' && totalPages > 1 && !isLoading && (
					<div className="flex justify-center mt-8">
						<div className="flex items-center gap-2">
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className={`rounded-full border border-solid p-2 ${currentPage === 1
									? 'border-gray-200 text-gray-400 cursor-not-allowed'
									: 'border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
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
									: 'border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
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

				{/* Display total count for past events */}
				{activeTab === 'past' && totalSpeakers > 0 && !isLoading && (
					<div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
						Showing {speakers.length} of {totalSpeakers} past speakers
					</div>
				)}

				{/* Contact section */}
				<div className="mt-12 border-t border-black/[.08] dark:border-white/[.145] pt-8">
					<h2 className="text-xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
						Interested in being a guest speaker?
					</h2>
					<p className="mb-6">
						We regularly invite industry professionals to share insights with our student fund members.
						If you're interested in speaking at one of our events, please contact us.
					</p>
					<Link
						href="/contact"
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-fit"
					>
						Contact Us
					</Link>
				</div>
			</div>
		</div>
	);
}