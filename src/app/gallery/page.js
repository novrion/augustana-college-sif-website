'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to load the component client-side
const Gallery = dynamic(() => import('../components/Gallery'), {
	ssr: false,
	loading: () => <p>Loading gallery...</p>
});

export default function GalleryPage() {
	// State for gallery images
	const [galleryImages, setGalleryImages] = useState([
		{
			src: "/images/1.jpg",
			alt: "Stock pitch presentation",
			title: "Fall 2024 Stock Pitch",
			description: "Students presenting their analysis of Nvidia stock to the fund committee"
		},
		{
			src: "/images/2.jpg",
			alt: "Guest speaker event",
			title: "Industry Expert Talk",
			description: "Jane Doe from Morgan Stanley discussing market trends"
		},
		{
			src: "/images/3.jpg",
			alt: "Fund meeting",
			title: "Weekly Meeting",
			description: "SIF members analyzing portfolio performance"
		},
		{
			src: "/images/4.jpg",
			alt: "Market analysis",
			title: "Sector Analysis",
			description: "Deep dive into the technology sector outlook"
		},
		{
			src: "/images/5.jpg",
			alt: "Team photo",
			title: "SIF Team 2024-2025",
			description: "Current members of the Student Investment Fund"
		},
		{
			src: "/images/6.jpg",
			alt: "Investment competition",
			title: "Regional Competition",
			description: "SIF team at the Midwest Investment Challenge"
		},
		{
			src: "/images/8.png",
			alt: "Stock pitch presentation",
			title: "Spring 2025 Stock Pitch",
			description: "Students presenting their analysis of Tesla stock"
		},
		{
			src: "/images/9.jpg",
			alt: "Award ceremony",
			title: "Annual Awards Dinner",
			description: "Recognition of outstanding fund contributors"
		},
		{
			src: "/images/10.jpg",
			alt: "Alumni panel",
			title: "Alumni Career Panel",
			description: "Former SIF members sharing career insights"
		},
		//		{
		//			src: "/images/11.jpg",
		//			alt: "Executive meeting",
		//			title: "Executive Board Meeting",
		//			description: "SIF leadership planning session"
		//		}
	]);

	const [loading, setLoading] = useState(true);

	// Simulate loading
	useEffect(() => {
		// In a real app, this would fetch data from an API
		setTimeout(() => {
			setLoading(false);
		}, 500);
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
				) : (
					<Gallery images={galleryImages} />
				)}
			</div>
		</div>
	);
}