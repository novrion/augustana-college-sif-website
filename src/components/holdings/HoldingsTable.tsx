'use client';

import { useRouter } from 'next/navigation';
import { Holding } from '@/lib/types/holding';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface HoldingsTableProps {
	holdings: Holding[];
	totalEquityValue: number;
}

export default function HoldingsTable({
	holdings,
	totalEquityValue
}: HoldingsTableProps) {
	const router = useRouter();

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-white/[.145]">
				<thead>
					<tr>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Symbol</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
						<th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Shares</th>
						<th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
						<th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Market Value</th>
						<th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">% of Equity</th>
						<th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Gain/Loss</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-white/[.145]">
					{holdings.map((holding) => {
						const marketValue = holding.current_price * holding.share_count;
						const equityPercent = (marketValue / totalEquityValue) * 100;
						const gainLoss = marketValue - holding.cost_basis;
						const gainLossPercent = holding.cost_basis > 0 ? (gainLoss / holding.cost_basis) * 100 : 0;

						return (
							<tr
								key={holding.id}
								onClick={() => router.push(`/holdings/${holding.id}`)}
								className="hover:bg-[#1a1a1a] cursor-pointer"
							>
								<td className="px-4 py-3 whitespace-nowrap">{holding.ticker}</td>
								<td className="px-4 py-3 whitespace-nowrap">{holding.company_name}</td>
								<td className="px-4 py-3 whitespace-nowrap text-right">{holding.share_count.toLocaleString()}</td>
								<td className="px-4 py-3 whitespace-nowrap text-right">{formatCurrency(holding.current_price)}</td>
								<td className="px-4 py-3 whitespace-nowrap text-right">{formatCurrency(marketValue)}</td>
								<td className="px-4 py-3 whitespace-nowrap text-right">{formatPercent(equityPercent)}</td>
								<td className="px-4 py-3 whitespace-nowrap text-right">
									<span className={`${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
										{formatCurrency(gainLoss)} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
									</span>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}