'use client';

import React, { useState } from 'react';
import { SpeakerEventBox } from '../components/Boxes';
import Link from 'next/link';

export default function Calendar() {
	// Mock data for guest speakers
	const speakerEvents = [
		{
			id: "gs1",
			title: "Value Investing in a Changing Market",
			speaker: "Robert Chen",
			role: "Senior Portfolio Manager",
			company: "Heartland Advisors",
			date: "2025-05-15",
			description: "Robert Chen will discuss value investing strategies in high-inflation environments. The presentation will focus on the importance of free cash flow and debt levels when identifying value stocks. He'll share case studies of successful value investments during market corrections.",
			past: false,
			details: {
				"Location": "Hanson Hall of Science, Room 102",
				"Time": "4:00 PM - 5:30 PM",
				"Contact": "Emily Davis (emilydavis@augustana.edu)",
				"Requirements": "Open to all students. Registration required for non-SIF members."
			}
		},
		{
			id: "gs2",
			title: "ESG Investing: Trends and Opportunities",
			speaker: "Maria Rodriguez",
			role: "ESG Research Analyst",
			company: "Sustainalytics",
			date: "2025-05-29",
			description: "Maria Rodriguez will present on the evolving landscape of ESG investing and how environmental, social, and governance factors are increasingly impacting investment decisions. She'll discuss methodologies for ESG integration in portfolio construction and highlight emerging trends in the sustainable investing space.",
			past: false,
			details: {
				"Location": "Olin Center, Auditorium",
				"Time": "3:30 PM - 5:00 PM",
				"Contact": "Sofia Rodriguez (sofiarodriguez@augustana.edu)",
				"Requirements": "Open to all students and faculty. No registration required."
			}
		},
		{
			id: "gs3",
			title: "Cryptocurrency and Blockchain: Investment Implications",
			speaker: "Jason Park",
			role: "Director of Digital Asset Research",
			company: "Grayscale Investments",
			date: "2025-06-12",
			description: "Jason Park will explore the evolving landscape of cryptocurrency investments and blockchain technology. He'll discuss the fundamentals of blockchain, regulatory developments, and potential investment approaches to this emerging asset class. The presentation will include case studies and practical investment considerations.",
			past: false,
			details: {
				"Location": "Virtual Event (Zoom)",
				"Time": "5:00 PM - 6:30 PM",
				"Contact": "Taylor James (taylorjames@augustana.edu)",
				"Requirements": "Registration required. Zoom link will be provided upon registration."
			}
		},
		{
			id: "gs4",
			title: "Career Paths in Investment Management",
			speaker: "Sarah Johnson",
			role: "Managing Director",
			company: "BlackRock",
			date: "2025-04-10",
			description: "Sarah Johnson discussed various career paths in investment management, from research analyst to portfolio management. She shared insights from her 15-year career journey and provided advice on breaking into the industry. Students had the opportunity to ask questions about internships, skills development, and industry trends.",
			past: true,
			details: {
				"Location": "Brodahl Building, Room 205",
				"Time": "4:30 PM - 6:00 PM",
				"Recording": "Available on the SIF member portal",
				"Presentation": "Slides available on the SIF member portal"
			}
		},
		{
			id: "gs5",
			title: "Fixed Income Strategies in a Rising Rate Environment",
			speaker: "Michael Zhang",
			role: "Fixed Income Portfolio Manager",
			company: "PIMCO",
			date: "2025-03-20",
			description: "Michael Zhang presented strategies for navigating fixed income markets in a rising interest rate environment. He covered duration management, credit selection, and sector rotation approaches. The presentation included analysis of historical interest rate cycles and their impact on various fixed income sectors.",
			past: true,
			details: {
				"Location": "Olin Center, Room 307",
				"Time": "3:00 PM - 4:30 PM",
				"Recording": "Available on the SIF member portal",
				"Presentation": "Slides available on the SIF member portal"
			}
		},
		{
			id: "gs6",
			title: "Private Equity: Structure, Strategy, and Returns",
			speaker: "David Miller",
			role: "Partner",
			company: "Bain Capital",
			date: "2025-02-25",
			description: "David Miller provided an overview of the private equity industry, including fund structures, investment strategies, and performance metrics. He discussed the role of operational improvements in creating value and shared case studies from Bain Capital's portfolio. The session included a Q&A on careers in private equity.",
			past: true,
			details: {
				"Location": "Hanson Hall of Science, Room 304",
				"Time": "4:00 PM - 5:30 PM",
				"Recording": "Available on the SIF member portal",
				"Presentation": "Slides available on the SIF member portal"
			}
		},
		{
			id: "gs7",
			title: "Quantitative Investment Strategies",
			speaker: "Jennifer Lee",
			role: "Quantitative Analyst",
			company: "Two Sigma",
			date: "2025-02-08",
			description: "Jennifer Lee presented on quantitative investment approaches, including factor models, statistical arbitrage, and machine learning applications in asset management. She explained how quantitative strategies differ from traditional fundamental approaches and discussed the evolution of quant investing over the past decade.",
			past: true,
			details: {
				"Location": "Virtual Event (Zoom)",
				"Time": "5:00 PM - 6:30 PM",
				"Recording": "Available on the SIF member portal",
				"Presentation": "Slides available on the SIF member portal"
			}
		},
	];

	// State for tracking which tab is active
	const [activeTab, setActiveTab] = useState('upcoming');

	// Filter events based on active tab
	const filteredEvents = speakerEvents.filter(event => {
		const isPast = event.past || new Date() > new Date(event.date);
		return activeTab === 'upcoming' ? !isPast : isPast;
	});

	// Sort events by date
	filteredEvents.sort((a, b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
	});

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					Guest Speakers
				</h1>
				<p className="text-lg mb-8 font-[family-name:var(--font-geist-mono)]">
					Industry professionals sharing insights with our fund.
				</p>

				{/* Tabs for filtering */}
				<div className="flex border-b border-black/[.08] dark:border-white/[.145] mb-8 font-[family-name:var(--font-geist-mono)]">
					<button
						className={`py-2 px-4 font-medium ${activeTab === 'upcoming'
							? 'border-b-2 border-blue-500'
							: 'text-gray-500 dark:text-gray-400'
							}`}
						onClick={() => setActiveTab('upcoming')}
					>
						Upcoming Speakers
					</button>
					<button
						className={`py-2 px-4 font-medium ${activeTab === 'past'
							? 'border-b-2 border-blue-500'
							: 'text-gray-500 dark:text-gray-400'
							}`}
						onClick={() => setActiveTab('past')}
					>
						Past Speakers
					</button>
				</div>

				{/* Display filtered events */}
				<div className="space-y-6">
					{filteredEvents.length > 0 ? (
						filteredEvents.map((event) => (
							<SpeakerEventBox
								key={event.id}
								id={event.id}
								title={event.title}
								speaker={event.speaker}
								role={event.role}
								company={event.company}
								date={event.date}
								description={event.description}
								past={event.past}
								details={event.details}
							/>
						))
					) : (
						<div className="text-center py-8">
							<p className="text-gray-500 dark:text-gray-400">
								No {activeTab} speaker events found.
							</p>
						</div>
					)}
				</div>

				{/* Add a contact section at the bottom */}
				<div className="mt-12 border-t border-black/[.08] dark:border-white/[.145] pt-8">
					<h2 className="text-xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
						Interested in being a guest speaker?
					</h2>
					<p className="mb-6">
						We regularly invite industry professionals to share insights with our student fund members.
						If you&apos;re interested in speaking at one of our events, please contact us.
					</p>
					<Link
						href="/contact"
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-fit"
					>
						Contact Us
					</Link>
				</div>
			</div>
		</div>
	);
}