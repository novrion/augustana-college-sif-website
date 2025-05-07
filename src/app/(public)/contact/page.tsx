'use client';

import { useEffect, useState } from 'react';
import ProfilePicture from '@/components/ProfilePicture';
import { User } from '@/lib/types/user';

interface LeadershipData {
	president: User | null;
	vicePresident: User | null;
}

export default function ContactPage() {
	const [leadership, setLeadership] = useState<LeadershipData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLeadership = async () => {
			try {
				const response = await fetch('/api/contact/leadership');
				if (!response.ok) throw new Error('Failed to fetch leadership data');

				const data = await response.json();
				setLeadership(data);
				setError(null);
			} catch (err) {
				console.error('Error fetching leadership:', err);
				setError('Failed to load leadership information. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchLeadership();
	}, []);

	const renderContactCard = (user: User | null | undefined, role: string) => {
		if (!user) return null;

		return (
			<div className="rounded-lg border border-solid border-white/[.145] p-6">
				<div className="flex flex-col items-center mb-6">
					<ProfilePicture user={user} size={120} />
					<h2 className="text-xl font-semibold mt-4">{role}</h2>
				</div>
				<div className="flex flex-col gap-2">
					<p className="font-bold">{user.name}</p>
					{user.email && (
						<p className="text-sm">
							<span className="inline-block w-20">Email:</span>
							<a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">
								{user.email}
							</a>
						</p>
					)}
					{user.phone && (
						<p className="text-sm">
							<span className="inline-block w-20">Phone:</span>
							<a href={`tel:${user.phone}`} className="hover:underline">
								{user.phone}
							</a>
						</p>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Contact Us</h1>

				{isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				) : error ? (
					<div className="text-center p-4 rounded-md text-red-700 mb-6">
						{error}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
						{renderContactCard(leadership?.president, 'President')}
						{renderContactCard(leadership?.vicePresident, 'Vice President')}
					</div>
				)}

				<div className="rounded-lg border border-solid border-white/[.145] p-6 mt-8">
					<h2 className="text-xl font-semibold mb-4">Follow Us</h2>
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
		</div>
	);
}