export default function Portfolio() {
	// Mock data for portfolio holdings
	const holdings = [
		{ symbol: "AAPL", name: "Apple Inc.", sector: "Technology", percentage: 8.5, performance: 12.3 },
		{ symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", percentage: 7.2, performance: 15.7 },
		{ symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", percentage: 6.8, performance: 9.4 },
		{ symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary", percentage: 5.9, performance: 7.8 },
		{ symbol: "BRK.B", name: "Berkshire Hathaway", sector: "Financials", percentage: 4.6, performance: 5.2 },
	];

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-sans)]">
					Our Portfolio
				</h1>
				<p className="text-lg mb-8">
					Current holdings and performance metrics of the Augustana College Student Investment Fund.
				</p>

				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-geist-sans)]">
						Portfolio Metrics
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
						<div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6">
							<p className="text-sm text-gray-500 dark:text-gray-400">Assets Under Management</p>
							<p className="text-2xl font-semibold">$1.25M</p>
						</div>
						<div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6">
							<p className="text-sm text-gray-500 dark:text-gray-400">YTD Return</p>
							<p className="text-2xl font-semibold text-green-500">+8.4%</p>
						</div>
						<div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6">
							<p className="text-sm text-gray-500 dark:text-gray-400">Total Holdings</p>
							<p className="text-2xl font-semibold">27</p>
						</div>
						<div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6">
							<p className="text-sm text-gray-500 dark:text-gray-400">vs. S&P 500</p>
							<p className="text-2xl font-semibold text-green-500">+1.2%</p>
						</div>
					</div>
				</div>

				<div>
					<h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-geist-sans)]">
						Top Holdings
					</h2>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="border-b border-black/[.08] dark:border-white/[.145]">
									<th className="py-4 px-4 text-left">Symbol</th>
									<th className="py-4 px-4 text-left">Company</th>
									<th className="py-4 px-4 text-left">Sector</th>
									<th className="py-4 px-4 text-left">Portfolio %</th>
									<th className="py-4 px-4 text-left">YTD Performance</th>
								</tr>
							</thead>
							<tbody>
								{holdings.map((stock, index) => (
									<tr key={index} className="border-b border-black/[.08] dark:border-white/[.145] hover:bg-gray-50 dark:hover:bg-gray-900">
										<td className="py-4 px-4 font-medium">{stock.symbol}</td>
										<td className="py-4 px-4">{stock.name}</td>
										<td className="py-4 px-4">{stock.sector}</td>
										<td className="py-4 px-4">{stock.percentage}%</td>
										<td className={`py-4 px-4 ${stock.performance >= 0 ? "text-green-500" : "text-red-500"}`}>
											{stock.performance > 0 ? "+" : ""}{stock.performance}%
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="mt-8">
						<a
							href="/full-portfolio"
							className="inline-block rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-6 py-3 font-medium"
						>
							View Complete Portfolio
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}