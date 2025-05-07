'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Note } from '@/lib/types/note';
import { AdminList, AdminListItem, DeleteConfirmationModal } from '@/components/admin/common';
import PaginationControls from '@/components/common/PaginationControls';

interface NotesAdminListProps {
	notes: Note[];
	initialPage?: number;
	pageSize?: number;
}

export default function AdminNotesList({
	notes: initialNotes,
	initialPage = 1,
	pageSize = 10
}: NotesAdminListProps) {
	const [allNotes, setAllNotes] = useState(initialNotes);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(Math.ceil(initialNotes.length / pageSize));
	const [error, setError] = useState('');
	const [isLoading] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
	const [paginatedNotes, setPaginatedNotes] = useState<Note[]>([]);

	useEffect(() => {
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		setPaginatedNotes(allNotes.slice(startIndex, endIndex));
		setTotalPages(Math.ceil(allNotes.length / pageSize));
	}, [currentPage, allNotes, pageSize]);

	const formatDate = (dateString: string): string => {
		const date = new Date(`${dateString}T12:00:00Z`);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			timeZone: 'UTC'
		});
	};

	const openDeleteModal = (note: Note, e: React.MouseEvent) => {
		e.stopPropagation();
		setNoteToDelete(note);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setNoteToDelete(null);
	};

	const confirmDelete = async () => {
		if (!noteToDelete) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/admin/notes/${noteToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete note');
			}

			// Remove note from state
			const updatedNotes = allNotes.filter(note => note.id !== noteToDelete.id);
			setAllNotes(updatedNotes);

			// Update page if necessary (if we deleted the last item on a page)
			if (paginatedNotes.length === 1 && currentPage > 1) {
				setCurrentPage(currentPage - 1);
			}

			setIsDeleteModalOpen(false);
			setNoteToDelete(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete note');
		} finally {
			setIsDeleting(false);
		}
	};

	const handleNoteClick = (noteId: string) => {
		window.location.href = `/admin/notes/edit/${noteId}`;
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<>
			<AdminList
				error={error}
				isLoading={isLoading}
				isEmpty={allNotes.length === 0}
				emptyMessage="No meeting minutes found. Add your first note to get started."
			>
				{paginatedNotes.map(note => (
					<AdminListItem
						key={note.id}
						title={note.title}
						subtitle={`${formatDate(note.date)} - ${note.author}`}
						onClick={() => handleNoteClick(note.id)}
						actions={
							<>
								<Link
									href={`/admin/notes/edit/${note.id}`}
									className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
									onClick={(e) => e.stopPropagation()}
								>
									Edit
								</Link>
								<button
									onClick={(e) => openDeleteModal(note, e)}
									className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
								>
									Delete
								</button>
							</>
						}
					/>
				))}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-6">
						<PaginationControls
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
						<div className="mt-2 text-sm text-gray-400 text-center">
							Showing {paginatedNotes.length} of {allNotes.length} meeting minutes
						</div>
					</div>
				)}
			</AdminList>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Meeting Minutes"
				message="Are you sure you want to delete these meeting minutes? This action cannot be undone."
				itemName={noteToDelete?.title}
			/>
		</>
	);
}