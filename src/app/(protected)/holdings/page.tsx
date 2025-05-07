import { redirect } from 'next/navigation';
import { getAllHoldings, getCashBalance } from '@/lib/api/db';
import { getSession, hasPermission } from '@/lib/auth/auth';
import HoldingsSummary from '@/components/holdings/HoldingsSummary';
import HoldingsTable from '@/components/holdings/HoldingsTable';
import { EmptyLinkButton } from '@/components/Buttons';

export default async function HoldingsPage() {
	const session = await getSession();
	if (!session) { redirect('/login?callbackUrl=/holdings'); }

	const canManagePortfolio = await hasPermission('HOLDINGS_WRITE');

	const holdings = await getAllHoldings();
	const cashBalance = await getCashBalance();

	const sortedHoldings = [...holdings].sort((a, b) => (b.current_price * b.share_count) - (a.current_price * a.share_count));

	const totalPortfolioValue = sortedHoldings.reduce((sum, holding) => sum + (holding.current_price * holding.share_count), cashBalance);
	const totalEquityValue = totalPortfolioValue - cashBalance;

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Portfolio Tracker</h1>

					{canManagePortfolio && (
						<EmptyLinkButton
							href="/admin/holdings"
							text="Manage Portfolio"
						/>
					)}
				</div>

				<HoldingsSummary
					holdings={holdings}
					cashBalance={cashBalance}
					totalPortfolioValue={totalPortfolioValue}
				/>

				<div className="mt-12">
					<h2 className="text-2xl font-semibold mb-4">Holdings</h2>
					<HoldingsTable
						holdings={sortedHoldings}
						totalEquityValue={totalEquityValue}
					/>
				</div>
			</div>
		</div>
	);
}