'use client';

import React, { useEffect, useState } from 'react';
import { BoxBase } from '@/components/Boxes';
import ProfilePicture from '@/components/ProfilePicture';
import DefaultFooter from '@/components/DefaultFooter';

export default function Contact() {
	const [leadershipData, setLeadershipData] = useState({
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
				console.log("Leadership data received:", data);

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
					error: error.message
				}));
			}
		}

		fetchLeadershipData();
	}, []);

	const fallBackData = {
		name: '',
		email: '',
		phone: null,
		profile_picture: null
	};

	const president = leadershipData.president || fallBackData;
	const vicePresident = leadershipData.vicePresident || fallBackData;

	// Debug the profile picture values
	console.log("President profile pic:", president.profile_picture);
	console.log("VP profile pic:", vicePresident.profile_picture);

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 font-[family-name:var(--font-geist-mono)]">
					Contact Us
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 font-[family-name:var(--font-geist-mono)]">
					{/* President Contact Info */}
					<BoxBase>
						<div className="flex flex-col items-center mb-6">
							{/* Directly use ProfilePicture component without a wrapping div */}
							<ProfilePicture
								src={president.profile_picture}
								alt={`${president.name}'s profile picture`}
								size="xlarge"
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
					</BoxBase>

					{/* Vice President Contact Info */}
					<BoxBase>
						<div className="flex flex-col items-center mb-6">
							{/* Directly use ProfilePicture component without a wrapping div */}
							<ProfilePicture
								src={vicePresident.profile_picture}
								alt={`${vicePresident.name}'s profile picture`}
								size="xlarge"
							/>
							<h2 className="text-xl font-semibold mt-4 font-[family-name:var(--font-geist-mono)]">
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
					</BoxBase>
				</div>

				{/* Social Media Section */}
				<BoxBase className="mt-8">
					<h2 className="text-xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
						Follow Us
					</h2>
					<div className="flex items-center gap-4 font-[family-name:var(--font-geist-sans)]">
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
				</BoxBase>

				<div className="mt-20">
					<DefaultFooter />
				</div>
			</div>
		</div>
	);
}