// app/portfolio/page.js
import { Suspense } from 'react';
import { getPortfolioData } from '../lib/portfolioData';
import { formatCurrency } from '../models/portfolio';

// Loading component
function LoadingState() {
	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-6xl mx-auto">
				<p className="text-lg mb-8">
					Loading portfolio data...
				</p>
				<div className="animate-pulse">
					<div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-12"></div>
					<div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg mb-12"></div>
				</div>
			</div>
		</div>
	);
}

// Portfolio metrics component
function PortfolioMetrics({ portfolio }) {
	const lastUpdated = new Date(portfolio.lastUpdated);
	const formattedDate = lastUpdated.toLocaleDateString();
	const formattedTime = lastUpdated.toLocaleTimeString();

	return (
		<div className="mb-12">
			<div className="flex justify-between items-center mb-4 font-[family-name:var(--font-geist-mono)]">
				<h2 className="text-2xl font-semibold">
					Portfolio Metrics
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Last updated: {formattedDate} at {formattedTime}
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
				<div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6">
					<p className="text-sm text-gray-500 dark:text-gray-400">Assets Under Management</p>
					<p className="text-2xl font-semibold">{formatCurrency(portfolio.totalMarketValue)}</p>
				</div>

				<div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6">
					<p className="text-sm text-gray-500 dark:text-gray-400">Total Return</p>
					<p className={`text-2xl font-semibold ${portfolio.totalGainPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
						{portfolio.totalGainPercent >= 0 ? '+' : ''}{portfolio.totalGainPercent.toFixed(2)}%
					</p>
				</div>

				<div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6">
					<p className="text-sm text-gray-500 dark:text-gray-400">Total Holdings</p>
					<p className="text-2xl font-semibold">{portfolio.holdings.length}</p>
				</div>

				<div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6">
					<p className="text-sm text-gray-500 dark:text-gray-400">vs. S&P 500</p>
					<p className={`text-2xl font-semibold ${portfolio.relativeToSP >= 0 ? 'text-green-500' : 'text-red-500'}`}>
						{portfolio.relativeToSP >= 0 ? '+' : ''}{portfolio.relativeToSP.toFixed(2)}%
					</p>
				</div>
			</div>
		</div>
	);
}

// Main holdings table component
function HoldingsTable({ holdings, totalMarketValue }) {
	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
				Top Holdings
			</h2>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b border-black/[.08] dark:border-white/[.145]">
							<th className="py-4 px-4 text-left">Symbol</th>
							<th className="py-4 px-4 text-left">Company</th>
							<th className="py-4 px-4 text-left">Sector</th>
							<th className="py-4 px-4 text-left">Shares</th>
							<th className="py-4 px-4 text-left">Current Price</th>
							<th className="py-4 px-4 text-left">Value</th>
							<th className="py-4 px-4 text-left">Return</th>
							<th className="py-4 px-4 text-left">Weight</th>
						</tr>
					</thead>
					<tbody>
						{holdings.map((stock, index) => {
							const weight = (stock.marketValue / totalMarketValue) * 100;

							return (
								<tr key={index} className="border-b border-black/[.08] dark:border-white/[.145] hover:bg-gray-50 dark:hover:bg-gray-900">
									<td className="py-4 px-4 font-medium">{stock.symbol}</td>
									<td className="py-4 px-4">{stock.name}</td>
									<td className="py-4 px-4">{stock.sector}</td>
									<td className="py-4 px-4">{stock.shares.toLocaleString()}</td>
									<td className="py-4 px-4">{formatCurrency(stock.currentPrice)}</td>
									<td className="py-4 px-4">{formatCurrency(stock.marketValue)}</td>
									<td className={`py-4 px-4 ${stock.gainPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
										{stock.gainPercent >= 0 ? "+" : ""}{stock.gainPercent.toFixed(2)}%
									</td>
									<td className="py-4 px-4">{weight.toFixed(2)}%</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

// Main portfolio content component
async function PortfolioContent() {
	// Fetch portfolio data with real market prices
	const portfolio = await getPortfolioData();

	return (
		<>
			<PortfolioMetrics portfolio={portfolio} />
			<HoldingsTable holdings={portfolio.holdings} totalMarketValue={portfolio.totalMarketValue} />

			<div className="mt-8">
				<a
					href="/portfolio-analysis"
					className="inline-block rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-6 py-3 font-medium"
				>
					Advanced Portfolio Analysis
				</a>
			</div>
		</>
	);
}

// Main portfolio page component
export default function Portfolio() {
	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-2">
					Our Portfolio
				</h1>
				<p className="text-lg mb-8">
					Current holdings and performance metrics of the Augustana College Student Investment Fund.
				</p>

				<Suspense fallback={<LoadingState />}>
					<PortfolioContent />
				</Suspense>
			</div>
		</div>
	);
}