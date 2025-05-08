'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Gallery from '@/components/gallery/Gallery';
import { GalleryImage } from '@/lib/types/gallery';
import StatusMessage from '@/components/common/StatusMessage';

export default function ClientGallery({ initialPage = 1 }: { initialPage: number }) {
	const router = useRouter();
	const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(1);
	const [totalImages, setTotalImages] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchImages = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const params = new URLSearchParams({
					page: currentPage.toString(),
					pageSize: '12',
					orderBy: 'date',
					ascending: 'false'
				});

				const response = await fetch(`/api/gallery?${params.toString()}`);
				if (!response.ok) { throw new Error('Failed to fetch gallery images'); }

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
		router.push(`/gallery?page=${page}`, { scroll: false });
	};

	return (
		<>
			{isLoading && (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			)}

			{error && <StatusMessage type="error" message={error} />}

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
		</>
	);
}