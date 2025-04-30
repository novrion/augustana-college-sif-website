// app/admin/gallery/page.js
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../lib/auth';
import { getAllGalleryImages } from '../../../lib/database';
import DraggableGalleryAdminList from '../../../components/admin/DraggableGalleryAdminList';

export default async function AdminGalleryPage() {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	// Fetch all gallery images
	const galleryImages = await getAllGalleryImages();

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Gallery Management
					</h1>

					<div className="flex gap-3">
						<Link
							href="/admin"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Admin
						</Link>

						<Link
							href="/admin/gallery/add"
							className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
						>
							Add New Image
						</Link>
					</div>
				</div>

				<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Gallery Images</h2>
						<div className="text-sm text-gray-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="12" y1="16" x2="12" y2="12"></line>
								<line x1="12" y1="8" x2="12.01" y2="8"></line>
							</svg>
							Drag images to reorder
						</div>
					</div>

					<DraggableGalleryAdminList galleryImages={galleryImages || []} />
				</div>
			</div>
		</div>
	);
}