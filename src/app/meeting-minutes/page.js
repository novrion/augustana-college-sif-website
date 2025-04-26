'use client';

import React, { useState } from 'react';
import { CollapsibleMeetingBox } from '../components/Boxes';

export default function MeetingMinutes() {
	// All meeting minutes data (in a real app, this would come from an API)
	const allMeetings = [
		{
			id: "m1",
			date: "April 15, 2025",
			title: "Portfolio Performance Review",
			publisher: "Jane Smith, Secretary",
			notes: "In today's meeting, we reviewed our Q1 performance, which outperformed the S&P 500 by 1.8%. We voted to increase our technology sector allocation by 3% and reduce exposure to financials. New ESG screening criteria were approved for future investments. We also assigned research teams for upcoming stock pitches with Team A focusing on Healthcare and Team B on Consumer Discretionary stocks. The meeting concluded with approving a $50,000 allocation for new technology investments."
		},
		{
			id: "m2",
			date: "April 8, 2025",
			title: "Stock Pitch: Renewable Energy Sector",
			publisher: "Michael Johnson, Vice President",
			notes: "Team C presented analysis on three renewable energy companies: SolarEdge, First Solar, and Vestas Wind Systems. Technical analysis showed strong momentum for First Solar with positive EMA crossover. The team addressed concerns about supply chain issues affecting manufacturing capacity. After discussion and debate on appropriate valuation metrics for early-stage renewable companies, we approved an investment of $25,000 in First Solar. Additional research was requested on Vestas Wind Systems for reconsideration next month."
		},
		{
			id: "m3",
			date: "April 1, 2025",
			title: "Guest Speaker: Value Investing Strategies",
			publisher: "Emily Davis, Treasurer",
			notes: "Today we welcomed Robert Chen, CFA from Heartland Advisors who presented on modern value investing in high-inflation environments. His presentation focused on the importance of free cash flow and debt levels for value stocks, with case studies of successful value investments during market corrections. The Q&A session covered screening techniques and valuation models. We scheduled a follow-up workshop on DCF modeling techniques and created a value investing study group that will meet bi-weekly."
		},
		{
			id: "m4",
			date: "March 25, 2025",
			title: "Fund Administrative Meeting",
			publisher: "Jane Smith, Secretary",
			notes: "We reviewed the fund governance structure and discussed potential revisions to bylaws. Our spring recruitment strategy for new analyst positions was outlined, with a focus on attracting more diverse candidates. Emily presented the fund expense report and administrative budget for the upcoming quarter. We updated our portfolio reporting templates to include new performance metrics and planned the agenda for the upcoming campus investment competition. The budget for spring recruitment events was approved unanimously."
		},
		{
			id: "m5",
			date: "March 18, 2025",
			title: "Market Outlook and Strategy Session",
			publisher: "Michael Johnson, Vice President",
			notes: "Today's session focused on analyzing the impact of recent Federal Reserve policy decisions on equities. We discussed potential effects of the upcoming earnings season on our portfolio holdings. The research team presented sector rotation analysis, identifying emerging opportunities in the small-cap growth segment. We debated the appropriate level of international exposure given the current geopolitical environment and decided to maintain our current asset allocation with minor adjustments to sector weights. A watchlist of potential small-cap additions to the portfolio was approved."
		},
		// Additional meeting minutes for "Load More"
		{
			id: "m6",
			date: "March 11, 2025",
			title: "ESG Investment Criteria Review",
			publisher: "Sofia Rodriguez, ESG Analyst",
			notes: "The team conducted a thorough review of our ESG investment criteria and scoring methodology. We discussed updates to our climate risk assessment metrics to better align with industry standards. The committee voted to incorporate additional data sources for social impact metrics. A decision was made to create an ESG dashboard for our portfolio to track environmental and social impact alongside financial performance. We also established quarterly reviews of our ESG framework to ensure ongoing relevance."
		},
		{
			id: "m7",
			date: "March 4, 2025",
			title: "Portfolio Risk Assessment",
			publisher: "Alex Wong, Risk Manager",
			notes: "Today's meeting focused on comprehensive risk assessment across the portfolio. We reviewed volatility metrics, drawdown analysis, and factor exposure. The team identified concentration risks in certain tech holdings and proposed diversification strategies. Stress testing scenarios were presented for various market conditions including rising interest rates and inflation. We decided to implement tighter stop-loss protocols for our more speculative positions and approved a hedging strategy using index options to protect against downside risk."
		},
		{
			id: "m8",
			date: "February 25, 2025",
			title: "Financial Technology Sector Analysis",
			publisher: "Taylor James, Technology Analyst",
			notes: "Our technology team presented analysis of the fintech sector, highlighting opportunities in payment processing, blockchain infrastructure, and digital banking. We discussed competitive dynamics and regulatory challenges facing major players. The team proposed increasing our allocation to established payment processors while taking smaller positions in emerging blockchain service providers. After debate, we approved two new fintech investments totaling $35,000 and scheduled follow-up research on cybersecurity providers serving the financial sector."
		},
		{
			id: "m9",
			date: "February 18, 2025",
			title: "Economic Outlook Briefing",
			publisher: "Marcus Lee, Economist",
			notes: "Our economic team delivered a comprehensive market outlook for Q2-Q3 2025. Analysis covered GDP growth projections, employment trends, and inflation expectations. We discussed implications of recent manufacturing data and consumer sentiment indicators. The team identified potential leading indicators of a sector rotation from growth to value in the coming quarters. We concluded with a discussion of monetary policy expectations and adjusted our interest rate forecasts accordingly."
		},
		{
			id: "m10",
			date: "February 11, 2025",
			title: "Spring Investment Competition Planning",
			publisher: "Jane Smith, Secretary",
			notes: "Today's meeting focused on planning the upcoming campus-wide investment competition. We finalized rules, submission guidelines, and judging criteria. Responsibilities were assigned for marketing, participant recruitment, and workshop facilitation. The budget for prizes and event hosting was approved. We also coordinated with faculty advisors on academic credit options for participants and scheduled four preparation workshops to be led by fund members ahead of the competition launch in March."
		}
	];

	// State for tracking number of meetings to display
	const [displayCount, setDisplayCount] = useState(5);
	const [loading, setLoading] = useState(false);

	// Function to load more meetings
	const loadMore = () => {
		setLoading(true);

		// Simulate a delay to show loading state (remove in production)
		setTimeout(() => {
			setDisplayCount(prevCount => prevCount + 5);
			setLoading(false);
		}, 800);
	};

	// Get only the meetings we want to display
	const displayedMeetings = allMeetings.slice(0, displayCount);

	// Check if there are more meetings to load
	const hasMore = displayCount < allMeetings.length;

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					Meeting Minutes
				</h1>
				<p className="text-lg mb-8 font-[family-name:var(--font-geist-mono)]">
					Notes from our weekly meetings.
				</p>

				<div className="space-y-6">
					{displayedMeetings.map((meeting) => (
						<CollapsibleMeetingBox
							key={meeting.id}
							id={meeting.id}
							title={meeting.title}
							date={meeting.date}
							publisher={meeting.publisher}
							notes={meeting.notes}
						/>
					))}
				</div>

				{hasMore && (
					<div className="mt-8 flex justify-center">
						<button
							onClick={loadMore}
							disabled={loading}
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-6 py-3 font-[family-name:var(--font-geist-mono)]"
						>
							{loading ? (
								<span className="flex items-center">
									Loading
									<span className="ml-2 h-4 w-4 rounded-full border-2 border-t-transparent border-r-transparent animate-spin" />
								</span>
							) : (
								"Load More"
							)}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}