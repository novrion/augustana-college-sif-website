'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/lib/types/event';
import { AdminList, AdminListItem } from '@/components/admin/common';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import PaginationControls from '@/components/common/PaginationControls';
import { EditLinkButton, DeleteButton } from "@/components/Buttons";
import { formatDateForDisplay } from '@/lib/utils';

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
	const router = useRouter();
	const [allEvents, setAllEvents] = useState(initialEvents);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(Math.ceil(initialEvents.length / pageSize));
	const [error, setError] = useState('');
	const [paginatedEvents, setPaginatedEvents] = useState<Event[]>([]);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

	useEffect(() => {
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		setPaginatedEvents(allEvents.slice(startIndex, endIndex));
		setTotalPages(Math.ceil(allEvents.length / pageSize));
	}, [currentPage, allEvents, pageSize]);

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

			// Update state after successful delete
			const updatedEvents = allEvents.filter(event => event.id !== eventToDelete.id);
			setAllEvents(updatedEvents);

			// Handle pagination edge case
			if (paginatedEvents.length === 1 && currentPage > 1) {
				setCurrentPage(currentPage - 1);
			}

			setIsDeleteModalOpen(false);
			setEventToDelete(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete speaker');
		} finally {
			setIsDeleting(false);
		}
	};

	const handleEventClick = (eventId: string) => {
		router.push(`/admin/events/edit/${eventId}`);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<>
			<AdminList
				error={error}
				isEmpty={allEvents.length === 0}
				emptyMessage="No speakers found. Add your first speaker to get started."
			>
				{paginatedEvents.map(event => (
					<AdminListItem
						key={event.id}
						title={event.title || event.speaker_name}
						subtitle={
							<div className="flex items-center gap-4">
								<span>{formatDateForDisplay(event.date)}{event.title ? ` - ${event.speaker_name}` : ''}</span>
								<span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-200">
									{event.location}
								</span>
							</div>
						}
						onClick={() => handleEventClick(event.id)}
						actions={
							<>
								<EditLinkButton
									href={`/admin/events/edit/${event.id}`}
									onClick={(e) => e.stopPropagation()}
								/>
								<DeleteButton
									onClick={(e) => openDeleteModal(event, e)}
								/>
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
							Showing {paginatedEvents.length} of {allEvents.length} speakers
						</div>
					</div>
				)}
			</AdminList>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Speaker"
				message="Are you sure you want to delete this speaker? This action cannot be undone."
				itemName={eventToDelete?.title || eventToDelete?.speaker_name}
			/>
		</>
	);
}