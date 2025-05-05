import { Holding } from '@/lib/types/holding';

interface HoldingsSummaryProps {
	holdings: Holding[];
	cashBalance: number;
	totalPortfolioValue: number;
}

export default function HoldingsSummary({
	holdings,
	cashBalance,
	totalPortfolioValue
}: HoldingsSummaryProps) {
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	};

	const formatPercent = (value: number) => {
		return `${value.toFixed(2)}%`;
	};

	const equity = holdings.reduce((sum, holding) => { return sum + (holding.current_price * holding.share_count); }, 0);
	const equityPercent = (equity / totalPortfolioValue) * 100;
	const cashPercent = (cashBalance / totalPortfolioValue) * 100;
	const totalCostBasis = holdings.reduce((sum, holding) => { return sum + holding.cost_basis; }, 0);
	const totalGainLoss = equity - totalCostBasis;
	const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div className="rounded-lg border border-solid border-white/[.145] p-6">
				<h3 className="text-lg font-semibold mb-2">Equity</h3>
				<p className="text-2xl font-bold">{formatCurrency(equity)}</p>
				<p className="text-sm text-gray-400 mt-1">
					{formatPercent(equityPercent)} of Holdings
				</p>
			</div>

			<div className="rounded-lg border border-solid border-white/[.145] p-6">
				<h3 className="text-lg font-semibold mb-2">Cash Balance</h3>
				<p className="text-2xl font-bold">{formatCurrency(cashBalance)}</p>
				<p className="text-sm text-gray-400 mt-1">
					{formatPercent(cashPercent)} of Holdings
				</p>
			</div>

			<div className="rounded-lg border border-solid border-white/[.145] p-6">
				<h3 className="text-lg font-semibold mb-2">Total Gain/Loss</h3>
				<p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
					{formatCurrency(totalGainLoss)} ({totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)
				</p>
			</div>
		</div>
	);
}