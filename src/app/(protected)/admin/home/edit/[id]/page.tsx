import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getHomeSectionById } from '@/lib/api/db';
import HomeSectionForm from '@/components/admin/home/HomeSectionForm';
import { EmptyLinkButton } from "@/components/Buttons";

interface EditHomeSectionParams {
	params: Promise<{ id: string }>
}

export default async function EditHomeSectionPage({ params }: EditHomeSectionParams) {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	try {
		const { id } = await params;
		const homeSection = await getHomeSectionById(id);
		if (!homeSection) redirect('/admin/home');

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Edit: {homeSection.title}</h1>
						<EmptyLinkButton href="/admin/home" text="Back to Home Management" />
					</div>

					<HomeSectionForm initialData={homeSection} isEditing={true} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading home section:', error);
		redirect('/admin/home');
	}
}