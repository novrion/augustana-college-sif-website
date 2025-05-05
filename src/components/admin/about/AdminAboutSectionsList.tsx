'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AboutSection } from '@/lib/types/about';
import { AdminList, AdminListItemWithOrdering, DeleteConfirmationModal } from '@/components/admin/common';

interface AdminAboutSectionsListProps {
	aboutSections: AboutSection[];
}

export default function AdminAboutSectionsList({ aboutSections }: AdminAboutSectionsListProps) {
	const [sections, setSections] = useState(aboutSections);
	const [isReordering, setIsReordering] = useState(false);
	const [error, setError] = useState('');

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [sectionToDelete, setSectionToDelete] = useState<AboutSection | null>(null);

	const handleReorder = async (id: string, direction: 'up' | 'down') => {
		const currentIndex = sections.findIndex(section => section.id === id);
		if (
			(direction === 'up' && currentIndex === 0) ||
			(direction === 'down' && currentIndex === sections.length - 1)
		) {
			return; // Can't move further in this direction
		}

		const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
		const newSections = [...sections];
		const [movedSection] = newSections.splice(currentIndex, 1);
		newSections.splice(newIndex, 0, movedSection);

		const updatedSections = newSections.map((section, index) => ({
			...section,
			order_index: index + 1
		}));

		setSections(updatedSections);

		try {
			setIsReordering(true);
			setError('');

			const response = await fetch(`/api/admin/about/reorder/${id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ direction })
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update section order');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update section order');
			setSections(aboutSections); // Revert to original order
		} finally {
			setIsReordering(false);
		}
	};

	const openDeleteModal = (section: AboutSection, e: React.MouseEvent) => {
		e.stopPropagation();
		setSectionToDelete(section);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setSectionToDelete(null);
	};

	const confirmDelete = async () => {
		if (!sectionToDelete) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/admin/about/${sectionToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete section');
			}

			// Remove section from state
			setSections(sections.filter(section => section.id !== sectionToDelete.id));
			setIsDeleteModalOpen(false);
			setSectionToDelete(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete section');
		} finally {
			setIsDeleting(false);
		}
	};

	const handleSectionClick = (sectionId: string) => {
		window.location.href = `/admin/about/edit/${sectionId}`;
	};

	return (
		<>
			<AdminList
				error={error}
				isLoading={isReordering}
				loadingMessage="Saving new order..."
				isEmpty={sections.length === 0}
				emptyMessage="No about sections found. Add your first section to get started."
			>
				{sections.map((section, index) => (
					<AdminListItemWithOrdering
						key={section.id}
						title={section.title}
						onClick={() => handleSectionClick(section.id)}
						onMoveUp={() => handleReorder(section.id, 'up')}
						onMoveDown={() => handleReorder(section.id, 'down')}
						canMoveUp={index !== 0}
						canMoveDown={index !== sections.length - 1}
						isReordering={isReordering}
						actions={
							<>
								<Link
									href={`/admin/about/edit/${section.id}`}
									className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
									onClick={(e) => e.stopPropagation()}
								>
									Edit
								</Link>
								<button
									onClick={(e) => openDeleteModal(section, e)}
									className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
								>
									Delete
								</button>
							</>
						}
					/>
				))}
			</AdminList>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Section"
				message="Are you sure you want to delete this section? This action cannot be undone."
				itemName={sectionToDelete?.title}
			/>
		</>
	);
}