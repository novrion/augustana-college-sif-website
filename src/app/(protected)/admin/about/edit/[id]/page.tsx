import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '@/lib/auth/auth';
import { getAboutSectionById } from '@/lib/api/db';
import AboutSectionForm from '@/components/admin/about/AboutSectionForm';

export default async function EditAboutSectionPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) { redirect('/unauthorized'); }

	try {
		const { id } = await params;
		const aboutSection = await getAboutSectionById(id);

		if (!aboutSection) {
			redirect('/admin/about');
		}

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit: {aboutSection.title}
						</h1>

						<Link
							href="/admin/about"
							className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] font-medium text-sm h-10 px-4"
						>
							Back to About Management
						</Link>
					</div>

					<AboutSectionForm
						initialData={aboutSection}
						isEditing={true}
					/>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading about section:', error);
		redirect('/admin/about');
	}
}