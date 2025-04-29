import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../lib/auth';
import { getAllAboutSections } from '../../../lib/database';
import AdminAboutSectionsList from '../../../components/admin/AdminAboutSectionsList';
import AboutSectionForm from '../../../components/admin/AboutSectionForm';

export default async function AdminAboutPage() {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	// Fetch all about sections
	const aboutSections = await getAllAboutSections();

	// Calculate the maximum order index for new sections
	const maxOrderIndex = aboutSections.length > 0
		? Math.max(...aboutSections.map(section => section.order_index))
		: 0;

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						About Us Management
					</h1>

					<div className="flex gap-3">
						<Link
							href="/admin"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Admin
						</Link>

						<Link
							href={`/admin/about/add?maxOrder=${maxOrderIndex}`}
							className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
						>
							Add New Section
						</Link>
					</div>
				</div>

				{/* About Section Management */}
				<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Sections</h2>
					<AdminAboutSectionsList aboutSections={aboutSections} />
				</div>
			</div>
		</div>
	);
}