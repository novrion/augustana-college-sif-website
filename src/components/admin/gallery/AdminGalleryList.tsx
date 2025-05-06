'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GalleryImage } from '@/lib/types/gallery';
import PaginationControls from '@/components/common/PaginationControls';
import { DeleteConfirmationModal } from '@/components/admin/common';

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

	const formatDate = (dateString: string) => {
		if (!dateString) return '';
		const date = new Date(`${dateString}T12:00:00Z`);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			timeZone: 'UTC' // Use UTC to avoid timezone shifts
		});
	};

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
			const response = await fetch(`/api/admin/gallery/delete/${imageToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete image');
			}

			// Close modal and refresh
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
			{error && (
				<div className="text-center p-4 rounded-md text-red-700 mb-4">
					{error}
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{images.map((image) => (
					<div
						key={image.id}
						onClick={() => handleEditImage(image.id)}
						className="border border-white/[.145] rounded-lg overflow-hidden hover:bg-[#1a1a1a] transition-transform hover:scale-[1.02] cursor-pointer relative"
					>
						<div className="relative aspect-[4/3] w-full">
							<Image
								src={image.src}
								alt={image.alt || image.title}
								fill
								className="object-cover"
							/>
						</div>
						<div className="p-4">
							<h3 className="font-semibold truncate">{image.title}</h3>
							<p className="text-xs text-gray-400 mb-1">{formatDate(image.date)}</p>
							<p className="text-sm text-gray-400 line-clamp-2 h-10 mb-2">{image.description || "No description"}</p>

							<div className="absolute bottom-3 right-4">
								<button
									onClick={(e) => openDeleteModal(image, e)}
									className="text-sm text-red-500 hover:text-red-400 p-1 rounded-full"
									title="Delete image"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M3 6h18"></path>
										<path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
										<line x1="10" y1="11" x2="10" y2="17"></line>
										<line x1="14" y1="11" x2="14" y2="17"></line>
									</svg>
								</button>
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