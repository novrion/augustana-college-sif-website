import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getPaginatedGalleryImages } from '@/lib/api/db';
import AdminGalleryList from '@/components/admin/gallery/AdminGalleryList';
import { EmptyLinkButton, FilledLinkButton } from "@/components/Buttons";

export default async function AdminGalleryPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
	const hasAccess = await hasPermission('SECRETARY');
	if (!hasAccess) redirect('/unauthorized');

	const { page: pageParam } = await searchParams || {};
	const page = pageParam ? parseInt(pageParam) : 1;
	const pageSize = 12;

	const { data: images, total, totalPages } = await getPaginatedGalleryImages({
		page,
		pageSize,
		orderBy: 'date',
		ascending: false // Newest first
	});

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Gallery Management</h1>
					<div className="flex gap-3">
						<EmptyLinkButton href="/admin" text="Back to Admin" />
						<FilledLinkButton href="/admin/gallery/add" text="Add New Image" />
					</div>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Gallery Images</h2>
					<AdminGalleryList
						images={images}
						currentPage={page}
						totalPages={totalPages}
						totalImages={total}
					/>
				</div>
			</div>
		</div>
	);
}