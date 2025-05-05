import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '@/lib/auth/auth';
import { getAllAboutSections } from '@/lib/api/db';
import AboutSectionForm from '@/components/admin/about/AboutSectionForm';

export default async function AddAboutSectionPage({ searchParams }: {
	searchParams?: Promise<{ maxOrderParam?: string }>
}) {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) { redirect('/unauthorized'); }

	const { maxOrderParam } = await searchParams;
	let maxOrderIndex = parseInt(maxOrderParam || '0') || 0;

	// If no maxOrder provided, fetch all sections and calculate it
	if (!maxOrderParam) {
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
						className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] font-medium text-sm h-10 px-4"
					>
						Back to About Management
					</Link>
				</div>

				<AboutSectionForm maxOrderIndex={maxOrderIndex} />
			</div>
		</div>
	);
}