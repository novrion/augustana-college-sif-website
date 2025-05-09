import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getAllHomeSections } from '@/lib/api/db';
import AdminHomeSectionsList from '@/components/admin/home/AdminHomeSectionsList';
import { HomeSection } from '@/lib/types';
import { EmptyLinkButton, FilledLinkButton } from "@/components/Buttons";

export default async function AdminHomePage() {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	const sections: HomeSection[] = await getAllHomeSections();
	const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);

	const maxOrderIndex = sections.length ? Math.max(...sections.map(s => s.order_index)) : 0;

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Home Page Management</h1>

					<div className="flex gap-3">
						<EmptyLinkButton href="/admin" text="Back to Admin" />
						<FilledLinkButton
							href={`/admin/home/add?maxOrder=${maxOrderIndex}`}
							text="Add New Section"
						/>
					</div>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Home Page Sections</h2>
					<AdminHomeSectionsList homeSections={sortedSections} />
				</div>
			</div>
		</div>
	);
}