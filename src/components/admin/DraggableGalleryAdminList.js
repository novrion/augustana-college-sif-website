'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function DraggableGalleryAdminList({ galleryImages }) {
	const [images, setImages] = useState([...galleryImages]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isDragging, setIsDragging] = useState(false);
	const [draggedItem, setDraggedItem] = useState(null);
	const [hasChanges, setHasChanges] = useState(false);
	const router = useRouter();
	const dragItem = useRef(null);
	const dragNode = useRef(null);
	const dragPreviewRef = useRef(null);

	// State for delete confirmation modal
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [imageToDelete, setImageToDelete] = useState(null);

	// When galleryImages prop changes (e.g., after a delete), update local state
	useEffect(() => {
		setImages([...galleryImages]);
	}, [galleryImages]);

	// Create a simple drag preview element on mount
	useEffect(() => {
		// Create the drag preview element
		const dragPreview = document.createElement('div');
		dragPreview.style.position = 'absolute';
		dragPreview.style.top = '-1000px';
		dragPreview.style.width = '100px';
		dragPreview.style.height = '120px';
		dragPreview.style.backgroundColor = '#01030b';
		dragPreview.style.border = '2px solid #01030b';
		dragPreview.style.borderRadius = '4px';
		dragPreview.style.display = 'none';
		dragPreview.id = 'gallery-drag-preview';
		document.body.appendChild(dragPreview);

		dragPreviewRef.current = dragPreview;

		// Cleanup on unmount
		return () => {
			if (dragPreviewRef.current) {
				document.body.removeChild(dragPreviewRef.current);
			}
		};
	}, []);

	const handleDragStart = (e, index) => {
		dragItem.current = index;
		dragNode.current = e.currentTarget;

		// Add delay to ensure drag image is properly set
		setTimeout(() => {
			setIsDragging(true);
			setDraggedItem(index);
		}, 0);

		// Create a clean drag preview with just the image
		const image = images[index];
		const dragPreview = dragPreviewRef.current;

		if (dragPreview) {
			// Update the preview with the current image (if it has a background)
			dragPreview.style.backgroundImage = `url(${image.src})`;
			dragPreview.style.backgroundSize = 'cover';
			dragPreview.style.backgroundPosition = 'center';
			dragPreview.style.display = 'block';

			// Use this as the drag image
			e.dataTransfer.setDragImage(dragPreview, 50, 40);
		}

		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', index);
	};

	const handleDragEnter = (e, targetIndex) => {
		if (dragItem.current !== null && dragItem.current !== targetIndex) {
			// Update the images array to reflect the new order
			const newImages = [...images];
			const draggedItemContent = newImages[dragItem.current];
			newImages.splice(dragItem.current, 1);
			newImages.splice(targetIndex, 0, draggedItemContent);

			dragItem.current = targetIndex;
			setImages(newImages);
			setHasChanges(true);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDragEnd = () => {
		setIsDragging(false);
		setDraggedItem(null);
		dragItem.current = null;
		dragNode.current = null;

		// Hide the drag preview
		if (dragPreviewRef.current) {
			dragPreviewRef.current.style.display = 'none';
		}
	};

	const saveImageOrder = async () => {
		if (!hasChanges) return;

		setIsLoading(true);
		setError('');
		setSuccess('');

		try {
			const imageOrder = images.map(image => ({
				id: image.id
			}));

			const response = await fetch('/api/gallery/images/batch-reorder', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ imageOrder }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update image order');
			}

			setSuccess('Gallery image order saved successfully');
			setHasChanges(false);
			router.refresh();
		} catch (error) {
			setError(error.message || 'An error occurred while saving the image order');
		} finally {
			setIsLoading(false);
		}
	};

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

	return (
		<div>
			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			{success && (
				<div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
					{success}
				</div>
			)}

			{hasChanges && (
				<div className="sticky top-4 z-50 mb-4 flex justify-center">
					<button
						onClick={saveImageOrder}
						disabled={isLoading}
						className="cursor-pointer bg-blue-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-800 transition-colors"
					>
						{isLoading ? 'Saving...' : 'Save Image Order'}
					</button>
				</div>
			)}

			{images.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					No gallery images found. Add a new image to get started.
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{images.map((image, index) => (
						<div
							key={image.id}
							draggable
							onDragStart={(e) => handleDragStart(e, index)}
							onDragEnter={(e) => handleDragEnter(e, index)}
							onDragOver={handleDragOver}
							onDragEnd={handleDragEnd}
							className={`border border-black/[.08] dark:border-white/[.145] rounded-lg overflow-hidden cursor-move transition-transform ${isDragging && draggedItem === index
								? 'opacity-50'
								: 'opacity-100'
								} ${hasChanges && 'border-blue-300 dark:border-blue-700'
								}`}
						>
							<div className="relative aspect-[4/3] w-full">
								<Image
									src={image.src}
									alt={image.alt || image.title}
									fill
									className="object-cover pointer-events-none"
								/>
							</div>
							<div className="p-4">
								<h3 className="font-semibold mb-1">{image.title}</h3>
								<p className="text-sm text-gray-500 mb-4 line-clamp-2">{image.description}</p>
								<div className="flex justify-between">
									<Link
										href={`/admin/gallery/edit/${image.id}`}
										className="text-blue-500 hover:underline text-sm"
									>
										Edit
									</Link>
									<button
										onClick={() => openDeleteModal(image)}
										disabled={isLoading}
										className="cursor-pointer text-red-500 hover:underline text-sm"
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