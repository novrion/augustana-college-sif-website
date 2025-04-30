'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function GalleryAdminList({ galleryImages }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	// State for delete confirmation modal
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [imageToDelete, setImageToDelete] = useState(null);

	const openDeleteModal = (image) => {
		setImageToDelete(image);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setImageToDelete(null);
	};

	const confirmDeleteImage = async () => {
		if (!imageToDelete) return;

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/gallery/images/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					imageId: imageToDelete.id,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete image');
			}

			// Refresh the page
			closeDeleteModal();
			router.refresh();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle image reordering
	const handleReorder = async (imageId, direction) => {
		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/gallery/images/reorder`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					imageId,
					direction,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to reorder image');
			}

			// Refresh the page
			router.refresh();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			{galleryImages.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					No gallery images found. Add a new image to get started.
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{galleryImages.map((image, index) => (
						<div key={image.id} className="border border-black/[.08] dark:border-white/[.145] rounded-lg overflow-hidden relative">
							{/* Reorder Controls - Absolute positioned on the left */}
							<div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col bg-black bg-opacity-50 rounded p-1 z-10">
								<button
									onClick={() => handleReorder(image.id, 'up')}
									disabled={index === 0 || isLoading}
									className={`text-white p-1 rounded hover:bg-white/20 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
									title="Move up"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M12 19V5M5 12l7-7 7 7" />
									</svg>
								</button>
								<button
									onClick={() => handleReorder(image.id, 'down')}
									disabled={index === galleryImages.length - 1 || isLoading}
									className={`text-white p-1 rounded hover:bg-white/20 ${index === galleryImages.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
									title="Move down"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M12 5v14M5 12l7 7 7-7" />
									</svg>
								</button>
							</div>

							<div className="relative aspect-[4/3] w-full">
								<Image
									src={image.src}
									alt={image.alt || image.title}
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-4">
								<h3 className="font-semibold mb-1">{image.title}</h3>
								<p className="text-sm text-gray-500 mb-4 line-clamp-2">{image.description}</p>
								<div className="flex justify-between items-center">
									<span className="text-xs text-gray-400">Order: {image.order_index}</span>
									<button
										onClick={() => openDeleteModal(image)}
										disabled={isLoading}
										className="text-red-500 hover:underline text-sm"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDeleteImage}
				title="Delete Gallery Image"
				message="Are you sure you want to delete this image?"
				itemName={imageToDelete?.title}
				isLoading={isLoading}
			/>
		</div>
	);
}