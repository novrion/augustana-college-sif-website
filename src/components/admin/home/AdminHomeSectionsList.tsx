'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomeSection } from '@/lib/types';
import { AdminList, AdminListItemWithOrdering } from '@/components/admin/common';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { EditLinkButton, DeleteButton } from '@/components/Buttons';

interface AdminHomeSectionsListProps {
	homeSections: HomeSection[];
}

export default function AdminHomeSectionsList({ homeSections }: AdminHomeSectionsListProps) {
	const router = useRouter();
	const [sections, setSections] = useState(homeSections);
	const [isReordering, setIsReordering] = useState(false);
	const [error, setError] = useState('');
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [sectionToDelete, setSectionToDelete] = useState<HomeSection | null>(null);

	const handleReorder = async (id: string, direction: 'up' | 'down') => {
		// Find current section position
		const currentIndex = sections.findIndex(section => section.id === id);
		if ((direction === 'up' && currentIndex === 0) ||
			(direction === 'down' && currentIndex === sections.length - 1)) {
			return; // Already at boundary
		}

		// Calculate new position and update UI optimistically
		const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
		const newSections = [...sections];
		const [movedSection] = newSections.splice(currentIndex, 1);
		newSections.splice(newIndex, 0, movedSection);

		// Update order indexes
		const updatedSections = newSections.map((section, index) => ({
			...section,
			order_index: index + 1
		}));

		setSections(updatedSections);

		try {
			setIsReordering(true);
			setError('');

			const response = await fetch(`/api/admin/home/reorder/${id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ direction })
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update section order');
			}

			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update section order');
			setSections(homeSections); // Revert to original order on error
		} finally {
			setIsReordering(false);
		}
	};

	const openDeleteModal = (section: HomeSection, e: React.MouseEvent) => {
		e.stopPropagation();
		setSectionToDelete(section);
		setIsDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (!sectionToDelete) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/admin/home/${sectionToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete section');
			}

			setSections(sections.filter(section => section.id !== sectionToDelete.id));
			setIsDeleteModalOpen(false);
			setSectionToDelete(null);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete section');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<AdminList
				error={error}
				isLoading={isReordering}
				loadingMessage="Saving new order..."
				isEmpty={sections.length === 0}
				emptyMessage="No home sections found. Add your first section to get started."
			>
				{sections.map((section, index) => (
					<AdminListItemWithOrdering
						key={section.id}
						title={section.title}
						onClick={() => router.push(`/admin/home/edit/${section.id}`)}
						onMoveUp={() => handleReorder(section.id, 'up')}
						onMoveDown={() => handleReorder(section.id, 'down')}
						canMoveUp={index !== 0}
						canMoveDown={index !== sections.length - 1}
						isReordering={isReordering}
						actions={
							<>
								<EditLinkButton
									href={`/admin/home/edit/${section.id}`}
									onClick={(e) => e.stopPropagation()}
								/>
								<DeleteButton
									onClick={(e) => openDeleteModal(section, e)}
								/>
							</>
						}
					/>
				))}
			</AdminList>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Section"
				message="Are you sure you want to delete this section? This action cannot be undone."
				itemName={sectionToDelete?.title}
			/>
		</>
	);
}