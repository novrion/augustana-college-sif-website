// app/admin/gallery/edit/[id]/page.js
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../../../lib/auth';
import { getGalleryImageById } from '../../../../../lib/database';
import GalleryImageForm from '../../../../../components/admin/GalleryImageForm';

export default async function EditGalleryImagePage({ params }) {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	try {
		// Get the image ID from the URL
		const id = params.id;

		// Fetch the gallery image
		const image = await getGalleryImageById(id);

		if (!image) {
			redirect('/admin/gallery');
		}

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit Gallery Image
						</h1>

						<Link
							href="/admin/gallery"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Gallery
						</Link>
					</div>

					<GalleryImageForm initialData={image} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading gallery image:', error);
		redirect('/admin/gallery');
	}
}