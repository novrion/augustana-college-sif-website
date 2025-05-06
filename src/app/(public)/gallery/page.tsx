'use client';

import { useState, useEffect } from 'react';
import Gallery from '@/components/gallery/Gallery';
import { GalleryImage } from '@/lib/types/gallery';
import { useSearchParams } from 'next/navigation';

export default function GalleryPage() {
	const searchParams = useSearchParams();
	const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
	const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
	const [totalPages, setTotalPages] = useState(1);
	const [totalImages, setTotalImages] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchImages = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// Build query string
				const params = new URLSearchParams();
				params.set('page', currentPage.toString());
				params.set('pageSize', '12'); // 12 images per page works well with the grid layout
				params.set('orderBy', 'date'); // Sort by date
				params.set('ascending', 'false'); // Newest first

				const response = await fetch(`/api/gallery?${params.toString()}`);

				if (!response.ok) {
					throw new Error('Failed to fetch gallery images');
				}

				const data = await response.json();
				setGalleryImages(data.data || []);
				setTotalPages(data.totalPages || 1);
				setTotalImages(data.total || 0);
			} catch (err) {
				console.error('Error fetching gallery images:', err);
				setError(err instanceof Error ? err.message : 'Failed to load gallery images');
			} finally {
				setIsLoading(false);
			}
		};

		fetchImages();
	}, [currentPage]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);

		// Update URL without page reload
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		window.history.pushState({}, '', url.toString());
	};

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					Gallery
				</h1>
				<p className="text-lg mb-8 font-[family-name:var(--font-geist-mono)]">
					Browse photos from our stock pitches, events, fund meetings, and more.
				</p>

				{isLoading && (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				)}

				{error && (
					<div className="text-center p-4 rounded-md text-red-700 mb-6 font-[family-name:var(--font-geist-mono)]">
						{error}
					</div>
				)}

				{!isLoading && !error && (
					<>
						{galleryImages.length > 0 ? (
							<Gallery
								images={galleryImages}
								currentPage={currentPage}
								totalPages={totalPages}
								totalImages={totalImages}
								onPageChange={handlePageChange}
							/>
						) : (
							<div className="text-center py-8 text-gray-400 font-[family-name:var(--font-geist-mono)]">
								No gallery images available.
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}