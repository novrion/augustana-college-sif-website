'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event } from '@/lib/types/event';
import { AdminList, AdminListItem, DeleteConfirmationModal } from '@/components/admin/common';
import PaginationControls from '@/components/common/PaginationControls';

interface EventsAdminListProps {
	events: Event[];
	initialPage?: number;
	pageSize?: number;
}

export default function AdminEventsList({
	events: initialEvents,
	initialPage = 1,
	pageSize = 10
}: EventsAdminListProps) {
	const [allEvents, setAllEvents] = useState(initialEvents);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(Math.ceil(initialEvents.length / pageSize));
	const [error, setError] = useState('');
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
	const [paginatedEvents, setPaginatedEvents] = useState<Event[]>([]);

	useEffect(() => {
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		setPaginatedEvents(allEvents.slice(startIndex, endIndex));
		setTotalPages(Math.ceil(allEvents.length / pageSize));
	}, [currentPage, allEvents, pageSize]);

	const formatDate = (dateString: string) => {
		const date = new Date(`${dateString}T12:00:00Z`);

		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			timeZone: 'UTC' // Use UTC to avoid timezone shifts
		});
	};

	const openDeleteModal = (event: Event, e: React.MouseEvent) => {
		e.stopPropagation();
		setEventToDelete(event);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setEventToDelete(null);
	};

	const confirmDelete = async () => {
		if (!eventToDelete) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/admin/events/${eventToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete event');
			}

			// Remove event from state
			const updatedEvents = allEvents.filter(event => event.id !== eventToDelete.id);
			setAllEvents(updatedEvents);

			// Update page if necessary (if we deleted the last item on a page)
			if (paginatedEvents.length === 1 && currentPage > 1) {
				setCurrentPage(currentPage - 1);
			}

			setIsDeleteModalOpen(false);
			setEventToDelete(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete event');
		} finally {
			setIsDeleting(false);
		}
	};

	const handleEventClick = (eventId: string) => {
		window.location.href = `/admin/events/edit/${eventId}`;
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<>
			<AdminList
				error={error}
				isLoading={false}
				isEmpty={allEvents.length === 0}
				emptyMessage="No events found. Add your first event to get started."
			>
				{paginatedEvents.map(event => (
					<AdminListItem
						key={event.id}
						title={event.title || `Speaker: ${event.speaker_name}`}
						subtitle={
							<div className="flex items-center gap-4">
								<span>{formatDate(event.date)} - {event.speaker_name}</span>
								<span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-200">
									{event.location}
								</span>
							</div>
						}
						onClick={() => handleEventClick(event.id)}
						actions={
							<>
								<Link
									href={`/admin/events/edit/${event.id}`}
									className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
									onClick={(e) => e.stopPropagation()}
								>
									Edit
								</Link>
								<button
									onClick={(e) => openDeleteModal(event, e)}
									className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
								>
									Delete
								</button>
							</>
						}
					/>
				))}

				{totalPages > 1 && (
					<div className="mt-6">
						<PaginationControls
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
						<div className="mt-2 text-sm text-gray-400 text-center">
							Showing {paginatedEvents.length} of {allEvents.length} events
						</div>
					</div>
				)}
			</AdminList>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Event"
				message="Are you sure you want to delete this event? This action cannot be undone."
				itemName={eventToDelete?.title || eventToDelete?.speaker_name}
			/>
		</>
	);
}