import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../lib/auth';
import { getPaginatedNewsletters, getNewsletterYears } from '../../../lib/database';
import NewsletterList from '../../../components/admin/NewsletterList';
import PaginationControls from '../../../components/PaginationControls';
import YearFilter from '../../../components/YearFilter';

export default async function AdminNewsletterPage(props) {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	// Properly await searchParams
	const searchParams = await props.searchParams;

	// Parse pagination parameters with defaults
	const page = parseInt(searchParams?.page) || 1;
	const pageSize = parseInt(searchParams?.pageSize) || 20; // More items per page for admin
	const year = searchParams?.year || null;
	const search = searchParams?.search || null;

	// Fetch newsletters with pagination
	const { data: newsletters, total, totalPages } = await getPaginatedNewsletters({
		page,
		pageSize,
		year,
		search
	});

	// Fetch available years for filtering
	const years = await getNewsletterYears();

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Newsletter Management
					</h1>

					<div className="flex gap-3">
						<Link
							href="/admin"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Admin
						</Link>

						<Link
							href="/admin/newsletter/add"
							className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
						>
							Add New Newsletter
						</Link>
					</div>
				</div>

				<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
					{/* Filters Section */}
					<div className="mb-6">
						<YearFilter
							years={Array.isArray(years) ? years : []}
							currentYear={year}
						/>
					</div>

					{/* Display total count */}
					<div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						{total ? `Showing ${newsletters ? newsletters.length : 0} of ${total} newsletters` : 'No newsletters found'}
					</div>

					{/* Newsletter List */}
					<NewsletterList newsletters={newsletters || []} />

					{/* Pagination controls */}
					{totalPages > 1 && (
						<div className="mt-8">
							<PaginationControls
								currentPage={page}
								totalPages={totalPages}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}