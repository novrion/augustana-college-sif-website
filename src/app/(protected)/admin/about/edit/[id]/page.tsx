import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getAboutSectionById } from '@/lib/api/db';
import AboutSectionForm from '@/components/admin/about/AboutSectionForm';
import { EmptyLinkButton } from "@/components/Buttons";

interface EditAboutSectionParams {
	params: Promise<{ id: string }>
}

export default async function EditAboutSectionPage({ params }: EditAboutSectionParams) {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	try {
		const { id } = await params;
		const aboutSection = await getAboutSectionById(id);
		if (!aboutSection) redirect('/admin/about');

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Edit: {aboutSection.title}</h1>
						<EmptyLinkButton href="/admin/about" text="Back to About Management" />
					</div>

					<AboutSectionForm initialData={aboutSection} isEditing={true} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading about section:', error);
		redirect('/admin/about');
	}
}