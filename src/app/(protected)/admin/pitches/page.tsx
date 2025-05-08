import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getPaginatedPitches } from '@/lib/api/db';
import AdminPitchesList from '@/components/admin/pitches/AdminPitchesList';
import { EmptyLinkButton, FilledLinkButton } from "@/components/Buttons";

export default async function AdminPitchesPage({ searchParams }: { searchParams?: Promise<{ page?: string, year?: string }> }) {
	const hasAccess = await hasPermission('HOLDINGS_WRITE');
	if (!hasAccess) redirect('/unauthorized');

	const { page: pageParam, year: yearParam } = await searchParams || {};
	const page = pageParam ? parseInt(pageParam) : 1;
	const year = yearParam || null;
	const pageSize = 10;

	const { data: pitches } = await getPaginatedPitches({
		page,
		pageSize,
		year
	});

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Stock Pitch Management</h1>
					<div className="flex gap-3">
						<EmptyLinkButton href="/admin" text="Back to Admin" />
						<FilledLinkButton href="/admin/pitches/add" text="Add New Pitch" />
					</div>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Stock Pitches</h2>
					<AdminPitchesList
						pitches={pitches}
						initialPage={page}
						pageSize={pageSize}
					/>
				</div>
			</div>
		</div>
	);
}