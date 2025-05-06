import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '@/lib/auth/auth';
import { getGalleryImageById } from '@/lib/api/db';
import GalleryImageForm from '@/components/admin/gallery/GalleryImageForm';

export default async function EditGalleryImagePage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) { redirect('/unauthorized'); }

	try {
		const { id } = await params;
		const image = await getGalleryImageById(id);

		if (!image) {
			redirect('/admin/gallery');
		}

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit: {image.title}
						</h1>

						<Link
							href="/admin/gallery"
							className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] font-medium text-sm h-10 px-4"
						>
							Back to Gallery Management
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