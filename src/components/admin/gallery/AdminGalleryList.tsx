'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GalleryImage } from '@/lib/types/gallery';
import PaginationControls from '@/components/common/PaginationControls';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { EditLinkButton, DeleteButton } from '@/components/Buttons';
import StatusMessage from '@/components/common/StatusMessage';
import { formatDateForDisplay } from '@/lib/utils';

interface AdminGalleryListProps {
	images: GalleryImage[];
	currentPage: number;
	totalPages: number;
	totalImages: number;
}

export default function AdminGalleryList({
	images,
	currentPage,
	totalPages,
	totalImages
}: AdminGalleryListProps) {
	const router = useRouter();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState('');

	const handlePageChange = (page: number) => {
		router.push(`/admin/gallery?page=${page}`);
	};

	const handleEditImage = (imageId: string) => {
		router.push(`/admin/gallery/edit/${imageId}`);
	};

	const openDeleteModal = (image: GalleryImage, e: React.MouseEvent) => {
		e.stopPropagation();
		setImageToDelete(image);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setImageToDelete(null);
	};

	const confirmDelete = async () => {
		if (!imageToDelete) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/admin/gallery/${imageToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete image');
			}

			// Close modal and refresh the page
			closeDeleteModal();
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete image');
		} finally {
			setIsDeleting(false);
		}
	};

	if (images.length === 0) {
		return (
			<div className="text-center py-8 text-gray-400">
				No gallery images found. Add your first image to get started.
			</div>
		);
	}

	return (
		<>
			{error && <StatusMessage type="error" message={error} />}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{images.map((image) => (
					<div
						key={image.id}
						className="relative group overflow-hidden rounded-lg cursor-pointer"
						onClick={() => handleEditImage(image.id)}
					>
						<div className="relative aspect-[3/4] w-full">
							<Image
								src={image.src}
								alt={image.alt || image.title}
								fill
								quality={90}
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
								className="object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						</div>

						<div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex p-4">
							<div className="text-white w-full min-w-0">
								<h3 className="font-semibold text-lg font-[family-name:var(--font-geist-mono)]">{image.title}</h3>
								<p className="text-xs text-gray-300 mb-1 font-[family-name:var(--font-geist-mono)]">{formatDateForDisplay(image.date)}</p>
							</div>
						</div>

						<div className="absolute bottom-3 right-4 flex gap-2 z-10">
							<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<EditLinkButton
									href={`/admin/gallery/edit/${image.id}`}
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
							<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<DeleteButton
									onClick={(e) => openDeleteModal(image, e)}
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			{totalPages > 1 && (
				<div className="mt-8">
					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
					<div className="mt-4 text-sm text-gray-400 text-center">
						Showing {images.length} of {totalImages} images
					</div>
				</div>
			)}

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Gallery Image"
				message="Are you sure you want to delete this image? This action cannot be undone."
				itemName={imageToDelete?.title}
			/>
		</>
	);
}