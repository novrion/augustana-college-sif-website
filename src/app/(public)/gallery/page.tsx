import ClientGallery from '@/components/gallery/ClientGallery';

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const { page } = await searchParams;
	const currentPage = page ? parseInt(page) : 1;

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					Gallery
				</h1>
				<p className="text-lg mb-8 font-[family-name:var(--font-geist-mono)]">
					Browse photos from our stock pitches, events, fund meetings, and more.
				</p>

				<ClientGallery initialPage={currentPage} />
			</div>
		</div>
	);
}