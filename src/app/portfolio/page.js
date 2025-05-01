import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasPortfolioAccess, hasAdminAccess } from '../../lib/auth';
import { getAllHoldings, getCashBalance } from '../../lib/database';
import PortfolioTable from '../../components/portfolio/PortfolioTable';
import PortfolioSummary from '../../components/portfolio/PortfolioSummary';

export default async function Portfolio() {
	const hasPortfolioViewAccess = await hasPortfolioAccess();
	if (!hasPortfolioViewAccess) {
		redirect('/unauthorized');
	}

	// Verify user is admin to show 'Manage Portfolio'
	const canManagePortfolio = await hasAdminAccess();

	// Fetch all holdings and cash balance
	const holdings = await getAllHoldings();
	const cashBalance = await getCashBalance();

	// Calculate total portfolio value
	const totalPortfolioValue = holdings.reduce((sum, holding) => {
		return sum + (holding.current_price * holding.share_count);
	}, cashBalance);

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Portfolio Tracker
					</h1>
					{canManagePortfolio && (
						<Link
							href="/admin/portfolio"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Manage Portfolio
						</Link>
					)}
				</div>

				{/* Portfolio summary section */}
				<PortfolioSummary
					holdings={holdings}
					cashBalance={cashBalance}
					totalPortfolioValue={totalPortfolioValue}
				/>

				{/* Holdings table */}
				<div className="mt-12">
					<h2 className="text-2xl font-semibold mb-4">
						Holdings
					</h2>
					<PortfolioTable
						holdings={holdings}
						cashBalance={cashBalance}
						totalPortfolioValue={totalPortfolioValue}
					/>
				</div>
			</div>
		</div>
	);
}