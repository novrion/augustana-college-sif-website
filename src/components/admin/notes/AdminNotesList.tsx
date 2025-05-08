'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/lib/types/note';
import { AdminList, AdminListItem } from '@/components/admin/common';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import PaginationControls from '@/components/common/PaginationControls';
import { EditLinkButton, DeleteButton } from '@/components/Buttons';
import { formatDateForDisplay } from '@/lib/utils';

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
						subtitle={`${formatDateForDisplay(note.date)} - ${note.author}`}
						onClick={() => handleNoteClick(note.id)}
						actions={
							<>
								<EditLinkButton
									href={`/admin/notes/edit/${note.id}`}
									onClick={(e) => e.stopPropagation()}
								/>
								<DeleteButton
									onClick={(e) => openDeleteModal(note, e)}
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