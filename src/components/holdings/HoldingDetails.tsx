import { Holding } from '@/lib/types/holding';

interface HoldingDetailsProps {
	holding: Holding;
	totalEquityValue: number;
}

export default function HoldingDetails({
	holding,
	totalEquityValue
}: HoldingDetailsProps) {
	const marketValue = holding.current_price * holding.share_count;
	const gainLoss = marketValue - holding.cost_basis;
	const gainLossPercent = holding.cost_basis > 0 ? (gainLoss / holding.cost_basis) * 100 : 0;
	const equityPercent = (marketValue / totalEquityValue) * 100;

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	};

	const formatPercent = (value: number) => {
		return `${value.toFixed(2)}%`;
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return 'N/A';
		return new Date(`${dateString}T12:00:00Z`).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		});
	};

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<div className="rounded-lg border border-solid border-white/[.145] p-6 flex flex-col">
					<span className="text-sm text-gray-400 mb-2">Current Price</span>
					<span className="text-2xl font-bold">{formatCurrency(holding.current_price)}</span>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6 flex flex-col">
					<span className="text-sm text-gray-400 mb-2">Cost Basis</span>
					<span className="text-2xl font-bold">{formatCurrency(holding.cost_basis)}</span>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6 flex flex-col">
					<span className="text-sm text-gray-400 mb-2">Shares</span>
					<span className="text-2xl font-bold">{holding.share_count.toLocaleString()}</span>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6 flex flex-col">
					<span className="text-sm text-gray-400 mb-2">Market Value</span>
					<span className="text-2xl font-bold">{formatCurrency(marketValue)}</span>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6 flex flex-col">
					<span className="text-sm text-gray-400 mb-2">Gain/Loss</span>
					<span className={`text-2xl font-bold ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
						{formatCurrency(gainLoss)} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
					</span>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6 flex flex-col">
					<span className="text-sm text-gray-400 mb-2">% of Equity</span>
					<span className="text-2xl font-bold">{formatPercent(equityPercent)}</span>
				</div>
			</div>

			<div className="rounded-lg border border-solid border-white/[.145] p-6">
				<h2 className="text-xl font-semibold mb-4">Company Details</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
					<div className="text-sm text-gray-400">Ticker</div>
					<div>{holding.ticker}</div>

					<div className="text-sm text-gray-400">Sector</div>
					<div>{holding.sector || 'N/A'}</div>

					<div className="text-sm text-gray-400">Purchase Date</div>
					<div>{formatDate(holding.purchase_date)}</div>
				</div>
			</div>
		</>
	);
}