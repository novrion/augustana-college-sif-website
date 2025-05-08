'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Newsletter } from '@/lib/types/newsletter';
import { AdminList, AdminListItem } from '@/components/admin/common';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import PaginationControls from '@/components/common/PaginationControls';
import { EditLinkButton, DeleteButton } from "@/components/Buttons";
import { formatDateForDisplay } from '@/lib/utils';

interface NewsletterAdminListProps {
	newsletters: Newsletter[];
	initialPage?: number;
	pageSize?: number;
}

export default function AdminNewsletterList({
	newsletters: initialNewsletters,
	initialPage = 1,
	pageSize = 10
}: NewsletterAdminListProps) {
	const router = useRouter();
	const [allNewsletters, setAllNewsletters] = useState(initialNewsletters);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(Math.ceil(initialNewsletters.length / pageSize));
	const [error, setError] = useState('');
	const [paginatedNewsletters, setPaginatedNewsletters] = useState<Newsletter[]>([]);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [newsletterToDelete, setNewsletterToDelete] = useState<Newsletter | null>(null);

	useEffect(() => {
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		setPaginatedNewsletters(allNewsletters.slice(startIndex, endIndex));
		setTotalPages(Math.ceil(allNewsletters.length / pageSize));
	}, [currentPage, allNewsletters, pageSize]);

	const hasAttachments = (newsletter: Newsletter): boolean => {
		return (newsletter.attachments && newsletter.attachments.length > 0) as boolean;
	};

	const openDeleteModal = (newsletter: Newsletter, e: React.MouseEvent) => {
		e.stopPropagation();
		setNewsletterToDelete(newsletter);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setNewsletterToDelete(null);
	};

	const confirmDelete = async () => {
		if (!newsletterToDelete) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/admin/newsletter/${newsletterToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete newsletter');
			}

			// Update state after successful delete
			const updatedNewsletters = allNewsletters.filter(
				newsletter => newsletter.id !== newsletterToDelete.id
			);
			setAllNewsletters(updatedNewsletters);

			// Handle pagination edge case
			if (paginatedNewsletters.length === 1 && currentPage > 1) {
				setCurrentPage(currentPage - 1);
			}

			closeDeleteModal();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete newsletter');
		} finally {
			setIsDeleting(false);
		}
	};

	const handleNewsletterClick = (newsletterId: string) => {
		router.push(`/admin/newsletter/edit/${newsletterId}`);
	};

	return (
		<>
			<AdminList
				error={error}
				isEmpty={allNewsletters.length === 0}
				emptyMessage="No newsletters found. Add your first newsletter to get started."
			>
				{paginatedNewsletters.map(newsletter => (
					<AdminListItem
						key={newsletter.id}
						title={newsletter.title}
						subtitle={
							<div className="flex items-center gap-4">
								<span>{formatDateForDisplay(newsletter.date)} - {newsletter.author}</span>
								{hasAttachments(newsletter) && (
									<span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-900 text-blue-200">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
										</svg>
										{newsletter.attachments?.length} attachment{newsletter.attachments?.length !== 1 ? 's' : ''}
									</span>
								)}
							</div>
						}
						onClick={() => handleNewsletterClick(newsletter.id)}
						actions={
							<>
								<EditLinkButton
									href={`/admin/newsletter/edit/${newsletter.id}`}
									onClick={(e) => e.stopPropagation()}
								/>
								<DeleteButton
									onClick={(e) => openDeleteModal(newsletter, e)}
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
							onPageChange={setCurrentPage}
						/>
						<div className="mt-2 text-sm text-gray-400 text-center">
							Showing {paginatedNewsletters.length} of {allNewsletters.length} newsletters
						</div>
					</div>
				)}
			</AdminList>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Newsletter"
				message="Are you sure you want to delete this newsletter? This action cannot be undone."
				itemName={newsletterToDelete?.title}
			/>
		</>
	);
}