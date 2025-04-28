import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '../../../../../lib/auth';
import { getAboutSectionById } from '../../../../../lib/database';
import AboutSectionForm from '../../../../../components/admin/AboutSectionForm';

export default async function EditAboutSectionForm(props) {
	const isAdminUser = await isAdmin();

	if (!isAdminUser) {
		redirect('/unauthorized');
	}

	try {
		// Properly await params
		const params = await props.params;
		const id = params.id;

		// Fetch meeting minute
		const aboutSection = await getAboutSectionById(id);

		if (!aboutSection) {
			redirect('/admin/about');
		}

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit About Sections: {aboutSection.title}
						</h1>

						<Link
							href="/admin/about"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to About Management
						</Link>
					</div>

					<AboutSectionForm initialData={aboutSection} isEditing={true} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading about_section:', error);
		redirect('/admin/about'); // CHANGE THIS
	}
}