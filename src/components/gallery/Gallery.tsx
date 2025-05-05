'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PaginationControls from '@/components/common/PaginationControls';
import { GalleryImage } from '@/lib/types/gallery';

interface GalleryProps {
	images: GalleryImage[];
	currentPage: number;
	totalPages: number;
	totalImages: number;
	onPageChange: (page: number) => void;
}

export default function Gallery({
	images,
	currentPage,
	totalPages,
	totalImages,
	onPageChange
}: GalleryProps) {
	// State for columns
	const [columns, setColumns] = useState<number>(4);
	// State for lightbox
	const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

	// Update columns based on window width
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 640) {
				setColumns(1);
			} else if (width < 768) {
				setColumns(2);
			} else if (width < 1024) {
				setColumns(3);
			} else {
				setColumns(4);
			}
		};

		// Initial setup
		handleResize();

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// Add ESC key event listener for lightbox
	useEffect(() => {
		const handleEscKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && selectedImage !== null) {
				setSelectedImage(null);
			}
		};

		window.addEventListener('keydown', handleEscKey);

		return () => {
			window.removeEventListener('keydown', handleEscKey);
		};
	}, [selectedImage]);

	// Handle opening the lightbox
	const openLightbox = (image: GalleryImage) => {
		setSelectedImage(image);
	};

	// Handle closing the lightbox
	const closeLightbox = () => {
		setSelectedImage(null);
	};

	// Distribute images into columns
	const getColumnImages = (): GalleryImage[][] => {
		const result = Array.from({ length: columns }, () => [] as GalleryImage[]);

		images.forEach((image, index) => {
			result[index % columns].push(image);
		});

		return result;
	};

	return (
		<>
			<div className="flex gap-4">
				{getColumnImages().map((columnImages, columnIndex) => (
					<div key={columnIndex} className="flex-1 flex flex-col gap-4">
						{columnImages.map((image, imageIndex) => (
							<div
								key={image.id || imageIndex}
								className="relative group overflow-hidden rounded-lg"
								onClick={() => openLightbox(image)}
							>
								{/* Use a wrapper div with aspect ratio for image container */}
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

								{/* Overlay with description - appears on hover */}
								<div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end p-4">
									<div className="text-white w-full min-w-0">
										<h3 className="font-semibold text-lg font-[family-name:var(--font-geist-mono)]">{image.title}</h3>
										{image.description && <p className="text-sm break-words font-[family-name:var(--font-geist-sans)]">{image.description}</p>}
									</div>
								</div>
							</div>
						))}
					</div>
				))}
			</div>

			{/* Pagination controls */}
			{totalPages > 1 && (
				<div className="mt-8 font-[family-name:var(--font-geist-mono)]">
					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={onPageChange}
					/>
					<div className="mt-4 text-sm text-gray-400 text-center font-[family-name:var(--font-geist-mono)]">
						Showing {images.length} of {totalImages} images
					</div>
				</div>
			)}

			{/* Lightbox Modal */}
			{selectedImage && (
				<div
					className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 md:p-8"
					onClick={closeLightbox}
				>
					<div
						className="relative max-w-5xl w-full flex flex-col items-center justify-center px-8 md:px-16"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="relative w-full flex items-center justify-center mb-4">
							<button
								className="absolute -top-12 right-0 z-10 w-10 h-10 flex items-center justify-center text-white bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition-all duration-300 ease-in-out opacity-70 hover:opacity-100"
								onClick={closeLightbox}
								aria-label="Close lightbox"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>

							<div className="relative max-w-full mx-auto font-[family-name:var(--font-geist-mono)]">
								<Image
									src={selectedImage.src}
									alt={selectedImage.alt || selectedImage.title}
									width={1200}
									height={900}
									quality={100}
									priority
									className="object-contain max-h-[70vh] w-auto mx-auto rounded"
								/>
							</div>
						</div>

						<div className="bg-black bg-opacity-70 p-6 text-white rounded w-full max-w-3xl mx-auto text-center font-[family-name:var(--font-geist-mono)]">
							<h3 className="font-semibold text-xl mb-2 font-[family-name:var(--font-geist-mono)]">{selectedImage.title}</h3>
							{selectedImage.description && <p>{selectedImage.description}</p>}
						</div>
					</div>
				</div>
			)}
		</>
	);
}