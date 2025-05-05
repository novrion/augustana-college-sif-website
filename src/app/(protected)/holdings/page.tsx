import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAllHoldings, getCashBalance } from '@/lib/api/db';
import { getSession, hasHoldingsWriteAccess } from '@/lib/auth/auth';
import HoldingsSummary from '@/components/holdings/HoldingsSummary';
import HoldingsTable from '@/components/holdings/HoldingsTable';

export default async function HoldingsPage() {
	const session = await getSession();
	if (!session) { redirect('/login?callbackUrl=/holdings'); }

	const canManagePortfolio = await hasHoldingsWriteAccess();

	const holdings = await getAllHoldings();
	const cashBalance = await getCashBalance();

	const sortedHoldings = [...holdings].sort((a, b) => { return a.current_price * a.share_count - b.current_price * b.share_count; });

	const totalPortfolioValue = sortedHoldings.reduce((sum, holding) => {
		return sum + (holding.current_price * holding.share_count);
	}, cashBalance);
	const totalEquityValue = totalPortfolioValue - cashBalance;

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Portfolio Tracker
					</h1>
					{canManagePortfolio && (
						<Link
							href="/admin/holdings"
							className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Manage Portfolio
						</Link>
					)}
				</div>

				<HoldingsSummary
					holdings={holdings}
					cashBalance={cashBalance}
					totalPortfolioValue={totalPortfolioValue}
				/>

				<div className="mt-12">
					<h2 className="text-2xl font-semibold mb-4">
						Holdings
					</h2>
					<HoldingsTable
						holdings={sortedHoldings}
						totalEquityValue={totalEquityValue}
					/>
				</div>
			</div>
		</div>
	);
}