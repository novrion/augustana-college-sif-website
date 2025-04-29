import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '../../../lib/auth';
import { getAllHoldings, getCashBalance } from '../../../lib/database';
import AdminHoldingList from '../../../components/admin/AdminHoldingList';
import CashBalanceForm from '../../../components/admin/CashBalanceForm';

export default async function AdminPortfolioPage() {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) {
		redirect('/unauthorized');
	}

	// Fetch all holdings and cash balance
	const holdings = await getAllHoldings();
	const cashBalance = await getCashBalance();

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Portfolio Management
					</h1>

					<div className="flex gap-3">
						<Link
							href="/admin"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Admin
						</Link>

						<Link
							href="/admin/portfolio/add"
							className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
						>
							Add New Holding
						</Link>
					</div>
				</div>

				{/* Cash Balance Management */}
				<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 mb-8">
					<h2 className="text-xl font-semibold mb-4">Cash Balance</h2>
					<CashBalanceForm initialCashBalance={cashBalance} />
				</div>

				{/* Holdings Management */}
				<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Current Holdings</h2>
					<AdminHoldingList holdings={holdings} />
				</div>
			</div>
		</div>
	);
}