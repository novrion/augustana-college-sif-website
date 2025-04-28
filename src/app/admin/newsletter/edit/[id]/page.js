import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '../../../../../lib/auth';
import { getNewsletterById } from '../../../../../lib/database';
import NewsletterForm from '../../../../../components/admin/NewsletterForm';

export default async function EditNewsletterPage(props) {
	// Verify user is admin
	const isAdminUser = await isAdmin();

	if (!isAdminUser) {
		redirect('/unauthorized');
	}

	try {
		// Properly await params
		const params = await props.params;
		const id = params.id;

		// Fetch newsletter
		const newsletter = await getNewsletterById(id);

		if (!newsletter) {
			redirect('/admin/newsletter');
		}

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit Newsletter: {newsletter.title}
						</h1>

						<Link
							href="/admin/newsletter"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Newsletters
						</Link>
					</div>

					<NewsletterForm initialData={newsletter} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading newsletter:', error);
		redirect('/admin/newsletter');
	}
}