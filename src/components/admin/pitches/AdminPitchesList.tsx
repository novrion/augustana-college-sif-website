'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pitch } from '@/lib/types/pitch';
import { AdminList, AdminListItem } from '@/components/admin/common';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import PaginationControls from '@/components/common/PaginationControls';
import { EditLinkButton, DeleteButton } from '@/components/Buttons';
import { formatDateForDisplay, formatCurrency } from '@/lib/utils';

interface AdminPitchesListProps {
	pitches: Pitch[];
	initialPage?: number;
	pageSize?: number;
}

export default function AdminPitchesList({
	pitches: initialPitches,
	initialPage = 1,
	pageSize = 10
}: AdminPitchesListProps) {
	const router = useRouter();
	const [allPitches, setAllPitches] = useState(initialPitches);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(Math.ceil(initialPitches.length / pageSize));
	const [error, setError] = useState('');
	const [paginatedPitches, setPaginatedPitches] = useState<Pitch[]>([]);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [pitchToDelete, setPitchToDelete] = useState<Pitch | null>(null);

	useEffect(() => {
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		setPaginatedPitches(allPitches.slice(startIndex, endIndex));
		setTotalPages(Math.ceil(allPitches.length / pageSize));
	}, [currentPage, allPitches, pageSize]);

	const openDeleteModal = (pitch: Pitch, e: React.MouseEvent) => {
		e.stopPropagation();
		setPitchToDelete(pitch);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setPitchToDelete(null);
	};

	const confirmDelete = async () => {
		if (!pitchToDelete) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/admin/pitches/${pitchToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete pitch');
			}

			// Remove pitch from state
			const updatedPitches = allPitches.filter(pitch => pitch.id !== pitchToDelete.id);
			setAllPitches(updatedPitches);

			// Update page if necessary
			if (paginatedPitches.length === 1 && currentPage > 1) {
				setCurrentPage(currentPage - 1);
			}

			setIsDeleteModalOpen(false);
			setPitchToDelete(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete pitch');
		} finally {
			setIsDeleting(false);
		}
	};

	const handlePitchClick = (pitchId: string) => {
		router.push(`/admin/pitches/edit/${pitchId}`);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<>
			<AdminList
				error={error}
				isEmpty={allPitches.length === 0}
				emptyMessage="No stock pitches found. Add your first pitch to get started."
			>
				{paginatedPitches.map(pitch => (
					<AdminListItem
						key={pitch.id}
						title={pitch.title}
						subtitle={
							<div className="flex items-center gap-4">
								<span>{formatDateForDisplay(pitch.date)} - {pitch.analyst}</span>
								<span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-200">
									{pitch.symbol}
								</span>
								<span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${pitch.is_buy
									? 'bg-green-900 text-green-200'
									: 'bg-red-900 text-red-200'
									}`}>
									{pitch.is_buy ? 'BUY' : 'SELL'} {formatCurrency(pitch.amount)}
								</span>
							</div>
						}
						onClick={() => handlePitchClick(pitch.id)}
						actions={
							<>
								<EditLinkButton
									href={`/admin/pitches/edit/${pitch.id}`}
									onClick={(e) => e.stopPropagation()}
								/>
								<DeleteButton
									onClick={(e) => openDeleteModal(pitch, e)}
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
							Showing {paginatedPitches.length} of {allPitches.length} stock pitches
						</div>
					</div>
				)}
			</AdminList>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Stock Pitch"
				message="Are you sure you want to delete this stock pitch? This action cannot be undone."
				itemName={pitchToDelete?.title}
			/>
		</>
	);
}