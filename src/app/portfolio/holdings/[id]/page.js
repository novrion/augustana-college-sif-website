import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasPortfolioAccess } from '../../../../lib/auth';
import { getHoldingById } from '../../../../lib/database';

export default async function HoldingDetail({ params }) {
	// Verify user has access to portfolio
	const hasAccess = await hasPortfolioAccess();

	if (!hasAccess) {
		redirect('/unauthorized');
	}

	try {
		// Fetch holding details
		const id = params.id;
		const holding = await getHoldingById(id);

		if (!holding) {
			redirect('/portfolio');
		}

		// Calculate derived values
		const totalCost = holding.cost_basis; // Now directly from the database
		const marketValue = holding.current_price * holding.share_count;
		const gainLoss = marketValue - totalCost;
		const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

		// Format currency values
		const formatCurrency = (value) => {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format(value);
		};

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-6xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							{holding.company_name} ({holding.ticker})
						</h1>

						<Link
							href="/portfolio"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Portfolio
						</Link>
					</div>

					{/* Summary grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
							<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Price</span>
							<span className="text-2xl font-bold">{formatCurrency(holding.current_price)}</span>
						</div>

						<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
							<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Cost Basis</span>
							<span className="text-2xl font-bold">{formatCurrency(totalCost)}</span>
						</div>

						<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
							<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Shares</span>
							<span className="text-2xl font-bold">{holding.share_count.toLocaleString()}</span>
						</div>

						<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
							<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Market Value</span>
							<span className="text-2xl font-bold">{formatCurrency(marketValue)}</span>
						</div>

						<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
							<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Cost</span>
							<span className="text-2xl font-bold">{formatCurrency(totalCost)}</span>
						</div>

						<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 flex flex-col">
							<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Gain/Loss</span>
							<span className={`text-2xl font-bold ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
								{formatCurrency(gainLoss)} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
							</span>
						</div>
					</div>

					{/* Holding details */}
					<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
						<h2 className="text-xl font-semibold mb-4">Company Details</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
							<div className="text-sm text-gray-500 dark:text-gray-400">Ticker</div>
							<div>{holding.ticker}</div>

							<div className="text-sm text-gray-500 dark:text-gray-400">Sector</div>
							<div>{holding.sector || 'N/A'}</div>

							<div className="text-sm text-gray-500 dark:text-gray-400">Purchase Date</div>
							<div>{new Date(holding.purchase_date).toLocaleDateString()}</div>
						</div>
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading holding:', error);
		redirect('/portfolio');
	}
}