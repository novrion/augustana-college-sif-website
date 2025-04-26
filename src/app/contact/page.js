import React from 'react';
import { BoxBase } from '../components/Boxes';
import Image from 'next/image';

export default function Contact() {
	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					Contact Us
				</h1>
				<p className="text-lg mb-8 font-[family-name:var(--font-geist-mono)]">
					Connect with the Augustana College Student Investment Fund leadership.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
					{/* President Contact Info */}
					<BoxBase>
						<h2 className="text-xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
							President
						</h2>
						<div className="flex flex-col gap-2">
							<p className="font-medium">Sarah Johnson</p>
							<p className="text-sm">
								<span className="inline-block w-20">Email:</span>
								<a href="mailto:sarahjohnson@augustana.edu" className="text-blue-500 hover:underline">
									sarahjohnson@augustana.edu
								</a>
							</p>
							<p className="text-sm">
								<span className="inline-block w-20">Phone:</span>
								<a href="tel:3095551234" className="hover:underline">
									(309) 555-1234
								</a>
							</p>
							<p className="text-sm">
								<span className="inline-block w-20">Office:</span>
								Sorensen Hall, Room 211
							</p>
							<p className="text-sm mt-2">Office Hours: Monday & Wednesday 3:00-4:30 PM</p>
						</div>
					</BoxBase>

					{/* Vice President Contact Info */}
					<BoxBase>
						<h2 className="text-xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
							Vice President
						</h2>
						<div className="flex flex-col gap-2">
							<p className="font-medium">Michael Johnson</p>
							<p className="text-sm">
								<span className="inline-block w-20">Email:</span>
								<a href="mailto:michaeljohnson@augustana.edu" className="text-blue-500 hover:underline">
									michaeljohnson@augustana.edu
								</a>
							</p>
							<p className="text-sm">
								<span className="inline-block w-20">Phone:</span>
								<a href="tel:3095555678" className="hover:underline">
									(309) 555-5678
								</a>
							</p>
							<p className="text-sm">
								<span className="inline-block w-20">Office:</span>
								Sorensen Hall, Room 209
							</p>
							<p className="text-sm mt-2">Office Hours: Tuesday & Thursday 2:00-3:30 PM</p>
						</div>
					</BoxBase>
				</div>

				{/* Social Media Section */}
				<BoxBase className="mt-8">
					<h2 className="text-xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
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
					<p className="mt-4 text-sm">
						Stay updated with our latest events, stock pitches, and fund activities by following our Instagram page.
					</p>
				</BoxBase>

				{/* General Inquiries Section */}
				<BoxBase className="mt-8">
					<h2 className="text-xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
						General Inquiries
					</h2>
					<p className="mb-4">
						For general questions about the Student Investment Fund, membership inquiries, or other information:
					</p>
					<a
						href="mailto:sif@augustana.edu"
						className="text-blue-500 hover:underline font-medium"
					>
						sif@augustana.edu
					</a>
					<p className="mt-6">
						The Student Investment Fund holds weekly meetings every Tuesday at 7:00 PM in Sorensen Hall, Room 302.
					</p>
					<p className="mt-2">
						New members and visitors are always welcome!
					</p>
				</BoxBase>
			</div>
		</div>
	);
}