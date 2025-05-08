import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getGalleryImageById } from '@/lib/api/db';
import GalleryImageForm from '@/components/admin/gallery/GalleryImageForm';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function EditGalleryImagePage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const hasAccess = await hasPermission('SECRETARY');
	if (!hasAccess) redirect('/unauthorized');

	try {
		const { id } = await params;
		const image = await getGalleryImageById(id);

		if (!image) redirect('/admin/gallery');

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Edit: {image.title}</h1>
						<EmptyLinkButton href="/admin/gallery" text="Back to Gallery Management" />
					</div>
					<GalleryImageForm initialData={image} isEditing />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading gallery image:', error);
		redirect('/admin/gallery');
	}
}