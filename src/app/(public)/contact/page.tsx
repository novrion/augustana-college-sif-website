'use client';

import React, { useEffect, useState } from 'react';
import ProfilePicture from '@/components/ProfilePicture';
import { User } from '@/lib/types/user';

interface LeadershipData {
	president: User | null;
	vicePresident: User | null;
	isLoading: boolean;
	error: string | null;
}

export default function ContactPage() {
	const [leadershipData, setLeadershipData] = useState<LeadershipData>({
		president: null,
		vicePresident: null,
		isLoading: true,
		error: null
	});

	useEffect(() => {
		async function fetchLeadershipData() {
			try {
				const response = await fetch('/api/contact/leadership');
				if (!response.ok) {
					throw new Error('Failed to fetch leadership data');
				}

				const data = await response.json();
				setLeadershipData({
					president: data.president,
					vicePresident: data.vicePresident,
					isLoading: false,
					error: null
				});
			} catch (error) {
				setLeadershipData(prev => ({
					...prev,
					isLoading: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				}));
			}
		}

		fetchLeadershipData();
	}, []);

	const fallBackData = {
		id: '',
		name: '',
		email: '',
		role: 'user' as const,
		is_active: true
	};

	const president = leadershipData.president || fallBackData;
	const vicePresident = leadershipData.vicePresident || fallBackData;

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					Contact Us
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
					{/* President Contact Info */}
					<div className="rounded-lg border border-solid border-white/[.145] p-6">
						<div className="flex flex-col items-center mb-6">
							<ProfilePicture
								user={president}
								size={120}
							/>
							<h2 className="text-xl font-semibold mt-4">
								President
							</h2>
						</div>
						<div className="flex flex-col gap-2">
							<p className="font-bold">{president.name}</p>
							{president.email && (
								<p className="text-sm">
									<span className="inline-block w-20">Email:</span>
									<a href={`mailto:${president.email}`} className="text-blue-500 hover:underline">
										{president.email}
									</a>
								</p>
							)}
							{president.phone && (
								<p className="text-sm">
									<span className="inline-block w-20">Phone:</span>
									<a href={`tel:${president.phone}`} className="hover:underline">
										{president.phone}
									</a>
								</p>
							)}
						</div>
					</div>

					{/* Vice President Contact Info */}
					<div className="rounded-lg border border-solid border-white/[.145] p-6">
						<div className="flex flex-col items-center mb-6">
							<ProfilePicture
								user={vicePresident}
								size={120}
							/>
							<h2 className="text-xl font-semibold mt-4">
								Vice President
							</h2>
						</div>
						<div className="flex flex-col gap-2">
							<p className="font-bold">{vicePresident.name}</p>
							{vicePresident.email && (
								<p className="text-sm">
									<span className="inline-block w-20">Email:</span>
									<a href={`mailto:${vicePresident.email}`} className="text-blue-500 hover:underline">
										{vicePresident.email}
									</a>
								</p>
							)}
							{vicePresident.phone && (
								<p className="text-sm">
									<span className="inline-block w-20">Phone:</span>
									<a href={`tel:${vicePresident.phone}`} className="hover:underline">
										{vicePresident.phone}
									</a>
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Social Media Section */}
				<div className="rounded-lg border border-solid border-white/[.145] p-6 mt-8">
					<h2 className="text-xl font-semibold mb-4">
						Follow Us
					</h2>
					<div className="flex items-center gap-4">
						<a
							href="https://www.instagram.com/augieinvestmentfund/"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
								<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
								<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
							</svg>
							Follow us on Instagram
						</a>
					</div>
				</div>
			</div>
		</div >
	);
}