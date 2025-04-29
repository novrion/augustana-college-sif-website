import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../../lib/auth';
import { getAllAboutSections } from '../../../../lib/database';
import AboutSectionForm from '../../../../components/admin/AboutSectionForm';

export default async function AddAboutSectionPage({ searchParams }) {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	// Get the max order index from query parameters or recalculate it
	let maxOrderIndex = parseInt(searchParams?.maxOrder) || 0;

	// If no maxOrder provided, fetch all sections and calculate it
	if (!searchParams?.maxOrder) {
		const aboutSections = await getAllAboutSections();
		maxOrderIndex = aboutSections.length > 0
			? Math.max(...aboutSections.map(section => section.order_index))
			: 0;
	}

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Add About Section
					</h1>

					<Link
						href="/admin/about"
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Back to About Us Management
					</Link>
				</div>

				<AboutSectionForm maxOrderIndex={maxOrderIndex} />
			</div>
		</div>
	);
}