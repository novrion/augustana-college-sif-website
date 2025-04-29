import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../../lib/auth';
import HoldingForm from '../../../../components/admin/HoldingForm';

export default async function AddHoldingPage() {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Add New Holding
					</h1>

					<Link
						href="/admin/portfolio"
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Back to Portfolio
					</Link>
				</div>

				<HoldingForm />
			</div>
		</div>
	);
}