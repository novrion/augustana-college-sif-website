'use client';

import { useState, useEffect } from 'react';
import Gallery from '../../components/Gallery';
import DefaultFooter from '../../components/DefaultFooter';

export default function GalleryPage() {
	const [galleryImages, setGalleryImages] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch gallery images from the API
	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch('/api/gallery/images');
				if (!response.ok) {
					throw new Error('Failed to fetch gallery images');
				}
				const data = await response.json();
				setGalleryImages(data);
			} catch (error) {
				console.error('Error fetching gallery images:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchImages();
	}, []);

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-7xl mx-auto font-[family-name:var(--font-geist-mono)]">
				<h1 className="text-3xl font-bold mb-2">
					Gallery
				</h1>
				<p className="text-lg mb-8">
					Browse photos from our stock pitches, events, fund meetings, and more.
				</p>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black/[.08] dark:border-white/[.145]"></div>
					</div>
				) : galleryImages.length > 0 ? (
					<Gallery images={galleryImages} />
				) : (
					<p className="text-center text-gray-500 py-12">No gallery images found.</p>
				)}
			</div>

			<div className="mt-20">
				<DefaultFooter />
			</div>
		</div>
	);
}