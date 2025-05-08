import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getPaginatedNewsletters } from '@/lib/api/db';
import AdminNewsletterList from '@/components/admin/newsletter/AdminNewsletterList';
import { EmptyLinkButton, FilledLinkButton } from "@/components/Buttons";

export default async function AdminNewsletterPage({ searchParams }: { searchParams?: Promise<{ page?: string, year?: string }> }) {
	const hasAccess = await hasPermission('ADMIN');
	if (!hasAccess) redirect('/unauthorized');

	const { page: pageParam, year: yearParam } = await searchParams || {};
	const page = pageParam ? parseInt(pageParam) : 1;
	const year = yearParam || null;
	const pageSize = 10;

	const { data: newsletters } = await getPaginatedNewsletters({
		page,
		pageSize,
		year
	});

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Newsletter Management</h1>
					<div className="flex gap-3">
						<EmptyLinkButton href="/admin" text="Back to Admin" />
						<FilledLinkButton href="/admin/newsletter/add" text="Add New Newsletter" />
					</div>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Newsletters</h2>
					<AdminNewsletterList
						newsletters={newsletters}
						initialPage={page}
						pageSize={pageSize}
					/>
				</div>
			</div>
		</div>
	);
}