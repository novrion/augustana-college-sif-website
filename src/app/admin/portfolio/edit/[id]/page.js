import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '../../../../../lib/auth';
import { getHoldingById } from '../../../../../lib/database';
import HoldingForm from '../../../../../components/admin/HoldingForm';

export default async function EditHoldingPage({ params }) {
	// Verify user is admin
	const isAdminUser = await isAdmin();

	if (!isAdminUser) {
		redirect('/unauthorized');
	}

	try {
		// Fetch the holding
		const holding = await getHoldingById(params.id);

		if (!holding) {
			redirect('/admin/portfolio');
		}

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-6xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit Holding: {holding.company_name} ({holding.ticker})
						</h1>

						<Link
							href="/admin/portfolio"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Portfolio
						</Link>
					</div>

					<HoldingForm initialData={holding} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading holding:', error);
		redirect('/admin/portfolio');
	}
}